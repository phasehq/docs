import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'
import { SecurityCards } from '@/components/SecurityCards'
import { DocActions } from '@/components/DocActions'

export const description =
  'Phase architecture, threat model, and security implementation.'

<HeroPattern />

<Tag variant="small">SECURITY</Tag>

# Security Overview

Security is at the core of Phase's design and operations. As a platform for managing application secrets and configurations, Phase implements comprehensive security measures at every level. This security-first approach encompasses all aspects of the platform, including data encryption, key management, access control, and audit logging. Phase is designed to be secure by default out of the box, prioritizing the protection of secrets at all times without requiring extensive configuration from users.

<DocActions /> 

## Security Objectives

1. Provide a robust, open-source platform for securing application secrets throughout the entire development lifecycle.
2. Implement end-to-end encryption for all secrets (keys, values, comments) by default, with independent keys for each environment.
3. Maintain a developer experience (DX) that doesn't compromise on security, catering to fast-moving engineering teams.
4. Offer secure, efficient private key sharing mechanisms for team collaboration to protect against key compromises.
5. Ensure seamless integration and compatibility with a wide range of development workflows and deployment environments.

## Platform Security

<SecurityCards />

---

## SOC 2 Type II Compliance

Phase is currently undergoing an audit for the **SOC 2 Type II** compliance certification. You can find more information about the audit and track the progress in our [Trust Center](https://trust.phase.dev).

<div style={{ textAlign: 'left' }}>
  <a href="https://trust.phase.dev" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
    <img src="/assets/soc2-inprogress-dark-badge.svg" alt="SOC 2 Type II compliance" width="150" loading="lazy" />
  </a>
</div>

## Penetration Testing

Phase undergoes annual external penetration testing conducted by an independent security firm. The assessment covers Phase's platform, APIs, and services, with remediation tracked to completion. Please contact us at info@phase.dev if you would like to request an executive summary of the latest report.

## Version Control and Code Security

### GPG Signed Commits

Phase implements GPG key signing for all commits to ensure the authenticity and integrity of the codebase. Commits can be verified against the GPG public keys of Phase maintainers, and the trust chain for a particular `git blame` can be traced to its origin.

### Dependency Management and Scanning

Phase employs automated dependency updates and security scanning through GitHub Dependabot. This system continuously monitors the project's dependencies across various languages for known vulnerabilities, automatically creating pull requests which are tested and merged based on their severity. This proactive approach maintains a secure and up-to-date codebase with minimal manual intervention, reducing the risk of exploitable vulnerabilities in third-party libraries and lowering the overall attack surface.

### Public Container Builds

Phase's container images are built publicly in repositories via GitHub Actions, promoting transparency and allowing for community scrutiny of the build process. This open approach ensures that production containers are built from the exact code present in public repositories, enabling independent verification of the build pipeline.

## Access Control and Authentication

### Two-Factor Authentication (2FA)

Phase enforces two-factor authentication (2FA) using U2F/YubiKey for all system access. This additional security layer significantly reduces the risk of unauthorized access, even in scenarios where passwords might be compromised. The U2F/YubiKey implementation offers strong protection against phishing attacks, enhancing the overall security posture of the system.

### Password Policies

Strict password policies are enforced across all systems within Phase. These policies ensure that user-created passwords meet minimum complexity requirements and are regularly updated. By implementing robust password standards, Phase reduces the risk of password-based attacks and unauthorized access, contributing to a more secure environment.

## Network Security

### VPN

Secure remote access is facilitated through Tailscale VPN with centralized management and Single Sign-On (SSO) integration. Tailscale provides end-to-end encrypted connections between devices and services, simplifying secure access while maintaining strong authentication. The SSO integration ensures that access is tied to the central identity management system, streamlining user management and enhancing security.

### Cloudflare

All web traffic to Phase services is routed through Cloudflare, leveraging its Web Application Firewall (WAF), reverse proxy, and DDoS protection capabilities along with other important security features. This setup allows Phase to benefit from Cloudflare's global network and advanced security features. EC2 instances are configured to accept HTTP/HTTPS traffic only from Cloudflare IPs, as listed at `https://www.cloudflare.com/ips/`, adding an extra layer of protection against unauthorized access attempts.

## Infrastructure Security

### AWS EC2 Instances

Phase's infrastructure is built on AWS EC2 T3 instances, which utilize the Nitro System. This advanced virtualization technology provides significant security benefits through hardware-based isolation and direct integration with AWS services at a hardware level. Network access policies applied through AWS security groups are handled directly at the NIC attached to the physical machine, reducing dependence on the hypervisor. The Nitro System enhances overall performance, particularly for compute-intensive tasks, by offloading virtualization functions to dedicated hardware. Additionally, it employs dedicated hardware for encryption operations, reducing CPU overhead and improving security.

### Instance Metadata Service

To further strengthen instance-level security, the IMDSv2 API is disabled across all EC2 instances. This configuration prevents potential attacks that might exploit the instance metadata service to gain unauthorized access or extract sensitive information about the instances. By disabling this service, Phase mitigates the risk of certain types of server-side request forgery (SSRF) attacks and adds an extra layer of protection to its cloud infrastructure.

### Database Security

Phase employs robust security measures for its database systems to ensure data integrity and confidentiality. The AWS RDS PostgreSQL 14.10 instances are deployed within a Virtual Private Cloud (VPC), creating an isolated network environment. These instances implement encryption both at rest and in transit, safeguarding data throughout its lifecycle. Similarly, the AWS ElastiCache Redis 7.1.0 instances used by Phase mandate encryption for all data in transit, preventing eavesdropping and man-in-the-middle attacks.

## Data Protection and Encryption

### Backup and Recovery

Phase maintains a comprehensive backup strategy for its AWS RDS instances, including 24-hour snapshots and point-in-time backup capabilities. This approach enables quick recovery from various failure scenarios and helps maintain data integrity. The multi-faceted backup system ensures that data can be restored to a specific point in time, minimizing potential data loss in the event of a system failure or data corruption incident.

### HTTPS Configuration

The HTTPS configuration implemented by Phase has achieved an A+ rating from Qualys SSL Labs tests. This configuration enforces a minimum TLS version of 1.2 and supports HTTP/3 for improved performance and security. By maintaining high standards for HTTPS implementation, Phase ensures that all data transmitted between servers and clients is strongly encrypted and protected against interception or tampering.

### DNSSEC

Phase has enabled DNSSEC for its domains, adding an extra layer of security to the DNS system. This measure protects against DNS spoofing and cache poisoning attacks, ensuring that clients can trust they are connecting to legitimate Phase servers. DNSSEC implementation helps maintain the integrity and authenticity of DNS responses, reducing the risk of DNS-based attacks.

## Monitoring and Incident Response

### AWS CloudWatch

Comprehensive logging, monitoring, and alerting across Phase's infrastructure are managed through AWS CloudWatch. This service provides visibility into system performance and security status, facilitating quick anomaly detection and timely incident response. Custom alerts and dashboards are configured to monitor key security metrics and events, allowing for proactive management of potential security issues and ensuring the overall health of the infrastructure.

