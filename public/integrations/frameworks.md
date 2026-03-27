import { Tag } from '@/components/Tag'
import { HeroPattern } from '@/components/HeroPattern'

export const description =
  'Integrate Phase with popular frameworks to manage secrets and environment variables at runtime.'

<HeroPattern />

# Framework Integration

Use `phase run` to inject secrets into your application process at runtime. No code changes or dependencies required. {{ className: 'lead' }}

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](/cli/install)

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

<Note>
  Note that for environment variables to be exposed to the client, you'll have
  to prefix them with `NEXT_PUBLIC_`. Read more about that
  [here](https://nextjs.org/docs/basic-features/environment-variables).
</Note>

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

<div className="not-prose">
  <Button
    href="https://nodejs.dev/en/learn/how-to-read-environment-variables-from-nodejs/"
    variant="text"
    arrow="right"
    children="Node Docs"
  />
</div>

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

<Note>React environment variables must be prefixed with `REACT_APP_`</Note>

<div className="not-prose">
  <Button
    href="https://create-react-app.dev/docs/adding-custom-environment-variables"
    variant="text"
    arrow="right"
    children="React Docs"
  />
</div>

---

## Django

```fish
phase run python manage.py runserver payments-api:8000
```

Chaining multiple commands

```fish
phase run "python manage.py migrate && python manage.py runserver payments-api:8000"
```

<div className="not-prose">
  <Button
    href="https://docs.djangoproject.com/en/4.2/topics/settings"
    variant="text"
    arrow="right"
    children="Django Docs"
  />
</div>

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

<div className="not-prose">
  <Button
    href="https://v2.nuxt.com/docs/configuration-glossary/configuration-env"
    variant="text"
    arrow="right"
    children="Nuxt Docs"
  />
</div>

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

<div className="not-prose">
  <Button
    href="https://docs.nestjs.com/techniques/configuration#cache-environment-variables"
    variant="text"
    arrow="right"
    children="NestJS Docs"
  />
</div>

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

<Note>
  Vue.js client side environment variables must be prefixed with `VUE_APP`
</Note>

<div className="not-prose">
  <Button
    href="https://cli.vuejs.org/guide/mode-and-env.html#environment-variables"
    variant="text"
    arrow="right"
    children="Vue Docs"
  />
</div>

---

## FastAPI

```fish
phase run uvicorn main:app --reload
```

<div className="not-prose">
  <Button
    href="https://fastapi.tiangolo.com/advanced/settings"
    variant="text"
    arrow="right"
    children="FastAPI Docs"
  />
</div>

---

## Flask

```fish
phase run flask run
```

<div className="not-prose">
  <Button
    href="https://flask.palletsprojects.com/en/2.1.x/config"
    variant="text"
    arrow="right"
    children="Flask Docs"
  />
</div>

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

<Note>
  Svelte client side environment variables must be prefixed with `PUBLIC_`
</Note>

<div className="not-prose">
  <Button
    href="https://kit.svelte.dev/docs/modules#$env-static-public"
    variant="text"
    arrow="right"
    children="Svelte Docs"
  />
</div>

---

## Fiber

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

---

## Ruby on Rails

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

<div className="not-prose">
  <Button
    href="https://laravel.com/docs/10.x/configuration#environment-configuration"
    variant="text"
    arrow="right"
    children="Laravel Docs"
  />
</div>

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

<Note>
  Gatsby client side environment variables must be prefixed with `GATSBY_`
</Note>

<div className="not-prose">
  <Button
    href="https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/#accessing-environment-variables-in-the-browser"
    variant="text"
    arrow="right"
    children="Gatsby Docs"
  />
</div>

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

<div className="not-prose">
  <Button
    href="https://remix.run/docs/en/main/guides/envvars"
    variant="text"
    arrow="right"
    children="Remix Docs"
  />
</div>

---

## .NET

```fish
phase run dotnet run
```

<div className="not-prose">
  <Button
    href="https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-environment-variables"
    variant="text"
    arrow="right"
    children=".NET Docs"
  />
</div>
