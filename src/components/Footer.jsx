import { forwardRef, Fragment, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Transition } from '@headlessui/react'

import { navigation } from '@/components/Navigation'

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

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="10" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.75 10.813 2.438 2.437c1.218-4.469 4.062-6.5 4.062-6.5"
      />
    </svg>
  )
}

function FeedbackButton(props) {
  return (
    <button
      type="submit"
      className="px-3 font-mono text-xs uppercase tracking-[0.08em] text-zinc-600 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-100"
      {...props}
    />
  )
}

function PencilIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  )
}

const FeedbackForm = forwardRef(function FeedbackForm({ onSubmit }, ref) {
  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className="absolute inset-0 flex items-center justify-center gap-6 md:justify-start"
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Was this page helpful?
      </p>
      <div className="group grid h-8 grid-cols-[1fr,1px,1fr] overflow-hidden rounded-full border border-zinc-300 dark:border-zinc-700">
        <FeedbackButton data-response="yes">Yes</FeedbackButton>
        <div className="bg-zinc-300 dark:bg-zinc-700" />
        <FeedbackButton data-response="no">No</FeedbackButton>
      </div>
    </form>
  )
})

const FeedbackThanks = forwardRef(function FeedbackThanks({ onCommentSubmit }, ref) {
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onCommentSubmit(comment)
    setComment('')
  }

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col items-start justify-center md:justify-start"
    >
      <div className="flex items-center gap-3 rounded-full bg-emerald-500/10 py-1 pl-1.5 pr-3 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-500/30 dark:text-emerald-300">
        <CheckIcon className="h-5 w-5 flex-none fill-emerald-500 stroke-white dark:fill-emerald-500/20 dark:stroke-emerald-300" />
        Thanks for your feedback!
      </div>
      <form onSubmit={handleSubmit} className="mt-4 w-full max-w-md">
        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Mind telling us more?"
            className="h-24 w-full rounded-none border border-zinc-200 bg-white px-3 py-2 pr-24 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-925 dark:text-zinc-100 dark:focus:border-zinc-600"
          />
          <button
            type="submit"
            className="absolute bottom-2 right-2 inline-flex h-7 items-center rounded-full px-3 font-mono text-xs uppercase tracking-[0.08em] text-zinc-600 ring-1 ring-inset ring-zinc-300 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-100"
          >
            Submit
          </button>
        </div>
      </form>
      <p className="mt-2 text-xs text-zinc-500">
        Your feedback will be read by the Phase team.
      </p>
    </div>
  )
})

function Feedback() {
  const [submitted, setSubmitted] = useState(false)
  const [feedbackResponse, setFeedbackResponse] = useState(null)
  const [commentSubmitted, setCommentSubmitted] = useState(false)
  const router = useRouter()

  const sendFeedback = async (feedback, comment = null) => {
    const metadata = {
      action: "User submitted feedback on Docs",
      url: window.location.href,
      userAgent: navigator.userAgent,
      feedbackHelpful: feedback === 'yes',
      comment,
    }

    try {
      const response = await fetch('https://docs.phase.dev/1f611df5-9d6b-4f49-aa58-31e2370f3f98/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) {
        throw new Error('Failed to send feedback')
      }
    } catch (error) {
      console.error('Error sending feedback:', error)
    }
  }

  function onSubmit(event) {
    event.preventDefault()
    const feedback = event.nativeEvent.submitter.dataset.response
    setFeedbackResponse(feedback)
    sendFeedback(feedback)
    setSubmitted(true)
  }

  function onCommentSubmit(comment) {
    sendFeedback(feedbackResponse, comment)
    setCommentSubmitted(true)
  }

  return (
    <div className="relative h-40">
      <Transition
        show={!submitted}
        as={Fragment}
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        leave="pointer-events-none duration-300"
      >
        <FeedbackForm onSubmit={onSubmit} />
      </Transition>
      <Transition
        show={submitted && !commentSubmitted}
        as={Fragment}
        enterFrom="opacity-0"
        enterTo="opacity-100"
        enter="delay-150 duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        leave="duration-300"
      >
        <FeedbackThanks onCommentSubmit={onCommentSubmit} />
      </Transition>
      <Transition
        show={commentSubmitted}
        as={Fragment}
        enterFrom="opacity-0"
        enterTo="opacity-100"
        enter="delay-150 duration-300"
      >
        <div className="absolute inset-0 flex items-center justify-center md:justify-start">
          <div className="flex items-center gap-3 rounded-full bg-emerald-500/10 py-1 pl-1.5 pr-3 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-500/30 dark:text-emerald-300">
            <CheckIcon className="h-5 w-5 flex-none fill-emerald-500 stroke-white dark:fill-emerald-500/20 dark:stroke-emerald-300" />
            Thanks for your feedback! Your comment has been submitted.
          </div>
        </div>
      </Transition>
    </div>
  )
}

function PageLink({ label, page, previous = false }) {
  return (
    <>
      <Link
        href={page.href}
        aria-label={`${label}: ${page.title}`}
        className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 transition-colors duration-150 hover:text-zinc-900 focus-visible:outline focus-visible:outline-1 focus-visible:outline-zinc-400 dark:hover:text-zinc-200"
      >
        {previous && <ArrowIcon className="h-4 w-4 rotate-180" />}
        {label}
        {!previous && <ArrowIcon className="h-4 w-4" />}
      </Link>
      <Link
        href={page.href}
        tabIndex={-1}
        aria-hidden="true"
        className="text-base font-medium text-zinc-900 transition-colors duration-150 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
      >
        {page.title}
      </Link>
    </>
  )
}

function PageNavigation() {
  let router = useRouter()
  let allPages = navigation.flatMap((group) => group.links)
  let currentPageIndex = allPages.findIndex(
    (page) => page.href === router.pathname
  )

  if (currentPageIndex === -1) {
    return null
  }

  let previousPage = allPages[currentPageIndex - 1]
  let nextPage = allPages[currentPageIndex + 1]

  if (!previousPage && !nextPage) {
    return null
  }

  return (
    <div className="flex">
      {previousPage && (
        <div className="flex flex-col items-start gap-3">
          <PageLink label="Previous" page={previousPage} previous />
        </div>
      )}
      {nextPage && (
        <div className="ml-auto flex flex-col items-end gap-3">
          <PageLink label="Next" page={nextPage} />
        </div>
      )}
    </div>
  )
}

function ProductHuntIcon(props) {
  return (
    <svg role="img" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z" />
    </svg>
  )
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function SlackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function LinkedInIcon(props) {
  return (
    <svg role="img" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <title>LinkedIn</title>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function SocialLink({ href, icon: Icon, children }) {
  return (
    <Link href={href} className="group">
      <span className="sr-only">{children}</span>
      <Icon className="h-3.5 w-3.5 fill-zinc-500 transition-colors duration-150 group-hover:fill-zinc-700 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

function SmallPrint() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-600">
        &copy; {new Date().getFullYear()} Phi Security Inc.
      </p>
      <div className="flex gap-4">
        <SocialLink href="https://github.com/phasehq/console" icon={GitHubIcon}>
          Star us on GitHub
        </SocialLink>
        <SocialLink href="https://slack.phase.dev" icon={SlackIcon}>
          Join our Slack Community
        </SocialLink>
        <SocialLink href="https://x.com/phasedotdev" icon={XIcon}>
          Follow us on X
        </SocialLink>
        <SocialLink
          href="https://www.linkedin.com/company/phasehq"
          icon={LinkedInIcon}
        >
          Follow us on LinkedIn
        </SocialLink>
        <SocialLink
          href="https://www.producthunt.com/products/phase-5"
          icon={ProductHuntIcon}
        >
          Review us on ProductHunt
        </SocialLink>
      </div>
    </div>
  )
}

export function Footer() {
  let router = useRouter()
  const editUrl = `https://github.com/phasehq/docs`

  return (
    <footer className="mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <Feedback key={router.pathname} />
      <PageNavigation />
      <div className="flex justify-left">
        <Link
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 transition-colors duration-150 hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          <PencilIcon className="h-3.5 w-3.5 stroke-current" />
          Edit this page
        </Link>
      </div>
      <SmallPrint />
    </footer>
  )
}
