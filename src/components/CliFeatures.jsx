'use client'


import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'


const resources = [
  {
    href: '/cli/install',
    name: 'Install',
    description:
      'Install the Phase CLI on the platform or operating system of your choice.',
    
  },
  {
    href: '/cli/install#updates',
    name: 'Update',
    description: 'Update your CLI to get the latest features and bugfixes',
    
  },
  {
    href: '/cli/usage',
    name: 'Quickstart',
    description:
      'Install and get setup with the CLI in minutes.',
    
  },
  {
    href: '/cli/commands',
    name: 'Commands',
    description:
      'Explore all the available commands of the Phase CLI.',
    
  },
]



export function CliFeatures() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Resources
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
