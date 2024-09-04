'use client'

import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'


const resources = [
  {
    href: '/console/secrets',
    name: 'Secrets',
    description: 'Secrets in Phase are more than just key/value pairs. Explore referencing, overrides and more.',
  },
  {
    href: '/console/environments',
    name: 'Environments',
    description:
      'Environments let you manage secrets for different uses, such as development or production.',
  },
  {
    href: '/console/users',
    name: 'Users',
    description:
      'Learn about how user accounts are set up, secured and granted access to secrets.',
  },
  {
    href: '/security',
    name: 'Security',
    description:
      'A sophisticated security architecture is at the heart of Phase. Explore the details to learn more. ',
  },
]

export function About() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        About Phase
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
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
