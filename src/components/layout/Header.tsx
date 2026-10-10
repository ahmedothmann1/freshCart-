import {
  ChevronDown,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { categoryService } from '../../services/category.service'
import type { Category } from '../../types/api'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `px-2 py-2 text-sm font-medium ${isActive ? 'text-brand' : 'text-ink hover:text-brand'}`

export function Header() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const { items } = useWishlist()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    categoryService
      .list({ limit: 20 })
      .then((res) => setCategories(res.data.data))
      .catch(() => setCategories([]))
  }, [])

  function onSearch(event: FormEvent) {
    event.preventDefault()
    const value = query.trim()
    navigate(value ? `/products?keyword=${encodeURIComponent(value)}` : '/products')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="hidden border-b border-line bg-slate-50 text-xs text-muted md:block">
        <div className="container-page flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <span>Free Shipping on Orders 500 EGP</span>
            <span>New Arrivals Daily</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+18001234567" className="inline-flex items-center gap-1 hover:text-brand">
              <Phone className="h-3.5 w-3.5" /> +1 (800) 123-4567
            </a>
            <a href="mailto:support@freshcart.com" className="hover:text-brand">
              support@freshcart.com
            </a>
            {user ? (
              <button type="button" onClick={logout} className="hover:text-brand">
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="hover:text-brand">
                  Sign In
                </Link>
                <Link to="/register" className="hover:text-brand">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-page flex items-center gap-3 py-3 md:gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight">
          <ShoppingCart className="h-7 w-7 text-brand" />
          FreshCart
        </Link>

        <form onSubmit={onSearch} className="hidden flex-1 items-center md:flex">
          <label className="sr-only" htmlFor="site-search">
            Search
          </label>
          <div className="flex w-full overflow-hidden rounded-full border border-line">
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full px-4 py-2.5 text-sm outline-none"
            />
            <button
              type="submit"
              className="m-1 grid h-9 w-9 place-items-center rounded-full bg-brand text-white"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" className={navLink} end>
            Home
          </NavLink>
          <NavLink to="/products" className={navLink}>
            Shop
          </NavLink>
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2 py-2 text-sm font-medium hover:text-brand"
              onClick={() => setCatsOpen((v) => !v)}
            >
              Categories <ChevronDown className="h-4 w-4" />
            </button>
            {catsOpen ? (
              <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-line bg-white py-2 shadow-lg">
                <Link
                  to="/categories"
                  className="block px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={() => setCatsOpen(false)}
                >
                  All Categories
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${cat._id}`}
                    className="block px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setCatsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <NavLink to="/brands" className={navLink}>
            Brands
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link to="/support" className="hidden items-center gap-1 text-sm text-muted hover:text-brand xl:flex">
            <HelpCircle className="h-4 w-4" /> Support 24/7 Help
          </Link>
          <Link to="/wishlist" className="relative text-ink hover:text-brand" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {items.length > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] text-white">
                {items.length}
              </span>
            ) : null}
          </Link>
          <Link to="/cart" className="relative text-ink hover:text-brand" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] text-white">
                {count}
              </span>
            ) : null}
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/account" className="inline-flex items-center gap-1 text-sm font-medium hover:text-brand">
                <User className="h-4 w-4" /> {user.name}
              </Link>
              <button type="button" onClick={logout} aria-label="Sign out">
                <LogOut className="h-4 w-4 text-muted" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden text-sm font-medium hover:text-brand md:inline">
              Sign In
            </Link>
          )}
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-4 py-4 lg:hidden">
          <form onSubmit={onSearch} className="mb-3 flex overflow-hidden rounded-full border border-line">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 text-sm outline-none"
            />
            <button type="submit" className="px-3 text-brand" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
          </form>
          <div className="flex flex-col gap-2 text-sm font-medium">
            <Link to="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/products" onClick={() => setOpen(false)}>
              Shop
            </Link>
            <Link to="/categories" onClick={() => setOpen(false)}>
              Categories
            </Link>
            <Link to="/brands" onClick={() => setOpen(false)}>
              Brands
            </Link>
            <Link to="/wishlist" onClick={() => setOpen(false)}>
              Wishlist
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)}>
              Cart
            </Link>
            <Link to="/account" onClick={() => setOpen(false)} className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Account
            </Link>
            {user ? (
              <button type="button" onClick={logout} className="text-left">
                Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
