import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">The page you requested does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-medium text-white">
        Back home
      </Link>
    </div>
  )
}
