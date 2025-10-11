import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Run Phase on your Raspberry Pi with docker-compose.'

<Tag variant="small">SELF-HOSTING</Tag>


# Raspberry Pi

Learn how to set up the Phase Console using the Docker Compose template on your Raspberry Pi. {{ className: 'lead' }}

<DocActions /> 

Keep in mind the steps listed below serve as a rough outline on how to self-hosting Phase Services on your own infrastructure.

Note
- This guide is interchangeable for other ARM-based SBCs that support the `linux/arm64` Docker architecture.
- You may consider running the Phase Service behind a VPN and not exposing it to the internet directly.
- For production use, you may need to set up additional components such as TLS certificates, web application firewall, database backups and replication, DDoS protection, rate limiting, SSOs, etc.

## Installation Steps

### 1. Install Docker

First, we need to install Docker:

```fish
wget -O install_docker.sh https://get.docker.com
chmod +x install_docker.sh
sudo ./install_docker.sh
```

Add your user to the Docker group to run Docker commands without sudo:

```fish
sudo usermod -aG docker $USER
```

Log out and log back in for the changes to take effect:

```fish
exit
```

Reconnect to your device via SSH.

### 2. Install docker-compose

```fish
sudo apt update && sudo apt upgrade -y && sudo apt install -y docker-compose
```

### 3. Download the configurations

**.env** template:
```fish
wget -O .env https://raw.githubusercontent.com/phasehq/console/main/.env.example
```

**Docker Compose template**:

You can review the docker compose configuration 👉 [here](https://github.com/phasehq/console/blob/main/docker-compose.yml).

```fish
wget -O docker-compose.yml https://raw.githubusercontent.com/phasehq/console/main/docker-compose.yml
```

**Nginx config**
```fish
mkdir nginx && wget -O ./nginx/default.conf https://raw.githubusercontent.com/phasehq/console/main/nginx/default.conf
```

**Nginx Dockerfile**
```fish
wget -O ./nginx/Dockerfile https://raw.githubusercontent.com/phasehq/console/main/nginx/Dockerfile
```

### 4. Update your configuration

Make changes to the `.env` file to suit your environment. Refer to the available [environment variables](https://docs.phase.dev/self-hosting/configuration/envars) in the Phase documentation.

### 5. Start services

```fish
docker-compose up -d
```

## Troubleshooting

### Routing Structure

The `nginx` service acts as a reverse proxy for the `frontend` and `backend` services.

- Requests to `https://<your-pi-ip-address>/*` are routed to the `frontend` service at `http://frontend:3000`.
- Requests to `https://<your-pi-ip-address>/service/*` are routed to the `backend` service at `http://backend:8000`, with the `/service` path prefix stripped.

### Health Checks

You can check the health of the services using `curl`. Since a self-signed certificate is used by default, you may need to use the `-k` or `--insecure` flag to bypass certificate validation.

- **Frontend Health Check**:
  ```fish
  curl -vk https://<your-pi-ip-address>/api/health
  # Expected response: {"status":"alive"}
  ```

- **Backend Health Check**:
  ```fish
  curl -vk https://<your-pi-ip-address>/service/health/
  # Expected response: {"status": "alive", "version": "x.x.x"}
  ```

Your Phase console deployment will be available at `https://<your-pi-ip-address>`. By default, Phase will provision a self-signed TLS certificate using nginx. Please use a valid TLS certificate for your own domain in production.
