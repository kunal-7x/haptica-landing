# Cloudflare setup for famit.in — click-path + what `cf-setup.py` automates

This page is the human-readable companion to `cf-setup.py`. Use the script if
you can; use this page's manual steps for anything the script reports as
"could not apply via API — do it by hand" (non-fatal fallbacks it prints
itself), or if you'd rather click through everything yourself.

---

## 1. Get the right Cloudflare API token (read this first)

> **Known blocker:** the Cloudflare token currently on hand looks like a
> Wrangler/Workers-style token (often starts `cfut_...`). Those authenticate
> against the Cloudflare API just fine, but almost never carry the *zone*
> permissions this task needs (DNS edit, zone settings edit, firewall
> services edit). `cf-setup.py` checks for this automatically and will stop
> with a clear message instead of silently doing nothing — but it's faster to
> just create the right token up front:

1. Go to **https://dash.cloudflare.com/profile/api-tokens**
2. Click **Create Token** → **Create Custom Token** (bottom of the templates list)
3. Give it a name, e.g. `haptica-landing-deploy`
4. Add **three** permissions (use the three dropdowns on each row, click **+ Add more** between rows):
   - `Zone` — `DNS` — `Edit`
   - `Zone` — `Zone Settings` — `Edit`
   - `Zone` — `Firewall Services` — `Edit`
5. **Zone Resources:** `Specific zone` → `famit.in`
6. **Continue to summary** → **Create Token**
7. Copy the token (shown once). Set it as `CF_API_TOKEN`:
   - Either as an environment variable for the session you run the script in, or
   - Add a line `CF_API_TOKEN=<paste>` to the repo root's `.env.local`
     (`C:\Users\kunal\desktop\cal\.env.local` — already gitignored, never committed).

## 2. Run the script

```
! python3 "landing/deploy/cf-setup.py" <DROPLET_IP>
```
(`<DROPLET_IP>` is printed by `provision-landing-droplet.py`.)

It is safe to re-run — every step is idempotent (updates existing
records/settings instead of duplicating them).

### What it does, in order
| Step | API call(s) | Effect |
|---|---|---|
| Token check | `GET /user/tokens/verify` | Confirms the token is valid + active *before* touching anything. Stops with the exact fix if not. |
| Zone lookup | `GET /zones?name=famit.in` | Finds the zone id. Stops (with the dashboard link) if `famit.in` hasn't been added to this Cloudflare account yet. |
| DNS | `POST`/`PUT /zones/{id}/dns_records` | Proxied (orange-cloud) `A` records: `famit.in` → droplet IP, `www.famit.in` → droplet IP. |
| SSL mode | `PATCH /zones/{id}/settings/ssl` = `strict` | Full (Strict) — Cloudflare only accepts a valid, trusted cert from the origin. See **Origin TLS**, below — this needs one more piece on the droplet. |
| Always HTTPS | `PATCH .../settings/always_use_https` = `on` | Any `http://` request gets redirected to `https://` at the edge. |
| Min TLS | `PATCH .../settings/min_tls_version` = `1.2` | Refuses TLS 1.0/1.1 handshakes. |
| Bot Fight Mode | `PATCH .../settings/bot_fight_mode` = `on` | Cloudflare's free automated-traffic challenge/block layer. |
| Rate limit | `PUT /zones/{id}/rulesets/phases/http_ratelimit/entrypoint` | Blocks an IP for 10 minutes after >100 requests/minute to `famit.in`/`www.famit.in`. |
| Managed WAF | `PUT /zones/{id}/rulesets/phases/http_request_firewall_managed/entrypoint` | Turns on Cloudflare's free Managed Ruleset (OWASP-style core rules: SQLi, XSS, common CVEs). |

The rate-limit and WAF steps are wrapped so a hiccup (plan limitation, ruleset
id drift, etc.) prints a **manual fallback** and lets the rest of the script
keep going — it will never leave you with a half-silent failure.

## 3. Manual click-path (if you skip the script, or a step needs a manual fallback)

- **DNS records:** `famit.in` dashboard → **DNS** → **Records** → **Add record**
  → Type `A`, Name `@`, IPv4 address `<DROPLET_IP>`, Proxy status **Proxied**
  (orange cloud). Repeat with Name `www`.
- **SSL mode:** **SSL/TLS** → **Overview** → **Full (strict)**.
- **Always HTTPS + min TLS:** **SSL/TLS** → **Edge Certificates** → "Always Use
  HTTPS" **On**, "Minimum TLS Version" **1.2**.
- **Bot Fight Mode:** **Security** → **Bots** → "Bot Fight Mode" **On**.
- **Rate limiting rule:** **Security** → **Security rules** → **Create rule** →
  **Rate limiting rule** → When incoming requests match `Hostname equals
  famit.in OR www.famit.in`, rate = **100 requests / 1 minute**, per **IP**,
  then **Block** for **10 minutes**.
- **Managed WAF ruleset:** **Security** → **WAF** → **Managed rules** → turn
  on **Cloudflare Managed Ruleset**.

## 4. Origin TLS — the one piece `cf-setup.py` can't do for you

Full (Strict) means Cloudflare will **only** forward traffic to the origin
over HTTPS with a certificate it can validate. The `haptica-landing`
container in this repo deliberately serves **plain HTTP on :8080 only** (see
`../nginx.conf`) to keep the container itself as simple/hardened as possible.
Something still needs to answer `:443` on the droplet with a real
certificate. Two options — pick one, both are covered in `../DEPLOY.md`
under **"Origin TLS"**:

1. **Recommended — a tiny Caddy sidecar** (mirrors this repo's own
   `deploy/Caddyfile` + `deploy/docker-compose.tls.yml` pattern exactly, just
   pointed at `haptica-landing:8080` instead of `frontend:3000`). Full
   copy-paste snippet is in `../DEPLOY.md`.
2. **Fastest — switch SSL mode to `Flexible`** instead of `strict` (one
   Cloudflare setting) and ship today. Acceptable specifically *for this
   static page* because nothing sensitive (no auth cookies, no session data,
   no secrets) ever crosses the Cloudflare-to-origin leg — the
   visitor-to-Cloudflare leg is still full HTTPS + HSTS regardless. Harden to
   Full (Strict) later using option 1.

Whichever you pick, `cf-setup.py` already sets `strict` as instructed; if you
choose option 2 for now, override it manually to `Flexible` in the dashboard
(SSL/TLS → Overview) after running the script.
