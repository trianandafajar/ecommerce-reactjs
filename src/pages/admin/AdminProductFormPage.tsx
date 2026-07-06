import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { GET, POST, PUT } from "@/lib/api";
import api from "@/lib/axios";
import type { StandardResponse } from "@/types/api";
import type { Product } from "@/features/product/types/product";

type UploadImageResponse = StandardResponse<{ url: string }>;
type Mode = "create" | "edit";

const DEFAULT_CATEGORIES = [
  "Mechanical Keyboard",
  "Gaming Keyboard",
  "Keyboard Switches",
  "Keycaps",
  "Stabilizers",
  "Coiled Cable",
  "Keyboard Case",
  "Keyboard Kit",
  "Deskmat",
  "Keyboard Accessories",
];

type ProductFormState = {
  name: string;
  price: string;
  selectedCategory: string;
  description: string;
  imageUrl: string;
};

const initialForm: ProductFormState = {
  name: "",
  price: "",
  selectedCategory: "",
  description: "",
  imageUrl: "",
};

function mergeCategories(...groups: Array<string[] | undefined>) {
  return Array.from(
    new Set(
      groups
        .flatMap((group) => group ?? [])
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function LoadingState() {
  return (
    <div className="rounded-md border border-slate-700 bg-[#10192d] p-5">
      <Skeleton className="h-6 w-36 bg-white/10" />
      <Skeleton className="mt-3 h-4 w-72 bg-white/10" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-11 w-full bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-11 w-full bg-white/10" />
          <Skeleton className="h-11 w-full bg-white/10" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-11 w-full bg-white/10" />
          <Skeleton className="h-11 w-full bg-white/10" />
        </div>
        <Skeleton className="h-40 w-full bg-white/10" />
      </div>
    </div>
  );
}

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const params = useParams<{ productId?: string }>();
  const mode: Mode = params.productId ? "edit" : "create";

  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<ProductFormState>(initialForm);

  const categories = useMemo(
    () => mergeCategories(DEFAULT_CATEGORIES, apiCategories, form.selectedCategory ? [form.selectedCategory] : []),
    [apiCategories, form.selectedCategory],
  );

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await GET<StandardResponse<string[]>>("/products/categories");
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to load categories");
        }

        if (active) {
          setApiCategories(response.data);
        }
      } catch {
        if (active) {
          setApiCategories([]);
        }
      }
    };

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      if (!params.productId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await GET<StandardResponse<Product>>(`/products/${params.productId}`);
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to load product");
        }

        if (!active) return;

        const product = response.data;
        const existingCategory = product.category?.trim() ?? "";

        if (existingCategory) {
          setApiCategories((prev) => (prev.includes(existingCategory) ? prev : [...prev, existingCategory]));
        }

        setForm({
          name: product.name,
          price: String(product.price),
          selectedCategory: existingCategory || DEFAULT_CATEGORIES[0] || "",
          description: product.description ?? "",
          imageUrl: product.image_url ?? "",
        });
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load product");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      active = false;
    };
  }, [params.productId]);

  useEffect(() => {
    if (mode === "create" && categories.length > 0 && !form.selectedCategory) {
      setForm((prev) => ({
        ...prev,
        selectedCategory: categories[0],
      }));
    }
  }, [categories, form.selectedCategory, mode]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadImageResponse>("/products/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to upload image");
    }

    return response.data.data.url;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const resolvedCategory = form.selectedCategory.trim();
    if (!resolvedCategory) {
      setFormError("Category is required.");
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Price must be a valid number.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.imageUrl.trim() || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: resolvedCategory,
        price,
        image_url: imageUrl,
      };

      if (mode === "edit" && params.productId) {
        const response = await PUT<StandardResponse<Product>>(`/products/${params.productId}`, payload);
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to update product");
        }
      } else {
        const response = await POST<StandardResponse<Product>>("/products/", payload);
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to create product");
        }
      }

      navigate("/admin/products");
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      {error ? (
        <div className="mb-4 rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white">
            {mode === "edit" ? "Edit product" : "Add product"}
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Keep product details aligned with the live catalog.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="border-slate-700 bg-transparent text-white hover:bg-white/5"
          asChild
        >
          <Link to="/admin/products">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-md border border-slate-700 bg-[#10192d] px-5 py-5 sm:px-6">

          {formError ? (
            <div className="mb-5 rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {formError}
            </div>
          ) : null}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Product name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Enter product name"
                className="h-11 rounded-md border-slate-700 bg-[#111b30] text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Price</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder="0"
                  className="h-11 rounded-md border-slate-700 bg-[#111b30] text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Image file</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  className="h-11 rounded-md border-slate-700 bg-[#111b30] text-white file:mr-3 file:h-8 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:text-xs file:font-medium file:text-white hover:file:bg-slate-600 focus-visible:ring-[#00A9AA]/30"
                />
                <p className="text-xs text-slate-500">
                  {imageFile
                    ? `Selected: ${imageFile.name}`
                    : form.imageUrl
                      ? "Current image stays if you do not choose a new file."
                      : "PNG, JPG, WEBP or GIF. The uploaded file is stored as a URL."}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Category</label>
              <Select
                value={form.selectedCategory}
                onValueChange={(value) => setForm((prev) => ({ ...prev, selectedCategory: value }))}
              >
                <SelectTrigger className="h-11 min-h-11 w-full rounded-md border-slate-700 bg-[#111b30] text-sm text-white data-[size=default]:!h-11 data-[size=sm]:!h-11 focus:ring-[#00A9AA]/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-[#0b1322] text-white">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <MarkdownEditor
              label="Description"
              helperText=""
              value={form.description}
              onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
              placeholder="Write a short product description..."
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="border-slate-700 bg-transparent text-white hover:bg-white/5"
                asChild
              >
                <Link to="/admin/products">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-[#00A9AA] text-slate-950 hover:bg-[#00b8b9]"
                disabled={saving}
              >
                {saving ? "Saving..." : mode === "edit" ? "Save changes" : "Create product"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
