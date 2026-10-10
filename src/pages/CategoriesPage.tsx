import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { Spinner } from '../components/common/Spinner'
import { getApiError } from '../lib/http'
import { categoryService } from '../services/category.service'
import type { Category } from '../types/api'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    setError('')
    categoryService
      .list({ limit: 50 })
      .then((res) => setCategories(res.data.data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <Spinner label="Loading categories..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat._id}`}
            className="overflow-hidden rounded-2xl border border-line text-center transition hover:shadow-md"
          >
            <img src={cat.image} alt={cat.name} className="h-44 w-full object-cover" />
            <h2 className="p-4 font-semibold">{cat.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
