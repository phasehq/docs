import { Tag } from '@/components/Tag'

export const description =
  'Manage your secrets and environment variables in your application with the Phase CLI'

<Tag variant="small">INTEGRATE</Tag>

# Fiber

You can use Phase run to inject secrets to your application process during runtime. There is no need for you to change any code or add a dependency.

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](/cli/install)

## Initialize Phase for your [Fiber](https://gofiber.io) app

In the root of your application's codebase run:

```fish
phase init
```

## Start your app with Phase

Example

```fish
phase run go run server.go
```

<div className="not-prose">
  <Button
    href="https://docs.gofiber.io/api/middleware/envvar"
    variant="text"
    arrow="right"
    children="Fiber Docs"
  />
</div>
