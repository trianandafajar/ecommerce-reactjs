import type React from "react";
import { ProductCardSkeleton } from "./productCardSkeleton";

interface ProductContainerProps {
  children?: React.ReactNode;
  loading?: boolean;
}

const ProductContainer: React.FC<ProductContainerProps> = ({ children, loading }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading 
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))
          : children
        }
      </div>
    </div>
  );
};

export default ProductContainer