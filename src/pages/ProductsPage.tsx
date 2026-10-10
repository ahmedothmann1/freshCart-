import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { ProductCard } from '../components/product/ProductCard'
import { SkeletonCard } from '../components/common/Spinner'
import { getApiError } from '../lib/http'
import { brandService } from '../services/brand.service'
import { categoryService } from '../services/category.service'
import { productService } from '../services/product.service'
import type { Brand, Category, Product } from '../types/api'

export function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const query = useMemo(
    () => ({
      keyword: params.get('keyword') ?? '',
      category: params.get('category') ?? '',
      brand: params.get('brand') ?? '',
      sort: params.get('sort') ?? '',
      page: Number(params.get('page') || 1),
      min: params.get('min') ?? '',
      max: params.get('max') ?? '',
    }),
    [params],
  )

  useEffect(() => {
    Promise.all([categoryService.list({ limit: 50 }), brandService.list({ limit: 50 })])
      .then(([c, b]) => {
        setCategories(c.data.data)
        setBrands(b.data.data)
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')
    productService
      .list({
        limit: 12,
        page: query.page,
        keyword: query.keyword || undefined,
        brand: query.brand || undefined,
        sort: query.sort || undefined,
        'category[in]': query.category || undefined,
        'price[gte]': query.min ? Number(query.min) : undefined,
        'price[lte]': query.max ? Number(query.max) : undefined,
      })
      .then((res) => {
        setProducts(res.data.data)
        setPages(res.data.metadata?.numberOfPages || 1)
      })
      .catch((err) => setError(getApiError(err, 'Could not load products')))
      .finally(() => setLoading(false))
  }, [query])

  function update(next: Record<string, string>) {
    const merged = new URLSearchParams(params)
    Object.entries(next).forEach(([key, value]) => {
      if (value) merged.set(key, value)
      else merged.delete(key)
    })
    if (!('page' in next)) merged.set('page', '1')
    setParams(merged)
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold">Shop</h1>
      <p className="mt-1 text-muted">Browse products from the Route catalog.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="h-fit space-y-6 rounded-2xl border border-line p-4">
          <label className="block text-sm font-medium">
            Search
            <input
              value={query.keyword}
              onChange={(e) => update({ keyword: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
              placeholder="Product name"
            />
          </label>
          <label className="block text-sm font-medium">
            Category
            <select
              value={query.category}
              onChange={(e) => update({ category: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Brand
            <select
              value={query.brand}
              onChange={(e) => update({ brand: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            >
              <option value="">All</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Sort
            <select
              value={query.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            >
              <option value="">Default</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
              <option value="-ratingsAverage">Top rated</option>
              <option value="-sold">Best selling</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={query.min}
              onChange={(e) => update({ min: e.target.value })}
              className="rounded-lg border border-line px-3 py-2"
            />
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={query.max}
              onChange={(e) => update({ max: e.target.value })}
              className="rounded-lg border border-line px-3 py-2"
            />
          </div>
        </aside>

        <div>
          {error ? <ErrorState message={error} onRetry={() => update({ page: String(query.page) })} /> : null}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState title="No products found" message="Try a different search or filter." />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => update({ page: String(page) })}
                    className={`h-9 min-w-9 rounded-lg px-3 ${
                      page === query.page ? 'bg-brand text-white' : 'border border-line'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
