// routes/productLoader.ts
import { store } from "@/app/store";
import { getDetailProduct } from "@/features/product/productThunks";
import type { LoaderFunctionArgs } from "react-router-dom";

export async function productDetailLoader({ params }: LoaderFunctionArgs) {
    if(!params.id) {
        throw new Response("Product ID is required", { status: 400 });
    }
    await store.dispatch(getDetailProduct(String(params.id)))
}