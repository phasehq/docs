// Flat swiss hairline cell. `pattern` is accepted-and-ignored so legacy
// consumers (which passed spotlight grid coordinates) compile untouched.
export function Card({ index, pattern, children }) {
  return (
    <div className="group relative flex flex-col border border-zinc-200 bg-white p-5 transition-colors duration-150 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-925 dark:hover:bg-zinc-900/40">
      {index && (
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
          {index}
        </div>
      )}
      {children}
    </div>
  )
}
