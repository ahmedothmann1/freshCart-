import { api } from '../lib/http'
import type { Address } from '../types/api'

export const addressService = {
  list() {
    return api.get<{ data: Address[] }>('/api/v1/addresses')
  },
  add(body: { name: string; details: string; phone: string; city: string }) {
    return api.post<{ data: Address[] }>('/api/v1/addresses', body)
  },
  remove(id: string) {
    return api.delete(`/api/v1/addresses/${id}`)
  },
}
