import Image from 'next/image'
import { Card } from '@/components/Card'
import Link from 'next/link'

import logoDocker from '@/images/logos/docker.svg'
import logoKubernetes from '@/images/logos/kubernetes.svg'
import logoGitHub from '@/images/logos/github.svg'
import logoAws from '@/images/logos/aws.svg'
import logoNomad from '@/images/logos/nomad.svg'
import logoCloudflarePages from '@/images/logos/cloudflare-pages.svg'

import clsx from 'clsx'

const SDKs = [
  {
    href: '/integrations/platforms/docker',
    name: 'Docker',
    description: 'Inject secrets inside your Docker containers.',
    logo: logoDocker,
  },
  {
    href: '/integrations/platforms/kubernetes',
    name: 'Kubernetes',
    description:
      'Deploy secrets to your Kubernetes pods via the Phase Kubernetes Operator.',
    logo: logoKubernetes,
    available: true,
  },
  {
    href: '/integrations/platforms/github-actions',
    name: 'GitHub Actions',
    description: 'Sync secrets to GitHub Actions workflows.',
    logo: logoGitHub,
    available: true,
  },
  {
    href: '/integrations/platforms/github-dependabot',
    name: 'GitHub Dependabot',
    description: 'Sync secrets to GitHub Dependabot.',
    logo: logoGitHub,
    available: true,
  },
  {
    href: '/integrations/platforms/aws-elastic-container-service',
    name: 'AWS Elastic Container Service',
    description:
      'Deploy secrets to your ECS tasks.',
    logo: logoAws,
    available: true,
  },
  {
    href: '/integrations/platforms/hashicorp-nomad',
    name: 'Hashicorp Nomad',
    description: 'Deploy secrets to your Hashicorp Nomad jobs.',
    logo: logoNomad,
    available: true,
  },
  {
    href: '/integrations/platforms/cloudflare-pages',
    name: 'Cloudflare Pages',
    description: 'Deploy secrets to your Cloudflare Pages deployments.',
    logo: logoCloudflarePages,
    available: true,
  },
]

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  )
}

let arrowIcon = <ArrowIcon className={clsx('mt-0.5 -mr-1 h-5 w-5')} />

export function PlatformsIntegration() {
  return (
    <div className="my-16 xl:max-w-none">
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
        {SDKs.map((library) => (
          <Card key={library.name}>
            <Link href={library.href} className="flex flex-row-reverse gap-6">
              <div className="flex-auto">
                <h3 className=" font-semibold text-zinc-900 dark:text-white">
                  {library.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {library.description}
                </p>
                <div className="mt-4">
                  <div className="flex items-center text-emerald-500">
                    Explore {arrowIcon}
                  </div>
                </div>
              </div>
              <Image
                src={library.logo}
                alt=""
                className="h-10 w-10"
                unoptimized
              />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
