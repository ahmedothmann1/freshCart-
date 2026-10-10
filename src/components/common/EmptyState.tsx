import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function EmptyState({
  title,
  message,
  actionLabel = 'Continue shopping',
  actionTo = '/products',
  icon,
}: {
  title: string
  message: string
  actionLabel?: string
  actionTo?: string
  icon?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      {icon}
      <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted">{message}</p>
      <Link
        to={actionTo}
        className="mt-6 inline-flex rounded-lg bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-dark"
      >
        {actionLabel}
      </Link>
    </div>
  )
}
