import { useEffect } from "react"
import { useAppSelector } from "@/app/hooks"
import { useNavigate, Link } from "react-router-dom"
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
      navigate("/auth/login")
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    )
  }

  if (bookmarkedItems.length === 0) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 bg-background/50">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="relative inline-block mx-auto">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full translate-y-4"></div>
            <div className="relative bg-card border border-border rounded-3xl p-10 shadow-2xl shadow-primary/10">
              <Heart className="w-24 h-24 text-primary fill-primary/10 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground text-lg">
              Looks like you haven't saved anything yet. Browse our collection and find your next favorite!
            </p>
          </div>

          <div className="pt-4">
            <Link to="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-background/50 py-12 px-4 transition-all duration-500 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              My <span className="text-primary">Wishlist</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Keep track of everything you love. You have{" "}
              <span className="font-bold text-foreground">
                {bookmarkedItems.length}
              </span>{" "}
              item{bookmarkedItems.length !== 1 ? "s" : ""} saved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/">
              <Button variant="outline" className="rounded-full px-6 hover:bg-primary/5 border-primary/20 hover:border-primary transition-all active:scale-95">
                Explore Items
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {bookmarkedItems.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
