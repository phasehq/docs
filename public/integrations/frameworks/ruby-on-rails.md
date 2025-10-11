import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Manage your secrets and environment variables in your application with the Phase CLI'

<Tag variant="small">INTEGRATE</Tag>

# Ruby on Rails

You can use Phase run to inject secrets to your application process during runtime. There is no need for you to change any code or add a dependency.

<DocActions /> 

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](/cli/install)

## Initialize Phase for your [Svelte](https://rubyonrails.org) app

In the root of your application's codebase run:

```fish
phase init
```

## Start your app with Phase

Example

```fish
phase run rails server
```

<div className="not-prose">
  <Button
    href="https://guides.rubyonrails.org/configuring.html"
    variant="text"
    arrow="right"
    children="Ruby on Rails Docs"
  />
</div>
