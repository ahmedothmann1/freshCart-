export function Spinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 py-16 text-muted">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-brand" />
      <p>{label}</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-line">
      <div className="aspect-square bg-slate-100" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-4 w-1/4 rounded bg-slate-100" />
      </div>
    </div>
  )
}
