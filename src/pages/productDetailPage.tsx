import { useAppSelector } from "@/app/hooks";
import { ProductDetail } from "@/features/product/components/productDetail";
import { selectSelectedProduct } from "@/features/product/productSlice";
import SEO from "@/components/SEO";
import { stripMarkdown } from "@/features/product/helper/markdown";

export default function ProductPage() {
  const product = useAppSelector(selectSelectedProduct);

  return (
    <>
      {product && (
        <SEO
          title={product.name}
          description={stripMarkdown(product.description).slice(0, 155)}
          image={product.image_url ?? ""}
          url={`/product/${product.id}`}
          type="product"
          breadcrumbs={[{ name: product.name, url: `/product/${product.id}` }]}
          product={{
            name: product.name,
            description: product.description ?? "",
            price: product.price,
            image: product.image_url ?? "",
            availability: "InStock",
            brand: "Keysthetix",
            category: product.category ?? "Mechanical Keyboards",
          }}
        />
      )}
      <ProductDetail />
    </>
  );
}
