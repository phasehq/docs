---
title: "Framework Integration"
description: "Integrate Phase with popular frameworks to manage secrets and environment variables at runtime."
url: https://docs.phase.dev/integrations/frameworks
---

# Framework Integration

Use `phase run` to inject secrets into your application process at runtime. No code changes or dependencies required.

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](https://docs.phase.dev/cli/install.md)

## Initialize Phase

In the root of your application's codebase run:

```fish
phase init
```

---

## Next.js

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
    "dev": "phase run next dev",
    "build": "next build && next export",
    "start": "next start",
    "lint": "next lint"
  }
}
```

> **Note:** Note that for environment variables to be exposed to the client, you'll have
>   to prefix them with `NEXT_PUBLIC_`. Read more about that
>   [here](https://nextjs.org/docs/basic-features/environment-variables).

---

## Node.js

```fish
phase run npm run dev
```

**package.json**:

```json
{
  "name": "McLaren",
  "version": "0.1.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}
```

[Node Docs](https://nodejs.dev/en/learn/how-to-read-environment-variables-from-nodejs/)

---

## React

```fish
phase run npm start
```

**package.json**:

```json
{
  "name": "McLaren",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "phase run react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

> **Note:** React environment variables must be prefixed with `REACT_APP_`

[React Docs](https://create-react-app.dev/docs/adding-custom-environment-variables)

---

## Django

```fish
phase run python manage.py runserver payments-api:8000
```

Chaining multiple commands

```fish
phase run "python manage.py migrate && python manage.py runserver payments-api:8000"
```

[Django Docs](https://docs.djangoproject.com/en/4.2/topics/settings)

---

## Nuxt

```fish
phase run npm run dev
```

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
  }
}
```

[Nuxt Docs](https://v2.nuxt.com/docs/configuration-glossary/configuration-env)

---

## NestJS

```fish
phase run npm run start:dev
```

**package.json**:

```json
{
  "name": "McLaren",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start:dev": "phase run nest start --watch",
    "start": "nest start",
    "start:prod": "node dist/main"
  }
}
```

[NestJS Docs](https://docs.nestjs.com/techniques/configuration#cache-environment-variables)

---

## Vue.js

```fish
phase run npm run dev
```

**package.json**:

```json
{
  "name": "McLaren",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "phase run vue-cli-service serve",
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  }
}
```

> **Note:** Vue.js client side environment variables must be prefixed with `VUE_APP`

[Vue Docs](https://cli.vuejs.org/guide/mode-and-env.html#environment-variables)

---

## FastAPI

```fish
phase run uvicorn main:app --reload
```

[FastAPI Docs](https://fastapi.tiangolo.com/advanced/settings)

---

## Flask

```fish
phase run flask run
```

[Flask Docs](https://flask.palletsprojects.com/en/2.1.x/config)

---

## Svelte

```fish
phase run npm run dev
```

**package.json**:

```json
{
  "name": "McLaren",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "phase run \"run-s build:env:prod build:sveltekit build:env:local\"",
    "dev": "phase run \"npm run check-env && npm run dev:sveltekit\""
  }
}
```

> **Note:** Svelte client side environment variables must be prefixed with `PUBLIC_`

[Svelte Docs](https://kit.svelte.dev/docs/modules#$env-static-public)

---

## Fiber

```fish
phase run go run server.go
```

[Fiber Docs](https://docs.gofiber.io/api/middleware/envvar)

---

## Ruby on Rails

```fish
phase run rails server
```

[Ruby on Rails Docs](https://guides.rubyonrails.org/configuring.html)

---

## Laravel

### Development Environment

```fish
phase run php artisan serve
```

### Production Environment

In production, Laravel applications typically run using PHP-FPM managed by supervisor. PHP-FPM can read environment variables from the host system when properly configured.

#### Configure PHP-FPM

Ensure your PHP-FPM pool configuration preserves environment variables:

```ini
; In your PHP-FPM pool configuration (e.g., www.conf)
clear_env = no
```

#### Configure Supervisor

Set up supervisor to run PHP-FPM through Phase:

```ini
[program:laravel]
process_name=%(program_name)s_%(process_num)02d
command=phase run php-fpm
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/supervisor/laravel.log
```

[Laravel Docs](https://laravel.com/docs/10.x/configuration#environment-configuration)

---

## Gatsby

```fish
phase run npm run dev
```

**package.json**:

```json
{
  "name": "McLaren",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "phase run \"gatsby build\"",
    "dev": "phase run \"gatsby develop\""
  }
}
```

> **Note:** Gatsby client side environment variables must be prefixed with `GATSBY_`

[Gatsby Docs](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/#accessing-environment-variables-in-the-browser)

---

## Remix

```fish
phase run npm run dev
```

**package.json**:

```json
{
  "name": "McLaren",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "phase run \"remix build\"",
    "dev": "phase run \"remix dev\""
  }
}
```

[Remix Docs](https://remix.run/docs/en/main/guides/envvars)

---

## .NET

```fish
phase run dotnet run
```

[.NET Docs](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-environment-variables)
