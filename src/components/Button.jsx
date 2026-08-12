import Link from 'next/link'
import clsx from 'clsx'

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  )
}

// The emerald CTA pill is identical in both modes (no dark: variants needed).
const emeraldPill =
  'gap-2 whitespace-nowrap rounded-full bg-emerald-500 px-4 py-2 text-[13px] font-medium text-zinc-950 hover:bg-emerald-400 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400'

const variantStyles = {
  primary: emeraldPill,
  filled: emeraldPill,
  secondary:
    'gap-2 whitespace-nowrap rounded-full bg-zinc-100 px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline focus-visible:outline-1 focus-visible:outline-zinc-400 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
  outline:
    'gap-2 whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-zinc-600 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 hover:ring-zinc-400 focus-visible:outline focus-visible:outline-1 focus-visible:outline-zinc-400 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-100 dark:hover:ring-zinc-500',
  text: 'gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-600 hover:text-emerald-700 focus-visible:outline focus-visible:outline-1 focus-visible:outline-zinc-400 dark:text-emerald-400 dark:hover:text-emerald-300',
}

export function Button({
  variant = 'primary',
  className,
  children,
  arrow,
  ...props
}) {
  let Component = props.href ? Link : 'button'

  className = clsx(
    'group inline-flex w-fit items-center justify-center transition-colors duration-150',
    variantStyles[variant],
    className
  )

  let arrowIcon = (
    <ArrowIcon
      className={clsx(
        'shrink-0 transition-transform duration-150',
        variant === 'text' ? 'size-2.5' : 'size-3',
        arrow === 'left'
          ? 'rotate-180 group-hover:-translate-x-1'
          : 'group-hover:translate-x-1'
      )}
    />
  )

  return (
    <Component className={className} {...props}>
      {arrow === 'left' && arrowIcon}
      {children}
      {arrow === 'right' && arrowIcon}
    </Component>
  )
}
