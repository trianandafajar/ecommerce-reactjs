import { useEffect } from "react"
import { useAppSelector } from "@/app/hooks"
import { useNavigate, Link } from "react-router-dom"
import { Header } from "@/components/header"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { selectBookmarkedItems } from "@/features/bookmark/bookmarkSlice"
import { selectIsAuthenticated } from "@/features/auth/authSlice"
import ProductCard from "@/features/product/components/productCard"

export default function BookmarksPage() {
  const navigate = useNavigate()
  const bookmarkedItems = useAppSelector(selectBookmarkedItems)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (bookmarkedItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="bg-gray-100 min-h-screen py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-medium text-black mb-4">No Bookmarked Items</h1>
            <p className="text-gray-600 mb-8">
              Start browsing and bookmark your favorite items to see them here.
            </p>
            <Link to="/">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="bg-gray-100 min-h-screen">
        <div>
          <div className="py-4 px-4 bg-white border-b border-gray-100">
            <h1 className="text-2xl font-medium text-black">Bookmarked Items</h1>
            <p className="text-gray-600">
              {bookmarkedItems.length} item{bookmarkedItems.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {bookmarkedItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
