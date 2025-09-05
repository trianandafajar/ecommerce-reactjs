import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Header } from "@/components/header";
import ProductCard from "@/features/product/components/productCard";
import ProductContainer from "@/features/product/components/productContainer";
import { fetchProducts } from "@/features/product/productThunks";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const {
    items: products,
    loading,
    error,
    pagination,
  } = useAppSelector((state) => state.product);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && pagination?.has_next) {
          dispatch(fetchProducts({ page: pagination.page + 1, per_page: 12 }));
        }
      },
      { threshold: 1 }
    );

    if (pagination?.has_next) {
      observer.observe(loaderRef.current);
    } else {
      // stop observe kalau sudah habis
      observer.unobserve(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [dispatch, loading, pagination]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="p-4">
        {error && <p className="text-red-500">Gagal memuat produk: {error}</p>}

        <ProductContainer>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductContainer>

        {/* Loader indicator */}
        <div ref={loaderRef} className="flex justify-center p-4">
          {loading && <p className="text-gray-500">Loading more...</p>}
          {!loading && !pagination?.has_next && (
            <p className="text-gray-400">Semua produk sudah ditampilkan.</p>
          )}
        </div>
      </main>
    </div>
  );
}
