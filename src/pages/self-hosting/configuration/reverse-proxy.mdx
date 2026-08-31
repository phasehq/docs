import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'
import { DocActions } from '@/components/DocActions'

export const description =
  'Configure a load balancer, reverse proxy or CDN for Phase: forwarded headers, client IP detection, and CSRF origin validation.'

<HeroPattern />

<Tag variant="small">SELF-HOSTING</Tag>

# Load balancers and reverse proxies

Configure your load balancer, reverse proxy or CDN so that Phase receives the request context it needs: the original protocol, host, and client IP. {{ className: 'lead' }}

<DocActions />

Every reference deployment runs the Phase backend behind at least one reverse proxy. This can be the bundled `nginx`, a Kubernetes ingress controller, a cloud load balancer, or a chain of them. The backend reconstructs details about the original browser request from headers that each proxy hop must forward correctly.

## Forwarded headers

| Header | What Phase uses it for |
| --- | --- |
| `Host` | Request origin reconstruction for [CSRF validation](#csrf-protection), and `ALLOWED_HOSTS` checks |
| `X-Forwarded-Proto` | The original protocol (HTTP vs HTTPS), used by [CSRF origin validation](#csrf-protection). Trust is controlled by [`TRUST_PROXY_SSL_HEADER`](/self-hosting/configuration/envars#host-configuration) |
| `X-Real-IP` / `X-Forwarded-For` | [Client IP detection](#client-ip-detection) for audit logs and Network Access Policy enforcement |

A misconfigured proxy causes different symptoms:

- CSRF `403` errors on Console actions
- Audit logs that show the IP address of the proxy for every event
- IP allowlists that match the wrong clients

<Note>
The bundled [`nginx` configuration](https://raw.githubusercontent.com/phasehq/console/main/nginx/default.conf) sets all of these headers for you. If your copy of `default.conf` is older than Console `v2.75.0`, download the new version. It adds the `X-Forwarded-Proto` header.
</Note>

---

## Client IP detection

Phase uses the `X-Real-IP` header to identify the actual client IP address for audit logging and Network Access Policies. By default, the bundled nginx detects the real client IP and forwards it to the backend via this header.

If you run Phase behind an upstream proxy like Cloudflare or an Amazon ALB before nginx (for example, Cloudflare → ALB → nginx → Phase services), you must configure nginx to trust and extract the client IP from the upstream service's headers.

<Warning>
For security reasons, ensure your nginx instance only accepts IP information from trusted sources (Cloudflare or ALB IP ranges). Use the [`ngx_http_realip_module`](https://nginx.org/en/docs/http/ngx_http_realip_module.html) to configure this properly. This is to make sure an attacker cannot spoof the client IP address to bypass any Network Access Policies or audit logs.
</Warning>

### Nginx configuration example

If using Cloudflare, configure nginx to map Cloudflare's `CF-Connecting-IP` header, and pass the upstream `X-Forwarded-Proto` through:

```nginx
http {
  # --- Cloudflare IP header forwarding ---
  map $http_cf_connecting_ip $client_real_ip {
      default $remote_addr;
      "~." $http_cf_connecting_ip;
  }

  # --- Original protocol forwarding ---
  # Prefer the upstream proxy's X-Forwarded-Proto header, falling back to
  # this server's own scheme when it is absent.
  map $http_x_forwarded_proto $forwarded_proto {
      default $http_x_forwarded_proto;
      "" $scheme;
  }

  server {
      listen 80;
      listen 443 ssl;
      http2 on;
      server_tokens off;

      # Route API traffic to backend
      location /service/ {
          rewrite ^/service/(.*) /$1 break;
          proxy_set_header X-Real-IP $client_real_ip;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $forwarded_proto;
          proxy_set_header Host $http_host;
          proxy_pass http://backend:8000;
      }

      # Route traffic to frontend
      location / {
          proxy_set_header X-Real-IP $client_real_ip;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header Host $http_host;
          proxy_pass http://frontend:3000;
      }
  }
}
```

For Amazon ALB, replace `$http_cf_connecting_ip` with the ALB's IP header accordingly.

<Note>
The `X-Forwarded-Proto` map tells the backend that requests arrived over HTTPS when the upstream proxy terminates TLS and connects to nginx over plain HTTP. [CSRF origin validation](#csrf-protection) needs this from Console `v2.75.0`. Like the client IP headers, only use this passthrough when nginx is reachable exclusively through the upstream proxy.
</Note>

See the [Cloudflare documentation](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/#nginx-1) for more details.

If you're using Traefik or other reverse proxies, adjust the header mapping configuration to match your proxy's client IP header format. You may provide the above nginx config to your favourite AI assistant to help you configure your reverse proxy.

---

## CSRF protection

Starting with Console `v2.75.0`, the backend enforces [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) protection on session-authenticated browser routes. This prevents malicious websites from making state-changing requests to your Phase Console with a logged-in user's session cookie.

Most deployments need no configuration changes. If you run your own proxy, terminate TLS upstream of nginx, or use multiple hostnames, review the [deployment scenarios](#deployment-scenarios) that follow.

### What is affected

CSRF protection applies to the session-authenticated routes of the Console web UI. These are the browser GraphQL API, logout, the pre-login [2FA verification](/access-control/authentication/mfa) step, and the GitHub integration OAuth flow. The web UI fetches a CSRF token automatically and attaches it to every request.

The following do not use session cookies, and are **not** affected:

- The [CLI](/cli/commands), [SDKs](/sdks) and Kubernetes operator
- The [Public API](/public-api) (`/v1/*`), including requests made with service account tokens and personal access tokens
- SCIM provisioning
- Secret syncs and other [integrations](/integrations)
- [Lockbox](/console/secrets#lockbox) links, which are public share links by design

### How requests are validated

For every state-changing browser request, the backend checks a CSRF token (handled automatically by the web UI) and validates the `Origin` header of the browser. The `Origin` check passes in either of two cases:

1. **The origin is listed in `ALLOWED_ORIGINS`.** The [`ALLOWED_ORIGINS`](/self-hosting/configuration/envars#additional-environment-variables) environment variable is also the list of trusted origins for CSRF. It must contain the exact origin shown in the browser address bar (scheme, host, and port). The reference deployments derive it from `HTTP_PROTOCOL` + `HOST`. It is correct as long as those match the URL that your users visit.

2. **The backend can reconstruct the origin from the request.** The backend rebuilds `scheme://host` from the `Host` header and the protocol of the request. When a proxy terminates TLS in front of the backend, the backend learns the original protocol from the `X-Forwarded-Proto` header. This is the case in every reference deployment. The [`TRUST_PROXY_SSL_HEADER`](/self-hosting/configuration/envars#host-configuration) variable controls trust in this header and defaults to `true`.

In practice:

- If users only access the Console at the origin from `HTTP_PROTOCOL` + `HOST` (or `global.host` on Kubernetes), check 1 passes. No proxy header configuration is necessary.
- If the Console is reachable at more hostnames, IP addresses, or ports, add each extra origin to `ALLOWED_ORIGINS`. As an alternative, make sure that your proxy chain preserves `Host` and forwards `X-Forwarded-Proto`, so check 2 passes.

---

## Deployment scenarios

### Docker Compose with the bundled nginx

This covers the standard [Docker Compose](/self-hosting/docker-compose) deployment and the VM-based guides that reuse it: [AWS EC2](/self-hosting/aws), [Azure](/self-hosting/azure), [GCP](/self-hosting/gcp), [DigitalOcean](/self-hosting/digitalocean) and [Raspberry Pi](/self-hosting/raspberrypi).

When the browser connects directly to the bundled `nginx` service, everything works with no changes. The `nginx` service terminates TLS with your certificate or the default self-signed one. The stock configuration forwards the original protocol and host to the backend:

```nginx
location /service/ {
    rewrite ^/service/(.*) /$1 break;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header Host $http_host;
    ...
}
```

If your `nginx/default.conf` is older than Console `v2.75.0`, update it. Either download the current configuration, or add the `proxy_set_header X-Forwarded-Proto $scheme;` line to the `location /service/` block:

```fish
wget -O ./nginx/default.conf https://raw.githubusercontent.com/phasehq/console/main/nginx/default.conf
docker compose up -d --force-recreate nginx
```

Without this header, the Console continues to work at the origin from `HTTP_PROTOCOL` + `HOST` (check 1). The header only becomes necessary for origins that are not in `ALLOWED_ORIGINS`.

### A load balancer or CDN in front of the bundled nginx

Examples: AWS ALB, GCP HTTPS Load Balancer, Azure Application Gateway or Front Door, Cloudflare (proxied/orange-cloud DNS), or any other TLS-terminating proxy in front of the `nginx` service.

These proxies all set `X-Forwarded-Proto` themselves, but the bundled `nginx` **overwrites** it with the scheme of its own incoming connection. If your load balancer connects to nginx over plain HTTP, the backend sees `X-Forwarded-Proto: http`.

You have two options:

**Option 1 (simplest): connect to nginx over HTTPS.** Point the load balancer at `nginx` port `443` instead of port `80`. Then `$scheme` is `https` and the stock configuration is correct. The default self-signed certificate works for this hop with AWS ALB, GCP HTTPS load balancers, and Cloudflare's **Full** mode, because these do not validate origin certificates. Azure Application Gateway and Azure Front Door **do** validate the origin certificate. Use a certificate that they trust, or use Option 2. For Application Gateway, you can upload the root of your certificate as a trusted root certificate in the backend settings. Front Door does not accept self-signed certificates.

**Option 2: pass the upstream header through.** Configure `nginx` to prefer the upstream `X-Forwarded-Proto` header, with its own scheme as the fallback. From Console `v2.75.0`, `nginx/default.conf` contains this `map` as a commented block. Uncomment it, and use `$forwarded_proto` in the `location /service/` block. On older configurations, add the map above the `server` block:

```nginx
# Prefer the TLS-terminating proxy's X-Forwarded-Proto header,
# falling back to this server's own scheme when it is absent.
map $http_x_forwarded_proto $forwarded_proto {
    default $http_x_forwarded_proto;
    "" $scheme;
}

server {
    ...
    location /service/ {
        ...
        proxy_set_header X-Forwarded-Proto $forwarded_proto;
        ...
    }
}
```

<Warning>
Only use Option 2 when nginx is reachable exclusively through your load balancer or CDN. If clients can reach nginx directly, they can spoof `X-Forwarded-Proto`. In that case, keep the stock `$scheme` configuration. The same trust boundary applies to [client IP detection](#client-ip-detection).
</Warning>

If you use Cloudflare in front of Phase, use the **Full (strict)** SSL/TLS mode with a certificate that Cloudflare trusts, for example a free [Cloudflare Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/) certificate. If you keep the default self-signed certificate, use **Full** mode. Full (strict) rejects self-signed certificates. Do not use **Flexible** mode: it downgrades the origin connection to plain HTTP, which is not acceptable for a secrets manager.

### Kubernetes with the Phase Helm chart

The [Kubernetes](/self-hosting/kubernetes), [AWS EKS](/self-hosting/aws-eks) and [Azure AKS](/self-hosting/azure-aks) deployments route traffic through an NGINX ingress controller. The controller terminates TLS and sets `X-Forwarded-Proto` and `Host` for upstream services automatically. No extra configuration is necessary for the documented topologies, including the L4 (TCP passthrough) cloud load balancers in front of the controller.

If you terminate TLS upstream of the ingress controller (for example, an ALB that forwards plain HTTP to the controller), configure the controller to trust forwarded headers. This is the same ConfigMap used for [client IP forwarding](/self-hosting/kubernetes#client-ip-forwarding):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
data:
  use-forwarded-headers: "true"
  proxy-real-ip-cidr: "10.0.0.0/8" # 👈 Replace with your load balancer / VPC CIDR
```

<Warning>
Only enable `use-forwarded-headers` when the controller is reachable exclusively through your load balancer. If it is not, clients can spoof `X-Forwarded-*` headers.
</Warning>

For custom ingress controllers such as Traefik, make sure that the controller preserves the `Host` header and sets `X-Forwarded-Proto`. Both are default behavior for mainstream controllers. Also replicate the [routing rules](/self-hosting/kubernetes#troubleshooting) of the chart.

### Traefik

Traefik sets `X-Forwarded-Proto` and preserves the `Host` header by default when it terminates TLS.

- **Traefik in front of the bundled nginx:** this is the [load balancer scenario](#a-load-balancer-or-cdn-in-front-of-the-bundled-nginx). Either connect to nginx over HTTPS, or apply the `map` snippet above.
- **Traefik instead of the bundled nginx:** route `/service` to the backend with the prefix stripped, and everything else to the frontend:

```yaml {{ title: 'traefik-dynamic.yaml' }}
http:
  routers:
    phase-backend:
      rule: 'Host(`phase.example.com`) && PathPrefix(`/service/`)'
      entryPoints: ['websecure']
      tls: {}
      middlewares: ['phase-strip-service']
      service: phase-backend
    phase-frontend:
      rule: 'Host(`phase.example.com`)'
      entryPoints: ['websecure']
      tls: {}
      service: phase-frontend
  middlewares:
    phase-strip-service:
      stripPrefix:
        prefixes:
          - '/service'
  services:
    phase-backend:
      loadBalancer:
        servers:
          - url: 'http://backend:8000'
    phase-frontend:
      loadBalancer:
        servers:
          - url: 'http://frontend:3000'
```

### Caddy

Caddy sets `X-Forwarded-Proto` and preserves the `Host` header by default. To use Caddy instead of the bundled nginx:

```text {{ title: 'Caddyfile' }}
phase.example.com {
    handle_path /service/* {
        reverse_proxy backend:8000
    }
    handle {
        reverse_proxy frontend:3000
    }
}
```

`handle_path` strips the `/service` prefix before proxying, matching the bundled nginx routing.

### Apache HTTP Server

By default, Apache rewrites the `Host` header to the upstream address and does not set `X-Forwarded-Proto`. Configure both explicitly (requires `mod_proxy`, `mod_proxy_http`, `mod_headers` and `mod_ssl`):

```text {{ title: 'httpd.conf' }}
<VirtualHost *:443>
    ServerName phase.example.com
    SSLEngine on

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"

    ProxyPass        /service/ http://backend:8000/
    ProxyPassReverse /service/ http://backend:8000/
    ProxyPass        /         http://frontend:3000/
    ProxyPassReverse /         http://frontend:3000/
</VirtualHost>
```

The Phase frontend does not require WebSockets. If you need WebSocket upgrades through this proxy, use `ProxyPass` with `upgrade=websocket` (Apache 2.4.47+, `mod_proxy_wstunnel`).

### Tailscale Serve / Funnel

In the [Docker Compose + Tailscale](/self-hosting/tailscale) deployment, TLS terminates at Tailscale Serve inside the sidecar container. No action is necessary. The `.env` in the guide sets `ALLOWED_ORIGINS` to the exact tailnet origins, so requests validate via check 1. Tailscale Serve also sets `X-Forwarded-Proto`, and the Tailscale-specific nginx configuration passes it through to the backend.

If you access the Console via an origin beyond those in the guide (for example, a LAN hostname), add it to `ALLOWED_ORIGINS` in `.env`, and the hostname to `ALLOWED_HOSTS`. The same principle applies to the [private AKS deployment with Tailscale](/self-hosting/azure-aks). There, the origin derives from `global.host`, and extra origins require an `ALLOWED_ORIGINS` override on the backend deployment.

### Railway

On [Railway](/self-hosting/railway), TLS terminates at the Railway edge and traffic reaches the `railway-nginx` service over HTTP. `ALLOWED_ORIGINS` derives from the environment variables that reference the `railway-nginx` public domain, so keep them current. If you see CSRF failures after you add a custom domain, make sure that the referenced variables are up to date, then redeploy. The cause is the same as the [OAuth redirection issues](/self-hosting/railway#o-auth-redirection-issues) in the Railway guide.

### Serving over plain HTTP

Deployments on trusted internal networks without TLS work unchanged: set `HTTP_PROTOCOL=http://` so that `ALLOWED_ORIGINS` matches the `http://` origin in the browser.

### Multiple hostnames or IP-based access

The Console can be reachable at more than one origin: an IP address and a DNS name, an internal and an external hostname, or a non-standard port. Every origin that users type into the browser must validate. Either list them all in `ALLOWED_ORIGINS`, or make sure that your proxy chain preserves `Host` and sets `X-Forwarded-Proto` (the bundled nginx `v2.75.0`+ configuration does). With the headers in place, any hostname in `ALLOWED_HOSTS` validates without an `ALLOWED_ORIGINS` entry.

To list extra origins in the reference Docker Compose, edit `docker-compose.yml`. It sets `ALLOWED_HOSTS` and `ALLOWED_ORIGINS` in the `environment:` block of each service, which **overrides** `.env`:

```yaml {{ title: 'docker-compose.yml' }}
backend:
  # ...
  environment:
    ALLOWED_HOSTS: '${HOST},backend,phase.internal,10.20.0.5'
    ALLOWED_ORIGINS: '${HTTP_PROTOCOL}${HOST},https://phase.internal:8443,https://10.20.0.5'
```

Keep the values identical across the `backend`, `worker` and `migrations` services. Templates that do not override these values in the compose file, like the [Tailscale guide](/self-hosting/tailscale), read them from `.env` instead:

```fish {{ title: '.env' }}
ALLOWED_HOSTS=phase.example.com,phase.internal,10.20.0.5,backend
ALLOWED_ORIGINS=https://phase.example.com,https://phase.internal:8443,https://10.20.0.5
```

On Kubernetes, `ALLOWED_ORIGINS` derives from `global.host`. Add extra origins with an environment variable override on the backend deployment.

<Note>
Origins include the port when it is non-standard (`https://phase.internal:8443`), and no trailing slash.
</Note>

---

## Disabling proxy header trust

[`TRUST_PROXY_SSL_HEADER`](/self-hosting/configuration/envars#host-configuration) defaults to `true`, because every reference deployment runs the backend behind at least one proxy. Set it to `false` only if your `backend` container is reachable without a proxy that sets `X-Forwarded-Proto`. In that setup, a client can spoof the header directly. With trust disabled, the Console works normally as long as users access it at the origins in `ALLOWED_ORIGINS`.

---

## Troubleshooting

Failed CSRF checks surface as HTTP `403` responses to Console actions: saves that fail, or an unexpected logout. The CLI and API continue to work, because they are not subject to CSRF. Work through this checklist:

1. **Refresh the tab.** Tabs that were open across an upgrade to `v2.75.0` run older Console code that does not attach the CSRF token. A refresh loads the current version.

2. **Compare the browser origin with `ALLOWED_ORIGINS`.** The origin in the address bar must appear in `ALLOWED_ORIGINS` exactly (scheme, host, and port):

   ```fish
   docker compose exec backend printenv ALLOWED_ORIGINS HOST
   ```

   On Kubernetes:

   ```fish
   kubectl -n phase exec deploy/phase-console-backend -- printenv ALLOWED_ORIGINS HOST
   ```

   If you access the Console at `https://10.0.0.5` and `ALLOWED_ORIGINS` is `https://phase.example.com`, the origin check fails, unless your proxy forwards `X-Forwarded-Proto` and `Host` (see [Multiple hostnames](#multiple-hostnames-or-ip-based-access)).

3. **Examine the protocol that reaches the backend.** If TLS terminates upstream of the bundled nginx and the hop to nginx is plain HTTP, the stock configuration reports `http` to the backend. See [the load balancer scenario](#a-load-balancer-or-cdn-in-front-of-the-bundled-nginx).

4. **Make sure that the token endpoint responds and sets a cookie:**

   ```fish
   curl -sik https://<your-host>/service/auth/csrf/
   # Expect: HTTP 200, a JSON body {"csrfToken": "..."} and a set-cookie header
   ```

   If this fails, requests do not reach the backend. Examine the [routing structure](/self-hosting/docker-compose#routing-structure) for your deployment.

5. **Make sure that cookies are not stripped.** CSRF validation compares the token against a cookie. Proxies or CDN rules that strip `Set-Cookie` or `Cookie` headers on `/service/*` paths break both sessions and CSRF.

6. **Audit logs show the IP of the proxy, or IP allowlists misbehave.** The client IP does not reach the backend. See [client IP detection](#client-ip-detection) to forward it from your proxy chain.
