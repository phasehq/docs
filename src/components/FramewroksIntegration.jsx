import Image from 'next/image'
import { Card } from '@/components/Card'
import Link from 'next/link'
import { Heading } from '@/components/Heading'
import logoGo from '@/images/logos/go.svg'
import logoNode from '@/images/logos/node.svg'
import logoJavaScript from '@/images/logos/javascript.svg'
import logoDjango from '@/images/logos/django.svg'
import logoReact from '@/images/logos/react.svg'
import logoNext from '@/images/logos/nextjs.svg'
import logoLaravel from '@/images/logos/laravel.svg'
import logoDotnet from '@/images/logos/dotnet.svg'
import logoPhp from '@/images/logos/php.svg'
import logoPython from '@/images/logos/python.svg'
import logoRubyOnRails from '@/images/logos/rubyonrails.svg'
import clsx from 'clsx'

const SDKs = [
  {
    href: '/integrations/frameworks/react',
    name: 'React',
    description: 'Inject secrets and environment variables to your React app.',
    logo: logoReact,
  },
  {
    href: '/integrations/frameworks/node',
    name: 'Node.js',
    description:
      'Inject secrets and environment variables to your Node.js app.',
    logo: logoNode,
    available: true,
  },
  {
    href: '/integrations/frameworks/next-js',
    name: 'Next.js',
    description:
      'Inject secrets and environment variables to your Next.js app.',
    logo: logoNext,
    available: true,
  },
  {
    href: '/integrations/frameworks/django',
    name: 'Django',
    description: 'Inject secrets and environment variables to your Django app.',
    logo: logoDjango,
    available: true,
  },
  {
    href: '/integrations/frameworks/fiber',
    name: 'Golang',
    description: 'Inject secrets and environment variables to your Go app.',
    logo: logoGo,
    available: true,
  },
  {
    href: '/integrations/frameworks/ruby-on-rails',
    name: 'Ruby on Rails',
    description:
      'Inject secrets and environment variables to your Ruby on Rails app.',
    logo: logoRubyOnRails,
    available: true,
  },
  {
    href: '/integrations/frameworks/dotnet',
    name: '.NET',
    description: 'Inject secrets and environment variables to your .NET app.',
    logo: logoDotnet,
    available: true,
  },
  {
    href: '/integrations/frameworks/laravel',
    name: 'Laravel',
    description:
      'Inject secrets and environment variables to your Laravel app.',
    logo: logoLaravel,
    available: true,
  },
]

const serverSdks = [
  {
    href: '',
    name: 'Go (Coming soon)',
    description:
      'Encrypt and decrypt data in your preferred Go application server.',
    logo: logoGo,
    available: false,
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

export function FramewroksIntegration() {
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
