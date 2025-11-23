import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Run Phase on your own infrastructure with Docker Compose.'

<Tag variant="small">SELF-HOSTING</Tag>

# Docker Compose

Learn how to set up the Phase Console using the Docker Compose template. {{ className: 'lead' }}

<DocActions /> 

The steps outlined below provide a general guide for self-hosting Phase Services on your own infrastructure. 

Important considerations:
- It's recommended to run the Phase Service behind a VPN or within a VPC, rather than exposing it directly to the internet.
- You may need to configure additional components such as TLS certificates, web application firewalls, database backups and replication, DDoS protection, rate limiting, and SSO.

## 1. Install Docker on your machine

First, download the official Docker installation script:

```fish
curl https://get.docker.com > install.sh && chmod +x install.sh
```

We recommend reviewing the script before executing it on your system.

Install Docker and Docker Compose:

```fish
sh install.sh
```

Add your user to the Docker group:

```fish
sudo usermod -aG docker $USER
```

<Note>
You will need to log out and log back in for the group changes to take effect. You may use `Ctrl + D` to log out and then SSH back in.
</Note>

Verify that Docker is running:

```fish
docker ps
```

## 2. Download the configuration files

**.env** template:

```fish
wget -O .env https://raw.githubusercontent.com/phasehq/console/main/.env.example
```

**Docker Compose** template:

You can review the docker compose configuration 👉 [here](https://github.com/phasehq/console/blob/main/docker-compose.yml).

```fish
wget -O docker-compose.yml https://raw.githubusercontent.com/phasehq/console/main/docker-compose.yml
```

**Nginx config**:

```fish
mkdir nginx && wget -O ./nginx/default.conf https://raw.githubusercontent.com/phasehq/console/main/nginx/default.conf
```

**Nginx Dockerfile**:

```fish
wget -O ./nginx/Dockerfile https://raw.githubusercontent.com/phasehq/console/main/nginx/Dockerfile
```

## 3. Update your configuration

Modify the `.env` file to match your environment settings. 


### Single sign-on (SSO)

At the very least, you will need to set the `SSO_PROVIDERS` envrionment variable along with the SSO credentials for the provider you wish to use. For more instructions on configuring SSO, please refer to the [authentication documentation](/access-control/authentication). 

### Generate secrets 

```fish
sed -i.bak "s|DATABASE_PASSWORD=.*|DATABASE_PASSWORD=$(openssl rand -hex 32)|g" .env && \
sed -i.bak "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$(openssl rand -hex 32)|g" .env && \
sed -i.bak "s|SECRET_KEY=.*|SECRET_KEY=$(openssl rand -hex 32)|g" .env && \
sed -i.bak "s|SERVER_SECRET=.*|SERVER_SECRET=$(openssl rand -hex 32)|g" .env && \
rm .env.bak
```

For a complete list of available options, refer to the [environment variables](/self-hosting/configuration/envars) documentation.

<Note>
For a production deployment, please use a more secure method than a `.env` file to store your secrets. Please see our guide on [Docker Compose secrets](https://phase.dev/blog/docker-compose-secrets/) for more information.
</Note>

## 4. Start services

Pull containers and start services:

```fish
docker compose up -d
```

Your Phase Console deployment will be accessible at `https://<your-host-ip-address>`. By default, Phase provisions a self-signed TLS certificate using Nginx. For production use, please configure a valid TLS certificate for your domain.

---

## Stop services

To stop the Phase Console services, run:

```fish
docker compose down
```

## Uninstall

To completely remove the Phase Console and delete all data (including the database), run:

```fish
docker compose down -v
```

---

## Troubleshooting

In case you encounter any issues, please refer to the troubleshooting section below.

### Routing Structure

The `nginx` service acts as a reverse proxy for the `frontend` and `backend` services.

- Requests to `https://<your-host-ip-address>/*` are routed to the `frontend` service at `http://frontend:3000`.
- Requests to `https://<your-host-ip-address>/service/*` are routed to the `backend` service at `http://backend:8000`, with the `/service` path prefix stripped.

### Health Checks

You can check the health of the services using `curl`. Since a self-signed certificate is used by default, you may need to use the `-k` or `--insecure` flag to bypass certificate validation.

- **Frontend Health Check**:
  ```fish
  curl -vk https://<your-host-ip-address>/api/health
  # Expected response: {"status":"alive"}
  ```

- **Backend Health Check**:
  ```fish
  curl -vk https://<your-host-ip-address>/service/health/
  # Expected response: {"status": "alive", "version": "x.x.x"}
  ```
