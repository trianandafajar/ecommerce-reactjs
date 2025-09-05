// routes/productLoader.ts
import { store } from "@/app/store";
import { fetchProducts, getDetailProduct } from "@/features/product/productThunks";
import type { LoaderFunctionArgs } from "react-router-dom";

export async function productLoader() {
  await store.dispatch(fetchProducts({ page: 1, per_page: 12 }));
  return null;
}

export async function productDetailLoader({ params }: LoaderFunctionArgs) {
    if(!params.id) {
        throw new Response("Product ID is required", { status: 400 });
    }
    await store.dispatch(getDetailProduct(String(params.id)))
}