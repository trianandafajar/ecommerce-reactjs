import { memo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import SEO from "@/components/SEO";
import ProductCard from "@/features/product/components/productCard";
import ProductContainer from "@/features/product/components/productContainer";
import {
  selectHomeListLoading,
  selectHomePagination,
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

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectHomeProducts);
  const loading = useAppSelector(selectHomeListLoading);
  const error = useAppSelector(selectHomeProductError);
  const pagination = useAppSelector(selectHomePagination);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    // Reset page and fetch with new filters
    dispatch(
      fetchProducts({
        page: 1,
        per_page: 12,
        ...(categoryFilter ? { search: categoryFilter } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
      })
    );
    // Scroll to top when filters change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryFilter, searchQuery, dispatch]);

  const paginationRef = useRef(pagination);
  const loadingRef = useRef(loading);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Keep refs in sync for the intersection observer
  useEffect(() => {
    paginationRef.current = pagination;
    loadingRef.current = loading;
  }, [pagination, loading]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    // Use a large rootMargin (e.g. 800px) so it triggers fetching long before the user reaches the bottom
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && paginationRef.current?.has_next) {
          const activeSearch = searchQuery || categoryFilter || "";
          dispatch(
            fetchProducts({
              page: (paginationRef.current?.page ?? 1) + 1,
              per_page: 12,
              ...(activeSearch ? { search: activeSearch } : {}),
            })
          );
        }
      },
      { threshold: 0.1, rootMargin: "800px" }
    );

    observerRef.current.observe(loaderRef.current);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [dispatch, categoryFilter, searchQuery]);

  const titlePrefix = searchQuery
    ? `Search: ${searchQuery}`
    : categoryFilter
    ? `${categoryFilter} Collection`
    : "All Products";

  const seoTitle = `${titlePrefix}`;
  const seoDesc = searchQuery
    ? `Search results for ${searchQuery} active at Keysthetix.`
    : `Browse our ${categoryFilter || "complete"} collection of products at Keysthetix.`;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <SEO
        url={`/products?${searchParams.toString()}`}
        title={seoTitle}
        description={seoDesc}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-foreground capitalize text-center sm:text-left">
            {titlePrefix}
          </h1>
          {(categoryFilter || searchQuery) && (
            <button
              onClick={() => setSearchParams({})}
              className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mb-8">Failed to load products: {error}</p>}

        <ProductContainer loading={loading && products.length === 0}>
          <ProductGrid products={products} />
        </ProductContainer>

        {/* Loader element at the bottom */}
        <div ref={loaderRef} className="flex justify-center mt-8 p-4 h-20 items-center">
          {loading && products.length > 0 && (
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          )}
          {!loading && !pagination?.has_next && products.length > 0 && (
            <p className="text-gray-400">All products have been displayed.</p>
          )}
          {!loading && products.length === 0 && !error && (
            <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
          )}
        </div>
      </div>
    </main>
  );
}
