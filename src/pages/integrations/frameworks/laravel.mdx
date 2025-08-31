import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Manage your secrets and environment variables in your application with the Phase CLI'

<Tag variant="small">INTEGRATE</Tag>

# Laravel

You can use Phase run to inject secrets to your application process during runtime. There is no need for you to change any code or add a dependency.

<DocActions /> 

## Prerequisites

- Create an account on the Phase Console
- [Install the CLI](/cli/install)

## Initialize Phase for your [Laravel](https://laravel.com) app

In the root of your application's codebase run:

```fish
phase init
```

## Development Environment

For local development, you can use Laravel's built-in development server with Phase:

```fish
phase run php artisan serve
```

## Production Environment

In production, Laravel applications typically run using PHP-FPM managed by supervisor. PHP-FPM can read environment variables from the host system when properly configured.

### Configure PHP-FPM

First, ensure your PHP-FPM pool configuration preserves environment variables by setting:

```ini
; In your PHP-FPM pool configuration (e.g., www.conf)
clear_env = no
```

### Configure Supervisor

Then set up supervisor to run PHP-FPM through Phase:

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
