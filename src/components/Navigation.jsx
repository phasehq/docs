import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({ href, tag, active, isAnchorLink = false, children }) {
  
  const linkRef = useRef(null)

  useEffect(() => {
    if (active && linkRef.current) {
      const link = linkRef.current;
      const linkRect = link.getBoundingClientRect();

      // Check if link is fully visible in the viewport
      const isOutOfView =
        linkRect.top < 0 || linkRect.bottom > window.innerHeight;

      if (isOutOfView) {
        link.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [active]);
  
  return (
    <Link
      href={href}
      ref={linkRef}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function VisibleSectionHighlight({ group, pathname }) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation()
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0]
    )
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({ group, pathname }) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, className }) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [router, sections] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation
  )

  let isActiveGroup =
    group.links.findIndex((link) => link.href === router.pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === router.pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === router.pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const navigation = [
  {
    title: 'Get Started',
    links: [
      { title: 'Introduction', href: '/' },
      { title: 'Quickstart', href: '/quickstart' },
    ],
  },
  {
    title: 'Console',
    links: [
      { title: 'Overview', href: '/console' },
      { title: 'Organisations', href: '/console/organisation' },
      { title: 'Users', href: '/console/users' },
      { title: 'Apps', href: '/console/apps' },
      { title: 'Environments', href: '/console/environments' },
      { title: 'Secrets', href: '/console/secrets' }
    ],
  },
  {
    title: 'CLI',
    links: [
      { title: 'Overview', href: '/cli' },
      { title: 'Install', href: '/cli/install' },
      { title: 'Quickstart', href: '/cli/usage' },
      { title: 'Commands', href: '/cli/commands' },
    ],
  },
  {
    title: 'SDKs',
    links: [
      { title: 'Overview', href: '/sdks' },
      { title: 'Python', href: '/sdks/python' },
      { title: 'Golang', href: '/sdks/go' },
      { title: 'Node.js', href: '/sdks/node' },
    ],
  },
  {
    title: 'API',
    links: [
      { title: 'Overview', href: '/public-api' },
      { title: 'Secrets', href: '/public-api/secrets' },
      { title: 'Errors', href: '/public-api/errors' },
    ],
  },
  {
    title: 'Authentication & Access',
    links: [
      { title: 'Overview', href: '/access-control' },
      { title: 'Authentication', href: '/access-control/authentication' },
      { title: 'OAuth 2.0', href: '/access-control/authentication/oauth-sso' },
      { title: 'OpenID Connect (OIDC)', href: '/access-control/authentication/oidc-sso' },
      { title: 'Tokens', href: '/access-control/authentication/tokens' },
      { title: 'Service Accounts', href: '/access-control/service-accounts' },
      { title: 'Roles', href: '/access-control/roles' },
      { title: 'Network', href: '/access-control/network' },
    ],
  },
  {
    title: 'Security',
    links: [
      { title: 'Overview', href: '/security' },
      { title: 'Architecture', href: '/security/architecture' },
      { title: 'Cryptographic Algorithms', href: '/security/cryptography' },
    ],
  },
  {
    title: 'Platform Integration',
    links: [
      { title: 'Docker', href: '/integrations/platforms/docker' },
      {
        title: 'Docker Compose',
        href: '/integrations/platforms/docker-compose',
      },
      { title: 'Kubernetes', href: '/integrations/platforms/kubernetes' },
      {
        title: 'AWS Elastic Container Service',
        href: '/integrations/platforms/aws-elastic-container-service',
      },
      {
        title: 'AWS Secrets Manager',
        href: '/integrations/platforms/aws-secrets-manager',
      },
      {
        title: 'Hashicorp Terraform',
        href: '/integrations/platforms/hashicorp-terraform',
      },
      {
        title: 'Hashicorp Vault',
        href: '/integrations/platforms/hashicorp-vault',
      },
      {
        title: 'Hashicorp Nomad',
        href: '/integrations/platforms/hashicorp-nomad',
      },
      {
        title: 'Cloudflare Workers',
        href: '/integrations/platforms/cloudflare-workers',
      },
      {
        title: 'Cloudflare Pages',
        href: '/integrations/platforms/cloudflare-pages',
      },
      {
        title: 'GitHub Actions',
        href: '/integrations/platforms/github-actions',
      },
      { title: 'GitLab CI', href: '/integrations/platforms/gitlab-ci' },
      { title: 'Vercel', href: '/integrations/platforms/vercel' },
      { title: 'Railway', href: '/integrations/platforms/railway' },
      { title: 'Jenkins', href: '/integrations/platforms/jenkins' },
      { title: 'CircleCI', href: '/integrations/platforms/circleci' },
      { title: 'AWS CodeBuild', href: '/integrations/platforms/aws-codebuild' },
      {
        title: 'Azure Pipelines',
        href: '/integrations/platforms/azure-pipelines',
      },
      {
        title: 'Travis CI',
        href: '/integrations/platforms/travis-ci',
      },
      {
        title: 'Bitbucket Pipelines',
        href: '/integrations/platforms/bitbucket-pipelines',
      },
      {
        title: 'TeamCity',
        href: '/integrations/platforms/teamcity',
      },
      {
        title: 'Drone CI',
        href: '/integrations/platforms/drone-ci',
      },
      {
        title: 'Buildkite',
        href: '/integrations/platforms/buildkite',
      },
    ],
  },
  {
    title: 'Framework Integration',
    links: [
      { title: 'Overview', href: '/integrations' },
      { title: 'Next.js', href: '/integrations/frameworks/next-js' },
      { title: 'Node.js', href: '/integrations/frameworks/node' },
      { title: 'React', href: '/integrations/frameworks/react' },
      { title: 'Django', href: '/integrations/frameworks/django' },
      { title: 'Nuxt', href: '/integrations/frameworks/nuxt' },
      { title: 'NestJS', href: '/integrations/frameworks/nest-js' },
      { title: 'Vue.js', href: '/integrations/frameworks/vue-js' },
      { title: 'FastAPI', href: '/integrations/frameworks/fast-api' },
      { title: 'Flask', href: '/integrations/frameworks/flask' },
      { title: 'Svelte', href: '/integrations/frameworks/svelte' },
      { title: 'Fiber', href: '/integrations/frameworks/fiber' },
      {
        title: 'Ruby on Rails',
        href: '/integrations/frameworks/ruby-on-rails',
      },
      { title: 'Laravel', href: '/integrations/frameworks/laravel' },
      { title: 'Gatsby', href: '/integrations/frameworks/gatsby' },
      { title: 'Remix', href: '/integrations/frameworks/remix' },
      { title: '.NET', href: '/integrations/frameworks/dotnet' },
    ],
  },
  {
    title: 'Self-Host',
    links: [
      { title: 'Overview', href: '/self-hosting' },
      { title: 'Docker Compose', href: '/self-hosting/docker-compose' },
      { title: 'Kubernetes', href: '/self-hosting/kubernetes' },
      { title: 'AWS Elastic Kubernetes Service', href: '/self-hosting/aws-eks' },
      { title: 'AWS', href: '/self-hosting/aws' },
      { title: 'Google Cloud Platform', href: '/self-hosting/gcp' },
      { title: 'Azure', href: '/self-hosting/azure' },
      { title: 'Railway', href: '/self-hosting/railway' },
      { title: 'DigitalOcean', href: '/self-hosting/digitalocean' },
      { title: 'RaspberryPi', href: '/self-hosting/raspberrypi' },
      {
        title: 'Deployment configuration',
        href: '/self-hosting/configuration/envars',
      },
    ],
  },
  
]

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        {/* <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem> */}
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && 'md:mt-0'}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button
            href="https://console.phase.dev"
            target="_blank"
            variant="filled"
            className="w-full"
          >
            Launch Console
          </Button>
        </li>
      </ul>
    </nav>
  )
}
