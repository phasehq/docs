import { isValidElement } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { Heading } from '@/components/Heading'
import ZoomableImage from './ZoomableImage'
export { SkillBox } from '@/components/SkillBox'

export const a = Link
export { Button } from '@/components/Button'
export { CodeGroup, Code as code, Pre as pre } from '@/components/Code'
export { TabGroup, TabPanel } from '@/components/TabGroup'
export { Diagram } from '@/components/Diagram'

export const h2 = function H2(props) {
  return <Heading level={2} {...props} />
}

export const h3 = function H3(props) {
  return <Heading level={3} {...props} />
}

export const h4 = function H4(props) {
  return <Heading level={4} {...props} />
}

export function Note({ children }) {
  return (
    <div className="my-6 border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
        Note
      </div>
      <div className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Warning({ children }) {
  return (
    <div className="my-6 border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 dark:text-amber-400">
        Warning
      </div>
      <div className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Row({ children }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  )
}

export function Col({ children, sticky = false }) {
  return (
    <div
      className={clsx(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24'
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        className="m-0 max-w-[calc(theme(maxWidth.xl)-theme(spacing.8))] list-none divide-y divide-zinc-200 p-0 dark:divide-zinc-800"
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({ name, type, children }) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        <dt className="sr-only">Type</dt>
        <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          {type}
        </dd>
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}

export function MathSymbol({ children }) {
  return (<span className="font-serif font-semibold italic">{children}</span>)
}

export const img = function Img(props) {
  return <ZoomableImage {...props} width={props.width || 800} height={props.height || 600} />
}

export const p = function P({ children, ...rest }) {
  const arr = Array.isArray(children) ? children : [children]
  const meaningful = arr.filter(
    (c) => !(typeof c === 'string' && c.trim() === '')
  )
  if (
    meaningful.length === 1 &&
    isValidElement(meaningful[0]) &&
    meaningful[0].type === img
  ) {
    return meaningful[0]
  }
  return <p {...rest}>{children}</p>
}

