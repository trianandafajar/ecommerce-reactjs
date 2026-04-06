import { useAppSelector } from "@/app/hooks";
import { ProductDetail } from "@/features/product/components/productDetail";
import SEO from "@/components/SEO";

export default function ProductPage() {
  const product = useAppSelector((state) => state.product.selectedProduct);

  return (
    <>
      {product && (
        <SEO
          title={product.name}
          description={product.description.slice(0, 155)}
          image={product.image_url}
          url={`/product/${product.id}`}
          type="product"
          breadcrumbs={[{ name: product.name, url: `/product/${product.id}` }]}
          product={{
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image_url,
            availability: "InStock",
            brand: "Keysthetix",
            category: "Mechanical Keyboards",
          }}
        />
      )}
      <ProductDetail />
    </>
  );
}
