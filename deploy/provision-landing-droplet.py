#!/usr/bin/env python3
"""
Provision the Haptica AI LANDING PAGE droplet on DigitalOcean (famit.in).

Mirrors the pattern in infra/provision-droplet.py (the main app's droplet
script) — same idempotent shape, same urllib-only dependency footprint — but
for a tiny, separate, minimal-attack-surface box that serves ONLY the static
marketing site.

Run this YOURSELF (it acts with your authorization, which the agent's safety
gate requires for changes to the shared DO account):

    ! python3 "landing/deploy/provision-landing-droplet.py"

It is idempotent: re-running won't create a second droplet or a duplicate
firewall — it reuses the existing 'haptica-landing' droplet/firewall by name
and just re-prints the IP.

What it does:
  1. Reads DO_API_TOKEN (from env, else the repo ROOT .env.local).
  2. Registers your SSH public key with the account (if not already there).
  3. Creates the SMALLEST sensible droplet (s-1vcpu-1gb) in BLR1 running the
     cloud-init.yaml sitting next to this script (Docker + compose plugin +
     clone/pull + `docker compose up -d --build`).
  4. Waits for it to boot and prints DROPLET_IP.
  5. Creates/updates a DO Cloud Firewall ('haptica-landing-fw') that locks
     inbound 80/443 to Cloudflare's current published IP ranges ONLY —
     mirroring 'fortress-panel-fw' in plans/docs/architecture/04-deployment.md
     — plus SSH (see ALLOW_SSH_FROM below). Outbound is restricted to
     80/443/53/123, matching this repo's stated egress policy for
     low-need frontend-tier boxes (DEPLOY-STATE.md).

Next step after this script prints an IP: run cf-setup.py (same directory)
to point Cloudflare's DNS at it and turn on Bot Fight Mode / rate-limit / WAF.
"""
import json, os, sys, time, urllib.request, urllib.error

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))  # .../cal
ENV_FALLBACK = os.path.join(REPO_ROOT, ".env.local")
PUBKEY_PATH = os.path.expanduser("~/.ssh/id_ed25519.pub")
CLOUD_INIT_PATH = os.path.join(SCRIPT_DIR, "cloud-init.yaml")

NAME, REGION, SIZE, IMAGE = "haptica-landing", "blr1", "s-1vcpu-1gb", "ubuntu-24-04-x64"
FW_NAME = "haptica-landing-fw"

# SSH source lock. Key-only auth is the real control (matches
# infra/provision-droplet.py's UFW `allow OpenSSH` from anywhere); set
# ALLOW_SSH_FROM="<your.ip.here>/32,<ipv6>/128" to tighten it once you know
# your own egress IP. Comma-separated CIDRs.
ALLOW_SSH_FROM = [c.strip() for c in
                  os.environ.get("ALLOW_SSH_FROM", "0.0.0.0/0,::/0").split(",") if c.strip()]

# Dated fallback snapshot (fetched live from cloudflare.com/ips-v4 /-v6 on
# 2026-07-07) used ONLY if the live fetch below fails — Cloudflare changes
# these ranges rarely, but re-verify against https://www.cloudflare.com/ips/
# if this script ever has to fall back to it.
CF_V4_FALLBACK = [
    "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
    "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
    "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
    "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
]
CF_V6_FALLBACK = [
    "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
    "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32",
]


def read_token() -> str:
    tok = os.environ.get("DO_API_TOKEN")
    if tok:
        return tok.strip()
    try:
        with open(ENV_FALLBACK) as f:
            for line in f:
                if line.startswith("DO_API_TOKEN="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    sys.exit(f"DO_API_TOKEN not found (set env, or add it to {ENV_FALLBACK})")


TOK = read_token()


def api(method, path, body=None):
    req = urllib.request.Request(
        "https://api.digitalocean.com/v2" + path, method=method,
        headers={"Authorization": "Bearer " + TOK, "Content-Type": "application/json"},
        data=json.dumps(body).encode() if body is not None else None,
    )
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            return json.load(r) if r.length != 0 else {}
    except urllib.error.HTTPError as e:
        try:
            return json.load(e)
        except Exception:
            return {"message": f"HTTP {e.code}"}


def get_cf_ranges():
    """Live Cloudflare edge IP ranges (public endpoint, no auth needed), with
    a graceful fallback to the dated snapshot above if this shell has no
    outbound internet access right now."""
    try:
        req = urllib.request.Request("https://api.cloudflare.com/client/v4/ips")
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.load(r)
        result = data.get("result") or {}
        v4 = result.get("ipv4_cidrs") or CF_V4_FALLBACK
        v6 = result.get("ipv6_cidrs") or CF_V6_FALLBACK
        print(f"cloudflare ranges: fetched live ({len(v4)} v4 + {len(v6)} v6 blocks)")
        return v4, v6
    except Exception as e:
        print(f"warn: could not fetch live Cloudflare IP ranges ({e}); using {os.path.basename(__file__)}'s dated fallback snapshot")
        return CF_V4_FALLBACK, CF_V6_FALLBACK


def ensure_ssh_key() -> str:
    try:
        pub = open(PUBKEY_PATH).read().strip()
    except FileNotFoundError:
        sys.exit(
            f"no SSH public key at {PUBKEY_PATH}.\n"
            f"Generate one first:  ssh-keygen -t ed25519 -f {os.path.expanduser('~/.ssh/id_ed25519')}\n"
            f"then re-run this script."
        )
    pub_body = pub.split()[1]

    keys = api("GET", "/account/keys").get("ssh_keys", [])
    fp = next((k["fingerprint"] for k in keys
               if k.get("public_key", "").split()[1:2] == [pub_body]), None)
    if fp:
        return fp
    r = api("POST", "/account/keys", {"name": "haptica-landing-deploy", "public_key": pub})
    fp = (r.get("ssh_key") or {}).get("fingerprint")
    if not fp:
        sys.exit(f"could not register SSH key: {r.get('message', r)}")
    return fp


def ensure_droplet(ssh_fp: str):
    try:
        cloud_init = open(CLOUD_INIT_PATH).read()
    except FileNotFoundError:
        sys.exit(f"missing {CLOUD_INIT_PATH} (deploy/cloud-init.yaml) — it ships alongside this script")

    drops = api("GET", "/droplets?per_page=100").get("droplets", [])
    d = next((x for x in drops if x["name"] == NAME), None)
    if d:
        print("reusing existing droplet id:", d["id"])
        return d

    r = api("POST", "/droplets", {
        "name": NAME, "region": REGION, "size": SIZE, "image": IMAGE,
        "ssh_keys": [ssh_fp], "backups": False, "monitoring": True,
        "ipv6": True, "user_data": cloud_init, "tags": ["haptica-landing"],
    })
    d = r.get("droplet")
    if not d:
        sys.exit(f"droplet create failed: {r.get('message', r)}")
    print("created droplet id:", d["id"])
    return d


def wait_for_ip(droplet_id):
    for _ in range(60):  # ~5 min
        dd = api("GET", f"/droplets/{droplet_id}").get("droplet", {})
        if dd.get("status") == "active":
            ip = next((n["ip_address"] for n in dd.get("networks", {}).get("v4", [])
                       if n["type"] == "public"), None)
            if ip:
                return ip
        time.sleep(5)
    return None


def ensure_firewall(droplet_id):
    v4, v6 = get_cf_ranges()
    web_sources = {"addresses": v4 + v6}
    body = {
        "name": FW_NAME,
        "inbound_rules": [
            {"protocol": "tcp", "ports": "80", "sources": web_sources},
            {"protocol": "tcp", "ports": "443", "sources": web_sources},
            {"protocol": "tcp", "ports": "22", "sources": {"addresses": ALLOW_SSH_FROM}},
        ],
        # Tight egress: this box serves static files only (no runtime API
        # calls at all) and needs outbound access just for OS/image updates.
        # Matches the "Egress default-deny except 80/443/53/123" policy this
        # repo already uses for its frontend tier (infra/DEPLOY-STATE.md) —
        # the June-2026 postmortem lesson (an egress-open box got conscripted
        # into an outbound DDoS) applies here too, and this box needs even
        # less egress than that one.
        "outbound_rules": [
            {"protocol": "tcp", "ports": "80", "destinations": {"addresses": ["0.0.0.0/0", "::/0"]}},
            {"protocol": "tcp", "ports": "443", "destinations": {"addresses": ["0.0.0.0/0", "::/0"]}},
            {"protocol": "tcp", "ports": "53", "destinations": {"addresses": ["0.0.0.0/0", "::/0"]}},
            {"protocol": "udp", "ports": "53", "destinations": {"addresses": ["0.0.0.0/0", "::/0"]}},
            {"protocol": "udp", "ports": "123", "destinations": {"addresses": ["0.0.0.0/0", "::/0"]}},
        ],
        "droplet_ids": [droplet_id],
    }

    fws = api("GET", "/firewalls?per_page=200").get("firewalls", [])
    existing = next((f for f in fws if f["name"] == FW_NAME), None)
    if existing:
        r = api("PUT", f"/firewalls/{existing['id']}", body)
        ok = "firewall" in r
        print(f"firewall updated: {existing['id']} - {'OK' if ok else r.get('message', r)}")
    else:
        r = api("POST", "/firewalls", body)
        fw = r.get("firewall")
        if not fw:
            sys.exit(f"firewall create failed: {r.get('message', r)}")
        print("firewall created:", fw["id"])


def main():
    fp = ensure_ssh_key()
    print("ssh-key-fingerprint:", fp)

    d = ensure_droplet(fp)
    ip = wait_for_ip(d["id"])

    print("=" * 60)
    if not ip:
        print("STATUS: still provisioning - re-run this script in a minute to get the IP.")
        print("=" * 60)
        return

    print("STATUS: active")
    print("DROPLET_IP:", ip)

    ensure_firewall(d["id"])

    print("=" * 60)
    print("Next step - point Cloudflare at this IP and turn on the edge protections:")
    print(f'    ! python3 "landing/deploy/cf-setup.py" {ip}')
    print("Cloud-init is still installing Docker + building the container in the")
    print("background; give it ~2 minutes before expecting the site to answer.")
    print("=" * 60)


if __name__ == "__main__":
    main()
