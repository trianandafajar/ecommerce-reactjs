import { useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, Eye, PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { adminProducts, type AdminProductRow } from "@/components/admin/adminData";
import { cn } from "@/lib/utils";

type ProductStatus = AdminProductRow["status"];
type ProductFormState = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
  description: string;
};

const initialForm: ProductFormState = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: 0,
  status: "Published",
  description: "",
};

const statusClass: Record<ProductStatus, string> = {
  Published: "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/20",
  Draft: "bg-amber-400/10 text-amber-200 ring-1 ring-amber-400/20",
  Archived: "bg-rose-400/10 text-rose-200 ring-1 ring-rose-400/20",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState(adminProducts);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<AdminProductRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(initialForm);

  const currentProduct = useMemo(
    () => products.find((product) => product.id === editingId) ?? null,
    [editingId, products]
  );

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(initialForm);
    setDialogMode("create");
  };

  const openEditDialog = (product: AdminProductRow) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      description: product.description,
    });
    setDialogMode("edit");
  };

  const closeFormDialog = () => {
    setDialogMode(null);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (dialogMode === "edit" && currentProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === currentProduct.id
            ? {
                ...product,
                ...form,
                updatedAt: "Just now",
              }
            : product
        )
      );
    } else {
      const nextProduct: AdminProductRow = {
        id: `PRD-${String(products.length + 1).padStart(3, "0")}`,
        ...form,
        updatedAt: "Just now",
      };
      setProducts((prev) => [nextProduct, ...prev]);
    }

    closeFormDialog();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((product) => product.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Products</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">Product list</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Manage products from one table. Add, inspect details, edit, and delete
              actions are wired in as UI-only interactions for now.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-full border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
            >
              Export list
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button onClick={openCreateDialog} className="rounded-full bg-slate-100 text-slate-950 hover:bg-white">
              <Plus className="h-4 w-4" />
              Add product
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Published", value: products.filter((item) => item.status === "Published").length },
          { label: "Draft", value: products.filter((item) => item.status === "Draft").length },
          { label: "Archived", value: products.filter((item) => item.status === "Archived").length },
          { label: "Low stock", value: products.filter((item) => item.stock < 10).length },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-white">
                    <div>
                      <p>{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <span className={cn(product.stock < 10 ? "text-amber-300" : "text-slate-200")}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", statusClass[product.status])}>
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell>{product.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                        onClick={() => setDetailsProduct(product)}
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                        onClick={() => openEditDialog(product)}
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
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
      </section>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => (!open ? closeFormDialog() : null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "Edit product" : "Add product"}</DialogTitle>
            <DialogDescription>
              Update the product details shown in the admin table.
            </DialogDescription>
          </DialogHeader>

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Product name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Enter product name"
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">SKU</label>
              <Input
                value={form.sku}
                onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
                placeholder="Enter SKU"
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Category</label>
              <Input
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                placeholder="Keyboards, switches, accessories"
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Price</label>
              <Input
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="$0"
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Stock</label>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, stock: Number(event.target.value) || 0 }))
                }
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value as ProductStatus }))
                }
                className="h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm text-slate-300">Description</label>
              <Textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Short product description"
                className="min-h-32 border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                onClick={closeFormDialog}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-slate-100 text-slate-950 hover:bg-white">
                {dialogMode === "edit" ? "Save changes" : "Create product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsProduct !== null} onOpenChange={(open) => (!open ? setDetailsProduct(null) : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product details</DialogTitle>
            <DialogDescription>
              A read-only snapshot of the selected product.
            </DialogDescription>
          </DialogHeader>
          {detailsProduct && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Name</p>
                <p className="mt-2 text-white">{detailsProduct.name}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">SKU</p>
                <p className="mt-2 text-white">{detailsProduct.sku}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Category</p>
                <p className="mt-2 text-white">{detailsProduct.category}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Price</p>
                <p className="mt-2 text-white">{detailsProduct.price}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Stock</p>
                <p className="mt-2 text-white">{detailsProduct.stock}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
                <p className="mt-2 text-white">{detailsProduct.status}</p>
              </div>
              <div className="sm:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Description</p>
                <p className="mt-2 leading-6 text-slate-300">{detailsProduct.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => (!open ? setDeleteTarget(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Remove ${deleteTarget.name} from the list? This action is UI-only for now.`
                : "Remove this product from the list?"}
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
