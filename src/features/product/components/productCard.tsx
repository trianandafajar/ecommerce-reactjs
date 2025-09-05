import type React from "react";
import { Heart } from "lucide-react";
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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector(selectIsBookmarked(product.id));
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isBookmarked) {
      dispatch(removeBookmark(product.id));
      removeBookmark(product.id);
    } else {
      dispatch(addBookmark(product));
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="bg-white group block">
      <div className="relative aspect-square bg-gray-50">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 hover:bg-white/80 !rounded-none cursor-pointer ${
            isBookmarked ? "text-red-500" : "text-black"
          }`}
          onClick={handleHeartClick}
        >
          <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="text-black font-medium mb-2 line-clamp-1 [text-overflow:clip]">
          {product.name}
        </h3>
        <p className="text-black text-sm">{product.price}</p>
      </div>
    </Link>
  );
}

export default ProductCard