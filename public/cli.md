import { Tag } from '@/components/Tag'
import CliDemo from '@/components/CliDemo'
import { CliFeatures } from '@/components/CliFeatures'
import { HeroPattern } from '@/components/HeroPattern'

export const description =
  'This guide will explain how the Phase CLI works.'

<HeroPattern />

# CLI

The Phase CLI works together with the [Phase Console](https://github.com/phasehq/console) to bring end-to-end encrypted secret management to your command line. {{ className: 'lead' }} 

The CLI fetches, decrypts, and injects secrets into your applications during runtime. You can manage secrets across all environment, use personal secret-overrides, resolve references and much more. 

<CliDemo castFile="phase-run.cast" terminalFontSize="small" />

<CliFeatures />