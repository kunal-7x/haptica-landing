#!/usr/bin/env python3
"""
Cloudflare setup for famit.in (Haptica AI landing) — DNS + SSL + Bot Fight +
rate-limit + managed WAF, all via the Cloudflare API v4.

Run this YOURSELF once you have the droplet IP (printed by
provision-landing-droplet.py) and a Cloudflare API TOKEN (NOT the legacy
Global API Key) with these three scopes:

    Zone  ->  DNS               ->  Edit
    Zone  ->  Zone Settings     ->  Edit
    Zone  ->  Firewall Services ->  Edit

Create one at https://dash.cloudflare.com/profile/api-tokens -> Create Token
-> Create Custom Token -> add the three permissions above -> Zone Resources =
Specific zone -> famit.in. Full click-path: cloudflare-setup.md (next to this
file).

    ! python3 "landing/deploy/cf-setup.py" <DROPLET_IP>

Idempotent: re-running updates the existing records/settings instead of
duplicating them.

IMPORTANT — token scope check (do not fail silently):
The token currently on hand looks like a Wrangler/Workers-style token (often
prefixed "cfut_..."), which authenticates against the API but typically has
NONE of the zone permissions this script needs. So this script:
  1. Calls /user/tokens/verify FIRST. If that fails, the token doesn't even
     authenticate — stop immediately.
  2. Then makes the real calls (list zones, read/patch zone settings). If ANY
     of those come back 403/permission-denied, stop immediately.
In both failure cases it prints the EXACT permissions to grant on a new
token and where to create it — never a silent partial configuration.
"""
import json, os, sys, urllib.request, urllib.error

ZONE_NAME = "famit.in"
RECORD_SUBNAMES = [ZONE_NAME, "www"]   # apex (@) + www
API = "https://api.cloudflare.com/client/v4"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_FALLBACK = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", ".env.local"))

# Cloudflare's official "Cloudflare Managed Ruleset" id (stable, documented in
# Cloudflare's own Terraform provider examples). If this account/plan doesn't
# recognize it, ensure_waf_managed_ruleset() prints a manual fallback rather
# than crashing the rest of the script — see below.
CF_MANAGED_RULESET_ID = "efb7b8c949ac4650a09736fc376e9aee"

NEEDS_TOKEN_MSG = """
=====================================================================
CLOUDFLARE TOKEN PROBLEM - the token on hand can't do this job.

Create a NEW token with EXACTLY these permissions:
  1. Go to  https://dash.cloudflare.com/profile/api-tokens
  2. Create Token -> Create Custom Token
  3. Add THREE permissions:
       Zone | DNS                | Edit
       Zone | Zone Settings      | Edit
       Zone | Firewall Services  | Edit
  4. Zone Resources: Specific zone -> famit.in
  5. Create Token, copy it.
Then set it as CF_API_TOKEN (env var, or add it to the repo's .env.local) and
re-run:
    ! python3 "landing/deploy/cf-setup.py" <DROPLET_IP>

(A Wrangler/Workers-scoped token, often starting "cfut_", authenticates fine
but has none of the permissions above — that matches what's on hand now.)
=====================================================================
"""


def read_token() -> str:
    tok = os.environ.get("CF_API_TOKEN")
    if tok:
        return tok.strip()
    try:
        with open(ENV_FALLBACK) as f:
            for line in f:
                if line.startswith("CF_API_TOKEN="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    sys.exit(f"CF_API_TOKEN not found (set env, or add it to {ENV_FALLBACK})")


TOK = read_token()


def api(method, path, body=None):
    req = urllib.request.Request(
        API + path, method=method,
        headers={"Authorization": "Bearer " + TOK, "Content-Type": "application/json"},
        data=json.dumps(body).encode() if body is not None else None,
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
            return r.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read())
        except Exception:
            return e.code, {"success": False, "errors": [{"message": str(e)}]}
    except urllib.error.URLError as e:
        return 0, {"success": False, "errors": [{"message": str(e)}]}


def verify_token():
    status, r = api("GET", "/user/tokens/verify")
    if status != 200 or not r.get("success"):
        print(NEEDS_TOKEN_MSG)
        sys.exit(f"token verify failed: HTTP {status} {r}")
    result = r.get("result", {})
    print(f"token ok: id={result.get('id')} status={result.get('status')}")
    if result.get("status") != "active":
        print(NEEDS_TOKEN_MSG)
        sys.exit(f"token status is '{result.get('status')}', expected 'active'")


def get_zone_id() -> str:
    status, r = api("GET", f"/zones?name={ZONE_NAME}")
    if status == 403 or not r.get("success"):
        print(NEEDS_TOKEN_MSG)
        sys.exit(f"cannot list zones (permission issue): HTTP {status} {r.get('errors', r)}")
    zones = r.get("result") or []
    if not zones:
        sys.exit(
            f"zone '{ZONE_NAME}' not found on this Cloudflare account.\n"
            f"Add the site first: https://dash.cloudflare.com -> Add a Site -> {ZONE_NAME}"
        )
    return zones[0]["id"]


def ensure_dns_record(zone_id: str, subname: str, ip: str):
    full_name = subname if subname == ZONE_NAME else f"{subname}.{ZONE_NAME}"
    status, r = api("GET", f"/zones/{zone_id}/dns_records?type=A&name={full_name}")
    if status == 403:
        print(NEEDS_TOKEN_MSG)
        sys.exit(f"cannot read DNS records (permission issue): HTTP {status} {r.get('errors', r)}")

    body = {"type": "A", "name": full_name, "content": ip, "ttl": 1, "proxied": True}
    existing = (r.get("result") or [None])[0] if status == 200 else None
    if existing:
        s, rr = api("PUT", f"/zones/{zone_id}/dns_records/{existing['id']}", body)
    else:
        s, rr = api("POST", f"/zones/{zone_id}/dns_records", body)

    if rr.get("success"):
        print(f"DNS {full_name}: -> {ip} (proxied)  {'[updated]' if existing else '[created]'}")
    elif s == 403:
        print(NEEDS_TOKEN_MSG)
        sys.exit(f"cannot write DNS record for {full_name} (permission issue): {rr.get('errors', rr)}")
    else:
        sys.exit(f"DNS {full_name}: FAILED {rr.get('errors', rr)}")


def set_zone_setting(zone_id: str, setting: str, value):
    status, r = api("PATCH", f"/zones/{zone_id}/settings/{setting}", {"value": value})
    if status == 403 or not r.get("success"):
        print(NEEDS_TOKEN_MSG)
        sys.exit(f"cannot set {setting} (permission issue): HTTP {status} {r.get('errors', r)}")
    print(f"setting {setting} -> {value}: OK")


def upsert_phase_ruleset(zone_id: str, phase: str, name: str, rules: list, label: str, manual_fallback: str):
    """Idempotently replace the zone's entrypoint ruleset for one phase. This
    is a single PUT (Cloudflare's documented pattern for managing WAF custom
    rules / rate-limit rules) — no need to list-then-decide create-vs-update.
    Never raises: on any failure it prints the exact manual dashboard steps
    and returns, so a hiccup in this one call doesn't abort DNS/SSL/Bot-Fight
    (the higher priority items) which run before/after it."""
    body = {"name": name, "kind": "zone", "phase": phase, "rules": rules}
    status, r = api("PUT", f"/zones/{zone_id}/rulesets/phases/{phase}/entrypoint", body)
    if r.get("success"):
        print(f"{label}: OK")
    else:
        print(f"{label}: could not apply via API (HTTP {status}: {r.get('errors', r)}).")
        print(f"  -> do it by hand instead: {manual_fallback}")


def ensure_rate_limit(zone_id: str):
    rules = [{
        "action": "block",
        "expression": f'(http.host eq "{ZONE_NAME}") or (http.host eq "www.{ZONE_NAME}")',
        "description": "haptica-landing basic anti-abuse: >100 req/min/IP -> block 10 min",
        "ratelimit": {
            "characteristics": ["ip.src"],
            "period": 60,
            "requests_per_period": 100,
            "mitigation_timeout": 600,
        },
    }]
    upsert_phase_ruleset(
        zone_id, "http_ratelimit", "haptica-landing rate limit", rules,
        label="rate-limit rule",
        manual_fallback=f"dash.cloudflare.com -> {ZONE_NAME} -> Security -> "
                         f"Rate limiting rules -> Create rule (100 req/min/IP -> Block 10 min)",
    )


def ensure_waf_managed_ruleset(zone_id: str):
    rules = [{
        "action": "execute",
        "expression": "true",
        "description": "Cloudflare Managed Ruleset (core OWASP-style protection)",
        "action_parameters": {"id": CF_MANAGED_RULESET_ID},
    }]
    upsert_phase_ruleset(
        zone_id, "http_request_firewall_managed", "haptica-landing managed WAF", rules,
        label="WAF managed ruleset",
        manual_fallback=f"dash.cloudflare.com -> {ZONE_NAME} -> Security -> WAF -> "
                         f"Managed rules -> turn on 'Cloudflare Managed Ruleset'",
    )


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: python3 cf-setup.py <DROPLET_IP>")
    ip = sys.argv[1]

    verify_token()
    zone_id = get_zone_id()
    print(f"zone: {ZONE_NAME} ({zone_id})")

    for subname in RECORD_SUBNAMES:
        ensure_dns_record(zone_id, subname, ip)

    set_zone_setting(zone_id, "ssl", "strict")
    set_zone_setting(zone_id, "always_use_https", "on")
    set_zone_setting(zone_id, "min_tls_version", "1.2")
    set_zone_setting(zone_id, "automatic_https_rewrites", "on")

    # Bot Fight Mode is a plain zone setting on Free/Pro plans.
    status, r = api("PATCH", f"/zones/{zone_id}/settings/bot_fight_mode", {"value": "on"})
    if r.get("success"):
        print("setting bot_fight_mode -> on: OK")
    else:
        print(f"bot_fight_mode: could not set via API (HTTP {status}: {r.get('errors', r)}).")
        print(f"  -> do it by hand: dash.cloudflare.com -> {ZONE_NAME} -> Security -> Bots -> Bot Fight Mode -> On")

    ensure_rate_limit(zone_id)
    ensure_waf_managed_ruleset(zone_id)

    print("=" * 60)
    print(f"DONE. {ZONE_NAME} + www.{ZONE_NAME} now point at {ip} (Cloudflare-proxied).")
    print("SSL mode = Full (Strict): Cloudflare will only connect to the origin")
    print("over HTTPS with a valid certificate. The landing container itself")
    print("serves plain HTTP on :8080 by design (minimal attack surface) —")
    print("see DEPLOY.md 'Origin TLS' section for the one extra piece needed")
    print("on the droplet before Full (Strict) actually works end-to-end.")
    print("=" * 60)


if __name__ == "__main__":
    main()
