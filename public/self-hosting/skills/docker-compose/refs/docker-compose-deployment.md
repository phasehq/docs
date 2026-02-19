# Docker Compose Deployment Reference

Complete reference for deploying Phase Console with Docker Compose and Let's Encrypt TLS.

## Architecture

```
Internet
    │
    ▼
 Nginx :80/:443
    ├── /.well-known/acme-challenge/ → /var/www/certbot (certbot webroot)
    ├── /service/ → backend:8000 (Django API)
    └── / → frontend:3000 (Next.js)
         │
    ┌────┴─────┐
    │          │
 Postgres   Redis
```

## configure-env.sh Template

Write this as `configure-env.sh`, `chmod +x` it. Auto-generates all secrets. Mark OAuth fields with `# EDIT_ME`.

```bash
#!/bin/bash
# Phase Console environment configuration
# Edit the EDIT_ME values below, then run this script to generate your .env

DOMAIN="EDIT_ME_YOUR_DOMAIN"         # EDIT_ME: e.g. phase.example.com
SSO_PROVIDERS="EDIT_ME_PROVIDERS"    # EDIT_ME: e.g. google,github

# OAuth credentials — fill in after creating OAuth apps
GOOGLE_CLIENT_ID="EDIT_ME"           # EDIT_ME: Google OAuth Client ID
GOOGLE_CLIENT_SECRET="EDIT_ME"       # EDIT_ME: Google OAuth Client Secret
GITHUB_CLIENT_ID="EDIT_ME"           # EDIT_ME: GitHub OAuth Client ID
GITHUB_CLIENT_SECRET="EDIT_ME"       # EDIT_ME: GitHub OAuth Client Secret
GITLAB_CLIENT_ID="EDIT_ME"           # EDIT_ME: GitLab OAuth Client ID
GITLAB_CLIENT_SECRET="EDIT_ME"       # EDIT_ME: GitLab OAuth Client Secret

# GitHub integration (optional — for syncing secrets to GitHub Actions)
GITHUB_INTEGRATION_CLIENT_ID="EDIT_ME"      # EDIT_ME (optional)
GITHUB_INTEGRATION_CLIENT_SECRET="EDIT_ME"  # EDIT_ME (optional)

# Enterprise license (leave blank if not applicable)
PHASE_LICENSE_OFFLINE=""

cat > .env <<EOF
HOST=${DOMAIN}
HTTP_PROTOCOL=https://

SSO_PROVIDERS=${SSO_PROVIDERS}

NEXTAUTH_SECRET=$(openssl rand -hex 32)
SECRET_KEY=$(openssl rand -hex 32)
SERVER_SECRET=$(openssl rand -hex 32)

GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}

GITLAB_CLIENT_ID=${GITLAB_CLIENT_ID}
GITLAB_CLIENT_SECRET=${GITLAB_CLIENT_SECRET}

GITHUB_INTEGRATION_CLIENT_ID=${GITHUB_INTEGRATION_CLIENT_ID}
GITHUB_INTEGRATION_CLIENT_SECRET=${GITHUB_INTEGRATION_CLIENT_SECRET}

DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=phase-db
DATABASE_USER=phase
DATABASE_PASSWORD=$(openssl rand -hex 32)

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

NEXT_TELEMETRY_DISABLED=1
PHASE_LICENSE_OFFLINE=${PHASE_LICENSE_OFFLINE}
EOF

echo ".env written successfully."
```

Only include credential lines for the SSO providers the user actually needs. Remove unused provider blocks entirely to keep the `.env` clean.

## SSO OAuth Callback URLs

Pattern: `https://{DOMAIN}/api/auth/callback/{provider_slug}`

| Provider | Slug | Callback URL |
|---|---|---|
| Google OAuth | `google` | `https://{domain}/api/auth/callback/google` |
| GitHub OAuth | `github` | `https://{domain}/api/auth/callback/github` |
| GitLab OAuth | `gitlab` | `https://{domain}/api/auth/callback/gitlab` |
| Authentik | `authentik` | `https://{domain}/api/auth/callback/authentik` |
| GitHub Enterprise | `github-enterprise` | `https://{domain}/api/auth/callback/github-enterprise` |
| Google OIDC | `google-oidc` | `https://{domain}/api/auth/callback/google-oidc` |
| JumpCloud OIDC | `jumpcloud-oidc` | `https://{domain}/api/auth/callback/jumpcloud-oidc` |
| Microsoft Entra ID | `entra-id-oidc` | `https://{domain}/api/auth/callback/entra-id-oidc` |
| Okta OIDC | `okta-oidc` | `https://{domain}/api/auth/callback/okta-oidc` |

## docker-compose.yml — Certbot Patch

Add the following to the existing `docker-compose.yml`. Do not remove or modify any existing service definitions.

**Add to the `nginx` service's `volumes` list:**

```yaml
      - certbot-webroot:/var/www/certbot:ro
      - certbot-certs:/etc/letsencrypt:ro
```

**Add the `certbot` service at the end of the `services` block:**

```yaml
  certbot:
    container_name: phase-certbot
    image: certbot/certbot:latest
    volumes:
      - certbot-webroot:/var/www/certbot
      - certbot-certs:/etc/letsencrypt
```

**Add to the `volumes` block:**

```yaml
  certbot-webroot:
    driver: local
  certbot-certs:
    driver: local
```

The full patched `nginx` service should look like:

```yaml
  nginx:
    container_name: phase-nginx
    build:
      context: .
      dockerfile: ./nginx/Dockerfile
    restart: always
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - certbot-webroot:/var/www/certbot:ro
      - certbot-certs:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
    networks:
      - phase-net
```

## nginx/default.conf — Let's Encrypt Ready

This replaces the existing `nginx/default.conf` entirely. Preserves all existing routing. The HTTPS block initially uses the self-signed cert baked into the nginx image — this gets swapped to Let's Encrypt after cert issuance.

```nginx
# HTTP — serve ACME challenges, redirect everything else to HTTPS
server {
    listen 80;
    server_tokens off;

    # Let's Encrypt ACME challenge (certbot webroot)
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS — reverse proxy to Phase services
server {
    listen 443 ssl;
    http2 on;
    server_tokens off;

    # TLS config
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+AESGCM:EECDH+CHACHA20;
    ssl_prefer_server_ciphers on;

    # TLS certificate
    # Initially: self-signed cert baked into the nginx image (allows nginx to start)
    # After cert issuance: updated to Let's Encrypt paths (step 5f)
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    # Route API traffic to backend — https://example.com/service/ -> http://backend:8000/
    location /service/ {
        rewrite ^/service/(.*) /$1 break;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://backend:8000;
        proxy_redirect off;

        proxy_cookie_path / "/; HttpOnly; SameSite=strict";

        proxy_buffers 16 32k;
        proxy_buffer_size 64k;
        proxy_busy_buffers_size 128k;
    }

    # Route all other traffic to frontend — https://example.com/ -> http://frontend:3000/
    location / {
        include /etc/nginx/mime.types;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_pass http://frontend:3000;
        proxy_redirect off;

        proxy_buffers 16 32k;
        proxy_buffer_size 64k;
        proxy_busy_buffers_size 128k;
    }
}
```

## nginx/default.conf — After Let's Encrypt (step 5f)

After certbot issues the cert, update the two `ssl_certificate` lines in the HTTPS server block:

```nginx
    # Let's Encrypt certificate (issued by certbot)
    ssl_certificate /etc/letsencrypt/live/{DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{DOMAIN}/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/{DOMAIN}/chain.pem;

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 1.1.1.1 valid=300s;
    resolver_timeout 5s;
```

All routing (`/service/`, `/`) stays exactly the same — only the cert block changes.

Then reload nginx without restarting:

```bash
docker compose exec nginx nginx -s reload
```

## DNS Verification

Before running certbot, verify the domain resolves to the server's public IP:

```bash
# Get the server's public IP
curl -s https://api.ipify.org

# Check DNS resolution from multiple resolvers
dig @8.8.8.8 ${DOMAIN} +short
dig @1.1.1.1 ${DOMAIN} +short
dig @9.9.9.9 ${DOMAIN} +short
dig @208.67.222.222 ${DOMAIN} +short
```

All resolvers should return the server's public IP. Proceed only when at least 3 of 4 agree.

## Certbot Commands

### Initial certificate issuance

```bash
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email {EMAIL} \
  --agree-tos \
  --no-eff-email \
  -d {DOMAIN}
```

### Manual renewal test (dry run)

```bash
docker compose run --rm certbot renew --dry-run
```

### Force renewal

```bash
docker compose run --rm certbot renew --force-renewal
docker compose exec nginx nginx -s reload
```

## Auto-Renewal Cron Job

Install a cron job that attempts renewal twice daily. Certbot only actually renews when the cert is within 30 days of expiry.

```bash
(crontab -l 2>/dev/null; echo "0 0,12 * * * cd {WORKING_DIR} && docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload") | crontab -
```

Verify it was installed:

```bash
crontab -l
```

## Health Check Endpoints

```bash
# Frontend health
curl -s https://{DOMAIN}/api/health

# Backend health
curl -s https://{DOMAIN}/service/health/
```

Both should return HTTP 200.

## Certificate Verification

```bash
# Check issuer and expiry
curl -sv https://{DOMAIN} 2>&1 | grep -E "issuer|expire|SSL connection"

# Or use openssl
echo | openssl s_client -connect {DOMAIN}:443 -servername {DOMAIN} 2>/dev/null \
  | openssl x509 -noout -issuer -dates
```

## Upgrading Phase

```bash
docker compose pull
docker compose up -d
```

The certbot volumes and cron job are unaffected by upgrades.

## Cloudflare Users

If the domain uses Cloudflare as a proxy (orange cloud), set SSL/TLS mode to **Full (strict)** in the Cloudflare dashboard. The Let's Encrypt cert on the origin server satisfies strict mode.

If using Cloudflare's proxy, you may also want to forward the real client IP. Uncomment the Cloudflare IP header block in `nginx/default.conf`:

```nginx
map $http_cf_connecting_ip $client_real_ip {
    default $remote_addr;
    "~." $http_cf_connecting_ip;
}
```

Then replace `$remote_addr` with `$client_real_ip` in the `proxy_set_header X-Real-IP` lines.
