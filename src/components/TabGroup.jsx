import {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { create } from 'zustand'
import React from 'react'
import { Prose } from '@/components/Prose'

function getPanelTitle({ title, slug }) {
  return title ?? slug ?? 'Tab'
}

function TabGroupHeader({ children, selectedIndex }) {
  let hasTabs = Children.count(children) > 1

  if (!hasTabs) {
    return null
  }

  return (
    <div className="flex min-h-[calc(theme(spacing.12)+1px)] flex-col gap-y-2 py-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-4 sm:gap-y-0">
      {hasTabs && (
        <Tab.List className="-mb-3 flex w-full gap-3 overflow-x-auto border-b border-zinc-200 text-xs font-medium dark:border-zinc-700 sm:-mb-px sm:gap-4">
          {Children.map(children, (child, childIndex) => {
            const { title, slug, icon: Icon } = child.props
            return (
              <Tab
                key={slug || childIndex}
                className={clsx(
                  'border-b py-3 transition focus:[&:not(:focus-visible)]:outline-none',
                  'flex items-center gap-2 whitespace-nowrap',
                  childIndex === selectedIndex
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300'
                )}
              >
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                {getPanelTitle({ title, slug })}
              </Tab>
            )
          })}
        </Tab.List>
      )}
    </div>
  )
}

function TabGroupPanel({ children }) {
  return (
    <div className="py-6" as="article">
      {children}
    </div>
  )
}

function TabGroupPanels({ children }) {
  let hasTabs = Children.count(children) > 1

  if (hasTabs) {
    return (
      <Tab.Panels>
        {Children.map(children, (child) => (
          <Tab.Panel key={child.props.slug || child.key}>
            <TabGroupPanel>{child}</TabGroupPanel>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    )
  }

  return <TabGroupPanel>{children}</TabGroupPanel>
}

function usePreventLayoutShift() {
  let positionRef = useRef()
  let rafRef = useRef()

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return {
    positionRef,
    preventLayoutShift(callback) {
      let initialTop = positionRef.current.getBoundingClientRect().top

      callback()

      rafRef.current = window.requestAnimationFrame(() => {
        let newTop = positionRef.current.getBoundingClientRect().top
        window.scrollBy(0, newTop - initialTop)
      })
    },
  }
}

const usePreferredTabStore = create((set) => ({
  preferredTabs: {},
  setPreferredTab: (groupSlug, tabSlug) =>
    set((state) => ({
      preferredTabs: {
        ...state.preferredTabs,
        [groupSlug]: tabSlug,
      },
    })),
}))

function useTabGroupProps(availableTabSlugs, groupSlug) {
  const router = useRouter()
  const { preferredTabs, setPreferredTab } = usePreferredTabStore()
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Get tab from URL query string
  const urlTab = router.query.tab

  // Determine the active tab based on URL query, preferred tab, or default
  let activeTab = null
  if (urlTab && availableTabSlugs.includes(urlTab)) {
    activeTab = urlTab
  } else if (
    preferredTabs[groupSlug] &&
    availableTabSlugs.includes(preferredTabs[groupSlug])
  ) {
    activeTab = preferredTabs[groupSlug]
  } else {
    activeTab = availableTabSlugs[0]
  }

  const tabIndex = availableTabSlugs.indexOf(activeTab)
  const newSelectedIndex = tabIndex === -1 ? 0 : tabIndex

  if (newSelectedIndex !== selectedIndex) {
    setSelectedIndex(newSelectedIndex)
  }

  const { positionRef, preventLayoutShift } = usePreventLayoutShift()

  return {
    as: 'div',
    ref: positionRef,
    selectedIndex,
    onChange: (newSelectedIndex) => {
      preventLayoutShift(() => {
        const newTabSlug = availableTabSlugs[newSelectedIndex]
        setPreferredTab(groupSlug, newTabSlug)

        const newQuery = { ...router.query, tab: newTabSlug }
        const newUrl = `${router.pathname}?tab=${newTabSlug}${window.location.hash}`

        router
          .push(
            {
              pathname: router.pathname,
              query: newQuery,
            },
            newUrl,
            { shallow: true }
          )
          .then(() => {
            // Defer to next tick to ensure DOM is ready
            if (window.location.hash) {
              const id = window.location.hash.substring(1)
              const el = document.getElementById(id)
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' }) // Or { block: 'start' } if you prefer
              }
            }
          })
      })
    },
  }
}

const TabGroupContext = createContext(false)

export function TabGroup({ children, slug, ...props }) {
  const tabSlugs = Children.map(
    children,
    (child) =>
      child.props.slug ||
      child.props.title ||
      `tab-${Children.toArray(children).indexOf(child)}`
  )
  const groupSlug = slug || 'tab-group'
  const tabGroupProps = useTabGroupProps(tabSlugs, groupSlug)
  const hasTabs = Children.count(children) > 1
  const Container = hasTabs ? Tab.Group : 'div'
  const containerProps = hasTabs ? tabGroupProps : {}
  const headerProps = hasTabs
    ? { selectedIndex: tabGroupProps.selectedIndex }
    : {}

  return (
    <TabGroupContext.Provider value={true}>
      <Container
        {...containerProps}
        className="my-6 overflow-hidden"
      >
        <TabGroupHeader {...headerProps}>{children}</TabGroupHeader>
        <TabGroupPanels {...props}>{children}</TabGroupPanels>
      </Container>
    </TabGroupContext.Provider>
  )
}

export function TabPanel({ children, slug, subtitle, icon, ...props }) {
  const isGrouped = useContext(TabGroupContext)

  if (isGrouped) {
    return children
  }

  // If not grouped, render as a standalone section
  return (
    <div className="overflow-hidden">
      <Prose className="max-w-none p-6" as="article">
        {children}
      </Prose>
    </div>
  )
}
