'use client'

import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const resources = [
  {
    href: '/access-control/service-accounts#create-a-new-service-account-token',
    name: 'Service Account Token',
    description: 
      'Access tokens that belong to Service Accounts. These tokens inherit fine-grained access control and role-based permissions from service accounts, making them ideal for automated processes and system integrations.',
  },
  {
    href: '/access-control/authentication/tokens',
    name: 'Personal Access Token (PAT)',
    description: 
      'Access tokens that belong to human users, inheriting their permissions and access levels. Ideal for development workflows, testing, and accessing personal secret overrides. These tokens provide the same access as the user who created them.',
  }
]

export function ProgrammaticAuth() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Access Token Types
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/10 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {resources.map((resource) => (
          <div key={resource.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {resource.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {resource.description}
            </p>
            <p className="mt-4">
              <Button href={resource.href} variant="text" arrow="right">
                Explore
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
