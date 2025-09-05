// routes/productLoader.ts
import { store } from "@/app/store";
import { fetchProducts } from "@/features/product/productThunks";

export async function productLoader() {
  await store.dispatch(fetchProducts({ page: 1, per_page: 12 }));
  return null;
}
