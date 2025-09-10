// routes/cartLoader.ts
import { store } from "@/app/store";
import { lookupCart } from "@/features/cart/cartThunks";

export async function cartLoader() {
  try {
    await store.dispatch(lookupCart({})).unwrap();
  } catch (error) {
    console.error("Failed to prefetch cart:", error);
  }
  return null;
}
