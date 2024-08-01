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

// Merged list of SDKs
const sdks = [
  {
    href: '/sdks/python',
    name: 'Python',
    description:
      'Manage secrets securely in your Python applications.',
    logo: logoPython,
    available: true,
  },
  {
    href: '/sdks/go',
    name: 'Golang',
    description: 'Manage secrets securely in your Go applications.',
    logo: logoGo,
    available: true,
  },
  {
    href: '/sdks/node',
    name: 'Node.js',
    description:
      'Seamlessly integrate secret management in your Node.js applications.',
    logo: logoNode,
    available: true,
  },
  // Add any other SDKs here
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

export function Libraries() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="sdks">
        SDKs
      </Heading>
      <p>
        Explore our SDKs for encrypting and decrypting data in both client-side
        and server-side applications.
      </p>
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
        {sdks.map((sdk) => (
          <Card key={sdk.name}>
            <Link
              href={sdk.href}
              className={clsx(
                'flex flex-row-reverse gap-6',
                !sdk.available && 'cursor-not-allowed opacity-40'
              )}
            >
              <div className="flex-auto">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {sdk.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {sdk.description}
                </p>
                <div className="mt-4">
                  <div className="flex items-center text-emerald-500">
                    Explore {arrowIcon}
                  </div>
                </div>
              </div>
              <Image src={sdk.logo} alt="" className="h-12 w-12" unoptimized />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
