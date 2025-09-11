// src/pages/admin/CreateProductPage.tsx
import { useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { createProduct } from "@/features/product/productThunks";
import type { Product } from "@/features/product/types/product";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Header } from "@/components/header";

export default function CreateProductPage() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<Omit<Product, "id" | "created_at" | "updated_at">>({
    name: "",
    description: "",
    price: 0,
    image_url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(createProduct(formData)).unwrap();
      toast.success("Product created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Header/>
        <div className="p-8 max-w-2xl mx-auto">
        <Card>
            <CardHeader>
            <CardTitle>Create New Product</CardTitle>
            </CardHeader>
            <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                />
                </div>

                {/* Description */}
                <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={4}
                />
                </div>

                {/* Price */}
                <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter product price"
                    required
                />
                </div>

                {/* Image URL */}
                <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.png"
                />
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    </>
  );
}
