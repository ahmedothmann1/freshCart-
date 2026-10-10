import { Heart, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { ProductCard } from '../components/product/ProductCard'
import { Spinner } from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { getApiError } from '../lib/http'
import { productService } from '../services/product.service'
import type { Product, Review } from '../types/api'

export function ProductDetailsPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const { addToCart } = useCart()
  const { ids, toggle } = useWishlist()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [active, setActive] = useState('')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    setRelated([])
    setReviews([])
    productService
      .get(id)
      .then(({ data }) => {
        setProduct(data.data)
        setActive(data.data.imageCover)
        return Promise.allSettled([
          productService.list({ 'category[in]': data.data.category._id, limit: 8 }),
          productService.reviews(id),
        ])
      })
      .then(([rel, rev]) => {
        if (rel.status === 'fulfilled') {
          setRelated(rel.value.data.data.filter((item) => item._id !== id))
        }
        if (rev.status === 'fulfilled') {
          setReviews(rev.value.data.data || [])
        }
      })
      .catch((err) => setError(getApiError(err, 'Product not found')))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner label="Loading product..." />
  if (error || !product) return <ErrorState message={error || 'Product not found'} />

  const wished = ids.has(product._id)
  const currentProduct = product
  const images = [product.imageCover, ...(product.images || [])].filter(
    (img, i, arr) => arr.indexOf(img) === i,
  )

  async function add() {
    try {
      for (let i = 0; i < qty; i += 1) {
        await addToCart(currentProduct)
      }
    } catch {
      // The cart context reports API errors to the user.
    }
  }

  async function submitReview() {
    if (!token) {
      navigate('/login', { state: { from: `/products/${currentProduct._id}` } })
      return
    }
    try {
      await productService.createReview(currentProduct._id, { review: reviewText, rating })
      toast.success('Review submitted')
      setReviewText('')
      const { data } = await productService.reviews(currentProduct._id)
      setReviews(data.data || [])
    } catch (err) {
      toast.error(getApiError(err, 'Could not submit review'))
    }
  }

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-muted">
        <Link to="/">Home</Link> / <Link to="/products">Shop</Link> / {product.title}
      </nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <img src={active} alt={product.title} className="w-full rounded-2xl border border-line object-contain" />
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((img) => (
              <button
                type="button"
                key={img}
                onClick={() => setActive(img)}
                className={`h-20 w-20 overflow-hidden rounded-lg border ${active === img ? 'border-brand' : 'border-line'}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-brand">{product.category?.name}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-amber-500">
            <Star className="h-5 w-5 fill-amber-400" />
            {product.ratingsAverage} <span className="text-muted">({product.ratingsQuantity} ratings)</span>
          </div>
          <p className="mt-4 text-2xl font-bold text-brand">
            {(product.priceAfterDiscount ?? product.price)} EGP
          </p>
          {product.priceAfterDiscount ? (
            <p className="text-slate-400 line-through">{product.price} EGP</p>
          ) : null}
          <p className="mt-4 leading-7 text-muted">{product.description}</p>
          <p className="mt-3 text-sm">Brand: {product.brand?.name}</p>
          <p className="text-sm">Availability: {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-line">
              <button type="button" className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                -
              </button>
              <span className="px-4">{qty}</span>
              <button type="button" className="px-3 py-2" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => void add()}
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              Add to Cart
            </button>
            <button
              type="button"
              aria-label="Add to wishlist"
              onClick={() => {
                void toggle(product).catch(() => {
                  // The wishlist context reports API errors to the user.
                })
              }}
              className="grid h-12 w-12 place-items-center rounded-lg border border-line"
            >
              <Heart className={`h-5 w-5 ${wished ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="mt-4 space-y-4">
          {reviews.length === 0 ? <p className="text-muted">No reviews yet.</p> : null}
          {reviews.map((review) => (
            <article key={review._id} className="rounded-xl border border-line p-4">
              <p className="font-medium">{review.user?.name || 'Customer'}</p>
              <p className="text-sm text-amber-500">{review.ratings ?? review.rating}/5</p>
              <p className="mt-1 text-muted">{review.review || review.title}</p>
            </article>
          ))}
        </div>
        <form
          className="mt-6 max-w-lg space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            void submitReview()
          }}
        >
          <label className="block text-sm font-medium">
            Your rating
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <textarea
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write a review"
            className="w-full rounded-lg border border-line px-3 py-2"
            rows={3}
          />
          <button type="submit" className="rounded-lg bg-brand px-4 py-2 font-medium text-white">
            Submit review
          </button>
        </form>
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">Related products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
