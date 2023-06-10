import Image from 'next/image'
import { Card } from '@/components/Card'
import Link from 'next/link'
import { Heading } from '@/components/Heading'
import logoDocker from '@/images/logos/docker.svg'
import logoAWS from '@/images/logos/aws.svg'
import logoDO from '@/images/logos/digitalocean.svg'
import logoRender from '@/images/logos/render.svg'
import clsx from 'clsx'

const deployment_methods = [
  {
    href: '/self-hosting/docker-compose',
    name: 'Docker Compose',
    description: 'Deploy Phase Console via Docker Compose on any machine.',
    logo: logoDocker,
    available: true,
  },
  {
    href: '',
    name: 'AWS (Coming soon)',
    description:
      'Deploy Phase Console on a EC2 instance on your AWS infrastructure.',
    logo: logoAWS,
    available: true,
  },
  {
    href: '',
    name: 'DigitalOcean (Coming soon)',
    description: 'Deploy Phase Console on a droplet in DigitalOcean',
    logo: logoDO,
    available: true,
  },
  // {
  //   href: '',
  //   name: 'Render (Coming soon)',
  //   description: 'Deploy Phase Console on render via a blueprint.',
  //   logo: logoRender,
  //   available: false,
  // },

  // {
  //   href: '',
  //   name: 'Go (Coming soon)',
  //   description:
  //     'Encrypt and decrypt data in your preferred Go application server.',
  //   logo: logoGo,
  //   available: false,
  // },
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
      <Heading level={2} id="server">
        Deployment options:
      </Heading>
      <p>
        Choose from a variety of deployment options listed below to get started:
      </p>
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
        {deployment_methods.map((library) => (
          <Card key={library.name}>
            <Link
              href={library.href}
              className={clsx(
                'flex flex-row-reverse gap-6',
                !library.available && 'cursor-not-allowed opacity-40'
              )}
            >
              <div className="flex-auto">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {library.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {library.description}
                </p>
                <div className="mt-4">
                  <div className="flex items-center text-emerald-500">
                    Expore {arrowIcon}
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
