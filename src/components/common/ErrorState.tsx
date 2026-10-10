export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-dark"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
