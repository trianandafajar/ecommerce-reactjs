import { store } from "@/app/store";
import { getDetailProduct } from "@/features/product/productThunks";
import { setSelected } from "@/features/product/productSlice";
import type { LoaderFunctionArgs } from "react-router-dom";

export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Product ID is required", { status: 400 });
  }

  const id = String(params.id);
  const state = store.getState();
  const cached = state.product.items.find((p) => p.id === id);
  if (cached) {
    store.dispatch(setSelected(cached));
    return cached;
  }
  const result = await store.dispatch(getDetailProduct(id));

  if (getDetailProduct.rejected.match(result)) {
    throw new Response("Product not found", { status: 404 });
  }

  return result.payload;
}