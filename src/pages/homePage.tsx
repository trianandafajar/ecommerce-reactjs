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
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="text-center text-3xl font-semibold capitalize text-foreground sm:text-left">
            {categoryFilter ? `${categoryFilter} Collection` : "Popular Products"}
          </h2>

          {categoryFilter ? (
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSearchParams({})}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear filter
              </button>

              <Link
                to={`/products?category=${categoryFilter}`}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                View all {categoryFilter}
              </Link>
            </div>
          ) : (
            <Link
              to="/products"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              View all
            </Link>
          )}
        </div>

        <ProductContainer loading={loading && products.length === 0}>
          <ProductGrid products={visibleProducts} />
        </ProductContainer>
      </div>
    </main>
  );
}
