import clsx from 'clsx'

const variantStyles = {
  medium: 'px-1.5 ring-1 ring-inset',
}

const colorStyles = {
  emerald: {
    small: 'text-emerald-600 dark:text-emerald-400',
    medium:
      'ring-emerald-600/40 text-emerald-600 dark:ring-emerald-400/40 dark:text-emerald-400',
  },
  sky: {
    small: 'text-sky-600 dark:text-sky-400',
    medium: 'ring-sky-600/40 text-sky-600 dark:ring-sky-400/40 dark:text-sky-400',
  },
  amber: {
    small: 'text-amber-600 dark:text-amber-400',
    medium:
      'ring-amber-600/40 text-amber-600 dark:ring-amber-400/40 dark:text-amber-400',
  },
  rose: {
    small: 'text-rose-600 dark:text-rose-400',
    medium:
      'ring-rose-600/40 text-rose-600 dark:ring-rose-400/40 dark:text-rose-400',
  },
  zinc: {
    small: 'text-zinc-500',
    medium: 'ring-zinc-300 text-zinc-500 dark:ring-zinc-700 dark:text-zinc-400',
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
