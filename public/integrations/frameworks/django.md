import { Tag } from '@/components/Tag'

export const description =
  'Manage your secrets and environment variables in your application with the Phase CLI'

<Tag variant="small">INTEGRATE</Tag>

# Django

You can use Phase run to inject secrets to your application process during runtime. There is no need for you to change any code or add a dependency.

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](/cli/install)

## Initialize Phase for your [Django](https://www.djangoproject.com) app

In the root of your application's codebase run:

```fish
phase init
```

## Start your app with Phase

Examples

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
