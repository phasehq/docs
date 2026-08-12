import { GridPattern } from '@/components/GridPattern'

// Section-index hero ground: a quiet emerald radial wash with the blueprint
// spec-sheet rulers over it, in both modes. Spans the FULL page width: the
// content wrapper in Layout.jsx is deliberately not `relative`, so this
// absolute layer resolves against the initial containing block (inset-x-0 =
// viewport edge to edge, behind the opaque sidebar). Masked out by ~18rem;
// !max-w-none escapes the prose `> *` width cap.
export function HeroPattern() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 !mx-0 !max-w-none overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgb(16_185_129/0.10),transparent_70%)] dark:bg-[radial-gradient(120%_100%_at_50%_0%,rgb(52_211_153/0.18),rgb(16_185_129/0.06)_45%,transparent_75%)]" />
      {/* Spec-sheet rulers: minor pitch under the major grid, kept faint. */}
      <GridPattern
        width={18}
        height={14}
        x="50%"
        y="0"
        className="absolute inset-0 h-full w-full fill-none stroke-emerald-700/5 dark:stroke-emerald-400/5"
      />
      <GridPattern
        width={72}
        height={56}
        x="50%"
        y="0"
        className="absolute inset-0 h-full w-full fill-none stroke-emerald-700/15 dark:stroke-emerald-400/10"
      />
    </div>
  )
}
