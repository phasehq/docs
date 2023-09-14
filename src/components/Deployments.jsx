import { Card } from '@/components/Card'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { ubuntu, digitalocean, amazonaws } from 'simple-icons'

const deployment_methods = [
  {
    href: '/self-hosting/docker-compose',
    name: 'Ubuntu server',
    description: 'Deploy Phase Console via Docker Compose on any machine.',
    logo: ubuntu,
    available: true,
  },
  {
    href: '',
    name: 'AWS (Coming soon)',
    description:
      'Deploy Phase Console on a EC2 instance on your AWS infrastructure.',
    logo: amazonaws,
    available: true,
  },
  {
    href: '',
    name: 'DigitalOcean (Coming soon)',
    description: 'Deploy Phase Console on a droplet in DigitalOcean',
    logo: digitalocean,
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

function SimpleIcon({ path, color, size = 48, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d={path} fill={color} />
    </svg>
  )
}

export function Deployments() {
  const arrowIcon = <ArrowIcon className={clsx('mt-0.5 -mr-1 h-5 w-5')} />

  return (
    <div className="my-16 xl:max-w-none">
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
        {deployment_methods.map((library) => (
          <Card key={library.name}>
            <Link href={library.href}>
              <div
                className={clsx(
                  'flex cursor-pointer flex-row-reverse gap-6',
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
                      Explore {arrowIcon}
                    </div>
                  </div>
                </div>
                {library.logo && library.logo.path && library.logo.hex && (
                  <SimpleIcon
                    path={library.logo.path}
                    color={`#${library.logo.hex}`}
                    size={48}
                    className="h-12 w-12"
                  />
                )}
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
