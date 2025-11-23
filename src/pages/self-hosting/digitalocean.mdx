import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Run Phase on your own DigitalOcean infrastructure.'

<Tag variant="small">SELF-HOSTING</Tag>

# DigitalOcean

Learn how to set up the Phase Console using DigitalOcean droplet and managed PostgreSQL via the Docker Compose template. {{ className: 'lead' }}

<DocActions /> 

Keep in mind the steps listed below serve as a rough outline on how to self-hosting Phase Services on your own infrastructure.

You may:

- Choose to run the Phase Console components on managed services (PaaS) or alternative container orchestration tools like Kubernetes instead of Docker Compose.
- Consider running the Phase Service behind a VPN or a VPC and not to expose it the internet directly.
- Need to set up things like TLS certificates, web application firewall, database backups and replication, DDoS protection, rate limiting, SSOs etc.

### I. Set Up a DigitalOcean Droplet

1. **Log in to your DigitalOcean Dashboard**.

2. **Create a new Droplet**:

   - Choose an appropriate datacenter region.
   - Choose the **Ubuntu 22.04 LTS** image.
   - Select **Droplet Type** as **General Purpose** and pick a size similar to $63/month **8 GB / 2 CPUs**.
   - For **Additional Options**, ensure you have selected **Monitoring**.
   - Under **Authentication**, select **SSH keys**. Add your existing SSH key or [create a new SSH key](https://www.digitalocean.com/docs/ssh/create-ssh-keys/).

3. **Click Create Droplet**.

### II. Set Up Managed PostgreSQL Database

1. Navigate to **Databases** in the left sidebar of your DigitalOcean Dashboard.

2. **Click on 'Create Database'**:

   - Choose **PostgreSQL** as your database engine.
   - Pick a version, e.g., **15**.
   - Select the **Standard** plan and choose a size similar to $60/month **Basic / 2 vCPU / 4 GB RAM / 60 GB SSD / Connection limit: 97**.
   - Choose your datacenter region (preferably the same as your Droplet for better latency).

3. **Database Configuration**:

   - Once the database is created, block public incoming connections to your database by clicking on **Secure this database cluster by restricting access.** in **TRUSTED SOURCES**.
   - Navigate to the **Users & Databases** tab.
   - Create a new database named **phase_db**.
   - Create a new user named **phase_api** and set a password.
   - Grant the **phase_api** user necessary privileges on the **phase_db**.

4. **Database Connection Settings**:
   - Note down the connection details for later. You'll specifically need the host (private network vpc host), user, database, and password.

### III. Set Up Managed Redis Database

1. Navigate to **Databases** in the DigitalOcean Dashboard.

2. **Click on 'Create Database'** and select **Redis**:

   - Choose a version, e.g., **6.x**.
   - Select the **Standard** plan and choose a size that suits your requirements.
   - Choose the same datacenter region as your Droplet for better latency.
   - Block public incoming connections to your Redis instance by restricting access.

3. **Redis Configuration**:
   - Once created, note down the connection details (host, port, and password).

### IV. SSH into Droplet & Setup Database

1. Open your terminal and navigate to the directory containing your SSH key.

2. **SSH into your Droplet**:

   ```fish
   ssh -i "your-ssh-key-name" root@your-droplet-ip-address
   ```

3. **Install PostgreSQL client**:

   ```fish
   sudo apt update
   sudo apt install postgresql-client
   ```

4. **Connect to the Managed PostgreSQL instance**:

   ```fish
   psql -h your-postgresql-host -U phase_api -d phase_db
   ```

5. **Exit** the PostgreSQL session:
   ```sql
   \q
   ```

### V. Prepare for Docker Deployment

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
   - Replace **DATABASE_HOST** with your Managed PostgreSQL host.
   - Update **DATABASE_NAME**, **DATABASE_USER**, and **DATABASE_PASSWORD** with your credentials.
   - Add **REDIS_HOST**, **REDIS_PORT**, and **REDIS_PASSWORD** and set them to your Managed Redis host, port, and password.

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

7. You should now be able to access the Phase console at `https://your-droplet-ip-address`. By default, Phase provisions a self-signed TLS certificate using Nginx. For production use, please configure a valid TLS certificate for your domain.

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

- Requests to `https://your-droplet-ip-address/*` are routed to the `frontend` service at `http://frontend:3000`.
- Requests to `https://your-droplet-ip-address/service/*` are routed to the `backend` service at `http://backend:8000`, with the `/service` path prefix stripped.

### Health Checks

You can check the health of the services using `curl`. Since a self-signed certificate is used by default, you may need to use the `-k` or `--insecure` flag to bypass certificate validation.

- **Frontend Health Check**:
  ```fish
  curl -vk https://your-droplet-ip-address/api/health
  # Expected response: {"status":"alive"}
  ```

- **Backend Health Check**:
  ```fish
  curl -vk https://your-droplet-ip-address/service/health/
  # Expected response: {"status": "alive", "version": "x.x.x"}
  ```

