import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import SEO from "@/components/SEO";
import VirtualProductGrid from "@/features/product/components/VirtualProductGrid";
import {
  selectHomeListLoading,
  selectHomePagination,
  selectHomeProductError,
  selectHomeProducts,
} from "@/features/product/productSlice";
import { fetchProducts } from "@/features/product/productThunks";

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

  const handleLoadMore = useCallback(() => {
    if (!loading && pagination?.has_next) {
      const activeSearch = searchQuery || categoryFilter || "";
      dispatch(
        fetchProducts({
          page: (pagination?.page ?? 1) + 1,
          per_page: 12,
          ...(activeSearch ? { search: activeSearch } : {}),
        })
      );
    }
  }, [dispatch, loading, pagination, searchQuery, categoryFilter]);

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
              className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mb-8 text-center bg-red-500/10 p-4 rounded-lg">Failed to load products: {error}</p>}

        <VirtualProductGrid
          products={products}
          loading={loading}
          hasNextPage={!!pagination?.has_next}
          onLoadMore={handleLoadMore}
        />
      </div>
    </main>
  );
}

