import { GridPattern } from '@/components/GridPattern'

/* Section-index hero ground — background exploration. Flip VARIANT to
   compare candidates (all pure CSS, masked out by ~18rem, full page width):
     'gray-blueprint'  — the current wash + rulers, zinc instead of emerald
     'pegboard'        — dotted peg grid
     'static-veil'     — layered emerald pools, a still CSS read of DarkVeil
     'crosshair-sheet' — neutral drafting grid with registration marks
     'rule-bloom'      — single hairline under the header with an emerald bloom
     'plus-field'      — pegboard rhythm, drawn with '+' registration glyphs
*/
const VARIANT = 'gray-blueprint'

const CROSSES = [
  [288, 112],
  [648, 56],
  [1008, 168],
  [1368, 112],
  [504, 224],
  [864, 224],
]

export function HeroPattern() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 !mx-0 !max-w-none overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]"
    >
      {VARIANT === 'gray-blueprint' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgb(113_113_122/0.12),transparent_70%)] dark:bg-[radial-gradient(120%_100%_at_50%_0%,rgb(161_161_170/0.10),rgb(113_113_122/0.04)_45%,transparent_75%)]" />
          <GridPattern
            width={18}
            height={14}
            x="50%"
            y="0"
            className="absolute inset-0 h-full w-full fill-none stroke-zinc-500/10 dark:stroke-zinc-600/10"
          />
          <GridPattern
            width={72}
            height={56}
            x="50%"
            y="0"
            className="absolute inset-0 h-full w-full fill-none stroke-zinc-500/25 dark:stroke-zinc-600/25"
          />
        </>
      )}

      {VARIANT === 'pegboard' && (
        <div className="absolute inset-0 [background-image:radial-gradient(circle,rgb(9_9_11/0.16)_1px,transparent_1.5px)] [background-size:20px_20px] dark:[background-image:radial-gradient(circle,rgb(244_244_245/0.13)_1px,transparent_1.5px)]" />
      )}

      {VARIANT === 'static-veil' && (
        <div className="absolute inset-0 bg-[radial-gradient(45%_85%_at_15%_0%,rgb(16_185_129/0.10),transparent_70%),radial-gradient(55%_95%_at_60%_-10%,rgb(52_211_153/0.11),transparent_65%),radial-gradient(40%_70%_at_92%_5%,rgb(4_120_87/0.10),transparent_70%)] dark:bg-[radial-gradient(45%_85%_at_15%_0%,rgb(16_185_129/0.15),transparent_70%),radial-gradient(55%_95%_at_60%_-10%,rgb(52_211_153/0.17),transparent_65%),radial-gradient(40%_70%_at_92%_5%,rgb(4_120_87/0.14),transparent_70%)]" />
      )}

      {VARIANT === 'crosshair-sheet' && (
        <>
          <GridPattern
            width={72}
            height={56}
            x="50%"
            y="0"
            className="absolute inset-0 h-full w-full fill-none stroke-zinc-200 dark:stroke-zinc-800/80"
          />
          {CROSSES.map(([x, y]) => (
            <span
              key={`${x}-${y}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-sm leading-none text-zinc-300 dark:text-zinc-700"
              style={{ left: x, top: y }}
            >
              +
            </span>
          ))}
        </>
      )}

      {VARIANT === 'plus-field' && (
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full text-zinc-950/15 dark:text-zinc-100/10"
        >
          <defs>
            <pattern
              id="hero-plus-field"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
              x="50%"
            >
              <path
                d="M12 8.5v7M8.5 12h7"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-plus-field)" />
        </svg>
      )}

      {VARIANT === 'rule-bloom' && (
        <>
          <div className="absolute inset-x-0 top-14 h-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="absolute inset-x-0 top-14 h-56 bg-[linear-gradient(to_bottom,rgb(16_185_129/0.09),transparent)] dark:bg-[linear-gradient(to_bottom,rgb(52_211_153/0.11),transparent)]" />
        </>
      )}
    </div>
  )
}
