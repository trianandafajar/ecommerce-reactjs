import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, ChevronRight, ShoppingBag, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { selectIsBookmarked, addBookmark, removeBookmark } from "@/features/bookmark/bookmarkSlice"
import { selectIsAuthenticated } from "@/features/auth/authSlice"
import { shortCodeFromUUID } from "../helper/product"
import { selectCart } from "@/features/cart/cartSlice"
import { addCartItem, createCart, lookupCart } from "@/features/cart/cartThunks"

function AccordionItem({
  id,
  label,
  expanded,
  onToggle,
  children,
}: {
  id: string
  label: string
  expanded: boolean
  onToggle: (id: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <button
        onClick={() => onToggle(id)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={expanded}
      >
        <span className="text-foreground">{label}</span>
        {expanded ? (
          <Minus className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 text-sm text-muted-foreground pb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductDetail() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const cart = useAppSelector(selectCart)
  const cartLoading = useAppSelector((state) => state.cart.loading)
  const product = useAppSelector((state) => state.product.selectedProduct)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const isBookmarked = useAppSelector(selectIsBookmarked(product?.id ?? ""))

  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleHeartClick = () => {
    if (!product) return
    if (isBookmarked) {
      dispatch(removeBookmark(product.id))
    } else {
      dispatch(addBookmark(product))
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login")
      return
    }
    if (!product || cartLoading) return

    let cartId = cart?.id

    if (!cartId) {
      try {
        const newCart = await dispatch(createCart()).unwrap()
        cartId = newCart.id
      } catch {
        try {
          const lookedUpCart = await dispatch(lookupCart({})).unwrap()
          cartId = lookedUpCart.id
        } catch {
          return
        }
      }
    }

    try {
      await dispatch(
        addCartItem({
          cart_id: cartId as string,
          product_id: product.id,
          quantity: 1,
        })
      )
    } catch {
      // handle silently
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen animate-in fade-in duration-500">
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="bg-muted aspect-square rounded-2xl overflow-hidden border border-border flex items-center justify-center p-8 group relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={`${product.name} - Detailed View`}
              width={600}
              height={600}
              decoding="async"
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
            />
          </div>

          <div className="space-y-6 flex flex-col justify-center">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {shortCodeFromUUID(product.id)}
                </p>
                <h1 className="text-2xl font-medium text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-foreground">
                  ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                className={`hover:bg-gray-50 ${isBookmarked ? "text-red-500" : "text-foreground"}`}
                onClick={handleHeartClick}
              >
                <Heart className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-foreground">Material</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded-full" />
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={cartLoading}
                aria-label="Add to cart"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transform transition-all active:scale-[0.98] py-6 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{cartLoading ? "Adding..." : "Add to Cart"}</span>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl border border-border">
              <p>Our Digital Advisor is available if you have any question on this product.</p>
              <button className="underline text-foreground">Contact us</button>
            </div>

            <div className="space-y-4">
              <div
                className={`text-muted-foreground leading-relaxed relative overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? "max-h-[1000px]" : "max-h-[4.5rem]"
                }`}
              >
                <p>{product.description}</p>
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
                )}
              </div>
              <button
                onClick={() => setIsExpanded((v) => !v)}
                aria-expanded={isExpanded}
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            </div>

            <AccordionItem
              id="instore"
              label="In-Store Services"
              expanded={expandedSection === "instore"}
              onToggle={toggleSection}
            >
              <p>• Personal Shopping Appointment</p>
              <p>• Product Customization & Personalization</p>
              <p>• Repair & Maintenance Services</p>
              <p>• Gift Wrapping & Special Packaging</p>
              <p>• Style Consultation with Expert Advisors</p>
            </AccordionItem>

            <AccordionItem
              id="delivery"
              label="Delivery & Returns"
              expanded={expandedSection === "delivery"}
              onToggle={toggleSection}
            >
              <p>• Free standard delivery on all orders</p>
              <p>• Express delivery available (1-2 business days)</p>
              <p>• Same-day delivery in select cities</p>
              <p>• 30-day return policy</p>
              <p>• Free returns and exchanges</p>
              <p>• Track your order online</p>
            </AccordionItem>

            <AccordionItem
              id="gifting"
              label="Gifting"
              expanded={expandedSection === "gifting"}
              onToggle={toggleSection}
            >
              <p>• Complimentary gift wrapping</p>
              <p>• Personalized gift messages</p>
              <p>• Premium gift boxes and bags</p>
              <p>• Gift receipts (prices hidden)</p>
              <p>• Extended return period for gifts</p>
              <p>• Digital gift cards available</p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  )
}