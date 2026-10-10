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
import { cartService } from '../services/cart.service'
import type { Cart, CartProduct, Product } from '../types/api'
import { useAuth } from './AuthContext'

const GUEST_CART_KEY = 'freshcart_guest_cart'

function readGuestCart(): CartProduct[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? '[]')
    return Array.isArray(stored) ? (stored as CartProduct[]) : []
  } catch {
    return []
  }
}

function makeCart(products: CartProduct[]): Cart | null {
  if (products.length === 0) return null
  return {
    _id: 'guest-cart',
    products,
    totalCartPrice: products.reduce((total, item) => total + item.price * item.count, 0),
  }
}

interface CartContextValue {
  cart: Cart | null
  count: number
  loading: boolean
  addToCart: (product: Product) => Promise<void>
  updateCount: (productId: string, count: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [cart, setCart] = useState<Cart | null>(() => makeCart(readGuestCart()))
  const [count, setCount] = useState(() => readGuestCart().reduce((total, item) => total + item.count, 0))
  const [loading, setLoading] = useState(false)

  const saveGuestCart = useCallback((products: CartProduct[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(products))
    setCart(makeCart(products))
    setCount(products.reduce((total, item) => total + item.count, 0))
  }, [])

  const refresh = useCallback(async () => {
    if (!token) {
      const products = readGuestCart()
      setCart(makeCart(products))
      setCount(products.reduce((total, item) => total + item.count, 0))
      return
    }
    setLoading(true)
    try {
      const { data } = await cartService.get()
      setCart(data.data)
      setCount(data.numOfCartItems)
    } catch {
      setCart(null)
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addToCart = useCallback(
    async (product: Product) => {
      if (!token) {
        const products = readGuestCart()
        const productId = product._id || product.id
        const existing = products.find((item) => item._id === productId)
        const next = existing
          ? products.map((item) =>
              item._id === productId ? { ...item, count: item.count + 1 } : item,
            )
          : [
              ...products,
              {
                _id: productId,
                price: product.priceAfterDiscount ?? product.price,
                product,
                count: 1,
              },
            ]
        saveGuestCart(next)
        toast.success('Added to cart')
        return
      }
      try {
        const { data } = await cartService.add(product._id)
        setCart(data.data)
        setCount(data.numOfCartItems)
        toast.success('Added to cart')
      } catch (error) {
        toast.error(getApiError(error, 'Could not add to cart'))
        throw error
      }
    },
    [saveGuestCart, token],
  )

  const updateCount = useCallback(
    async (productId: string, nextCount: number) => {
      if (nextCount < 1) return
      if (!token) {
        saveGuestCart(
          readGuestCart().map((item) =>
            item._id === productId ? { ...item, count: nextCount } : item,
          ),
        )
        return
      }
      try {
        const { data } = await cartService.updateCount(productId, nextCount)
        setCart(data.data)
        setCount(data.numOfCartItems)
      } catch (error) {
        toast.error(getApiError(error, 'Could not update quantity'))
      }
    },
    [saveGuestCart, token],
  )

  const removeItem = useCallback(
    async (productId: string) => {
      if (!token) {
        saveGuestCart(readGuestCart().filter((item) => item._id !== productId))
        toast.success('Removed from cart')
        return
      }
      try {
        const { data } = await cartService.remove(productId)
        setCart(data.data)
        setCount(data.numOfCartItems)
        toast.success('Removed from cart')
      } catch (error) {
        toast.error(getApiError(error, 'Could not remove item'))
      }
    },
    [saveGuestCart, token],
  )

  const clearCart = useCallback(async () => {
    if (!token) {
      saveGuestCart([])
      toast.success('Cart cleared')
      return
    }
    try {
      await cartService.clear()
      setCart(null)
      setCount(0)
      toast.success('Cart cleared')
    } catch (error) {
      toast.error(getApiError(error, 'Could not clear cart'))
    }
  }, [saveGuestCart, token])

  const value = useMemo(
    () => ({ cart, count, loading, addToCart, updateCount, removeItem, clearCart, refresh }),
    [cart, count, loading, addToCart, updateCount, removeItem, clearCart, refresh],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
