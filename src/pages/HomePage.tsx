import { Headphones, RefreshCcw, ShieldCheck, Truck } from 'lucide-react'
import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { ProductCard } from '../components/product/ProductCard'
import { SkeletonCard } from '../components/common/Spinner'
import { categoryService } from '../services/category.service'
import { getApiError } from '../lib/http'
import { productService } from '../services/product.service'
import type { Category, Product } from '../types/api'

const slides = [
  {
    title: 'Fresh Products Delivered to your Door',
    text: 'Get 20% off your first order',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
    cta: 'Shop Now',
    secondary: 'View Deals',
  },
  {
    title: 'Premium Quality Guaranteed',
    text: 'Fresh from farm to your table',
    image:
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80',
    cta: 'Shop Now',
    secondary: 'Learn More',
  },
  {
    title: 'Fast & Free Delivery',
    text: 'Same day delivery available',
    image:
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=80',
    cta: 'Order Now',
    secondary: 'Delivery Info',
  },
]

export function HomePage() {
  const [index, setIndex] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const [productsError, setProductsError] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    categoryService
      .list({ limit: 12 })
      .then((res) => setCategories(res.data.data))
      .catch((error) => setCategoriesError(getApiError(error, 'Could not load categories')))

    productService
      .list({ limit: 40 })
      .then((res) => setProducts(res.data.data))
      .catch((error) => setProductsError(getApiError(error, 'Could not load featured products')))
      .finally(() => setLoading(false))
  }, [])

  const slide = slides[index]

  function subscribe(event: FormEvent) {
    event.preventDefault()
    if (!email.includes('@')) {
      toast.error('Enter a valid email')
      return
    }
    toast.success('Subscribed! There is no newsletter API on the backend, so this stays local.')
    setEmail('')
  }

  return (
    <div>
      <section className="relative">
        <div
          className="relative min-h-[380px] overflow-hidden bg-cover bg-center md:min-h-[460px]"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand/80 to-emerald-500/40" />
          <div className="container-page relative flex min-h-[380px] flex-col justify-center py-16 text-white md:min-h-[460px]">
            <h2 className="max-w-xl text-4xl font-bold leading-tight md:text-5xl">{slide.title}</h2>
            <p className="mt-3 text-lg">{slide.text}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products" className="rounded-lg bg-white px-5 py-2.5 font-semibold text-ink">
                {slide.cta}
              </Link>
              <Link to="/products" className="rounded-lg border border-white px-5 py-2.5 font-semibold">
                {slide.secondary}
              </Link>
            </div>
          </div>
          <button
            type="button"
            className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            aria-label="Next slide"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((item, i) => (
              <button
                key={item.title}
                type="button"
                className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page relative z-10 -mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Perk icon={<Truck className="h-6 w-6 text-sky-500" />} title="Free Shipping" text="On orders over 500 EGP" />
        <Perk icon={<ShieldCheck className="h-6 w-6 text-emerald-500" />} title="Secure Payment" text="100% secure transactions" />
        <Perk icon={<RefreshCcw className="h-6 w-6 text-orange-400" />} title="Easy Returns" text="14-day return policy" />
        <Perk icon={<Headphones className="h-6 w-6 text-indigo-500" />} title="24/7 Support" text="Dedicated support team" />
      </section>

      <section className="container-page py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="border-l-4 border-brand pl-3 text-2xl font-bold">
            Shop By <span className="text-brand">Category</span>
          </h2>
          <Link to="/categories" className="text-sm font-medium text-brand">
            View All Categories
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categoriesError ? (
            <div className="col-span-full">
              <ErrorState message={categoriesError} />
            </div>
          ) : categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="rounded-2xl border border-line p-4 text-center transition hover:shadow-md"
            >
              <img src={cat.image} alt={cat.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
              <h3 className="mt-3 font-medium">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-4 md:grid-cols-2">
        <Promo
          title="Fresh Organic Fruits"
          text="Get up to 40% off on selected organic fruits"
          to="/products"
          cta="Shop Now"
          color="from-lime-500 to-green-600"
        />
        <Promo
          title="Exotic Vegetables"
          text="Discover our latest collection of premium vegetables"
          to="/products"
          cta="Explore Now"
          color="from-emerald-600 to-teal-700"
        />
      </section>

      <section className="container-page py-14">
        <h2 className="mb-6 border-l-4 border-brand pl-3 text-2xl font-bold">
          Featured <span className="text-brand">Products</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
            : productsError
              ? <div className="col-span-full"><ErrorState message={productsError} /></div>
              : products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand to-emerald-400 py-14 text-white">
        <div className="container-page grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Newsletter · 50,000+ subscribers</p>
            <h2 className="mt-2 text-3xl font-bold">Get the Freshest Updates Delivered Free</h2>
            <p className="mt-2 text-white/90">Weekly recipes, seasonal offers & exclusive member perks.</p>
            <form onSubmit={subscribe} className="mt-6 flex max-w-md overflow-hidden rounded-lg bg-white">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-ink outline-none"
              />
              <button type="submit" className="bg-ink px-4 font-semibold text-white">
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-sm text-white/80">Unsubscribe anytime. No spam, ever.</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-6">
            <h3 className="text-xl font-semibold">Shop Faster on Our App</h3>
            <p className="mt-2 text-white/90">Get app-exclusive deals & 15% off your first order.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-lg bg-black px-4 py-2 text-sm">Download on App Store</span>
              <span className="rounded-lg bg-black px-4 py-2 text-sm">Get it on Google Play</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Perk({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-50">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted">{text}</p>
      </div>
    </div>
  )
}

function Promo({
  title,
  text,
  to,
  cta,
  color,
}: {
  title: string
  text: string
  to: string
  cta: string
  color: string
}) {
  return (
    <div className={`rounded-2xl bg-gradient-to-r ${color} p-8 text-white`}>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-white/90">{text}</p>
      <Link to={to} className="mt-5 inline-block rounded-lg bg-white px-4 py-2 font-semibold text-ink">
        {cta}
      </Link>
    </div>
  )
}
