import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Run Phase on your own Google Cloud Platform infrastructure.'

<Tag variant="small">SELF-HOSTING</Tag>

# Google Cloud Platform

Learn how to set up the Phase Console using GCP Compute Engine and managed CloudSQL instance via the Docker Compose template. {{ className: 'lead' }}

<DocActions /> 

Keep in mind the steps listed below serve as a rough outline on how to self-hosting Phase Services on your own infrastructure.

You may:

- Choose to run the Phase Console components on managed services (PaaS) or alternative container orchestration tools like Kubernetes instead of Docker Compose.
- Consider running the Phase Service behind a VPN or a VPC and not to expose it the internet directly.
- Need to set up things like TLS certificates, web application firewall, database backups and replication, DDoS protection, rate limiting, SSOs etc.

## I. Set Up a Compute Engine instance

1. **Log in to Google Cloud Console**:
   Navigate to the **Compute Engine** dashboard.

2. **Create a new instance**:

   - Choose the **Ubuntu Server 22.04 LTS** image.
   - Select the machine type equivalent to **t3.large**, which would typically be **e2-standard-2**.
   - For the boot disk, select **120GB of Standard persistent disk**.

3. **Configure Firewall rules**:

   - Under the instance details, go to the **Firewall** tab.
   - Allow **HTTP** (port 80).
   - Allow **HTTPS** (port 443).
   - Allow **SSH** (port 22).

4. **Create an SSH key pair**:

   - Follow GCP's guide to [generate an SSH key pair](https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys).
   - Add the public SSH key to the instance.

5. **Start** the instance.

## II. Set Up a Cloud SQL for PostgreSQL Instance

1. From the **SQL** dashboard, **create a new instance**.

2. Choose the **PostgreSQL** option.

3. **Specify instance details**:

   - Choose an instance ID and password for the `postgres` user.
   - Set the instance type to a configuration equivalent to **db.m5.large**.

4. **Configuration options**:

   - Set initial storage to **30GB of Standard storage**.
   - Ensure **Private IP** is enabled, allowing connectivity between Compute Engine and Cloud SQL.

5. **Create** the instance.

## III. Set Up Google Cloud Memorystore for Redis

1. **Log in to Google Cloud Console**:
   Navigate to the **Memorystore** dashboard.

2. **Create a new Redis instance**:

   - Choose a region that matches your Compute Engine instance.
   - Select the desired tier and capacity based on your workload.
   - Configure networking to ensure that the Redis instance is reachable from your Compute Engine instance.

3. **Configure security**:

   - Set up firewall rules if necessary to restrict access.
   - Note the IP address and port number of the Redis instance.

4. **Create** the Redis instance.

5. **Note down** the IP address and port for later use.

## IV. SSH into Compute Engine & Setup Database

1. Navigate to the directory containing your private SSH key.
2. **SSH into your Compute Engine instance**:

   ```fish
   ssh -i "path-to-your-private-key" username@your-instance-external-ip
   ```

3. **Install PostgreSQL client**:

   ```fish
   sudo apt update
   sudo apt install postgresql-client
   ```

4. **Connect to the Cloud SQL PostgreSQL instance**:

   ```fish
   psql -h your-cloudsql-ip -U your-username -d postgres
   ```

5. **Database setup**:

   ```sql
   CREATE DATABASE phase_db;
   CREATE USER phase_api WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE phase_db TO phase_api;
   ```

6. **Exit** the PostgreSQL session:
   ```sql
   \q
   ```

## V. Prepare for Docker Deployment

1. **Generate a strong database password**:

   ```fish
   openssl rand -hex 32
   ```

2. **Install Docker & Docker Compose**:

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

3. **Download required configurations**:

   - **.env** template:

     ```fish
     wget -O .env https://raw.githubusercontent.com/phasehq/console/main/.env.example
     ```

   - **Docker Compose** template:

      You can review the docker compose configuration 👉 [here](https://github.com/phasehq/console/blob/main/docker-compose.yml).

     ```fish
     wget -O docker-compose.yml https://raw.githubusercontent.com/phasehq/console/main/docker-compose.yml
     ```

   - **Nginx** config & Dockerfile:
     ```fish
     mkdir nginx && wget -O ./nginx/default.conf https://raw.githubusercontent.com/phasehq/console/main/nginx/default.conf
     wget -O ./nginx/Dockerfile  https://raw.githubusercontent.com/phasehq/console/main/nginx/Dockerfile
     ```

4. **Edit `.env` file**:

   - Replace **DATABASE_HOST** with your Cloud SQL IP.
   - Update **DATABASE_NAME**, **DATABASE_USER**, and **DATABASE_PASSWORD** with your desired credentials.
   - Add **REDIS_HOST**, **REDIS_PORT**, and **REDIS_PASSWORD** and set them to your Google Cloud Memorystore Redis host and port (6379).
   - Modify other environment variables as necessary.

   ### Single sign-on (SSO)

   At the very least, you will need to set the `SSO_PROVIDERS` envrionment variable along with the SSO credentials for the provider you wish to use. For more instructions on configuring SSO, please refer to the [authentication documentation](/access-control/authentication).

   ### Generate secrets

   You can use the following command to generate strong random secrets for your `.env` file:

   ```fish
   sed -i.bak "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$(openssl rand -hex 32)|g" .env && \
   sed -i.bak "s|SECRET_KEY=.*|SECRET_KEY=$(openssl rand -hex 32)|g" .env && \
   sed -i.bak "s|SERVER_SECRET=.*|SERVER_SECRET=$(openssl rand -hex 32)|g" .env && \
   rm .env.bak
   ```

   For a complete list of available options, refer to the [environment variables](/self-hosting/configuration/envars) documentation.

   <Note>
   For a production deployment, please use a more secure method than a `.env` file to store your secrets. Please see our guide on [Docker Compose secrets](https://phase.dev/blog/docker-compose-secrets/) for more information.
   </Note>

5. **Edit `docker-compose.yml`**:

   - Comment out the PostgreSQL service.
   - Comment out the Redis service.

6. **Start services**:

   Pull containers and start services:

   ```fish
   docker compose up -d
   ```

7. You should now be able to access the Phase console at `https://your-instance-external-ip`. By default, Phase provisions a self-signed TLS certificate using Nginx. For production use, please configure a valid TLS certificate for your domain.

---

## Stop services

To stop the Phase Console services, run:

```fish
docker compose down
```

## Uninstall

To completely remove the Phase Console and delete all data (excluding external databases), run:

```fish
docker compose down -v
```

---

## Troubleshooting

### Routing Structure

The `nginx` service acts as a reverse proxy for the `frontend` and `backend` services.

- Requests to `https://your-instance-external-ip/*` are routed to the `frontend` service at `http://frontend:3000`.
- Requests to `https://your-instance-external-ip/service/*` are routed to the `backend` service at `http://backend:8000`, with the `/service` path prefix stripped.

### Health Checks

You can check the health of the services using `curl`. Since a self-signed certificate is used by default, you may need to use the `-k` or `--insecure` flag to bypass certificate validation.

- **Frontend Health Check**:
  ```fish
  curl -vk https://your-instance-external-ip/api/health
  # Expected response: {"status":"alive"}
  ```

- **Backend Health Check**:
  ```fish
  curl -vk https://your-instance-external-ip/service/health/
  # Expected response: {"status": "alive", "version": "x.x.x"}
  ```
