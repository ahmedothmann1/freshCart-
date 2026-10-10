import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { Spinner } from '../components/common/Spinner'
import { useCart } from '../context/CartContext'

export function CartPage() {
  const { cart, loading, updateCount, removeItem, clearCart } = useCart()
  const products = cart?.products ?? []

  if (loading) return <Spinner label="Loading cart..." />
  if (!cart || products.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          title="Your cart is empty"
          message="Add products to continue shopping."
          icon={<ShoppingBag className="mx-auto h-12 w-12 text-brand" />}
        />
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button type="button" onClick={() => void clearCart()} className="text-sm text-red-500">
          Clear cart
        </button>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {products.map((item) => {
            const product = item.product
            const id = typeof product === 'string' ? product : product._id
            return (
              <article key={item._id} className="flex flex-col gap-4 rounded-2xl border border-line p-4 sm:flex-row">
                <img
                  src={typeof product === 'string' ? '' : product.imageCover}
                  alt={typeof product === 'string' ? '' : product.title}
                  className="h-28 w-28 rounded-xl object-contain"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/products/${id}`} className="font-semibold hover:text-brand">
                      {typeof product === 'string' ? id : product.title}
                    </Link>
                    <p className="text-brand">{item.price} EGP</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-line">
                      <button
                        type="button"
                        className="px-3 py-1"
                        onClick={() => void updateCount(id, item.count - 1)}
                      >
                        -
                      </button>
                      <span className="px-3">{item.count}</span>
                      <button
                        type="button"
                        className="px-3 py-1"
                        onClick={() => void updateCount(id, item.count + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => void removeItem(id)} aria-label="Remove">
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <aside className="h-fit rounded-2xl border border-line p-5">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{cart.totalCartPrice} EGP</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>Shipping</span>
            <span>{cart.totalCartPrice >= 500 ? 'Free' : 'Calculated at checkout'}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold">
            <span>Total</span>
            <span>{cart.totalPriceAfterDiscount ?? cart.totalCartPrice} EGP</span>
          </div>
          <Link
            to="/checkout"
            className="mt-5 block rounded-lg bg-brand py-3 text-center font-semibold text-white hover:bg-brand-dark"
          >
            Proceed to checkout
          </Link>
          <Link to="/products" className="mt-3 block text-center text-sm text-brand">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
