'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

let mermaidInitialized = false

export function Diagram({ children, caption }) {
  const containerRef = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Detect initial theme
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }

    checkDarkMode()

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isClient || !containerRef.current) return

    const initializeMermaid = async () => {
      try {
        // Configure Mermaid based on theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            background: 'transparent',
            primaryColor: '#B3EFBD',
            primaryTextColor: isDark ? '#e4e4e7' : '#18181b',
            primaryBorderColor: '#A8DAFF',
            lineColor: isDark ? '#71717a' : '#52525b',
            secondaryColor: '#A8DAFF',
            tertiaryColor: isDark ? '#27272a' : '#f4f4f5',
            noteBkgColor: isDark ? '#27272a' : '#fafafa',
            noteTextColor: isDark ? '#e4e4e7' : '#18181b',
            noteBorderColor: isDark ? '#52525b' : '#d4d4d8',
            actorTextColor: isDark ? '#18181b' : '#18181b',
            actorLineColor: '#66D575',
            signalColor: isDark ? '#e4e4e7' : '#18181b',
            signalTextColor: isDark ? '#e4e4e7' : '#18181b',
            labelBoxBkgColor: '#A8DAFF',
            labelBoxBorderColor: '#A8DAFF',
            labelTextColor: '#18181b',
            loopTextColor: isDark ? '#e4e4e7' : '#18181b',
            activationBorderColor: '#A8DAFF',
            activationBkgColor: isDark ? '#3f3f46' : '#e4e4e7',
            sequenceNumberColor: isDark ? '#18181b' : '#fafafa',
          },
          sequence: {
            actorFontSize: 14,
            actorFontWeight: 600,
            noteFontSize: 13,
            messageFontSize: 13,
            diagramMarginX: 20,
            diagramMarginY: 20,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
          },
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        })

        mermaidInitialized = true

        // Generate unique ID
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Clear previous content
        containerRef.current.innerHTML = ''

        // Render diagram
        const { svg } = await mermaid.render(id, children.trim())
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          
          // Make SVG responsive
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
          }
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500 text-sm p-4">Error rendering diagram: ${error.message}</div>`
        }
      }
    }

    initializeMermaid()
  }, [children, isClient, isDark])

  if (!isClient) {
    return (
      <div className="my-6 flex items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="text-sm text-zinc-500">Loading diagram...</div>
      </div>
    )
  }

  return (
    <figure className="not-prose my-8">
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-transparent p-6 dark:border-zinc-800">
        <div ref={containerRef} className="flex justify-center" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
