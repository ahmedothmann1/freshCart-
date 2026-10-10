import { api } from '../lib/http'
import type { Brand, Paginated } from '../types/api'

export const brandService = {
  list(params?: { limit?: number; keyword?: string }) {
    return api.get<Paginated<Brand>>('/api/v1/brands', { params })
  },
  get(id: string) {
    return api.get<{ data: Brand }>(`/api/v1/brands/${id}`)
  },
}
