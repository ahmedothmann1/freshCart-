import { api } from '../lib/http'
import type { Paginated, Product, ProductQuery, Review } from '../types/api'

export const productService = {
  list(params?: ProductQuery) {
    return api.get<Paginated<Product>>('/api/v1/products', { params })
  },
  get(id: string) {
    return api.get<{ data: Product }>(`/api/v1/products/${id}`)
  },
  reviews(productId: string) {
    return api.get<Paginated<Review>>(`/api/v1/products/${productId}/reviews`)
  },
  createReview(productId: string, body: { review: string; rating: number }) {
    return api.post(`/api/v1/products/${productId}/reviews`, body)
  },
}
