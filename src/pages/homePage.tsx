import { memo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { HeroBanner } from "@/components/heroBanner";
import { CategoryNav } from "@/components/categoryNav";
import SEO from "@/components/SEO";
import ProductCard from "@/features/product/components/productCard";
import ProductContainer from "@/features/product/components/productContainer";
import {
  selectHomeListLoading,
  selectHomeProductError,
  selectHomeProducts,
} from "@/features/product/productSlice";
import { fetchProducts } from "@/features/product/productThunks";
import type { Product } from "@/features/product/types/product";

const ProductGrid = memo(function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
});

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectHomeProducts);
  const loading = useAppSelector(selectHomeListLoading);
  const error = useAppSelector(selectHomeProductError);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, per_page: 8, search: categoryFilter }));
  }, [categoryFilter, dispatch]);

  const visibleProducts = products.slice(0, 8);

  const seoTitle = categoryFilter ? `${categoryFilter} Collection` : undefined;
  const seoDesc = categoryFilter
    ? `Browse our premium ${categoryFilter} collection - mechanical keyboards, keycaps & accessories at Keysthetix.`
    : undefined;

  return (
    <main>
      <SEO
        url={categoryFilter ? `/?category=${categoryFilter}` : "/"}
        title={seoTitle}
        description={seoDesc}
        breadcrumbs={
          categoryFilter
            ? [{ name: categoryFilter, url: `/?category=${categoryFilter}` }]
            : undefined
        }
      />

      <HeroBanner />
      <CategoryNav />

      <div
        id="popular"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-foreground capitalize text-center sm:text-left">
            {categoryFilter ? `${categoryFilter} Collection` : "Popular Products"}
          </h2>
          {categoryFilter ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchParams({})}
                className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Clear Filter
              </button>
              <Link
                to={`/products?category=${categoryFilter}`}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View All {categoryFilter}
              </Link>
            </div>
          ) : (
            <Link
              to="/products"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All
            </Link>
          )}
        </div>

        {error && <p className="text-red-500">Failed to load products: {error}</p>}

        <ProductContainer loading={loading && products.length === 0}>
          <ProductGrid products={visibleProducts} />
        </ProductContainer>
      </div>
    </main>
  );
}
