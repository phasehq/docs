import clsx from 'clsx'

// medium = the API method badge: a flat variant-tinted fill, no border.
const variantStyles = {
  medium: 'px-1.5',
}

const colorStyles = {
  emerald: {
    small: 'text-emerald-600 dark:text-emerald-400',
    medium:
      'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  },
  sky: {
    small: 'text-sky-600 dark:text-sky-400',
    medium: 'bg-sky-500/15 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300',
  },
  amber: {
    small: 'text-amber-600 dark:text-amber-400',
    medium:
      'bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  },
  rose: {
    small: 'text-rose-600 dark:text-rose-400',
    medium:
      'bg-rose-500/15 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
  },
  zinc: {
    small: 'text-zinc-500',
    medium:
      'bg-zinc-500/15 text-zinc-600 dark:bg-zinc-400/15 dark:text-zinc-300',
  },
}

const valueColorMap = {
  get: 'emerald',
  post: 'sky',
  put: 'amber',
  delete: 'rose',
  encrypted: 'emerald',
  public: 'emerald',
  secret: 'rose',
}

export function Tag({
  children,
  variant = 'medium',
  color = valueColorMap[children.toLowerCase()] ?? 'emerald',
}) {
  return (
    <span
      className={clsx(
        'font-mono text-2xs font-medium uppercase leading-6 tracking-[0.1em]',
        variantStyles[variant],
        colorStyles[color][variant]
      )}
    >
      {children}
    </span>
  )
}
