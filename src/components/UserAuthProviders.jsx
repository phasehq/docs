import Image from 'next/image'
import { Card } from '@/components/Card'
import Link from 'next/link'

import logoGoogle from '@/images/logos/google.svg'
import logoGitHub from '@/images/logos/github.svg'
import logoGitLab from '@/images/logos/gitlab.svg'
import logoJumpCloud from '@/images/logos/jumpcloud.svg'

import clsx from 'clsx'

// Microsoft Entra ID Logo component
function EntraIDLogo({ className }) {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 18 18" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m3.802,14.032c.388.242,1.033.511,1.715.511.621,0,1.198-.18,1.676-.487,0,0,.001,0,.002-.001l1.805-1.128v4.073c-.286,0-.574-.078-.824-.234l-4.374-2.734Z" fill="#225086"/>
      <path d="m7.853,1.507L.353,9.967c-.579.654-.428,1.642.323,2.111,0,0,2.776,1.735,3.126,1.954.388.242,1.033.511,1.715.511.621,0,1.198-.18,1.676-.487,0,0,.001,0,.002-.001l1.805-1.128-4.364-2.728,4.365-4.924V1s0,0,0,0c-.424,0-.847.169-1.147.507Z" fill="#6df"/>
      <polygon points="4.636 10.199 4.688 10.231 9 12.927 9.001 12.927 9.001 12.927 9.001 5.276 9 5.275 4.636 10.199" fill="#cbf8ff"/>
      <path d="m17.324,12.078c.751-.469.902-1.457.323-2.111l-4.921-5.551c-.397-.185-.842-.291-1.313-.291-.925,0-1.752.399-2.302,1.026l-.109.123h0s4.364,4.924,4.364,4.924h0s0,0,0,0l-4.365,2.728v4.073c.287,0,.573-.078.823-.234l7.5-4.688Z" fill="#074793"/>
      <path d="m9.001,1v4.275s.109-.123.109-.123c.55-.627,1.377-1.026,2.302-1.026.472,0,.916.107,1.313.291l-2.579-2.909c-.299-.338-.723-.507-1.146-.507Z" fill="#0294e4"/>
      <polygon points="13.365 10.199 13.365 10.199 13.365 10.199 9.001 5.276 9.001 12.926 13.365 10.199" fill="#96bcc2"/>
    </svg>
  )
}

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
  {
    href: '/access-control/authentication/oidc-sso#microsoft-entra-id-azure-ad',
    name: 'Microsoft Entra ID OIDC SSO',
    description: 'Use Microsoft Entra ID (Azure AD) OIDC SSO to Authenticate with Phase.',
    logo: { src: null, height: 18, width: 18 }, // Using custom logo component
    customLogo: <EntraIDLogo className="h-10 w-10" />,
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
                {library.customLogo ? (
                  <div className="flex items-center justify-center h-10 w-10">
                    {library.customLogo}
                  </div>
                ) : (
                  <Image
                    src={library.logo}
                    alt=""
                    className="h-10 w-10"
                    unoptimized
                  />
                )}
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
