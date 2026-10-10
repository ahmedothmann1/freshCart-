import { api } from '../lib/http'
import type { CartResponse } from '../types/api'

const CART = '/api/v1/cart'

export const cartService = {
  get() {
    return api.get<CartResponse>(CART)
  },
  add(productId: string) {
    return api.post<CartResponse>(CART, { productId })
  },
  updateCount(productId: string, count: number) {
    return api.put<CartResponse>(`${CART}/${productId}`, { count: String(count) })
  },
  remove(productId: string) {
    return api.delete<CartResponse>(`${CART}/${productId}`)
  },
  clear() {
    return api.delete(CART)
  },
}
