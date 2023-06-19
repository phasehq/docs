import Image from 'next/image'
import { Card } from '@/components/Card'
import Link from 'next/link'
import { Heading } from '@/components/Heading'
import logoGo from '@/images/logos/go.svg'
import logoNode from '@/images/logos/node.svg'
import logoJavaScript from '@/images/logos/javascript.svg'
import logoPhp from '@/images/logos/php.svg'
import logoPython from '@/images/logos/python.svg'
import logoRuby from '@/images/logos/ruby.svg'
import clsx from 'clsx'

const SDKs = [
  {
    href: '/sdks/js',
    name: 'JavaScript',
    description: "Encrypt data directly in your users' browsers.",
    logo: logoJavaScript,
  },
  {
    href: '/sdks/node',
    name: 'Node.js',
    description:
      'Encrypt and decrypt data in your preferred Node.js application server.',
    logo: logoNode,
    available: true,
  },
  {
    href: '/sdks/python',
    name: 'Python',
    description:
      'Encrypt and decrypt data in your preferred Python application server.',
    logo: logoPython,
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

export function LibrariesIntro() {
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
