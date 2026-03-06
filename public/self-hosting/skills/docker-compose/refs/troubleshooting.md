# Troubleshooting Guide

Common issues when deploying Phase Console with Docker Compose, with a focus on Let's Encrypt certificate setup.

## ACME Challenge Fails (certbot can't get certificate)

**Symptom:** `docker compose run --rm certbot certonly ...` fails with an error like:

```
Challenge failed for domain phase.example.com
http-01 challenge for phase.example.com
Cleaning up challenges
Some challenges have failed.
```

**Cause:** Let's Encrypt couldn't reach the ACME challenge file on port 80 at `http://{domain}/.well-known/acme-challenge/`. Common reasons:

1. **DNS not pointing to this server** — The domain doesn't resolve to this machine's IP.
2. **Port 80 is blocked** — A firewall (UFW, iptables, cloud security group) is blocking inbound port 80.
3. **nginx not running or not serving ACME challenges** — The config patch wasn't applied or nginx didn't restart.
4. **nginx config not updated** — The `/.well-known/acme-challenge/` location block is missing.

**Diagnosis:**

```bash
# Check DNS
dig @8.8.8.8 {domain} +short

# Check server public IP
curl -s https://api.ipify.org

# Check port 80 is reachable from outside (run from a different machine or use an online tool)
curl -v http://{domain}/.well-known/acme-challenge/test

# Check nginx is running
docker compose ps nginx

# Check nginx config is loaded correctly
docker compose exec nginx nginx -t

# Check nginx logs for errors
docker compose logs nginx
```

**Fix:**
- Fix DNS if it doesn't point to this server
- Open port 80 in firewall: `ufw allow 80/tcp` or equivalent
- Verify `nginx/default.conf` has the ACME challenge location in the HTTP server block:
  ```nginx
  location /.well-known/acme-challenge/ {
      root /var/www/certbot;
  }
  ```
- Verify the certbot-webroot volume is mounted in nginx: `docker compose config` should show the volume

## nginx Won't Start After Config Change

**Symptom:** `docker compose up -d --build nginx` fails or nginx exits immediately.

**Diagnosis:**

```bash
docker compose logs nginx
docker compose exec nginx nginx -t
```

**Common causes:**

- **Syntax error in nginx config** — Check for missing semicolons, braces, or typos. Run `nginx -t` to see the exact line.
- **SSL cert file not found** — If the config references Let's Encrypt paths (`/etc/letsencrypt/live/...`) but certbot hasn't run yet, nginx will fail to start. Make sure the config still points to the self-signed cert (`/etc/nginx/ssl/nginx.crt`) until after certbot succeeds.
- **Port already in use** — Something else is running on port 80 or 443. Check: `ss -tlnp | grep -E ':80|:443'`

## nginx Starts but Returns Self-Signed Cert After Switching

**Symptom:** After updating the `ssl_certificate` lines to Let's Encrypt paths and running `nginx -s reload`, the browser still shows the self-signed cert.

**Cause:** The nginx container's `/etc/letsencrypt` mount may not have picked up the new certs, or the reload didn't complete cleanly.

**Fix:**

```bash
# Verify the cert file exists inside the nginx container
docker compose exec nginx ls /etc/letsencrypt/live/{domain}/

# Force a clean restart (brief connection interruption)
docker compose restart nginx

# Re-verify
echo | openssl s_client -connect {domain}:443 -servername {domain} 2>/dev/null \
  | openssl x509 -noout -issuer
```

## Certificate Expires / Auto-Renewal Not Working

**Symptom:** Certificate expired. Browser shows security warning.

**Diagnosis:**

```bash
# Check cron jobs
crontab -l

# Check current cert expiry
echo | openssl s_client -connect {domain}:443 -servername {domain} 2>/dev/null \
  | openssl x509 -noout -dates

# Test renewal manually (dry run)
docker compose run --rm certbot renew --dry-run
```

**Common causes:**

- Cron job wasn't installed, or was removed
- Working directory in the cron job is wrong (docker compose can't find `docker-compose.yml`)
- Port 80 was blocked at renewal time

**Fix:**

Force renew immediately:

```bash
cd {working_dir}
docker compose run --rm certbot renew --force-renewal
docker compose exec nginx nginx -s reload
```

Reinstall the cron job:

```bash
(crontab -l 2>/dev/null | grep -v certbot; echo "0 0,12 * * * cd {working_dir} && docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload") | crontab -
```

## Phase Container CrashLooping

**Symptom:** `docker compose ps` shows a Phase container restarting repeatedly.

**Diagnosis:**

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs worker
docker compose logs migrations
```

**Common causes:**

- **Missing or invalid `.env`** — `HOST`, `NEXTAUTH_SECRET`, `SECRET_KEY`, `SERVER_SECRET`, `DATABASE_PASSWORD` must all be set.
- **Database migration failure** — Check `docker compose logs migrations`. Often caused by a wrong `DATABASE_PASSWORD` or Postgres not yet healthy.
- **Invalid `HOST` value** — Must be just the domain (`phase.example.com`), not `https://phase.example.com`.
- **Invalid `HTTP_PROTOCOL`** — Must be `https://` (with trailing slash).

## 502 Bad Gateway

**Symptom:** nginx returns 502 Bad Gateway.

**Cause:** The upstream service (frontend or backend) is not ready yet.

**Diagnosis:**

```bash
docker compose ps
docker compose logs backend
docker compose logs frontend
```

**Fix:** Wait for migrations to complete — the backend only starts after `phase-migrations` exits successfully. Check:

```bash
docker compose logs migrations
```

If migrations failed, fix the `.env` database credentials and re-run:

```bash
docker compose up migrations
```

## Let's Encrypt Rate Limits

**Symptom:** certbot fails with `Error: too many certificates already issued for...`

**Cause:** Let's Encrypt limits issuance to 5 duplicate certificates per domain per week.

**Fix:** Wait up to a week, or use a staging certificate to test:

```bash
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email {EMAIL} \
  --agree-tos \
  --no-eff-email \
  --staging \
  -d {DOMAIN}
```

Staging certs are not trusted by browsers but are useful for verifying the ACME flow works end-to-end. Remove the `--staging` flag once you're confident the flow works, then delete the staging cert and re-issue:

```bash
docker compose run --rm certbot delete --cert-name {DOMAIN}
# Then re-run without --staging
```

## Can't Connect to Phase After DNS Change

**Symptom:** Phase was working, then DNS was changed (e.g., moving to Cloudflare), and now it fails.

**Cause:** If Cloudflare proxy (orange cloud) is enabled but SSL mode isn't set to `Full (strict)`, Cloudflare will try to connect to the origin over plain HTTP and get rejected.

**Fix:**
- In Cloudflare dashboard: SSL/TLS → set to **Full (strict)**
- Or temporarily disable the Cloudflare proxy (grey cloud) to bypass it

## Disk Space — Certbot Accumulating Old Certs

**Symptom:** Disk usage growing on a server running for many months.

**Fix:** certbot keeps the last few cert versions by default. Clean up old ones:

```bash
docker compose run --rm certbot delete --cert-name {DOMAIN}
# Then re-issue a fresh cert
```

Or prune unused Docker volumes periodically:

```bash
docker volume prune
```

Be careful — `docker volume prune` removes ALL unused volumes, not just certbot's. Only run if you're sure no important data is in unnamed volumes.
