import { api } from '../lib/http'
import type { Product } from '../types/api'

export const wishlistService = {
  get() {
    return api.get<{ data: Product[]; count?: number }>('/api/v1/wishlist')
  },
  add(productId: string) {
    return api.post<{ message: string; data: string[] }>('/api/v1/wishlist', { productId })
  },
  remove(productId: string) {
    return api.delete<{ message: string; data: string[] }>(`/api/v1/wishlist/${productId}`)
  },
}
