import type React from "react";

interface ProductContainerProps {
  children: React.ReactNode;
}

const ProductContainer: React.FC<ProductContainerProps> = ({ children }) => {
  return (
    <div className="container bg-gray-100 min-h-screen">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductContainer