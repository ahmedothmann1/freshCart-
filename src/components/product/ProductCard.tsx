import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import type { Product } from '../../types/api'

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { ids, toggle } = useWishlist()
  const [busy, setBusy] = useState(false)
  const wished = ids.has(product._id) || ids.has(product.id)
  const discounted = product.priceAfterDiscount && product.priceAfterDiscount < product.price

  async function onAdd() {
    setBusy(true)
    try {
      await addToCart(product)
    } catch {
      /* toast handled in context */
    } finally {
      setBusy(false)
    }
  }

  async function onWish() {
    try {
      await toggle(product)
    } catch {
      // The wishlist context reports API errors to the user.
    }
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => void onWish()}
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white shadow-sm"
        >
          <Heart className={`h-4 w-4 ${wished ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
        </button>
      </div>
      {discounted ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
          Sale
        </span>
      ) : null}
      <Link to={`/products/${product._id}`} className="block bg-slate-50">
        <img
          src={product.imageCover}
          alt={product.title}
          className="aspect-square w-full object-contain p-4 transition group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-brand">{product.category?.name}</p>
        <Link to={`/products/${product._id}`} className="mt-1 line-clamp-2 font-semibold leading-snug hover:text-brand">
          {product.title}
        </Link>
        <div className="mt-2 flex items-center gap-1 text-sm text-amber-500">
          <Star className="h-4 w-4 fill-amber-400" />
          <span>{product.ratingsAverage}</span>
          <span className="text-muted">({product.ratingsQuantity})</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {discounted ? (
              <>
                <p className="font-bold text-brand">{product.priceAfterDiscount} EGP</p>
                <p className="text-sm text-slate-400 line-through">{product.price} EGP</p>
              </>
            ) : (
              <p className="font-bold text-brand">{product.price} EGP</p>
            )}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onAdd()}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:opacity-60"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
