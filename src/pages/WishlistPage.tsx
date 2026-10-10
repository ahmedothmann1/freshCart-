import { Heart } from 'lucide-react'
import { EmptyState } from '../components/common/EmptyState'
import { ProductCard } from '../components/product/ProductCard'
import { Spinner } from '../components/common/Spinner'
import { useWishlist } from '../context/WishlistContext'

export function WishlistPage() {
  const { items, loading } = useWishlist()

  if (loading) return <Spinner label="Loading wishlist..." />
  if (items.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          title="Your wishlist is empty"
          message="Save products you love and they will show up here."
          icon={<Heart className="mx-auto h-12 w-12 text-brand" />}
        />
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
