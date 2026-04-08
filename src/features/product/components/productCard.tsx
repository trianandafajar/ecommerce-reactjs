import { memo, useCallback } from "react";
import type React from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { Product } from "@/features/product/types/product";
import {
  addBookmark,
  removeBookmark,
  selectIsBookmarked,
} from "@/features/bookmark/bookmarkSlice";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import { selectCart, selectCartItems } from "@/features/cart/cartSlice";
import { addCartItem, createCart, lookupCart } from "@/features/cart/cartThunks";

interface ProductCardProps {
  product: Product;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector(selectIsBookmarked(product.id));
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const cart = useAppSelector(selectCart);
  const cartItems = useAppSelector(selectCartItems);
  const cartLoading = useAppSelector((state) => state.cart.loading);

  const productInCart = cartItems.find((item) => item.product_id === product.id);
  const productCartItemCount = productInCart ? productInCart.quantity : 0;

  const handleHeartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (isBookmarked) {
      dispatch(removeBookmark(product.id));
    } else {
      dispatch(addBookmark(product));
    }
  }, [dispatch, isAuthenticated, isBookmarked, navigate, product]);

  const handleCartClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    // If item already in cart, navigate to cart like header icon behavior
    if (productCartItemCount > 0) {
      navigate("/cart");
      return;
    }

    if (cartLoading) return;

    let cartId = cart?.id;

    if (!cartId) {
      try {
        const newCart = await dispatch(createCart()).unwrap();
        cartId = newCart.id;
      } catch (err: any) {
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
  }, [isAuthenticated, productCartItemCount, cartLoading, cart?.id, navigate, dispatch, product.id]);

  return (
    <Link to={`/product/${product.id}`} className="bg-card group block border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 animate-in fade-in zoom-in duration-500 relative">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-primary/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-10" />
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={`${product.name} - Premium Mechanical Keyboard Component`}
          width={500}
          height={500}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="w-full h-full object-cover transition-transform duration-700 absolute inset-0 z-0 group-hover:scale-110 group-hover:rotate-3"
        />
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 hover:bg-background/80 !rounded-none cursor-pointer z-20 ${isBookmarked ? "text-red-500" : "text-foreground"
            }`}
          onClick={handleHeartClick}
        >
          <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="text-foreground font-medium mb-1 line-clamp-1 [text-overflow:clip] group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2 text-yellow-500">
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current text-gray-500/30" />
          <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-foreground font-semibold">
            {priceFormatter.format(product.price)}
          </p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="w-4 h-4" />
              {productCartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {productCartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default ProductCard

