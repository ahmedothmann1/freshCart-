export interface Category {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Subcategory {
  _id: string
  name: string
  slug: string
  category: string
}

export interface Brand {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Product {
  sold?: number
  images: string[]
  subcategory?: Subcategory[]
  ratingsQuantity: number
  _id: string
  title: string
  slug: string
  description: string
  quantity: number
  price: number
  imageCover: string
  category: Category
  brand: Brand
  ratingsAverage: number
  createdAt?: string
  updatedAt?: string
  id: string
  priceAfterDiscount?: number
}

export interface Paginated<T> {
  results?: number
  metadata?: {
    currentPage: number
    numberOfPages: number
    limit: number
    nextPage?: number
    prevPage?: number
  }
  data: T[]
}

export interface AuthUser {
  name: string
  email: string
  role?: string
}

export interface CartProduct {
  count: number
  _id: string
  price: number
  product: Product
}

export interface Cart {
  _id: string
  cartOwner?: string
  products: CartProduct[]
  totalCartPrice: number
  totalPriceAfterDiscount?: number
}

export interface CartResponse {
  status: string
  message?: string
  numOfCartItems: number
  cartId?: string
  data: Cart
}

export interface Address {
  _id: string
  name: string
  details: string
  phone: string
  city: string
}

export interface ShippingAddress {
  details: string
  phone: string
  city: string
}

export interface OrderItem {
  count: number
  price: number
  product: Product | string
}

export interface Order {
  _id: string
  id?: number
  user?: AuthUser & { _id?: string }
  cartItems: OrderItem[]
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  isDelivered: boolean
  shippingAddress?: ShippingAddress
  createdAt: string
}

export interface Review {
  _id: string
  title?: string
  ratings?: number
  rating?: number
  review?: string
  user?: { name?: string }
  createdAt?: string
}

export interface ProductQuery {
  limit?: number
  page?: number
  sort?: string
  keyword?: string
  brand?: string
  'price[gte]'?: number
  'price[lte]'?: number
  'category[in]'?: string
}
