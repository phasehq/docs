import { Tag } from '@/components/Tag'

export const description =
  'Manage your secrets and environment variables in your application with the Phase CLI'

<Tag variant="small">INTEGRATE</Tag>

# Remix

You can use Phase run to inject secrets to your application process during runtime. There is no need for you to change any code or add a dependency.

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](/cli/install)

## Initialize Phase for your [Remix](https://remix.run) app

In the root of your application's codebase run:

```fish
phase init
```

## Start your app with Phase

Example

```fish
phase run npm run dev
```

Alternatively, you can use `phase run` in your package.json file, so secrets will automatically be injected when you `npm run dev`.

**package.json**:

```json
{
  "name": "McLaren",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "phase run \"remix build\"",
    "dev": "phase run \"remix dev\""
  },
  "browserslist": "...",
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  }
}
```

<div className="not-prose">
  <Button
    href="https://remix.run/docs/en/main/guides/envvars"
    variant="text"
    arrow="right"
    children="Remix Docs"
  />
</div>
