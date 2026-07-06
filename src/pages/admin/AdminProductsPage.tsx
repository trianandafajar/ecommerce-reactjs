import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Filter,
  ImageIcon,
  PencilLine,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { cn } from "@/lib/utils";
import { DELETE, GET, POST, PUT } from "@/lib/api";
import type { StandardResponse, PaginationMeta } from "@/types/api";
import type { Product } from "@/features/product/types/product";
import { formatMarkdown, stripMarkdown } from "@/features/product/helper/markdown";

type ProductListResponse = StandardResponse<Product[]> & {
  metadata?: {
    pagination?: PaginationMeta;
  };
};

type ProductCategoryResponse = StandardResponse<string[]>;

type ProductFilter = "all" | string;
type ProductFormMode = "preset" | "custom";
type ProductDialogMode = "create" | "edit" | null;

type ProductFormState = {
  name: string;
  price: string;
  imageUrl: string;
  categoryMode: ProductFormMode;
  selectedCategory: string;
  customCategory: string;
  description: string;
};

type ProductPreview = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  category?: string | null;
  description: string;
  created_at?: string | Date;
  updated_at?: string | Date;
};

const DEFAULT_PER_PAGE = 8;

const initialForm: ProductFormState = {
  name: "",
  price: "",
  imageUrl: "",
  categoryMode: "preset",
  selectedCategory: "",
  customCategory: "",
  description: "",
};

function formatMoney(value: unknown) {
  const numeric = Number(value?.toString?.() ?? value ?? 0);
  if (Number.isNaN(numeric)) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric);
}

function formatUpdatedAt(value?: string | Date | null) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function buildPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) {
    items.push("ellipsis");
  }

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < totalPages - 1) {
    items.push("ellipsis");
  }

  items.push(totalPages);
  return items;
}

function ProductTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-[#10192d]">
      <div className="border-b border-slate-800 p-5">
        <Skeleton className="h-6 w-52 bg-white/10" />
        <Skeleton className="mt-2 h-4 w-80 bg-white/10" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-800 bg-[#0f172a] text-left text-xs text-slate-400">
            <tr>
              {["Product", "Category", "Price", "Updated", "Action"].map((label) => (
                <th key={label} className="px-5 py-3">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-44 bg-white/10" />
                      <Skeleton className="h-3 w-60 bg-white/10" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-6 w-28 rounded-full bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-9 w-44 rounded-full bg-white/10" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-[#10192d]">
      <div className="border-b border-slate-800 p-5">
        <h4 className="text-lg font-semibold text-white">Catalog is quiet</h4>
        <p className="mt-2 text-sm text-slate-400">
          Add a product or loosen the filters to bring items back.
        </p>
      </div>
      <div className="px-6 py-16 text-center">
        <p className="text-sm text-slate-300">{message}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">
          No rows returned
        </p>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductFilter>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false,
  });
  const [hasLoaded, setHasLoaded] = useState(false);

  const [dialogMode, setDialogMode] = useState<ProductDialogMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ProductFormState>(initialForm);

  const currentProduct = useMemo(
    () => products.find((product) => product.id === selectedProduct?.id) ?? null,
    [products, selectedProduct],
  );

  const currentCategoryValue = useMemo(() => {
    if (form.categoryMode === "custom") {
      return form.customCategory.trim();
    }

    return form.selectedCategory.trim();
  }, [form.categoryMode, form.customCategory, form.selectedCategory]);

  const previewProduct: ProductPreview = {
    id: currentProduct?.id ?? "preview",
    name: form.name || "Preview product",
    price: Number(form.price) || 0,
    image_url: form.imageUrl || null,
    category:
      form.categoryMode === "custom"
        ? form.customCategory || "Custom"
        : form.selectedCategory || "Uncategorized",
    description: form.description || "",
    created_at: currentProduct?.created_at,
    updated_at: currentProduct?.updated_at,
  };

  const activeFilterCount =
    (debouncedSearch.trim() ? 1 : 0) + (categoryFilter !== "all" ? 1 : 0);

  const pageItems = useMemo(
    () => buildPaginationItems(pagination.page, pagination.pages || 0),
    [pagination.page, pagination.pages],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await GET<ProductCategoryResponse>("/products/categories");
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to load categories");
        }

        if (active) {
          setCategories(response.data);
        }
      } catch {
        if (active) {
          setCategories([]);
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
    setLoading(true);
    setError(null);

    const loadProducts = async () => {
      try {
        const response = await GET<ProductListResponse>("/products/", {
          params: {
            page,
            per_page: perPage,
            search: debouncedSearch || undefined,
            category: categoryFilter === "all" ? undefined : categoryFilter,
          },
        });

        if (response.status !== "success") {
          throw new Error(response.message || "Failed to fetch products");
        }

        if (!active) return;

        const meta = response.metadata?.pagination as
          | (PaginationMeta & { total_pages?: number })
          | undefined;
        const totalPages =
          meta?.total_pages ?? meta?.pages ?? (response.data.length > 0 ? Math.ceil(response.data.length / perPage) : 0);

        if (page > 1 && totalPages > 0 && page > totalPages) {
          setPage(totalPages);
          return;
        }

        setProducts(response.data);
        setPagination({
          page: meta?.page ?? page,
          per_page: meta?.per_page ?? perPage,
          total: meta?.total ?? response.data.length,
          pages: totalPages,
          has_next: meta?.has_next ?? page < totalPages,
          has_prev: meta?.has_prev ?? page > 1,
        });
      } catch (loadError) {
        if (!active) return;
        setProducts([]);
        setPagination({
          page,
          per_page: perPage,
          total: 0,
          pages: 0,
          has_next: false,
          has_prev: false,
        });
        setError(loadError instanceof Error ? loadError.message : "Failed to fetch products");
      } finally {
        if (active) {
          setLoading(false);
          setHasLoaded(true);
        }
      }
    };

    void loadProducts();

    return () => {
      active = false;
    };
  }, [page, perPage, debouncedSearch, categoryFilter]);

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setCategoryFilter("all");
    setPage(1);
  };

  const openCreateDialog = () => {
    const defaultCategory = categories[0] ?? "";
    setSelectedProduct(null);
    setForm({
      ...initialForm,
      categoryMode: defaultCategory ? "preset" : "custom",
      selectedCategory: defaultCategory,
    });
    setFormError(null);
    setDialogMode("create");
  };

  const openEditDialog = (product: Product) => {
    const existingCategory = product.category?.trim() ?? "";
    const categoryKnown = categories.includes(existingCategory);

    setSelectedProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      imageUrl: product.image_url ?? "",
      categoryMode: categoryKnown ? "preset" : "custom",
      selectedCategory: categoryKnown ? existingCategory : categories[0] ?? "",
      customCategory: categoryKnown ? "" : existingCategory,
      description: product.description ?? "",
    });
    setFormError(null);
    setDialogMode("edit");
  };

  const closeFormDialog = () => {
    setDialogMode(null);
    setSelectedProduct(null);
    setForm(initialForm);
    setFormError(null);
    setSubmitting(false);
  };

  const refreshCurrentPage = async (targetPage = page) => {
    const response = await GET<ProductListResponse>("/products/", {
      params: {
        page: targetPage,
        per_page: perPage,
        search: debouncedSearch || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
      },
    });

    if (response.status !== "success") {
      throw new Error(response.message || "Failed to fetch products");
    }

    const meta = response.metadata?.pagination as
      | (PaginationMeta & { total_pages?: number })
      | undefined;
    const totalPages =
      meta?.total_pages ?? meta?.pages ?? (response.data.length > 0 ? Math.ceil(response.data.length / perPage) : 0);

    if (targetPage > 1 && totalPages > 0 && targetPage > totalPages) {
      setPage(totalPages);
      return;
    }

    setProducts(response.data);
    setPagination({
      page: meta?.page ?? targetPage,
      per_page: meta?.per_page ?? perPage,
      total: meta?.total ?? response.data.length,
      pages: totalPages,
      has_next: meta?.has_next ?? targetPage < totalPages,
      has_prev: meta?.has_prev ?? targetPage > 1,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const resolvedCategory = currentCategoryValue;
    if (!resolvedCategory) {
      setFormError("Category is required.");
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Price must be a valid number.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: resolvedCategory,
      price,
      image_url: form.imageUrl.trim() || null,
    };

    try {
      if (dialogMode === "edit" && currentProduct) {
        const response = await PUT<ProductListResponse>(`/products/${currentProduct.id}`, payload);
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to update product");
        }
      } else {
        const response = await POST<ProductListResponse>("/products/", payload);
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to create product");
        }
        if (page !== 1) {
          setPage(1);
          closeFormDialog();
          return;
        }
        await refreshCurrentPage(1);
        closeFormDialog();
        return;
      }

      await refreshCurrentPage();
      closeFormDialog();
    } catch (submitError) {
      setFormError(
        submitError instanceof Error ? submitError.message : "Failed to save product",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await DELETE<StandardResponse<{ deleted_id: string }>>(
        `/products/${deleteTarget.id}`,
      );
      if (response.status !== "success") {
        throw new Error(response.message || "Failed to delete product");
      }
      setDeleteTarget(null);
      await refreshCurrentPage();
    } catch (deleteError) {
      setFormError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete product",
      );
    }
  };

  const showSkeleton = loading && !hasLoaded;
  const showEmptyState = !loading && products.length === 0;
  const emptyMessage = error
    ? error
    : activeFilterCount > 0
      ? "No products match the selected filters."
      : "No products have been created yet.";
  const showingFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.per_page + 1;
  const showingTo =
    pagination.total === 0
      ? 0
      : Math.min(pagination.page * pagination.per_page, pagination.total);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-md border border-slate-700 bg-[#10192d]">
        <div className="flex flex-col gap-3 border-b border-slate-700 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="mt-2 text-lg font-semibold text-white">Products</h3>
            <p className="mt-1 text-sm text-slate-400">
              Manage the live catalog from the FastAPI backend.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={openCreateDialog}
              className="rounded-full bg-[#00A9AA] text-slate-950 hover:bg-[#00b8b9]"
            >
              <Plus className="h-4 w-4" />
              Add product
            </Button>
          </div>
        </div>

        <div className="border-b border-slate-700 bg-[#0d1526] px-5 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:flex-nowrap xl:items-end xl:gap-3">
            <div className="space-y-2 min-w-0 xl:flex-[2.8_1_0%]">
              <label className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Search
              </label>
              <div className="relative">
                <Input
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                  }}
                  placeholder="Product name, category, or description..."
                  className="h-11 min-h-11 border-slate-700 bg-[#0b1322] pr-10 text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
                />
                {searchInput.trim() ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-slate-400 hover:bg-white/5 hover:text-white"
                    onClick={() => {
                      setSearchInput("");
                      setDebouncedSearch("");
                      setPage(1);
                    }}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="space-y-2 min-w-0 xl:flex-[1.1_1_0%]">
              <label className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Category
              </label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value as ProductFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 min-h-11 w-full border-slate-700 bg-[#0b1322] text-sm text-white data-[size=default]:!h-11 data-[size=sm]:!h-11 focus:ring-[#00A9AA]/30">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-[#0b1322] text-white">
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-0 xl:flex-[0.9_1_0%]">
              <label className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Per page
              </label>
              <Select
                value={String(perPage)}
                onValueChange={(value) => {
                  setPerPage(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 min-h-11 w-full border-slate-700 bg-[#0b1322] text-sm text-white data-[size=default]:!h-11 data-[size=sm]:!h-11 focus:ring-[#00A9AA]/30">
                  <SelectValue placeholder="8" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-[#0b1322] text-white">
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end xl:shrink-0">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full border-slate-700 bg-transparent px-5 text-white hover:bg-white/5 xl:w-auto"
                onClick={resetFilters}
                disabled={activeFilterCount === 0}
              >
                <Filter className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          </div>
        </div>

        {showSkeleton ? (
          <ProductTableSkeleton />
        ) : showEmptyState ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 bg-[#0f172a] hover:bg-[#0f172a]">
                    <TableHead className="text-slate-300">Product</TableHead>
                    <TableHead className="text-slate-300">Category</TableHead>
                    <TableHead className="text-slate-300">Price</TableHead>
                    <TableHead className="text-slate-300">Updated</TableHead>
                    <TableHead className="text-right text-slate-300">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-[#10192d]">
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="border-slate-700 hover:bg-white/[0.035]"
                    >
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-600">
                                <ImageIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {product.name}
                            </p>
                            <p className="mt-1 line-clamp-1 max-w-[26rem] text-xs text-slate-500">
                              {stripMarkdown(product.description) || "No description yet."}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-300">
                        <span className="inline-flex rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-200">
                          {product.category || "Uncategorized"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-300">
                        {formatMoney(product.price)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {formatUpdatedAt(product.updated_at || product.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-700 bg-transparent text-white hover:bg-white/5"
                            onClick={() => setDetailsProduct(product)}
                          >
                            <Sparkles className="h-4 w-4" />
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 hover:text-amber-100"
                            onClick={() => openEditDialog(product)}
                          >
                            <PencilLine className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-rose-100"
                            onClick={() => setDeleteTarget(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t border-slate-700 bg-[#0d1526] px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-400">
                  Showing {showingFrom}-{showingTo} of {pagination.total} products
                </div>

                {pagination.pages > 0 ? (
                  <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
                    <PaginationContent className="w-full justify-start sm:w-auto sm:justify-end">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={cn(
                            "border-slate-700 bg-transparent text-white hover:bg-white/5",
                            !pagination.has_prev && "pointer-events-none opacity-50",
                          )}
                          onClick={(event) => {
                            event.preventDefault();
                            if (pagination.has_prev) {
                              setPage((prev) => Math.max(prev - 1, 1));
                            }
                          }}
                        />
                      </PaginationItem>

                      {pageItems.map((item, index) =>
                        item === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis className="text-slate-400" />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              href="#"
                              isActive={item === pagination.page}
                              className={cn(
                                "border-slate-700 bg-transparent text-white hover:bg-white/5",
                                item === pagination.page &&
                                  "border-[#00A9AA]/30 bg-[#00A9AA]/10 text-[#00A9AA]",
                              )}
                              onClick={(event) => {
                                event.preventDefault();
                                setPage(item);
                              }}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className={cn(
                            "border-slate-700 bg-transparent text-white hover:bg-white/5",
                            !pagination.has_next && "pointer-events-none opacity-50",
                          )}
                          onClick={(event) => {
                            event.preventDefault();
                            if (pagination.has_next) {
                              setPage((prev) => prev + 1);
                            }
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => (!open ? closeFormDialog() : null)}>
        <DialogContent className="h-[92vh] w-[96vw] max-w-[1280px] overflow-hidden border-slate-800 bg-[#10192d] p-0 text-white shadow-2xl shadow-black/50">
          <div className="flex h-full flex-col">
            <div className="shrink-0 border-b border-slate-800 bg-[#0b1322] px-7 py-5">
              <DialogHeader className="pr-12">
                <DialogTitle className="text-xl font-semibold text-white">
                  {dialogMode === "edit" ? "Edit product" : "Add product"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-slate-400">
                  Add product details, pricing, category, image, and description.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
              <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(380px,0.8fr)]">
                <div className="min-h-0 overflow-y-auto px-7 py-6 lg:border-r lg:border-slate-800">
                  <div className="mx-auto max-w-3xl space-y-6">
                    {formError ? (
                      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {formError}
                      </div>
                    ) : null}

                    <div className="rounded-3xl border border-slate-800 bg-[#0b1322]/70 p-5">
                      <div className="mb-5">
                        <h3 className="mt-2 text-lg font-semibold text-white">
                          Basic information
                        </h3>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm text-slate-300">Product name</label>
                          <Input
                            value={form.name}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, name: event.target.value }))
                            }
                            placeholder="Enter product name"
                            className="h-12 rounded-xl border-slate-700 bg-[#111b30] text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-slate-300">Price</label>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={form.price}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, price: event.target.value }))
                            }
                            placeholder="0"
                            className="h-12 rounded-xl border-slate-700 bg-[#111b30] text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-slate-300">Image URL</label>
                          <Input
                            type="url"
                            value={form.imageUrl}
                            onChange={(event) =>
                              setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                            }
                            placeholder="https://example.com/product.jpg"
                            className="h-12 rounded-xl border-slate-700 bg-[#111b30] text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-slate-300">Category</label>
                          <Select
                            value={form.categoryMode === "custom" ? "__custom__" : form.selectedCategory}
                            onValueChange={(value) => {
                              if (value === "__custom__") {
                                setForm((prev) => ({
                                  ...prev,
                                  categoryMode: "custom",
                                  customCategory: prev.customCategory || prev.selectedCategory,
                                }));
                                return;
                              }

                              setForm((prev) => ({
                                ...prev,
                                categoryMode: "preset",
                                selectedCategory: value,
                                customCategory: "",
                              }));
                            }}
                          >
                            <SelectTrigger className="h-12 min-h-12 w-full rounded-xl border-slate-700 bg-[#111b30] text-sm text-white data-[size=default]:!h-12 data-[size=sm]:!h-12 focus:ring-[#00A9AA]/30">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-800 bg-[#0b1322] text-white">
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                              <SelectItem value="__custom__">Custom category</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {form.categoryMode === "custom" ? (
                          <div className="space-y-2">
                            <label className="text-sm text-slate-300">Custom category</label>
                            <Input
                              value={form.customCategory}
                              onChange={(event) =>
                                setForm((prev) => ({ ...prev, customCategory: event.target.value }))
                              }
                              placeholder="Type a new category"
                              className="h-12 rounded-xl border-slate-700 bg-[#111b30] text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-[#0b1322]/70 p-5">
                      <MarkdownEditor
                        label="Description"
                        value={form.description}
                        onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                        placeholder="Write a short product description..."
                      />
                    </div>
                  </div>
                </div>

                <div className="min-h-0 overflow-y-auto bg-[#0b1322]/70 px-7 py-6">
                  <div className="sticky top-0 space-y-5">
                    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#10192d] shadow-xl shadow-black/20">
                      <div className="aspect-[16/10] bg-slate-950">
                        {previewProduct.image_url ? (
                          <img
                            src={previewProduct.image_url}
                            alt={previewProduct.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-600">
                            <ImageIcon className="h-14 w-14" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 border-t border-slate-800 p-5">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-[#00A9AA]/30 bg-[#00A9AA]/10 px-3 py-1 text-xs font-medium text-[#00A9AA]">
                            {previewProduct.category || "Uncategorized"}
                          </span>
                          <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300">
                            {formatMoney(previewProduct.price)}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                            Live preview
                          </p>
                          <h4 className="mt-2 text-2xl font-semibold leading-tight text-white">
                            {previewProduct.name || "Preview product"}
                          </h4>
                        </div>

                        <div
                          className="space-y-2 text-sm leading-6 text-slate-300"
                          dangerouslySetInnerHTML={{
                            __html:
                              formatMarkdown(previewProduct.description) ||
                              '<p class="text-sm text-slate-500">No description yet.</p>',
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Quick notes
                      </p>
                      <ul className="mt-4 space-y-3">
                        <li>Keep the image URL public and accessible.</li>
                        <li>Use the markdown toolbar to emphasize key details.</li>
                        <li>Category can use an existing option or a custom value.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="shrink-0 border-t border-slate-800 bg-[#0b1322] px-7 py-5">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-700 bg-transparent text-white hover:bg-white/5"
                  onClick={closeFormDialog}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#00A9AA] text-slate-950 hover:bg-[#00b8b9]"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : dialogMode === "edit"
                      ? "Save changes"
                      : "Create product"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsProduct !== null} onOpenChange={(open) => (!open ? setDetailsProduct(null) : null)}>
        <DialogContent className="max-w-[min(96vw,960px)]">
          <DialogHeader className="pr-12">
            <DialogTitle>Product details</DialogTitle>
            <DialogDescription>
              Real product snapshot from the backend.
            </DialogDescription>
          </DialogHeader>

          {detailsProduct ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0b1322]">
                <div className="aspect-[4/3] bg-slate-950">
                  {detailsProduct.image_url ? (
                    <img
                      src={detailsProduct.image_url}
                      alt={detailsProduct.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-600">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 border-t border-slate-800 p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#00A9AA]/30 bg-[#00A9AA]/10 px-3 py-1 text-xs font-medium text-[#00A9AA]">
                      {detailsProduct.category || "Uncategorized"}
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300">
                      {formatMoney(detailsProduct.price)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Updated
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      {formatUpdatedAt(detailsProduct.updated_at || detailsProduct.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Product name
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold text-white">
                    {detailsProduct.name}
                  </h4>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Image URL
                  </p>
                  <p className="mt-2 break-all text-sm text-slate-300">
                    {detailsProduct.image_url || "No image set"}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Description
                  </p>
                  <div
                    className="mt-4 space-y-3 text-sm leading-6 text-slate-300"
                    dangerouslySetInnerHTML={{
                      __html:
                        formatMarkdown(detailsProduct.description) ||
                        '<p class="text-sm text-slate-500">No description available.</p>',
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => (!open ? setDeleteTarget(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Remove ${deleteTarget.name} from the catalog? This action will delete the live record.`
                : "Remove this product from the catalog?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
