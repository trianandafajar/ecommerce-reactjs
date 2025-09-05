import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronRight, Plus, ShoppingBag, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addBookmark,
  removeBookmark,
  selectIsBookmarked,
} from "@/features/bookmark/bookmarkSlice";
import { addToCart } from "@/features/cart/cartSlice";
import { selectIsAuthenticated } from "@/features/auth/authSlice";

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isBookmarked = useAppSelector(selectIsBookmarked(productId));

  // mock product data (nanti bisa fetch dari API/Redux slice)
  const product = {
    id: productId,
    name: "Christopher PM",
    code: "M14858",
    price: "USD 6,700",
    image_url: "/black-pixel-pattern-backpack-louis-vuitton-style.png",
    material: "Autres Toiles",
    description: `The Christopher PM backpack in raffia showcases the House's expertise...`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const handleHeartClick = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(product.id));
    } else {
      dispatch(addBookmark(product));
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(addToCart(product));
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-white ">
      <div className="px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gray-100 aspect-square">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">{product.code}</p>
                <h1 className="text-2xl font-medium text-black mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-black">{product.price}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`hover:bg-gray-50 ${
                  isBookmarked ? "text-red-500" : "text-black"
                }`}
                onClick={handleHeartClick}
              >
                <Heart
                  className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            {/* Material */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-black">Material</span>
              <div className="flex items-center gap-2">
                <span className="text-black">{product.material}</span>
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-4 rounded-full">
                Contact Concierge Services
              </Button>
              <Button
                onClick={handleAddToCart}
                className="bg-black text-white hover:bg-gray-800 py-4 px-10 rounded-full flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </Button>
            </div>

            {/* Digital Advisor */}
            <div className="text-sm text-gray-600">
              <p>
                Our Digital Advisor is available if you have any question on
                this product.
              </p>
              <button className="underline text-black">Contact us</button>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {isExpanded
                  ? product.description
                  : `${product.description.substring(0, 200)}...`}
              </p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="underline text-black text-sm"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            </div>

            {/* Expandable Sections */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => toggleSection("instore")}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-black">In-Store Services</span>
                {expandedSection === "instore" ? (
                  <Minus className="w-4 h-4 text-gray-400" />
                ) : (
                  <Plus className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSection === "instore" && (
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <p>• Personal Shopping Appointment</p>
                  <p>• Product Customization & Personalization</p>
                  <p>• Repair & Maintenance Services</p>
                  <p>• Gift Wrapping & Special Packaging</p>
                  <p>• Style Consultation with Expert Advisors</p>
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => toggleSection("delivery")}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-black">Delivery & Returns</span>
                {expandedSection === "delivery" ? (
                  <Minus className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSection === "delivery" && (
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <p>• Free standard delivery on all orders</p>
                  <p>• Express delivery available (1-2 business days)</p>
                  <p>• Same-day delivery in select cities</p>
                  <p>• 30-day return policy</p>
                  <p>• Free returns and exchanges</p>
                  <p>• Track your order online</p>
                </div>
              )}
            </div>

            {/* Gifting */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => toggleSection("gifting")}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-black">Gifting</span>
                {expandedSection === "gifting" ? (
                  <Minus className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSection === "gifting" && (
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <p>• Complimentary gift wrapping</p>
                  <p>• Personalized gift messages</p>
                  <p>• Premium gift boxes and bags</p>
                  <p>• Gift receipts (prices hidden)</p>
                  <p>• Extended return period for gifts</p>
                  <p>• Digital gift cards available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
