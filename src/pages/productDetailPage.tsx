import { Header } from "@/components/header"
import { ProductDetail } from "@/features/product/components/productDetail"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProductDetail />
      </main>
    </div>
  )
}
