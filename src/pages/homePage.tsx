import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { HeroBanner } from "@/components/heroBanner";
import { CategoryNav } from "@/components/categoryNav";
import ProductCard from "@/features/product/components/productCard";
import ProductContainer from "@/features/product/components/productContainer";
import { fetchProducts } from "@/features/product/productThunks";
import SEO from "@/components/SEO";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items: products, loading, error, pagination } = useAppSelector(
    (state) => state.product
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, per_page: 12, search: categoryFilter }));
  }, [categoryFilter, dispatch]);

  const paginationRef = useRef(pagination);
  const loadingRef = useRef(loading);
  paginationRef.current = pagination;
  loadingRef.current = loading;

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingRef.current &&
          paginationRef.current?.has_next
        ) {
          dispatch(
            fetchProducts({
              page: (paginationRef.current?.page ?? 1) + 1,
              per_page: 12,
              search: categoryFilter,
            })
          );
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [dispatch, categoryFilter]);

  const seoTitle = categoryFilter ? `${categoryFilter} Collection` : undefined
  const seoDesc = categoryFilter
    ? `Browse our premium ${categoryFilter} collection — mechanical keyboards, keycaps & accessories at Keysthetix.`
    : undefined

  return (
    <main>
      <SEO
        url={categoryFilter ? `/?category=${categoryFilter}` : '/'}
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
            <button
              onClick={() => setSearchParams({})}
              className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
            >
              Clear Filter
            </button>
          ) : (
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View All
            </button>
          )}
        </div>

        {error && <p className="text-red-500">Failed to load products: {error}</p>}

        <ProductContainer loading={loading && products.length === 0}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductContainer>
      </div>

      <div ref={loaderRef} className="flex justify-center p-4">
        {loading && <p className="text-gray-500">Loading more...</p>}
        {!loading && !pagination?.has_next && products.length > 0 && (
          <p className="text-gray-400">All products have been displayed.</p>
        )}
      </div>
    </main>
  );
}