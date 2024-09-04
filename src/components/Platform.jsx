'use client'


import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'


const resources = [
  {
    href: '/console',
    name: 'Console',
    description:
      'Manage secrets across environments and teams via a web dashboard.',
    
  },
  {
    href: '/cli/commands',
    name: 'CLI',
    description: 'Securely inject secrets into any application at runtime',
    
  },
  {
    href: '/public-api/secrets#get-secrets',
    name: 'REST API',
    description:
      'Create, retrieve, update, delete secrets via any HTTP client.',
    
  },
  {
    href: '/sdks',
    name: 'SDKs',
    description:
      'Create, retrieve, update, delete secrets securely from your application.',
    
  },
]



export function Platform() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Platform
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 border-t border-zinc-900/10 gap-8 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
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
