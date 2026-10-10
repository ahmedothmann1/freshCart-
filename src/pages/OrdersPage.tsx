import { useEffect, useState } from 'react'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Spinner } from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { getApiError } from '../lib/http'
import { decodeUserId, getToken } from '../lib/storage'
import { orderService } from '../services/order.service'
import type { Order } from '../types/api'

export function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function load() {
    const token = getToken()
    const userId = token ? decodeUserId(token) : null
    if (!userId) {
      setError('Could not read user id from token')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    orderService
      .userOrders(userId)
      .then((res) => {
        const payload = res.data
        setOrders(Array.isArray(payload) ? payload : payload.data)
      })
      .catch((err) => setError(getApiError(err, 'Could not load orders')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <Spinner label="Loading orders..." />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (orders.length === 0) {
    return (
      <div className="container-page">
        <EmptyState title="No orders yet" message={`Hi ${user?.name || 'there'}, your order history is empty.`} />
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold">Order history</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-2xl border border-line p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">Order {order.id ?? order._id.slice(-6)}</p>
              <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <p className="mt-2 text-sm">
              {order.paymentMethodType} · {order.isPaid ? 'Paid' : 'Unpaid'} ·{' '}
              {order.isDelivered ? 'Delivered' : 'Processing'}
            </p>
            <p className="mt-1 font-medium text-brand">{order.totalOrderPrice} EGP</p>
            <ul className="mt-3 text-sm text-muted">
              {order.cartItems.map((item, index) => (
                <li key={index}>
                  {typeof item.product === 'string' ? item.product : item.product.title} × {item.count}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
