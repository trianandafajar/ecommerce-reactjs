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
    <Link
      to={`/product/${product.id}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={`${product.name} - Premium Mechanical Keyboard Component`}
          width={500}
          height={500}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <Button
          variant="ghost"
          size="icon"
          className="
            absolute top-3 right-3 z-30
            h-9 w-9
            rounded-full
            bg-background/80
            backdrop-blur-md
            border border-border/80
            hover:bg-background
            transition-all duration-200
            cursor-pointer
            shadow-sm
          "
          onClick={handleHeartClick}
        >
          <Heart
            className={`
              w-4 h-4
              text-foreground
              transition-all duration-200
              ${isBookmarked ? "fill-red-500 text-red-500 scale-110" : ""}
            `}
          />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 font-medium text-foreground [text-overflow:clip] transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mb-2 flex items-center gap-1 text-yellow-500">
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
          <div className="translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="relative h-8 w-8 cursor-pointer rounded-full bg-primary text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-primary/90 active:scale-[0.98]"
              onClick={handleCartClick}
            >
              <ShoppingCart className="w-4 h-4" />
              {productCartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
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

