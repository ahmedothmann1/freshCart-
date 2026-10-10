import { api } from '../lib/http'
import type { Category, Paginated, Subcategory } from '../types/api'

export const categoryService = {
  list(params?: { limit?: number; page?: number; keyword?: string }) {
    return api.get<Paginated<Category>>('/api/v1/categories', { params })
  },
  get(id: string) {
    return api.get<{ data: Category }>(`/api/v1/categories/${id}`)
  },
  subcategories(id: string) {
    return api.get<Paginated<Subcategory>>(`/api/v1/categories/${id}/subcategories`)
  },
}
