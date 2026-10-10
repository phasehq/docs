import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { ModeToggle } from '@/components/ModeToggle'
import { MobileSearch, Search } from '@/components/Search'

function TopLevelNavItem({ href, children, ...props }) {
  return (
    <li>
      <Link
        href={href}
        className="font-mono text-xs uppercase tracking-[0.08em] text-zinc-500 transition-colors duration-150 hover:text-zinc-900 focus-visible:outline focus-visible:outline-1 focus-visible:outline-zinc-400 dark:hover:text-zinc-200"
        {...props}
      >
        {children}
      </Link>
    </li>
  )
}

export const Header = forwardRef(function Header({ className }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  return (
    <div
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
        !isInsideMobileNavigation && 'backdrop-blur-sm',
        isInsideMobileNavigation
          ? 'bg-white dark:bg-zinc-925'
          : 'bg-white/90 dark:bg-zinc-925/90'
      )}
    >
      <div
        className={clsx(
          'absolute inset-x-0 top-full h-px',
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
            'bg-zinc-200 dark:bg-zinc-800'
        )}
      />
      <div className="hidden lg:block"></div>
        <Search />

      <div className="flex items-center gap-5 lg:hidden">
        <MobileNavigation />
        <Link href="/" aria-label="Home" className="flex items-center gap-2">
          <Logo className="h-10 fill-zinc-900 dark:fill-zinc-100" />
          <span className="font-mono text-sm uppercase tracking-[0.12em] text-zinc-500">
            docs
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-5">
        <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-8">
            <TopLevelNavItem href="https://phase.dev" target="_blank">
              Home
            </TopLevelNavItem>
            <TopLevelNavItem href="https://slack.phase.dev" target="_blank">
              Slack
            </TopLevelNavItem>
            <TopLevelNavItem href="https://phase.statuspage.io" target="_blank">
              System Status
            </TopLevelNavItem>
          </ul>
        </nav>
        <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-200 md:dark:bg-zinc-800" />
        <div className="flex gap-2 sm:gap-4">
          <MobileSearch />
          <ModeToggle />
        </div>
        <Link
          href="https://console.phase.dev"
          className="hidden h-8 shrink-0 items-center whitespace-nowrap rounded-full bg-emerald-500 px-4 font-mono text-xs font-medium uppercase tracking-[0.08em] text-zinc-950 transition-colors duration-150 hover:bg-emerald-400 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 min-[480px]:inline-flex"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
})
