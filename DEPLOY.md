# Deploying the Haptica AI landing page (famit.in)

Written for a non-technical founder: every command below is copy-paste, in
order, with a one-line plain-English explanation of what it does. Nothing
here touches the live app at `haptica.famit.in` — that stays completely
untouched on its own box.

**What you're deploying:** a static marketing website (no server-side code,
no database) self-hosted on one small DigitalOcean droplet, fronted by
Cloudflare for TLS + bot/attack protection, at the domain `famit.in` (+ `www`).

---

## 0. One-time code change this repo needs (do this — or ask Claude to — before building)

`landing/next.config.js` must export exactly this, so `npm run build`
produces a static export in `landing/out/` instead of a server build:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

module.exports = nextConfig
```

- `output: 'export'` — makes Next.js build to plain HTML/CSS/JS files instead
  of needing a Node.js server to run.
- `images: { unoptimized: true }` — Next's built-in image optimizer needs a
  live server; static export can't use it, so this switches image handling to
  plain `<img>` tags instead.
- `trailingSlash: true` — makes every page export as `page-name/index.html`
  (a small folder with an index file) instead of `page-name.html`, which is
  what the nginx config in this repo expects.

Everything below assumes this change is already in place and `landing/out/`
is what `npm run build` produces.

---

## 1. Get a DigitalOcean API token (2 minutes)

1. Go to **https://cloud.digitalocean.com/account/api/tokens**
2. Click **Generate New Token**
3. Name it `haptica-landing`, give it **Read and Write** access, click **Generate Token**
4. Copy the token. Open (or create) the file `C:\Users\kunal\desktop\cal\.env.local`
   and add a line:
   ```
   DO_API_TOKEN=paste_it_here
   ```
   (This file is already set up to never be committed to git.)

## 2. Get a Cloudflare API token (3 minutes)

Full details + exact permission click-path: `deploy/cloudflare-setup.md`.
Short version:

1. Go to **https://dash.cloudflare.com/profile/api-tokens** → **Create Token** → **Create Custom Token**
2. Add three permissions: `Zone:DNS:Edit`, `Zone:Zone Settings:Edit`, `Zone:Firewall Services:Edit`
3. Zone Resources → **Specific zone** → `famit.in`
4. Create it, copy it, add to the same `.env.local` file:
   ```
   CF_API_TOKEN=paste_it_here
   ```

> If you already have a Cloudflare token and it's the "Wrangler"-style kind
> (starts with `cfut_`), it will **not** work for this — `deploy/cf-setup.py`
> will detect that and tell you exactly what to create instead. Don't worry
> about getting it wrong; the script won't silently fail.

## 3. Create the droplet + its firewall

```
! python3 "landing/deploy/provision-landing-droplet.py"
```
Plain English: creates the smallest DigitalOcean server (about $6/mo),
installs Docker on it, and builds a firewall around it so **only Cloudflare**
can reach it on the web ports — nothing else on the internet can talk to it
directly, even if someone finds its IP address.

This prints a line like `DROPLET_IP: 164.90.XXX.XXX` — copy that IP.

Safe to re-run any time — it won't create a second server.

## 4. Point Cloudflare at it + turn on the protections

```
! python3 "landing/deploy/cf-setup.py" <DROPLET_IP>
```
Plain English: tells Cloudflare "this is where famit.in and www.famit.in
live," turns on automatic HTTPS, and switches on Cloudflare's bot-blocking,
rate-limiting, and attack-filtering (WAF) for the domain.

Safe to re-run any time.

## 5. Wait ~2 minutes, then verify

The droplet needs a couple of minutes after step 3 to install Docker and
build the site container. Then check:

```bash
# 1. HTTP redirects to HTTPS
curl -I http://famit.in
#    expect: HTTP/1.1 301 (or 308) ... location: https://famit.in/

# 2. The site loads over HTTPS
curl -I https://famit.in
#    expect: HTTP/2 200

# 3. The security headers are present
curl -sI https://famit.in | grep -i -E "strict-transport-security|content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy"
#    expect: all six headers to print a value

# 4. www works too
curl -I https://www.famit.in
```

If step 1-3 all look right, the site is live and hardened. If something
looks off, see **Troubleshooting** below.

## 6. Go live

DNS is already pointed at the droplet from step 4 — there's no separate
"cutover" step. The moment the container finishes building (a minute or two
after step 3), `https://famit.in` is the live site.

---

## Origin TLS — read this before you rely on "Full (Strict)"

Cloudflare's **Full (Strict)** SSL mode (which `cf-setup.py` turns on) means
Cloudflare will only forward traffic to your droplet over HTTPS with a
certificate it can verify. The site container in this repo is deliberately
**plain HTTP only, on port 8080** (see `nginx.conf`) — kept that simple on
purpose, to minimize what's exposed. That means **something else on the
droplet needs to answer port 443 with a real certificate** before Full
(Strict) actually works end-to-end. Pick ONE:

### Option A — fastest, ship today (recommended for launch day)
In the Cloudflare dashboard: **SSL/TLS → Overview → Flexible**. Visitors
still always get full HTTPS (Cloudflare → browser is unaffected); only the
Cloudflare → droplet leg is unencrypted plain HTTP. This is an accepted
trade-off *specifically because this is a static marketing page* — no
passwords, no session cookies, no personal data ever cross that leg. Upgrade
to Option B whenever you like; nothing else about the deployment changes.

### Option B — the complete answer, matches this repo's own proven pattern
This repo already runs a tiny Caddy container in front of the main app
exactly this way (`deploy/Caddyfile` + `deploy/docker-compose.tls.yml` at the
repo root) — same recipe, just pointed at this site's container instead.
SSH into the droplet and add two files next to `docker-compose.yml`:

`deploy/Caddyfile.landing`:
```caddyfile
famit.in, www.famit.in {
    tls {
        dns cloudflare {env.CF_API_TOKEN}
        resolvers 1.1.1.1 1.0.0.1
        propagation_delay 45s
        propagation_timeout -1
    }
    encode zstd gzip
    reverse_proxy haptica-landing:8080
}

http://famit.in, http://www.famit.in {
    encode zstd gzip
    reverse_proxy haptica-landing:8080
}
```

`docker-compose.tls.yml` (same directory as the repo's `docker-compose.yml`,
so `context: .` is the `haptica-landing` repo root):
```yaml
services:
  caddy:
    build:
      context: .
      dockerfile: deploy/Dockerfile.caddy
    restart: unless-stopped
    dns:
      - 1.1.1.1
      - 1.0.0.1
    environment:
      CF_API_TOKEN: ${CF_API_TOKEN}
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deploy/Caddyfile.landing:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - haptica-landing

volumes:
  caddy_data:
  caddy_config:
```
The Caddy image needs the Cloudflare DNS plugin baked in (stock `caddy:2-alpine`
doesn't have it). The axcrio-platform monorepo already has exactly this
recipe at `deploy/Dockerfile.caddy` (9 lines: `xcaddy build --with
github.com/caddy-dns/cloudflare`) — copy that one file, unchanged, into
`haptica-landing`'s own `deploy/` folder (alongside `Caddyfile.landing`), then:
```bash
docker compose -f docker-compose.yml -f docker-compose.tls.yml \
  --env-file .env up -d --build
```
`CF_API_TOKEN` needs one more Cloudflare permission for this path:
`Zone:DNS:Edit` (already covered if you created the token in step 2 above).

---

## Zero-server alternative: Cloudflare Pages

If you'd rather have **zero servers to manage at all** for this static site
(no droplet, no Docker, no firewall to think about), Cloudflare Pages is the
simplest possible hosting for a Next.js static export — fewest moving parts,
still fully DO-adjacent-optional (the main app at `haptica.famit.in` can stay
on DigitalOcean regardless; only this marketing page would move).

1. Push this repo (or just `landing/`) to a GitHub repo Cloudflare can read.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick the repo.
3. Build settings:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
4. Deploy. Cloudflare gives you a `*.pages.dev` URL immediately.
5. **Custom domain:** Pages project → **Custom domains** → add `famit.in` and
   `www.famit.in`. Cloudflare wires the DNS automatically (it's already your
   registrar/DNS host).
6. **Security:** Bot Fight Mode + WAF managed rules + rate-limiting rules
   apply the same way as `cloudflare-setup.md` describes (they're zone-level
   settings, independent of whether the origin is a droplet or Pages) — the
   security headers from `nginx.conf` need to move to a `_headers` file at
   the root of `landing/public/` instead (Cloudflare Pages' own header
   mechanism); ask Claude to generate one from `nginx.conf` if you switch to
   this path.

Trade-off: you give up the "everything self-hosted, one company" simplicity
and any use for `deploy/provision-landing-droplet.py` — but there's truly
nothing to patch, update, or get compromised, since there's no server at all.

---

## Troubleshooting

- **`curl -I http://famit.in` hangs / times out** — cloud-init is probably
  still installing Docker + building the image (give it a few more minutes),
  or DNS hasn't propagated yet (`cf-setup.py`'s DNS step usually takes effect
  in seconds since Cloudflare is authoritative, but local DNS caching can
  delay it a few minutes on your machine).
- **Security headers missing from `curl -sI`** — check the container is
  actually running the image built from THIS `nginx.conf`
  (`docker compose ps`, `docker compose logs haptica-landing` on the box).
- **SSL/TLS handshake errors** — you're on Full (Strict) without an origin
  cert yet. See **Origin TLS** above — either switch to Flexible for now, or
  add the Caddy piece.
- **Site shows old content after a deploy** — HTML responses are served
  `no-cache` on purpose (see `nginx.conf`'s cache map) so this shouldn't
  happen for pages; if `_next/static/*` assets look stale, that's expected —
  they're fingerprinted by content hash and cached for a year, so a NEW build
  gets NEW filenames automatically. Hard-refresh if in doubt.
- **Locked out after tightening `ALLOW_SSH_FROM`** — DigitalOcean dashboard →
  the droplet → **Access** → **Launch Droplet Console** works even with the
  Cloud Firewall blocking SSH (it's a separate, non-network console).

## Roll back

```bash
# On the droplet:
cd /opt/haptica-landing
docker compose down          # stops the container; DNS still points here
```
To fully undo the DNS pointing, remove the `A` records for `famit.in`/`www`
in the Cloudflare dashboard, or point them somewhere else. The droplet and
its firewall can be destroyed from the DigitalOcean dashboard → Droplets →
`haptica-landing` → **Destroy** — nothing else in this repo depends on it.
