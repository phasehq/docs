import Link from 'next/link'

import { ChevronRightLeftIcon } from '@/components/icons/ChevronRightLeftIcon'
import { BoltIcon } from '@/components/icons/BoltIcon'
import { CheckIcon } from '@/components/icons/CheckIcon'

const resources = [
  {
    href: '/security',
    name: 'Security',
    description: 'Phase security overview',
    icon: CheckIcon,
  },
  {
    href: '/security/architecture',
    name: 'Architecture',
    description: 'Phase security architecture and implementation',
    icon: ChevronRightLeftIcon,
  },
  {
    href: '/security/cryptography',
    name: 'Cryptography',
    description: 'Details of cryptographic algorithms and implementation',
    icon: BoltIcon,
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

function Resource({ resource, index }) {
  const Icon = resource.icon
  return (
    <div className="group relative flex flex-col bg-white p-5 transition-colors duration-150 hover:bg-zinc-50 dark:bg-zinc-925 dark:hover:bg-zinc-900/40">
      <Link href={resource.href} className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <Icon
            aria-hidden="true"
            className="h-5 w-5 fill-zinc-500/10 stroke-zinc-500"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="mt-4 font-medium tracking-[-0.01em] text-zinc-900 dark:text-zinc-100">
          {resource.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {resource.description}
        </p>
        <div className="mt-auto flex items-center pt-4 text-emerald-600 dark:text-emerald-400">
          Explore <ArrowIcon className="mt-0.5 -mr-1 h-5 w-5" />
        </div>
      </Link>
    </div>
  )
}

export function SecurityResources() {
  return (
    <div className="my-16 xl:max-w-none">
      {/* Hairline mesh: shared 1px rules via gap-px on the border ground,
          cells painting the page ground. 3 cells: +1 filler completes the
          2-column rows; the 3-column row completes on its own. */}
      <div className="not-prose mt-4 grid grid-cols-1 gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
        {resources.map((resource, index) => (
          <Resource key={resource.href} resource={resource} index={index} />
        ))}
        <div
          aria-hidden="true"
          className="hidden bg-white sm:block xl:hidden dark:bg-zinc-925"
        />
      </div>
    </div>
  )
}
