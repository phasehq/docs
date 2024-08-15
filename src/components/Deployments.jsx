import { Card } from '@/components/Card'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'

import logoDcoker from '@/images/logos/docker.svg'
import logoAmazonaws from '@/images/logos/aws.svg'
import logoDigitalOcean from '@/images/logos/digitalocean.svg'
import logoKubernetes from '@/images/logos/kubernetes.svg'
import logoGCP from '@/images/logos/gcp.svg'
import logoAzure from '@/images/logos/azure.svg'

const deployment_methods = [
  {
    href: '/self-hosting/docker-compose',
    name: 'Docker Compose',
    description:
      'Seamlessly deploy the Phase Console via Docker Compose on any machine.',
    logo: logoDcoker,
    available: true,
  },
  {
    href: '/self-hosting/kubernetes',
    name: 'Kubernetes',
    description:
      'Deploy Phase via the official Helm chart on your Kubernetes cluster.',
    logo: logoKubernetes,
    available: true,
  },
  {
    href: '/self-hosting/aws',
    name: 'AWS',
    description: 'Deploy the Phase Console on AWS EC2 and RDS PostgreSQL instance.',
    logo: logoAmazonaws,
    available: true,
  },
  {
    href: '/self-hosting/digitalocean',
    name: 'DigitalOcean',
    description:
      'Deploy the Phase Console on a DigitalOcean droplet and a managed PostgreSQL instance.',
    logo: logoDigitalOcean,
    available: true,
  },
  {
    href: '/self-hosting/gcp',
    name: 'Google Cloud Platform',
    description: 'Deploy the Phase Console on Google Compute Engine and a CloudSQL instance.',
    logo: logoGCP,
    available: true,
  },
  {
    href: '/self-hosting/azure',
    name: 'Microsoft Azure',
    description: 'Deploy the Phase Console on an Azure Virtual Machine and Azure Database for PostgreSQL.',
    logo: logoAzure,
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

export function Deployments() {
  return (
    <div className="my-16 xl:max-w-none">
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
        {deployment_methods.map((library) => (
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
                className="h-12 w-12"
                unoptimized
              />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
