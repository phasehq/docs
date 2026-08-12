import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'

import logoDcoker from '@/images/logos/docker.svg'
import logoAmazonaws from '@/images/logos/aws.svg'
import logoAmazonawsEks from '@/images/logos/aws-eks.svg'
import logoDigitalOcean from '@/images/logos/digitalocean.svg'
import logoKubernetes from '@/images/logos/kubernetes.svg'
import logoGCP from '@/images/logos/gcp.svg'
import logoAzure from '@/images/logos/azure.svg'
import logoRaspberryPi from '@/images/logos/raspberry.svg'
import logoRailway from '@/images/logos/railway.svg'

const deployment_methods = [
  {
    href: '/self-hosting/docker-compose',
    name: 'Docker Compose',
    description:
      'Deploy the Phase Console via Docker Compose on any machine.',
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
    href: '/self-hosting/aws-eks',
    name: 'AWS EKS',
    description:
      'Deploy Phase via Helm on your AWS Elastic Kubernetes Service (EKS) cluster.',
    logo: logoAmazonawsEks,
    available: true,
  },
  {
    href: '/self-hosting/azure-aks',
    name: 'Azure AKS',
    description:
      'Deploy Phase via Helm on Azure Kubernetes Service (AKS).',
    logo: logoAzure,
    available: true,
  },
  {
    href: '/self-hosting/aws',
    name: 'AWS EC2 & RDS',
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
  {
    href: '/self-hosting/railway',
    name: 'Railway',
    description: 'Deploy the Phase Console on Railway.',
    logo: logoRailway,
    available: true,
  },
  {
    href: '/self-hosting/raspberrypi',
    name: 'Raspberry Pi',
    description: 'Deploy the Phase Console on a Raspberry Pi.',
    logo: logoRaspberryPi,
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
      {/* Hairline mesh: shared 1px rules via gap-px on the border ground,
          cells painting the page ground. Fillers complete partial rows. */}
      <div className="not-prose mt-4 grid grid-cols-1 gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
        {deployment_methods.map((library) => (
          <div
            key={library.name}
            className="group relative flex flex-col bg-white p-5 transition-colors duration-150 hover:bg-zinc-50 dark:bg-zinc-925 dark:hover:bg-zinc-900/40"
          >
            <Link href={library.href} className="flex flex-row-reverse gap-6">
              <div className="flex-auto">
                <h3 className="font-medium tracking-[-0.01em] text-zinc-900 dark:text-zinc-100">
                  {library.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {library.description}
                </p>
                <div className="mt-4">
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
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
          </div>
        ))}
        {/* 10 cells: 2-col rows complete; +2 fillers complete the 3-col rows. */}
        <div aria-hidden="true" className="hidden bg-white xl:block dark:bg-zinc-925" />
        <div aria-hidden="true" className="hidden bg-white xl:block dark:bg-zinc-925" />
      </div>
    </div>
  )
}
