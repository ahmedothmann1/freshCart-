import { type FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { Spinner } from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getApiError } from '../lib/http'
import { addressService } from '../services/address.service'
import { orderService } from '../services/order.service'
import type { Address } from '../types/api'

export function CheckoutPage() {
  const { token } = useAuth()
  const { cart, loading } = useCart()
  const navigate = useNavigate()
  const [details, setDetails] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])

  useEffect(() => {
    if (!token) return
    addressService
      .list()
      .then((res) => setAddresses(res.data.data || []))
      .catch(() => setAddresses([]))
  }, [token])

  if (loading) return <Spinner />
  if (!cart || cart.products.length === 0) {
    return (
      <div className="container-page">
        <EmptyState title="Nothing to checkout" message="Add items to your cart first." />
      </div>
    )
  }

  const checkoutCart = cart

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!token) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    if (!details.trim() || !phone.trim() || !city.trim()) {
      toast.error('Please complete the shipping address')
      return
    }
    setSubmitting(true)
    const shippingAddress = { details, phone, city }
    try {
      const origin = window.location.origin
      const { data } = await orderService.checkoutSession(checkoutCart._id, origin, shippingAddress)
      const url = data.session?.url
      if (!url) {
        toast.error('Checkout session was not returned by the payment API')
        return
      }
      window.location.href = url
    } catch (error) {
      toast.error(getApiError(error, 'Checkout failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line p-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {!token ? (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Sign in is required to create a Stripe checkout session for your server-side cart.
          </p>
        ) : addresses.length > 0 ? (
          <label className="block text-sm font-medium">
            Saved addresses
            <select
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
              defaultValue=""
              onChange={(e) => {
                const found = addresses.find((a) => a._id === e.target.value)
                if (found) {
                  setDetails(found.details)
                  setPhone(found.phone)
                  setCity(found.city)
                }
              }}
            >
              <option value="">Select an address</option>
              {addresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.name} — {address.city}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-sm text-muted">
            No saved addresses.{' '}
            <Link to="/addresses" className="text-brand">
              Add one
            </Link>
          </p>
        )}
        <label className="block text-sm font-medium">
          Address details
          <input
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Phone
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          City
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        {token ? (
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Preparing Stripe checkout...' : 'Place order and continue to Stripe'}
          </button>
        ) : (
          <Link
            to="/login"
            state={{ from: '/checkout' }}
            className="block w-full rounded-lg bg-brand py-3 text-center font-semibold text-white hover:bg-brand-dark"
          >
            Sign in to continue to Stripe
          </Link>
        )}
      </form>
      <aside className="h-fit rounded-2xl border border-line p-5">
        <h2 className="font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {cart.products.map((item) => (
            <li key={item._id} className="flex justify-between gap-3">
              <span className="line-clamp-1">
                {typeof item.product === 'string' ? item.product : item.product.title} × {item.count}
              </span>
              <span>{item.price * item.count} EGP</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold">
          <span>Total</span>
          <span>{cart.totalPriceAfterDiscount ?? cart.totalCartPrice} EGP</span>
        </div>
      </aside>
    </div>
  )
}
