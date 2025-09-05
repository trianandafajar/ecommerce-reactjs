import { Header } from "@/components/header"
import { ProductDetail } from "@/features/product/components/productDetail"
import { useParams } from "react-router-dom"

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div className="p-4">Product not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProductDetail productId={id} />
      </main>
    </div>
  )
}
