import { api } from '../lib/http'
import type { Order, ShippingAddress } from '../types/api'

export const orderService = {
  cash(cartId: string, shippingAddress: ShippingAddress) {
    return api.post(`/api/v1/orders/${cartId}`, { shippingAddress })
  },
  checkoutSession(cartId: string, url: string, shippingAddress: ShippingAddress) {
    return api.post<{ session?: { url?: string } }>(
      `/api/v1/orders/checkout-session/${cartId}`,
      { shippingAddress },
      { params: { url } },
    )
  },
  userOrders(userId: string) {
    return api.get<Order[] | { data: Order[] }>(`/api/v1/orders/user/${userId}`)
  },
}
