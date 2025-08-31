import { Tag } from '@/components/Tag'

export const description =
  'Manage your secrets and environment variables in your application with the Phase CLI'

<Tag variant="small">INTEGRATE</Tag>

# Nuxt

You can use Phase run to inject secrets to your application process during runtime. There is no need for you to change any code or add a dependency.

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](/cli/install)

## Initialize Phase for your [Nuxt](https://v2.nuxt.com/) app

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
    "dev": "phase run nuxt",
    "build": "nuxt build",
    "start": "nuxt start",
    "generate": "nuxt generate"
  },
  "browserslist": "...",
  "dependencies": {...
  },
  "devDependencies": {...
  }
}
```

<div className="not-prose">
  <Button
    href="https://v2.nuxt.com/docs/configuration-glossary/configuration-env"
    variant="text"
    arrow="right"
    children="Nuxt Docs"
  />
</div>
