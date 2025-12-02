import Image from 'next/image'
import { Card } from '@/components/Card'
import Link from 'next/link'

import logoGoogle from '@/images/logos/google.svg'
import logoGitHub from '@/images/logos/github.svg'
import logoGitLab from '@/images/logos/gitlab.svg'
import logoJumpCloud from '@/images/logos/jumpcloud.svg'
import logoAuthentik from '@/images/logos/authentik.svg'

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

function OktaLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#007DC1"
        d="M12 0C5.389 0 0 5.35 0 12s5.35 12 12 12 12-5.35 12-12S18.611 0 12 0zm0 18c-3.325 0-6-2.675-6-6s2.675-6 6-6 6 2.675 6 6-2.675 6-6 6z"
      />
    </svg>
  )
}

function JumpCloudLogo({ className }) {
  return (
    <svg 
      viewBox="0 0 1420 247" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        fillRule="evenodd" 
        className="fill-[#002b49] dark:fill-white"
        d="m63.4 191.3c0 33.7-13.4 55.1-50.4 55.4q-6.5-0.1-12.9-1.2l1.8-34.3q4.6 1 9.4 0.9c9 0 12-6.1 12-15.2v-136h39.8v130.4zm118.8-28.8h-3c-7.9 26.6-24.9 40.7-46.9 40.7-26.3 0-39.9-18.6-39.9-48.8v-94.1h39.9v82.9c0 14.4 6.4 24 21.1 24 3.8 0.2 7.6-0.5 11.2-2 3.5-1.5 6.7-3.7 9.3-6.5 2.6-2.8 4.6-6.1 5.8-9.7 1.2-3.7 1.6-7.5 1.2-11.3v-77.4h39.6v139.1h-38.9zm106.7 36.3h-39.8v-139h39v37.2h2.9c7.9-26.7 24.6-40.7 46.6-40.7 24.6 0 36.7 15.5 38.4 41.5h3.2c7.6-27.2 23.4-41.5 46.3-41.5 27 0 40.8 18.6 40.8 48.9v94.2h-40.2v-82.9c0-14.1-6.4-23.8-21.1-23.8-3.8-0.1-7.6 0.6-11.1 2-3.5 1.5-6.7 3.7-9.3 6.4-2.6 2.8-4.6 6.1-5.8 9.7-1.3 3.6-1.7 7.4-1.3 11.2v77.4h-39.9v-82.9c0-14.1-6.8-23.8-21.1-23.8-3.8-0.1-7.6 0.6-11.2 2-3.5 1.5-6.7 3.6-9.3 6.4-2.7 2.8-4.7 6.1-5.9 9.7-1.3 3.6-1.8 7.4-1.5 11.2zm340.3-68.6c0 47.7-18.1 73.2-48.4 73.8-23.1 0-38-16.3-45.1-40.8h-2.3v80.9h-39.9v-183.4h39.9v35.2h2.6c7.4-24.3 22.6-39 44.8-39 30.5 0 47.9 25.5 47.9 73.3zm-67.3 38.1c19.3 0 27.5-13 27.5-38.5 0-25.5-8.5-37.5-27.5-37.5-17.6 0-28.5 12.7-28.5 32.6v10.9c0 19.7 11.1 32.6 28.1 32.6zm180.1-51.3c-3.5-15-9.4-25.4-27.9-25.4-18.5 0-29.9 11.7-29.9 38.1 0 24.6 9.9 39 30.5 39 17.8 0 24.6-12.1 27.5-26.4l36.7 8.8c-4.7 32.2-24.4 52.4-64 52.4-43.9 0-71.5-24.5-71.5-71.7 0-47.3 27-75 71.3-75 41.3 0 58.9 19.6 63.9 53.2l-37 7.1zm100 82.4h-39.9v-188.2h39.5zm93.6 4.1q0.1 0 0.2 0 0 0 0.1 0 0 0 0 0zm0.2 0c-45.1-0.1-72.1-27-72.1-73.3 0-46.4 28.6-73.3 71.9-73.3 43.4 0 71.3 27.8 71.3 73.3 0 45.4-27 73.2-71.1 73.3zm-31.9-73.9c0 25.3 9.5 39.9 31.7 39.9 22.3 0 31.6-14.7 31.6-39.9 0-25.2-9.6-39.5-31.6-39.5-22 0-31.7 14.3-31.7 39.5zm213.8 33.1h-2.9c-8 26.6-25 40.7-47 40.7-26.3 0-39.8-18.7-39.8-48.9v-94h39.8v82.9c0 14.4 6.5 24 21.1 24 3.8 0.1 7.7-0.6 11.2-2 3.5-1.5 6.7-3.7 9.3-6.5 2.7-2.8 4.6-6.1 5.9-9.8 1.2-3.6 1.6-7.5 1.2-11.3v-77.3h40.1v138.9h-38.9zm155.6 0.1h-2.4c-7 24.4-22.2 40.7-45.4 40.7-29.9 0-47.5-25.5-47.5-72.4 0-48.3 17.6-74.4 48.1-74.4 22.2 0 37.2 14.5 44.6 39h2.6v-84.4h39.9v188.1h-39.8zm0-25.9v-11c0-20.2-10.8-33.1-28.4-33.1-19.1 0-27.9 13.4-27.9 38.4 0 24.9 8.6 37.2 28.2 37.2 16.7 0 28.1-12.3 28.1-31.5zm-1208-115.1c0 4.2-1.3 8.4-3.6 11.9-2.4 3.6-5.8 6.3-9.7 7.9-3.9 1.7-8.3 2.1-12.4 1.3-4.2-0.9-8-2.9-11-5.9-3.1-3-5.1-6.9-5.9-11-0.9-4.2-0.4-8.5 1.2-12.5 1.6-3.9 4.4-7.2 7.9-9.6 3.6-2.4 7.7-3.6 12-3.6 2.8 0 5.6 0.5 8.2 1.6 2.6 1.1 5 2.7 7 4.7 2 2 3.6 4.3 4.6 6.9 1.1 2.7 1.7 5.4 1.7 8.3z"
      />
      <path 
        className="fill-[#002b49] dark:fill-white"
        d="m1375.1 163.1v5.7h-11v28.6h-6.8v-28.6h-10.9v-5.7zm37.1 34.3l-1.3-20.2c0-2.6 0-5.9 0-9.6h-0.4c-0.9 3.1-1.8 7.1-2.9 10.2l-6.1 19.1h-7.1l-6.2-19.6-2.4-9.7h-0.4c0 3.1 0 6.5 0 9.6l-1.3 20.2h-6.5l2.5-34.3h10.2l6 16.8c0.7 2.6 1.4 5.1 2.3 8.7 0.9-3.2 1.6-6.1 2.4-8.7l5.9-16.8h9.8l2.7 34.3z"
      />
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
  {
    href: '/access-control/authentication/oauth-sso#authentik',
    name: 'Authentik',
    description: 'Use Authentik SSO to Authenticate with Phase.',
    logo: logoAuthentik, 
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
    logo: { src: null, height: 18, width: 18 }, // Using custom logo component
    customLogo: <JumpCloudLogo className="h-10 w-24" />,
  },
  {
    href: '/access-control/authentication/oidc-sso#microsoft-entra-id-azure-ad',
    name: 'Microsoft Entra ID OIDC SSO',
    description: 'Use Microsoft Entra ID (Azure AD) OIDC SSO to Authenticate with Phase.',
    logo: { src: null, height: 18, width: 18 }, // Using custom logo component
    customLogo: <EntraIDLogo className="h-10 w-10" />,
  },
  {
    href: '/access-control/authentication/oidc-sso#okta',
    name: 'Okta OIDC SSO',
    description: 'Use Okta OIDC SSO to Authenticate with Phase.',
    logo: { src: null, height: 18, width: 18 }, // Using custom logo component
    customLogo: <OktaLogo className="h-10 w-10" />,
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
