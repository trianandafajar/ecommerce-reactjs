import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronRight, Plus, ShoppingBag, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsBookmarked, addBookmark, removeBookmark } from "@/features/bookmark/bookmarkSlice";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import { shortCodeFromUUID } from "../helper/product";
import { selectCart } from "@/features/cart/cartSlice";
import { addCartItem, createCart } from "@/features/cart/cartThunks";

export function ProductDetail() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const { selectedProduct: product } = useAppSelector((state) => state.product);

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isBookmarked = useAppSelector(selectIsBookmarked(product?.id || ""));

  const handleHeartClick = () => {
    if (!product) return;
    if (isBookmarked) {
      dispatch(removeBookmark(product.id));
    } else {
      dispatch(addBookmark(product));
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!product) return <p>Loading...</p>;

  const cartLoading = useAppSelector((state) => state.cart.loading);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    // If the cart is already loading (e.g. from App initialization), wait a bit or ignore click
    if (cartLoading) return;

    let cartId = cart?.id;

    if (!cartId) {
      try {
        const newCart = await dispatch(createCart()).unwrap();
        cartId = newCart.id;
      } catch (err: any) {
        // If createCart fails with 400, maybe the user already has a cart that wasn't found.
        // Try looking up the cart one more time before giving up.
        try {
          const lookedUpCart = await dispatch(lookupCart({})).unwrap();
          cartId = lookedUpCart.id;
        } catch (lookupErr) {
          console.error("Failed to create or lookup cart:", err);
          return;
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
      );
    } catch (err: any) {
      console.error("Failed to add item:", err);
    }
  };

  return (
    <div className="bg-background min-h-screen animate-in fade-in duration-500">
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-muted aspect-square rounded-2xl overflow-hidden border border-border flex items-center justify-center p-8 group relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={`${product.name} - Detailed View`}
              decoding="async"
              loading="eager"
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
                <p className="text-lg text-foreground">$ {product.price}.00</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`hover:bg-gray-50 ${isBookmarked ? "text-red-500" : "text-foreground"
                  }`}
                onClick={handleHeartClick}
              >
                <Heart
                  className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-foreground">Material</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transform transition-all active:scale-[0.98] py-6 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl border border-border">
              <p>
                Our Digital Advisor is available if you have any question on
                this product.
              </p>
              <button className="underline text-foreground">Contact us</button>
            </div>

            <div className="space-y-4">
              <div
                className={`text-muted-foreground leading-relaxed relative overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[1000px]" : "max-h-[4.5rem]"}`}
              >
                <p>{product.description}</p>
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
                )}
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => toggleSection("instore")}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-foreground">In-Store Services</span>
                {expandedSection === "instore" ? (
                  <Minus className="w-4 h-4 text-gray-400" />
                ) : (
                  <Plus className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${expandedSection === "instore" ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="space-y-3 text-sm text-muted-foreground pb-2">
                    <p>• Personal Shopping Appointment</p>
                    <p>• Product Customization & Personalization</p>
                    <p>• Repair & Maintenance Services</p>
                    <p>• Gift Wrapping & Special Packaging</p>
                    <p>• Style Consultation with Expert Advisors</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => toggleSection("delivery")}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-foreground">Delivery & Returns</span>
                {expandedSection === "delivery" ? (
                  <Minus className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${expandedSection === "delivery" ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="space-y-3 text-sm text-muted-foreground pb-2">
                    <p>• Free standard delivery on all orders</p>
                    <p>• Express delivery available (1-2 business days)</p>
                    <p>• Same-day delivery in select cities</p>
                    <p>• 30-day return policy</p>
                    <p>• Free returns and exchanges</p>
                    <p>• Track your order online</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => toggleSection("gifting")}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-foreground">Gifting</span>
                {expandedSection === "gifting" ? (
                  <Minus className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${expandedSection === "gifting" ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="space-y-3 text-sm text-muted-foreground pb-2">
                    <p>• Complimentary gift wrapping</p>
                    <p>• Personalized gift messages</p>
                    <p>• Premium gift boxes and bags</p>
                    <p>• Gift receipts (prices hidden)</p>
                    <p>• Extended return period for gifts</p>
                    <p>• Digital gift cards available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
