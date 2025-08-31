import { PlatformsIntegration } from '@/components/PlatformsIntegration'

import { Deployments } from '@/components/Deployments'
import { SecurityResources } from '@/components/SecurityResources'
import { Platform } from '@/components/Platform'
import { About } from '@/components/AboutPhase'
import { HeroPattern } from '@/components/HeroPattern'
import { Tag } from '@/components/Tag'
import { FaArrowRight } from 'react-icons/fa'

export const description =
  'Phase is an open source & end-to-end encrypted platform for creating, managing, syncing and deploying secrets and environment variables across your infrastructure.'

<HeroPattern />


# Introduction

Phase is an open-source, end-to-end encrypted platform for creating, managing, and deploying application secrets and environment variables across your infrastructure. {{ className: 'lead' }}

- **Import** secrets from `.env` files and [inject](/quickstart#3-inject-secrets) them into any application or container at runtime.
- **Automate** secret deployment to platforms like [GitHub Actions](/integrations/platforms/github-actions), [Kubernetes](/integrations/platforms/kubernetes), [AWS](/integrations/platforms/aws-secrets-manager) and more.
- **Share** secrets with your [team](/console/users#add-users-to-an-organisation) and manage access to secrets with [cryptographic RBAC](/console/environments#manage-user-access).
- **Manage** secrets with [environments](/console/environments), audit-logs, [RBAC](/access-control) etc.

![console](/assets/images/console/console-ui.webp)


The Phase platform provides powerful secret management features including personal secret overrides, secret versioning & roll-back, secret referencing, RBAC, and much more.
You can replace .env files with runtime secret inject with a fully-featured [CLI](/cli), deploy secrets to third party services with native integrations, and build your own custom workflows and integrations with [SDKs](/sdks) and [APIs](/public-api). 



The platform is built on a sophisticated [encryption architecture](/security/architecture), while abstracting as much of the complexity of this implementation away from the user as possible. 


---

## Get started{{ anchor: true }}

Get setup with Phase in minutes by following the Quickstart guide. This Guide will walk you through setting up your account via the [Phase Console](/#phase-console), installing the [CLI](/#phase-cli) and importing your existing secrets.

<div className="not-prose mb-16 mt-6 flex gap-3">
  <Button href="/quickstart" arrow="right" children="Quickstart" />
</div>

<About />

<Platform />

## Integrate Phase

Seamlessly work with your preferred tools and platforms.

<PlatformsIntegration />

<div className="not-prose">
  <Button
    href="integrations/platforms/docker"
    variant="text"
    arrow="right"
    children="Explore Platforms Integrations"
  />
</div>

## Self-host Phase

Deploy Phase on your own infrastructure, maintain full control over your data.

<Deployments />

<div className="not-prose">
  <Button
    href="/self-hosting"
    variant="text"
    arrow="right"
    children="Explore Deployment Options"
  />
</div>

---

## Ready to try?{{ anchor: true }}

To get started, create a new application in your [Phase Console](https://console.phase.dev) and set up the [Phase CLI](/cli/usage). {{ className: 'lead' }}

<div className="not-prose mb-16 mt-6 flex gap-3">
  <Button href="/quickstart" arrow="right" children="Quickstart" />
  <Button
    href="/integrations"
    variant="outline"
    children="Explore Integrations"
  />
</div>
