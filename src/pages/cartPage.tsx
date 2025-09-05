import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"
import { Header } from "@/components/header"
import {
  removeFromCart,
  clearCart,
  updateQuantity,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from "@/features/cart/cartSlice"
import { selectIsAuthenticated } from "@/features/auth/authSlice"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const items = useAppSelector(selectCartItems)
  const totalItems = useAppSelector(selectTotalItems)
  const totalPrice = useAppSelector(selectTotalPrice)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="py-8">
          <div className="px-4">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-black mb-4">Your Shopping Bag</h1>
              <p className="text-gray-600 mb-8">Your shopping bag is empty</p>
              <Button onClick={() => navigate(-1)} className="bg-black text-white hover:bg-gray-800 px-8 py-3">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-black">Your Shopping Bag</h1>
          <Button
            onClick={() => dispatch(clearCart())}
            variant="outline"
            className="flex items-center !rounded-none gap-2 text-red-600 border-red-600 hover:bg-red-50 w-fit sm:w-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          {totalItems} {totalItems === 1 ? "item" : "items"} • Total: USD {totalPrice.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4 gap-6">
        {items.map((item) => (
          <div key={`${item.id}-${item.quantity}`} className="relative bg-white group">
            <div className="relative aspect-square bg-gray-50">
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </Link>
              <div className="absolute top-2 right-2">
                <Button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 px-1 py-2 h-auto cursor-pointer bg-white rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-black font-medium mb-2 line-clamp-1 [text-overflow:clip]">{item.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">USD {Number(item.price.replace(/[^\d,]/g, "").replace(/,/g, "")).toLocaleString()}</p>
                <div className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                  <Button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                    variant="ghost"
                    size="sm"
                    className="w-5 h-5 p-0 cursor-pointer hover:bg-gray-200 rounded"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-xs font-medium min-w-[16px] text-center">{item.quantity}</span>
                  <Button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    variant="ghost"
                    size="sm"
                    className="w-5 h-5 p-0 cursor-pointer hover:bg-gray-200 rounded"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="py-8 px-4">
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="text-lg sm:text-xl font-semibold text-center sm:text-left">
            Total: USD {totalPrice.toLocaleString()}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="px-6 sm:px-8 py-3 cursor-pointer !rounded-none w-full sm:w-auto"
            >
              Continue Shopping
            </Button>
            <Link to="/checkout">
              <Button className="bg-black text-white hover:bg-gray-800 px-6 sm:px-8 py-3 cursor-pointer !rounded-none w-full sm:w-auto">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
