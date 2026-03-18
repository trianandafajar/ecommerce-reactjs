import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ChevronRight } from "lucide-react";

import {
  clearCart,
  deleteCartItem,
  updateCartItem,
} from "@/features/cart/cartThunks";
import {
  resetCart,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from "@/features/cart/cartSlice";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useAppSelector(selectCartItems);
  const { cart } = useAppSelector((s) => s.cart);
  const totalItems = useAppSelector(selectTotalItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  const handleClearCart = async () => {
    if (cart?.id && window.confirm("Are you sure you want to clear your cart?")) {
      await dispatch(clearCart(cart.id)).unwrap();
      dispatch(resetCart());
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="w-full h-12 rounded-full font-semibold"
          >
            Start Shopping
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">You have {totalItems} items in your bag</p>
          </div>
          <button 
            onClick={handleClearCart}
            className="text-sm font-medium text-muted-foreground hover:text-destructive flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-8">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row gap-6 pb-8 border-b last:border-0 group"
              >
                {/* Product Image */}
                <div className="w-full sm:w-40 aspect-square bg-muted rounded-xl overflow-hidden flex-shrink-0">
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                        <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Price: USD {Number(item.product.price).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        dispatch(deleteCartItem({ cart_id: item.cart_id, item_id: item.id }))
                      }
                      className="text-muted-foreground hover:text-destructive p-2"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border rounded-lg overflow-hidden bg-card h-10">
                      <button
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              cart_id: item.cart_id,
                              item_id: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          )
                        }
                        className="px-3 hover:bg-muted transition-colors disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              cart_id: item.cart_id,
                              item_id: item.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="px-3 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xl font-bold">
                      USD {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-card border rounded-2xl p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span>USD {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (Calculated at checkout)</span>
                  <span>USD 0.00</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">USD {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout" className="block">
                <Button className="w-full h-14 rounded-xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
                  Proceed to Checkout <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>

              <div className="pt-4 flex items-center justify-center gap-6 text-muted-foreground opacity-60">
                 {/* Optional secure badges can go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
