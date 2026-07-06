# Security — threat model for famit.in (the public root route)

This is the founder's explicit #1 concern for this deployment: the root
domain is the most-hit, least-authenticated route in the whole product, so it
gets the most scrutiny even though (or *because*) it does the least. This
doc lists every realistic threat against it and exactly what mitigates it,
file-by-file.

## Why the attack surface is small to begin with

`famit.in` is a **pure static export** — plain HTML/CSS/JS files, generated
once at build time, served byte-for-byte to every visitor. There is:
- **No server-side application code** running per-request (no Node process,
  no API routes, no middleware — `nginx.conf` only ever does `try_files` /
  static reads).
- **No database, no session store, no cookies set by this origin.**
- **No file uploads, no forms processed by this origin** (the one form/login
  affordance posts to the separate `haptica.famit.in` app — see `nginx.conf`'s
  CSP `form-action`/`connect-src`, scoped to exactly that one external origin).

That single fact eliminates entire attack classes outright (SQL injection,
SSRF, template injection, deserialization bugs, auth bypass, IDOR) — there is
no server-side logic for an attacker to inject into, and no backend for a
malicious request to pivot through.

## Threats and mitigations

| Threat | Mitigation | Where |
|---|---|---|
| **Bots / scrapers / vuln scanners hitting the root route** (the founder's #1 concern) | Cloudflare **Bot Fight Mode** challenges/blocks automated traffic at the edge, before it ever reaches the origin. Behind that, nginx returns **444 (connection closed, no response)** for any HTTP method that isn't GET/HEAD — scanners probing with `TRACE`/junk verbs get nothing to fingerprint. `server_tokens off` hides the nginx version from whatever does get through. | `deploy/cf-setup.py` (Bot Fight Mode), `nginx.conf` (method allow-list, `server_tokens off`) |
| **Direct attacks on the origin, bypassing Cloudflare entirely** | The DigitalOcean **Cloud Firewall** allows inbound 80/443 **only from Cloudflare's published IP ranges** (fetched live from `api.cloudflare.com/client/v4/ips` at provision time). The origin IP simply refuses connections from anywhere else — an attacker who finds the droplet's IP (e.g. via DNS history) still can't reach it directly. | `deploy/provision-landing-droplet.py` (`ensure_firewall`) |
| **Volumetric / DDoS** | Absorbed at Cloudflare's edge (anycast network, automatic DDoS mitigation) before it reaches a 1-vCPU/1GB droplet that couldn't otherwise survive one. Layered with a Cloudflare **rate-limiting rule** (>100 req/min/IP → 10-min block) and nginx's own `limit_req`/`limit_conn` (10 r/s, burst 20, per real client IP) as a second, origin-side backstop. | `deploy/cf-setup.py` (rate-limit rule), `nginx.conf` (`limit_req_zone`/`limit_conn_zone`) |
| **OWASP-class web attacks (SQLi/XSS/RCE payloads, common CVE probes)** | Cloudflare's free **Managed WAF Ruleset** inspects and blocks known attack signatures at the edge — belt-and-braces on top of there being no server-side code for those payloads to actually execute against. | `deploy/cf-setup.py` (`ensure_waf_managed_ruleset`) |
| **Clickjacking** | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` — this site can never be iframed by anyone, anywhere. | `nginx.conf` |
| **XSS (reflected/stored)** | Structurally near-impossible (static export, zero user-generated content, nothing dynamic to inject into). Backstopped by CSP `script-src 'self'` (no inline `<script>`, no `eval`, no third-party JS origins) and `X-Content-Type-Options: nosniff` (stops MIME-sniffing a non-script response into an executable one). | `nginx.conf` |
| **Malicious/embedded content, mixed-content downgrade** | CSP `img-src 'self' data:`, `font-src 'self'`, `style-src 'self' 'unsafe-inline'` (needed only for styled-jsx/next/font's build-time inline styles — not attacker-controlled), `upgrade-insecure-requests`, `object-src 'none'` (no Flash/plugin content ever). | `nginx.conf` |
| **TLS downgrade / cookie or credential interception in transit** | HSTS `max-age=63072000; includeSubDomains; preload` (2 years, submitted to browser preload lists — HTTPS is enforced before the first request ever leaves the browser), Cloudflare "Always Use HTTPS", min TLS 1.2, SSL mode Full (Strict) end-to-end. **Caveat, stated plainly:** Full (Strict) needs the origin to answer :443 with a valid cert; see `DEPLOY.md` → "Origin TLS" for the one extra piece this needs and the honest interim trade-off (Flexible mode) if you ship before adding it. | `nginx.conf` (HSTS), `deploy/cf-setup.py` (SSL settings), `DEPLOY.md` |
| **Privacy / cross-site tracking via browser features this site doesn't use** | `Permissions-Policy` disables camera, microphone, geolocation, payment, USB, and FLoC/Topics cohort tracking (`interest-cohort=()`) — none of which a marketing page needs, all of which are worth explicitly refusing. | `nginx.conf` |
| **Container compromise → lateral movement / becoming a bot in someone else's botnet** | Multi-stage Docker build ships **no Node, no npm, no shell build tools, no source** in the final image — just nginx + static files. Runs as a **non-root** user (nginx image's built-in uid 101), **read-only root filesystem** (`read_only: true`, only `/tmp` is writable, mounted `noexec,nosuid`), **all Linux capabilities dropped** (`cap_drop: ALL` — nginx on an unprivileged port needs none), `no-new-privileges`. Even a full nginx-process compromise has nowhere to write a payload, no capability to open a raw socket, and no elevated user to become. | `Dockerfile`, `docker-compose.yml` |
| **A compromised box gets used to attack others (outbound DDoS/spam)** | This is a direct, applied lesson from this project's own June-2026 incident (an egress-open box got rooted and used for outbound DDoS — documented in `plans/docs/architecture/04-deployment.md`). This droplet's Cloud Firewall **restricts outbound to 80/443/53/123 only** — tighter than that incident's box, appropriate here since a static file server makes zero runtime outbound calls at all (only OS/image updates need egress). | `deploy/provision-landing-droplet.py` (`outbound_rules`) |
| **Secrets leaking via the image, the repo, or DNS history** | No secret ever appears in any file this task created — `DO_API_TOKEN`/`CF_API_TOKEN` are read from the environment or the repo root `.env.local` (gitignored) at **operator run time**, never baked into an image layer or committed. `.dockerignore` excludes `.env*` and the entire `deploy/` operator-tooling folder from the Docker build context, so even a build-context mistake can't ship them. The only two `NEXT_PUBLIC_*` values baked into the client bundle (`NEXT_PUBLIC_APP_URL`, `SITE_URL`) are public URLs by design — nothing secret is ever inlined. | `.dockerignore`, `.env.example`, `Dockerfile` |
| **Stale/incorrect Cloudflare IP allowlist silently breaking or over-opening the origin firewall** | `provision-landing-droplet.py` fetches Cloudflare's current ranges **live** from `api.cloudflare.com/client/v4/ips` at every run (idempotent — re-running refreshes the allowlist), falling back to a dated snapshot (noted with its fetch date) only if that call fails. Re-run the script periodically, or after Cloudflare announces a range change (rare — see cloudflare.com/ips). | `deploy/provision-landing-droplet.py` |

## What this deliberately does NOT cover

- **The app at `haptica.famit.in`** — a completely separate box, separate
  threat model, out of scope for this document (see
  `plans/docs/architecture/04-deployment.md` for its own model).
- **DNS registrar account security** (whoever controls the `famit.in`
  registrar/Cloudflare account can repoint everything) — that's an account-
  access control, not something a config file can mitigate.
- **Supply-chain risk in `npm ci` dependencies** — standard `package-lock.json`
  pinning is in place; periodic `npm audit` is a process recommendation, not
  something enforced by any file here.
