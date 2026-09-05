import clsx from 'clsx'
import Link from 'next/link'
import { FaCog, FaKey, FaLock } from 'react-icons/fa'
import { FiEye, FiFolder } from 'react-icons/fi'
import {
  SiAmazoniam,
  SiAmazonwebservices,
  SiCloudflarepages,
  SiCloudflareworkers,
  SiDatadog,
  SiDependabot,
  SiGithub,
  SiGithubactions,
  SiGithubcopilot,
  SiGitlab,
  SiGnometerminal,
  SiGo,
  SiGooglecloud,
  SiJenkins,
  SiKubernetes,
  SiMicrosoftazure,
  SiNodedotjs,
  SiNomad,
  SiOkta,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiRailway,
  SiRender,
  SiTerraform,
  SiVercel,
} from 'react-icons/si'

import { ClaudeIcon, CursorIcon, OpenCodeIcon } from '@/components/icons/AgentIcons'

/**
 * "Phase at a glance" — the docs landing page, in the swiss drafting
 * language. Ported from the website's HowPhaseWorks export sheet; every
 * colour token is a light/dark pair so it follows the docs theme toggle
 * natively (no image swap). Every cell title links to its docs section
 * (underlined on hover), so the sheet doubles as a map of the docs. Four
 * hue-coded bands with the store as the hub:
 *
 *   Access            (sky)     — lifecycle axis develop → build → deploy →
 *                                 run and every surface that reaches into
 *                                 Phase along it; each drops a trace into
 *                                 the store.
 *   Store             (emerald) — app › environment › path › key/value and
 *                                 the three secret types.
 *   Automate          (violet)  — rotation, dynamic secrets, syncs; three
 *                                 traces drop from the store.
 *   Control & monitor (amber)   — authentication, network access policies,
 *                                 audit logs. Cross-cutting, so no traces.
 *
 * Static — no motion. Laid out for ≥1000px; below that the sheet scrolls
 * horizontally inside its wrapper. Semantic accents mirror the website:
 * lease-ledger dots (active / expiring / revoked), [SYNCED] statuses,
 * amber sealed lock, amber ❯ prompt, IP allow-list chips.
 */

/* ------------------------------------------------------------------ */
/* Tokens — light class first, dark: pair second                        */
/* ------------------------------------------------------------------ */

const t = {
  sheet: 'bg-white text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300',
  frameBorder: 'border-zinc-200 dark:border-zinc-800',
  rule: 'border-zinc-200 dark:border-zinc-800',
  divide: 'divide-zinc-200 dark:divide-zinc-800',
  line: 'bg-zinc-300 dark:bg-zinc-700',
  lineSoft: 'bg-zinc-200 dark:bg-zinc-800',
  ink: 'text-zinc-900 dark:text-zinc-100',
  body: 'text-zinc-700 dark:text-zinc-300',
  muted: 'text-zinc-500',
  faint: 'text-zinc-400 dark:text-zinc-600',
  panel: 'bg-zinc-50 dark:bg-zinc-800/40',
  chip: 'border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300',
  accentDot: 'bg-emerald-500 dark:bg-emerald-400',
  accentBorder: 'border-emerald-500 dark:border-emerald-400',
  tabIdle: 'text-zinc-500',
  tabActive: 'text-zinc-900 dark:text-zinc-100',
  iconTone: 'text-zinc-700 dark:text-zinc-300',
  plus: 'text-zinc-300 dark:text-zinc-700',
  hue: {
    sky: {
      text: 'text-sky-600 dark:text-sky-400',
      border: 'border-sky-500/50 dark:border-sky-400/45',
    },
    emerald: {
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/50 dark:border-emerald-400/45',
    },
    violet: {
      text: 'text-violet-600 dark:text-violet-400',
      border: 'border-violet-500/50 dark:border-violet-400/45',
    },
    amber: {
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/50 dark:border-amber-400/45',
    },
  },
  ok: {
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  warn: {
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  bad: {
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500 dark:bg-red-400',
  },
  glyph: {
    config: 'text-cyan-600 dark:text-cyan-400',
    secret: 'text-sky-600 dark:text-sky-400',
    sealed: 'text-amber-600 dark:text-amber-400',
  },
  sealedMask: 'text-amber-600/70 dark:text-amber-400/70',
  prompt: 'text-amber-600 dark:text-amber-400',
  ipRange:
    'border-blue-500/40 bg-blue-50 text-blue-700 dark:bg-blue-500/[0.06] dark:text-blue-300',
  ipSingle:
    'border-emerald-500/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/[0.06] dark:text-emerald-300',
}

const eyebrow = 'font-mono text-[10px] uppercase tracking-[0.14em]'

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** Band zone label — mono, uppercase, in the band's hue. */
function BandLabel({ hue, children }) {
  return <span className={clsx(eyebrow, t.hue[hue].text)}>{children}</span>
}

/** A provider / tool mark: icon (or text chip) + optional label. */
function Mark({ Icon, text, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {Icon ? (
        <Icon aria-hidden="true" className={clsx('h-3.5 w-3.5 shrink-0', t.iconTone)} />
      ) : (
        <span
          className={clsx(
            'inline-flex h-3.5 items-center border px-1 font-mono text-[8px] leading-none tracking-[0.06em]',
            t.chip
          )}
        >
          {text}
        </span>
      )}
      {label && (
        <span className={clsx('font-mono text-[10px] tracking-[0.02em]', t.body)}>{label}</span>
      )}
    </span>
  )
}

/** Tailscale mark — 3×3 dot grid, middle row + bottom-centre solid (a T). */
function TailscaleMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <circle
            key={`${r}${c}`}
            cx={4 + c * 8}
            cy={4 + r * 8}
            r={2.6}
            fill="currentColor"
            fillOpacity={r === 1 || (r === 2 && c === 1) ? 1 : 0.35}
          />
        ))
      )}
    </svg>
  )
}

/** IP allow-list chip — blue for ranges, emerald for single addresses. */
function IpChip({ range, children }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center border px-1.5 py-px font-mono text-[9px]',
        range ? t.ipRange : t.ipSingle
      )}
    >
      {children}
    </span>
  )
}

/** Status dot + mono text — the lease-ledger idiom (active / expiring / revoked). */
function Status({ level, className, children }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px]',
        t[level].text,
        className
      )}
    >
      <span aria-hidden="true" className={clsx('h-1.5 w-1.5 shrink-0 rounded-full', t[level].dot)} />
      {children}
    </span>
  )
}

/** Hue-coded node cell — border in the band hue at reduced opacity, title in
 *  the hue — a docs link when `href` is given, underlined on hover — with an
 *  optional right-aligned status, marks + a faint sub-line pinned to the
 *  bottom. */
function Cell({ hue, title, href, status, sub, className, children }) {
  return (
    <div className={clsx('flex flex-col border', t.hue[hue].border, className)}>
      <div className={clsx('flex items-baseline justify-between gap-2 border-b px-3 py-1.5', t.rule)}>
        {href ? (
          <Link
            href={href}
            className={clsx(
              eyebrow,
              t.hue[hue].text,
              'underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none'
            )}
          >
            {title}
          </Link>
        ) : (
          <span className={clsx(eyebrow, t.hue[hue].text)}>{title}</span>
        )}
        {status}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2.5 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">{children}</div>
        {sub && (
          <div className={clsx('font-mono text-[9px] uppercase tracking-[0.1em]', t.faint)}>{sub}</div>
        )}
      </div>
    </div>
  )
}

/** A row of vertical hairline traces, one per grid column, centered. */
function Drops({ cols, spans, className }) {
  return (
    <div
      aria-hidden="true"
      className={clsx('grid', className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {spans.map((span, i) => (
        <div key={i} className={clsx('relative', span)}>
          <span className={clsx('absolute left-1/2 top-0 h-full w-px -translate-x-1/2', t.line)} />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Store — the console-style frame                                     */
/* ------------------------------------------------------------------ */

const rowGrid = 'grid grid-cols-[188px_300px_84px_1fr] items-center px-4'

function StoreFrame() {
  return (
    <div className={clsx('border', t.hue.emerald.border)}>
      {/* App title bar */}
      <div className={clsx('flex items-center justify-between border-b px-4 py-2', t.rule, t.panel)}>
        <span className="flex items-center gap-2">
          <span className={clsx(eyebrow, t.faint)}>App</span>
          <span className={clsx('font-mono text-[12px] font-medium', t.ink)}>payments-api</span>
        </span>
        <span className={clsx(eyebrow, t.faint)}>3 environments · 47 secrets</span>
      </div>

      {/* Environment tabs + path */}
      <div className={clsx('flex items-center justify-between border-b px-4', t.rule)}>
        <div className="flex items-center gap-6">
          {[
            { name: 'Development', active: false },
            { name: 'Staging', active: false },
            { name: 'Production', active: true },
          ].map((env) => (
            <span
              key={env.name}
              className={clsx(
                'flex items-center gap-1.5 border-b py-2 font-mono text-[11px] tracking-[0.02em]',
                env.active ? clsx(t.tabActive, t.accentBorder) : clsx(t.tabIdle, 'border-transparent')
              )}
            >
              {env.active && <span className={clsx('h-1.5 w-1.5 rounded-full', t.accentDot)} />}
              {env.name}
            </span>
          ))}
        </div>
        <span className={clsx('flex items-center gap-1.5 font-mono text-[11px]', t.muted)}>
          <FiFolder aria-hidden="true" className="h-3 w-3" />
          <span>/</span>
          <span className={t.body}>backend</span>
          <span>/</span>
        </span>
      </div>

      {/* Table — the three rows are the type legend */}
      <div className={clsx(rowGrid, 'py-1.5', eyebrow, t.faint)}>
        <span>Key</span>
        <span>Value</span>
        <span>Type</span>
        <span />
      </div>
      <div className={clsx('divide-y border-t', t.rule, t.divide)}>
        {/* config — visible */}
        <div className={clsx(rowGrid, 'py-2 font-mono text-[11px]')}>
          <span className={clsx('flex items-center gap-2', t.ink)}>
            <FaCog aria-hidden="true" className={clsx('h-3 w-3 shrink-0', t.glyph.config)} />
            DATABASE_PORT
          </span>
          <span className={t.body}>5432</span>
          <span className={t.muted}>config</span>
          <span className={clsx('text-[10px]', t.faint)}>always visible</span>
        </div>
        {/* secret — masked, revealed here */}
        <div className={clsx(rowGrid, 'py-2 font-mono text-[11px]')}>
          <span className={clsx('flex items-center gap-2', t.ink)}>
            <FaKey aria-hidden="true" className={clsx('h-3 w-3 shrink-0', t.glyph.secret)} />
            DATABASE_HOST
          </span>
          <span className={clsx('flex items-center gap-2', t.body)}>
            db.internal
            <FiEye aria-hidden="true" className={clsx('h-3 w-3 shrink-0', t.ok.text)} />
          </span>
          <span className={t.muted}>secret</span>
          <span className={clsx('text-[10px]', t.faint)}>masked · reveal with access</span>
        </div>
        {/* sealed — never revealed */}
        <div className={clsx(rowGrid, 'py-2 font-mono text-[11px]')}>
          <span className={clsx('flex items-center gap-2', t.ink)}>
            <FaLock aria-hidden="true" className={clsx('h-3 w-3 shrink-0', t.glyph.sealed)} />
            DATABASE_PASSWORD
          </span>
          <span className={clsx('tracking-[0.1em]', t.sealedMask)}>*********</span>
          <span className={t.muted}>sealed</span>
          <span className={clsx('text-[10px]', t.faint)}>write-only · injected at runtime</span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const ACCESS_SPANS = Array.from({ length: 6 }, () => 'col-span-1')
const agentIcon = clsx('h-3.5 w-3.5 shrink-0', t.iconTone)

export function PhaseAtAGlance() {
  return (
    <div className="not-prose mb-16 mt-8 overflow-x-auto xl:max-w-none">
      <div
        translate="no"
        className={clsx(
          'w-full min-w-[1000px] border px-10 pb-8 pt-8 font-sans antialiased',
          t.sheet,
          t.frameBorder
        )}
      >
        {/* ------------------------------ Access ------------------------------ */}
        <div>
          <BandLabel hue="sky">Access</BandLabel>

          {/* Lifecycle axis: develop → build → deploy → run */}
          <div className="relative mt-3 grid grid-cols-6">
            {[
              { label: 'Develop', span: 'col-span-2' },
              { label: 'Build', span: 'col-span-2' },
              { label: 'Deploy', span: 'col-span-1' },
              { label: 'Run', span: 'col-span-1' },
            ].map((s) => (
              <span key={s.label} className={clsx(eyebrow, t.muted, s.span, 'pb-1.5')}>
                {s.label}
              </span>
            ))}
            <div className="relative col-span-6">
              <div className={clsx('h-px w-full', t.line)} />
              <span
                aria-hidden="true"
                className={clsx(
                  'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 font-mono text-[9px] leading-none',
                  t.muted
                )}
              >
                ▶
              </span>
            </div>
          </div>
          <Drops cols={6} spans={ACCESS_SPANS} className="h-4" />

          <div className="grid grid-cols-6 gap-x-3">
            <Cell hue="sky" title="AI agents" href="/integrations/agents/claude-code" sub="real API keys never enter the context window">
              <span className="flex items-center gap-2.5">
                <ClaudeIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#D97757]" />
                <SiOpenai aria-hidden="true" className={agentIcon} />
                <CursorIcon aria-hidden="true" className={agentIcon} />
                <OpenCodeIcon aria-hidden="true" className={agentIcon} />
                <SiGithubcopilot aria-hidden="true" className={agentIcon} />
              </span>
              <span className={clsx('w-full font-mono text-[10px]', t.muted)}>skill · phase-cli</span>
            </Cell>
            <Cell hue="sky" title="CLI" href="/cli" sub="injected as env vars">
              <SiGnometerminal aria-hidden="true" className={agentIcon} />
              <span className={clsx('w-full whitespace-nowrap font-mono text-[10px]', t.body)}>
                <span className={t.prompt}>❯</span> phase run <span className={t.faint}>npm start</span>
              </span>
              <span className={clsx('w-full font-mono text-[10px]', t.muted)}>
                <span className={t.prompt}>❯</span> phase secrets list
              </span>
            </Cell>
            <Cell hue="sky" title="SDK · API" href="/sdks" sub="read & write from your app">
              <Mark Icon={SiNodedotjs} label="Node" />
              <Mark Icon={SiPython} label="Python" />
              <Mark Icon={SiGo} label="Go" />
              <span className={clsx('w-full font-mono text-[10px]', t.muted)}>REST API</span>
            </Cell>
            <Cell hue="sky" title="CI" href="/integrations/platforms/github-actions" sub="secrets in the pipeline">
              <Mark Icon={SiGithubactions} label="GitHub Actions" />
              <Mark Icon={SiGitlab} label="GitLab CI" />
              <Mark Icon={SiJenkins} label="Jenkins" />
            </Cell>
            <Cell hue="sky" title="Terraform" href="/integrations/platforms/hashicorp-terraform" sub="provision infra · plan / apply">
              <Mark Icon={SiTerraform} label="provider" />
              <span className={clsx('w-full font-mono text-[10px]', t.muted)}>
                phase_secret · phase_secrets
              </span>
              <span className={clsx('w-full font-mono text-[10px]', t.muted)}>
                plan <span className={t.ok.text}>+2</span> <span className={t.warn.text}>~1</span>
              </span>
            </Cell>
            <Cell hue="sky" title="Kubernetes" href="/integrations/platforms/kubernetes" sub="production · auto-redeploy">
              <Mark Icon={SiKubernetes} label="operator" />
              <span className={clsx('w-full font-mono text-[10px]', t.muted)}>native Secrets</span>
              <Status level="ok" className="w-full">
                pods 3/3 ready
              </Status>
            </Cell>
          </div>

          {/* Every access surface drops a trace into the store */}
          <Drops cols={6} spans={ACCESS_SPANS} className="h-10" />
        </div>

        {/* ------------------------------- Store ------------------------------- */}
        <div className="relative -mt-10">
          <div className="absolute left-0 top-3">
            <BandLabel hue="emerald">Store</BandLabel>
          </div>
          <div className="pt-10">
            <StoreFrame />
          </div>
        </div>

        {/* Traces from the store into the automate cells */}
        <div className="relative">
          <Drops cols={12} spans={['col-span-3', 'col-span-3', 'col-span-6']} className="h-12" />
          <div className="absolute bottom-3 left-0">
            <BandLabel hue="violet">Automate</BandLabel>
          </div>
        </div>

        {/* ----------------------------- Automate ------------------------------ */}
        <div className="grid grid-cols-12 gap-x-4">
          <Cell hue="violet" className="col-span-3" title="Rotation" href="/console/rotating-secrets" sub="on a schedule · zero downtime">
            <Mark Icon={SiOpenai} label="OpenAI" />
            <Mark text="LiteLLM" />
            <Mark Icon={SiAmazonwebservices} label="AWS" />
            <Mark Icon={SiPostgresql} label="Postgres" />
            <Mark Icon={SiMicrosoftazure} label="Azure" />
            <span className="flex w-full flex-col gap-1 pt-0.5">
              <Status level="ok">v42 · active secret</Status>
              <Status level="warn">v41 · expiring in 6h</Status>
            </span>
          </Cell>
          <Cell hue="violet" className="col-span-3" title="Dynamic secrets" href="/console/dynamic-secrets" sub="short-lived · leased with a TTL">
            <Mark Icon={SiAmazoniam} label="AWS IAM" />
            <Mark Icon={SiPostgresql} label="Postgres" />
            <Mark Icon={SiMicrosoftazure} label="Azure" />
            <span className="flex w-full flex-col gap-1 pt-0.5">
              <Status level="ok">active · expires in 54m</Status>
              <Status level="warn">expiring · 3m</Status>
              <Status level="bad">revoked</Status>
            </span>
          </Cell>
          <Cell
            hue="violet"
            className="col-span-6"
            title="Syncs" href="/integrations"
            status={<Status level="ok">synced 12s ago</Status>}
            sub="automated secret deployment"
          >
            <Mark Icon={SiAmazonwebservices} label="Secrets Manager" />
            <Mark Icon={SiGooglecloud} label="Secret Manager" />
            <Mark Icon={SiMicrosoftazure} label="Key Vault" />
            <Mark Icon={SiGithub} label="Actions" />
            <Mark Icon={SiGitlab} label="CI" />
            <Mark Icon={SiVercel} label="Vercel" />
            <Mark Icon={SiCloudflareworkers} label="Workers" />
            <Mark Icon={SiCloudflarepages} label="Pages" />
            <Mark Icon={SiRender} label="Render" />
            <Mark Icon={SiRailway} label="Railway" />
            <Mark Icon={SiKubernetes} label="Kubernetes" />
            <Mark Icon={SiNomad} label="Nomad" />
            <Mark Icon={SiDependabot} label="Dependabot" />
          </Cell>
        </div>

        {/* -------------------------- Control & monitor ------------------------ */}
        <div className="pt-6">
          <div className={clsx('h-px w-full', t.lineSoft)} aria-hidden="true" />
          <div className="pt-4">
            <BandLabel hue="amber">Control &amp; monitor</BandLabel>
          </div>
          <div className="mt-3 grid grid-cols-12 gap-x-4">
            <Cell hue="amber" className="col-span-4" title="Authentication" href="/access-control/authentication">
              <span className={clsx('flex w-full flex-wrap items-center gap-x-3 font-mono text-[10px]', t.muted)}>
                <span className={t.faint}>humans</span>
                <span className={t.body}>OAuth</span>
                <Mark Icon={SiOkta} label="OIDC SSO" />
                <span className={t.body}>SCIM provisioning</span>
              </span>
              <span className={clsx('flex w-full items-center gap-x-3 font-mono text-[10px]', t.muted)}>
                <span className={t.faint}>workloads</span>
                <Mark Icon={SiMicrosoftazure} label="Entra ID" />
                <Mark Icon={SiAmazoniam} label="AWS IAM" />
              </span>
            </Cell>
            <Cell hue="amber" className="col-span-4" title="Network access policies" href="/access-control/network">
              <span className="flex w-full flex-wrap items-center gap-1.5">
                <IpChip range>
                  <TailscaleMark className="mr-1 h-2.5 w-2.5" />
                  100.64.0.0/10 · tailnet
                </IpChip>
                <IpChip range>203.0.113.0/24</IpChip>
                <IpChip>198.51.100.42</IpChip>
              </span>
            </Cell>
            <Cell hue="amber" className="col-span-4" title="Audit logs" href="/console/apps#logs">
              <span className={clsx('flex w-full flex-col gap-1 font-mono text-[10px]', t.muted)}>
                <span>
                  <span className={t.body}>update</span> DATABASE_HOST · rohan · 2m ago
                </span>
                <span>
                  <span className={t.body}>lease</span> aws-iam · claude-code · 12s ago
                </span>
              </span>
              <span className={clsx('flex w-full items-center gap-1.5 font-mono text-[10px]', t.muted)}>
                stream to external systems
                <SiDatadog aria-hidden="true" className={agentIcon} />
                <span className={t.body}>Datadog</span>
              </span>
            </Cell>
          </div>
        </div>

      </div>
    </div>
  )
}
