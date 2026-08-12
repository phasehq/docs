import Link from 'next/link'
import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'

export function Layout({ children, sections = [] }) {
  return (
    <SectionProvider sections={sections}>
      <div className="lg:ml-72 xl:ml-80">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className="contents bg-white dark:bg-zinc-925 lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-200 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-zinc-800 xl:w-80">
            <div className="hidden lg:flex">
              <Link
                href="/"
                aria-label="Home"
                className="flex items-center gap-2"
              >
                <Logo className="h-10 fill-zinc-900 dark:fill-zinc-100" />
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                  docs
                </span>
              </Link>
            </div>
            <Header />
            <Navigation className="hidden lg:mt-10 lg:block" />
          </div>
        </motion.header>
        {/* Deliberately NOT `relative`: HeroPattern's absolute sheet must
            resolve against the page (initial containing block) so it spans
            the full viewport width behind the sidebar. Footer's absolute
            elements have their own local `relative` containers. */}
        <div className="px-4 pt-14 sm:px-6 lg:px-8">
          <main className="py-16">
            <Prose as="article">{children}</Prose>
          </main>
          <Footer />
        </div>
      </div>
    </SectionProvider>
  )
}
