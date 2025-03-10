import Image from 'next/image'
import { Card } from '@/components/Card'
import Link from 'next/link'

import logoGoogle from '@/images/logos/google.svg'
import logoGitHub from '@/images/logos/github.svg'
import logoGitLab from '@/images/logos/gitlab.svg'
import logoJumpCloud from '@/images/logos/jumpcloud.svg'


import clsx from 'clsx'

const OAuthProviders = [
  {
    href: '/access-control/authentication/oauth-sso#google',
    name: 'Google OAuth SSO',
    description: 'Use Google OAuth App SSO to Authenticate with Phase.',
    logo: logoGoogle,
  },
  {
    href: '/access-control/authentication/oauth-sso#git-hub',
    name: 'GitHub OAuth SSO',
    description:
      'Use GitHub OAuth App SSO to Authenticate with Phase.',
    logo: logoGitHub,
  },
  {
    href: '/access-control/authentication/oauth-sso#git-lab',
    name: 'GitLab OAuth SSO',
    description: 'Use GitLab.com or self-managed GitLab instance to Authenticate with Phase.',
    logo: logoGitLab, 
  },
]

const OIDCProviders = [
  {
    href: '/access-control/authentication/oidc-sso#google',
    name: 'Google OIDC SSO',
    description: 'Use Google OIDC SSO to Authenticate with Phase.',
    logo: logoGoogle,
  },
  {
    href: '/access-control/authentication/oidc-sso#jump-cloud',
    name: 'JumpCloud OIDC SSO',
    description: 'Use JumpCloud OIDC SSO to Authenticate with Phase.',
    logo: logoJumpCloud,
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

export function UserAuthProviders() {
  return (
    <div className="my-16 xl:max-w-none">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">OAuth 2.0 Providers</h2>
        <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
          {OAuthProviders.map((library) => (
            <Card key={library.name}>
              <Link href={library.href} className="flex flex-row-reverse gap-6">
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
                <Image
                  src={library.logo}
                  alt=""
                  className="h-10 w-10"
                  unoptimized
                />
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">OpenID Connect (OIDC) Providers</h2>
        <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
          {OIDCProviders.map((library) => (
            <Card key={library.name}>
              <Link href={library.href} className="flex flex-row-reverse gap-6">
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
                <Image
                  src={library.logo}
                  alt=""
                  className="h-10 w-10"
                  unoptimized
                />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
