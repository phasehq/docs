import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'
import { Diagram } from '@/components/Diagram'

export const description =
  'An overview of the core concepts and abstractions that make up the Phase platform.'

<HeroPattern />

# Platform

Phase is a secrets management platform built on end-to-end encryption. It provides a secure way to store, manage, and deploy application secrets across your entire development lifecycle — from local development to CI/CD pipelines to production infrastructure.

This section explains the core abstractions that underpin everything in Phase. Whether you interact with Phase through the [Console](/console), the [CLI](/cli), [SDKs](/sdks), or the [API](/public-api), these concepts remain the same.

## Core Concepts

### Organisations

An [Organisation](/platform/organisations) is the top-level entity in Phase. It represents your team or company and contains all your Apps, Users, and configuration. Every user belongs to at least one Organisation, and all resources are scoped to an Organisation.

### Apps

An [App](/platform/apps) maps to a single project, repository, or service. Apps contain Environments, which in turn hold your Secrets. Apps also define the encryption mode (end-to-end or server-side) and control who has access to what.

### Environments

[Environments](/platform/environments) represent the stages of your development workflow — such as Development, Staging, and Production. Each Environment within an App holds its own set of Secrets, and access can be scoped per-user at the Environment level.

### Secrets

[Secrets](/platform/secrets) are the fundamental unit of data in Phase — encrypted key-value pairs that store your application configuration, API keys, database credentials, and other sensitive values. Secrets support multiple types, cross-environment referencing, personal overrides, tagging, comments, sharing, and full version history.

### Dynamic Secrets

[Dynamic Secrets](/platform/dynamic-secrets) are short-lived credentials for third-party services that are generated on-demand. Instead of storing long-lived static credentials, Dynamic Secrets create temporary, scoped credentials with automatic expiration, reducing your attack surface.

### Users

[Users](/platform/users) are individual accounts within an Organisation. Each user has a unique set of cryptographic keys that enable end-to-end encryption, a sudo password that protects those keys, and a role that determines their permissions.

### Service Accounts

[Service Accounts](/platform/service-accounts) are non-human identities used for programmatic access to secrets. They have their own cryptographic keyrings, can be assigned roles, and authenticate via tokens or external identity providers. Service Accounts are used by CI/CD pipelines, automation scripts, and machine-to-machine workflows.

### Access Control

[Access Control](/platform/access) in Phase is based on a Role-Based Access Control (RBAC) system. Roles define granular permissions across organisation and app-level resources, and access to Apps and Environments can be scoped per-user. Phase provides managed roles (Owner, Admin, Manager, Developer, Service) and supports custom roles.

### Integrations

Phase integrates with your existing infrastructure to deploy secrets where they are needed. Integrations connect at the Environment level and automatically sync secrets whenever they change. This includes CI/CD platforms like [GitHub Actions](/integrations/platforms/github-actions), [GitLab CI](/integrations/platforms/gitlab-ci), and [CircleCI](/integrations/platforms/circleci); cloud providers like [AWS](/integrations/platforms/aws-secrets-manager) and [Azure](/integrations/platforms/azure-key-vault); container platforms like [Docker](/integrations/platforms/docker) and [Kubernetes](/integrations/platforms/kubernetes); and hosting platforms like [Vercel](/integrations/platforms/vercel), [Railway](/integrations/platforms/railway), and [Render](/integrations/platforms/render). See the full list under [Platform Integration](/integrations/platforms/docker).

## Overview

<Diagram caption="Phase platform topology">
{`
graph TD
    Org["Organisation"]
    Org --> Users["Users & Service Accounts"]
    Org --> RBAC["Roles & Access Control"]
    Org --> App["App"]

    App --> Env["Environment"]

    Env --> Secrets["Secrets"]
    Env --> DynSecrets["Dynamic Secrets"]
    Env --> Integrations["Integrations"]

    classDef org fill:#059669,color:#fff,stroke:#059669
    classDef app fill:#0284c7,color:#fff,stroke:#0284c7
    classDef env fill:#7c3aed,color:#fff,stroke:#7c3aed
    classDef secret fill:#d97706,color:#fff,stroke:#d97706
    classDef access fill:#64748b,color:#fff,stroke:#64748b
    classDef integration fill:#0891b2,color:#fff,stroke:#0891b2

    class Org org
    class App app
    class Env env
    class Secrets,DynSecrets secret
    class Users,RBAC access
    class Integrations integration
`}
</Diagram>

Secrets flow from Phase to your applications through multiple channels:

- **Console** — Browse, search, and manage secrets through the web UI
- **CLI** — Inject secrets into local development with `phase run`, or manage them with `phase secrets`
- **SDKs** — Fetch secrets programmatically from your application code
- **API** — Access secrets over the REST API for custom integrations
- **Syncing** — Automatically deploy secrets to third-party platforms like AWS, GitHub Actions, Vercel, and more
