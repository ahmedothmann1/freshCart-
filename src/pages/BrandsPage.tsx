import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { Spinner } from '../components/common/Spinner'
import { getApiError } from '../lib/http'
import { brandService } from '../services/brand.service'
import type { Brand } from '../types/api'

export function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    setError('')
    brandService
      .list({ limit: 50 })
      .then((res) => setBrands(res.data.data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <Spinner label="Loading brands..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold">Brands</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            to={`/products?brand=${brand._id}`}
            className="rounded-2xl border border-line p-4 text-center transition hover:shadow-md"
          >
            <img src={brand.image} alt={brand.name} className="mx-auto h-24 object-contain" />
            <h2 className="mt-3 font-medium">{brand.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
