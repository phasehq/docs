import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'Manage your secrets and environment variables with the Phase CLI'

<Tag variant="small">CLI</Tag>

# Install

Install the Phase CLI on the platform or operating system of your choice.

<DocActions />

## Supported platforms

| OS | Architectures | Package formats |
| --- | --- | --- |
| Linux | x86_64, arm64, armv7, mips, mips64, riscv64, ppc64le, s390x | deb, rpm, apk, binary |
| macOS | x86_64 (Intel), arm64 (Apple Silicon) | Homebrew, binary |
| Windows | x86_64, arm64 | Scoop, binary |
| FreeBSD | x86_64, arm64 | binary |
| OpenBSD | x86_64 | binary |
| NetBSD | x86_64 | binary |

## Installation {{ className: 'lead' }}

<CodeGroup>

```fish {{ title: 'MacOS' }}
brew install phasehq/cli/phase
```

```fish {{ title: 'Linux' }}
curl -fsSL https://pkg.phase.dev/install.sh | sh

# curl -fsSL https://pkg.phase.dev/install.sh | sh -s -- --version 2.0.0
```

```fish {{ title: 'Scoop' }}
scoop bucket add phasehq https://github.com/phasehq/scoop-cli.git
scoop install phase
```

```fish {{ title: 'Windows (.exe)' }}
# Download the latest .exe for your architecture from:
# https://github.com/phasehq/cli/releases/latest
#
#   phase_cli_<version>_windows_amd64.exe   (Intel / AMD 64-bit)
#   phase_cli_<version>_windows_arm64.exe   (ARM 64-bit)
#
# Rename to phase.exe and add it to a directory on your PATH.
```

```fish {{ title: 'Alpine Linux' }}
apk add --no-cache curl
curl -fsSL https://pkg.phase.dev/install.sh | sh
```

```fish {{ title: 'NixOS' }}
nix-channel --update
nix-shell -p phase-cli
```

```fish {{ title: 'Docker' }}
# Run the latest version
docker run phasehq/cli

# Optional: run a specific version - docker run phasehq/cli:<version>
```

</CodeGroup>

## Updates {{ className: 'lead' }}

<CodeGroup>

```fish {{ title: 'MacOS' }}
brew update && brew upgrade phase
```

```fish {{ title: 'Linux' }}
phase update
```

```fish {{ title: 'Scoop' }}
scoop update phase
```

```fish {{ title: 'Windows (.exe)' }}
# Re-download the latest .exe from:
# https://github.com/phasehq/cli/releases/latest
# and replace your existing phase.exe.
```

```fish {{ title: 'Alpine Linux' }}
phase update
```

```fish {{ title: 'NixOS' }}
nix-channel --update && nix-shell -p phase-cli
```

```fish {{ title: 'Docker' }}
# Pull the latest version
docker pull phasehq/cli:latest

# Optional: pull a specific version - docker pull phasehq/cli:<version>
```

</CodeGroup>
