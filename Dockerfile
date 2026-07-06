# syntax=docker/dockerfile:1
# Haptica AI landing ("famit.in") — static Next.js export served by nginx.
#
# Build context is THIS directory (landing/):
#   docker build -t haptica-landing:latest -f Dockerfile .
#
# Two stages: (1) Node builds the static export into ./out, (2) a bare nginx
# image serves those files. The FINAL image ships NO Node, NO npm, NO source,
# NO build tools — just nginx + static HTML/CSS/JS. That is the whole point of
# a static site: the smallest possible attack surface (see ../SECURITY.md).

# ---------------------------------------------------------------------------
# Stage 1 — builder
# ---------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Deps first so this layer caches across source-only changes.
COPY package.json package-lock.json ./
RUN npm ci

# NEXT_PUBLIC_* vars are inlined into the client bundle at BUILD time, so they
# must be present here (not just at container-run time). Non-secret by
# definition — see .env.example. Safe defaults match the documented values.
ARG NEXT_PUBLIC_APP_URL=https://haptica.famit.in
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# App source + the production static export.
# Requires next.config.js: output: 'export' (see ../DEPLOY.md) -> produces ./out
COPY . .
RUN npm run build \
    && test -d out || (echo "ERROR: out/ was not produced - next.config.js needs output: 'export' (see DEPLOY.md)" >&2 && exit 1)

# ---------------------------------------------------------------------------
# Stage 2 — runtime (no Node, no npm, no source — just nginx + static files)
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime
LABEL org.opencontainers.image.title="haptica-landing" \
      org.opencontainers.image.description="Haptica AI marketing site (famit.in) - static export served by hardened nginx"

# Drop the stock vhost; our nginx.conf is a complete, self-contained config.
RUN rm -f /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=builder /app/out /usr/share/nginx/html

# Non-root: the alpine nginx image ships an unprivileged 'nginx' user
# (uid 101). We run the WHOLE process (master + workers) as that user.
# nginx.conf listens on 8080 (an unprivileged port) so no Linux capabilities
# are needed to bind it, and all writable paths (pid, temp dirs) are pointed
# at /tmp, which is mounted as a tmpfs by docker-compose.yml so the container
# can run with a fully read-only root filesystem.
USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
