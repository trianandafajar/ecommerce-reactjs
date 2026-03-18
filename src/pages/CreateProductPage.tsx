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
    <div className="p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <Card className="bg-card border-border shadow-xl shadow-primary/5">
        <CardHeader className="border-b border-border pb-6 mb-6">
          <CardTitle className="text-2xl text-foreground">Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="bg-background border-border focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="bg-background border-border focus-visible:ring-primary"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">Price (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter product price"
                className="bg-background border-border focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url" className="text-foreground">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
                className="bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
