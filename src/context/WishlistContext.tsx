import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import toast from 'react-hot-toast'
import { getApiError } from '../lib/http'
import { wishlistService } from '../services/wishlist.service'
import type { Product } from '../types/api'
import { useAuth } from './AuthContext'

const GUEST_WISHLIST_KEY = 'freshcart_guest_wishlist'

function readGuestWishlist(): Product[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) ?? '[]')
    return Array.isArray(stored) ? (stored as Product[]) : []
  } catch {
    return []
  }
}

interface WishlistContextValue {
  items: Product[]
  ids: Set<string>
  loading: boolean
  toggle: (product: Product) => Promise<void>
  refresh: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [items, setItems] = useState<Product[]>(() => readGuestWishlist())
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!token) {
      setItems(readGuestWishlist())
      return
    }
    setLoading(true)
    try {
      const { data } = await wishlistService.get()
      setItems(data.data || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const toggle = useCallback(
    async (product: Product) => {
      const productId = product._id || product.id
      const exists = items.some((item) => item._id === productId || item.id === productId)
      if (!token) {
        const next = exists
          ? items.filter((item) => item._id !== productId && item.id !== productId)
          : [...items, product]
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(next))
        setItems(next)
        toast.success(exists ? 'Removed from wishlist' : 'Added to wishlist')
        return
      }
      try {
        if (exists) {
          await wishlistService.remove(productId)
          setItems((prev) => prev.filter((item) => item._id !== productId && item.id !== productId))
          toast.success('Removed from wishlist')
        } else {
          await wishlistService.add(productId)
          toast.success('Added to wishlist')
          await refresh()
        }
      } catch (error) {
        toast.error(getApiError(error, 'Wishlist update failed'))
        throw error
      }
    },
    [items, refresh, token],
  )

  const ids = useMemo(
    () => new Set(items.map((item) => item._id || item.id)),
    [items],
  )

  const value = useMemo(
    () => ({ items, ids, loading, toggle, refresh }),
    [items, ids, loading, toggle, refresh],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
