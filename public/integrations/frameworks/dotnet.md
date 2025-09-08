import { Tag } from '@/components/Tag'

export const description =
  'Manage your secrets and environment variables in your application with the Phase CLI'

<Tag variant="small">INTEGRATE</Tag>

# .NET

You can use Phase run to inject secrets to your application process during runtime. There is no need for you to change any code or add a dependency.

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](/cli/install)

## Initialize Phase for your [.NET](https://dotnet.microsoft.com) app

In the root of your application's codebase run:

```fish
phase init
```

## Start your app with Phase

Example

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
