---
title: "Install"
description: "Manage your secrets and environment variables with the Phase CLI"
url: https://docs.phase.dev/cli/install
---

# Install

Install the Phase CLI on the platform or operating system of your choice.

## Supported platforms

| OS | Architectures | Package formats |
| --- | --- | --- |
| Linux | x86_64, arm64, armv7, mips, mips64, riscv64, ppc64le, s390x | deb, rpm, apk, binary |
| macOS | x86_64 (Intel), arm64 (Apple Silicon) | Homebrew, binary |
| Windows | x86_64, arm64 | Scoop, binary |
| FreeBSD | x86_64, arm64 | binary |
| OpenBSD | x86_64 | binary |
| NetBSD | x86_64 | binary |

## Installation

**MacOS**

```fish
brew tap phasehq/cli && brew trust phasehq/cli
brew install phase
```

**Linux**

```fish
curl -fsSL https://pkg.phase.dev/install.sh | sh

# curl -fsSL https://pkg.phase.dev/install.sh | sh -s -- --version 2.0.0
```

**Scoop**

```fish
scoop bucket add phasehq https://github.com/phasehq/scoop-cli.git
scoop install phase
```

**Windows (.exe)**

```fish
# Download the latest .exe for your architecture from:
# https://github.com/phasehq/cli/releases/latest
#
#   phase_cli_<version>_windows_amd64.exe   (Intel / AMD 64-bit)
#   phase_cli_<version>_windows_arm64.exe   (ARM 64-bit)
#
# Rename to phase.exe and add it to a directory on your PATH.
```

**Alpine Linux**

```fish
apk add --no-cache curl
curl -fsSL https://pkg.phase.dev/install.sh | sh
```

**NixOS**

```fish
nix-channel --update
nix-shell -p phase-cli
```

**Docker**

```fish
# Run the latest version
docker run phasehq/cli

# Optional: run a specific version - docker run phasehq/cli:<version>
```

## Updates

**MacOS**

```fish
brew trust phasehq/cli
brew update && brew upgrade phase
```

**Linux**

```fish
phase update
```

**Scoop**

```fish
scoop update phase
```

**Windows (.exe)**

```fish
# Re-download the latest .exe from:
# https://github.com/phasehq/cli/releases/latest
# and replace your existing phase.exe.
```

**Alpine Linux**

```fish
phase update
```

**NixOS**

```fish
nix-channel --update && nix-shell -p phase-cli
```

**Docker**

```fish
# Pull the latest version
docker pull phasehq/cli:latest

# Optional: pull a specific version - docker pull phasehq/cli:<version>
```
