import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'
import { Deployments } from '@/components/Deployments'
import { DocActions } from '@/components/DocActions'

export const description = 'Run Phase on your own infrastructure'

<Tag variant="small">SELF-HOSTING</Tag>

<HeroPattern />


# Self Hosting

Explore deployment options for self-hosting Phase. {{ className: 'lead' }}

<DocActions /> 

You may choose to self-host Phase to meet various compliance requirements, to simply maintain control over your data or run Phase behind your firewall.

<SkillBox />

## System Requirements

| Requirement       | Minimum         | Recommended          |
| ----------------- | --------------- | -------------------- |
| **CPU**           | 2 Cores         | 8 Cores              |
| **Memory**           | 2 GB             | 16 GB                 |
| **Database Volume** | 1 GB             | 50 GB               |


### Supported Platforms

- **Operating Systems**: Linux, FreeBSD, macOS, and Windows.
- **CPU Architectures**: `amd64` (x86) and `arm64`.

### Dependencies
- **Container Runtime**: A container runtime or orchestrator such as Docker, Docker Compose, Nomad, or Kubernetes.
- **Single Sign-On (SSO)**: You must use an SSO provider. See the [list of supported providers](/access-control/authentication#user-authentication).
- **TLS Certificate**: You must provision a TLS certificate and access Phase over HTTPS. This can be a self-signed certificate. The default Docker Compose installation will provide a self-signed certificate.


## Deployment Options

<Deployments />

## Architecture Overview

<Diagram caption="Phase architecture">
{`
graph LR
    Client["Client"]
    
    Client --> Nginx["Nginx"]
    
    Nginx --> Frontend["Frontend"]
    Nginx --> Backend[" Backend"]
    
    Frontend -.->  Backend
    
    Backend --> DB["PostgreSQL"]
    Backend --> Redis["Redis"]
    
    Worker["Worker (Async Jobs)"] --> DB
    Worker --> Redis
    
    classDef client fill:#4A90E2,stroke:#333,stroke-width:2px,color:#fff
    classDef proxy fill:#50C878,stroke:#333,stroke-width:2px,color:#fff
    classDef app fill:#9B59B6,stroke:#333,stroke-width:2px,color:#fff
    classDef data fill:#E67E22,stroke:#333,stroke-width:2px,color:#fff
    
    class Client client
    class Nginx proxy
    class Frontend,Backend app
    class DB,Redis,Worker data
`}
</Diagram>

### Your Responsibilities

When self-hosting Phase services on your own infrastructure, you assume sole responsibility for security, availability, and reliability. It is up to you to set up the following:

- **Security:**
    - **Single Sign-On (SSO):** You must configure SSO for user authentication using one of the [supported providers](/access-control/authentication#user-authentication).
    - **TLS Certificates:** Provision a valid TLS certificate to ensure Phase is accessed securely over HTTPS. Self-signed certificates are supported.
    - **Web Application Firewall (WAF):** Implement a WAF to protect against common web exploits.
    - **DDoS Protection & Rate Limiting:** Configure measures to mitigate Distributed Denial of Service attacks and prevent abuse through rate limiting.


- **Data & Availability:**
    - **Database Backups & Replication:** Regularly back up your database and set up replication for high availability and disaster recovery.

- **Maintenance & Updates:**
    - **Phase Updates:** Keep your Phase instance up-to-date by applying the latest upgrades and running necessary database migrations.
    - **System & Dependency Updates:** Regularly update the underlying host system and its dependencies to patch security vulnerabilities.


---

## Support & Maintenance

Regular maintenance of your self-hosted Phase instance helps ensure optimal performance and security. Please see our guide on maintenance for more information.


<div className="not-prose">
  <Button
    href="/self-hosting/maintenance"
    variant="text"
    arrow="right"
    children="Explore"
  />
</div>