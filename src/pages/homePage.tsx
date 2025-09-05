import { Header } from "@/components/header";
import ProductCard from "@/features/product/components/productCard";
import ProductContainer from "@/features/product/components/productContainer";
import { PRODUCTS_ITEMS } from "@/features/product/data/product";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProductContainer>
          {PRODUCTS_ITEMS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductContainer>
      </main>
    </div>
  );
}
