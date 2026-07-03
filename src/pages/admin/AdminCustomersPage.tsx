import { useEffect, useMemo, useState, type FormEvent } from "react";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import { GET, PUT } from "@/lib/api";
import type { StandardResponse } from "@/types/api";

type ApiCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: "admin" | "customer";
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
};

type CustomerStatus = "Active" | "Inactive";

type DisplayCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: CustomerStatus;
  joinedAt: string;
};

type CustomerFormState = {
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
};

const initialForm: CustomerFormState = {
  name: "",
  email: "",
  phone: "",
  status: "Active",
};

const statusClass: Record<CustomerStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/20",
  Inactive: "bg-rose-400/10 text-rose-200 ring-1 ring-rose-400/20",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatJoinedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function mapCustomer(customer: ApiCustomer): DisplayCustomer {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone || "-",
    role: customer.role || "customer",
    status: customer.is_active ? "Active" : "Inactive",
    joinedAt: formatJoinedAt(customer.created_at),
  };
}

function CustomerTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-slate-700 bg-[#10192d]">
      <div className="border-b border-slate-700 p-5">
        <Skeleton className="h-6 w-44 bg-white/10" />
        <Skeleton className="mt-2 h-4 w-72 bg-white/10" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-700 text-left text-xs text-slate-400">
            <tr>
              {["Customer", "Email", "Phone", "Role", "Status", "Joined", "Action"].map((label) => (
                <th key={label} className="px-5 py-3">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-44 bg-white/10" />
                  <Skeleton className="mt-2 h-3 w-28 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-40 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-28 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-9 w-28 rounded-full bg-white/10" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<DisplayCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DisplayCustomer | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerFormState>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentCustomer = useMemo(
    () => customers.find((customer) => customer.id === editingId) ?? null,
    [customers, editingId]
  );

  const loadCustomers = async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await GET<StandardResponse<ApiCustomer[]>>("/admin/customers", {
        params: { skip: 0, limit: 100 },
      });

      if (response.status !== "success") {
        throw new Error(response.message || "Failed to fetch customers");
      }

      setCustomers(response.data.map(mapCustomer));
      return response.data;
    } catch (loadError) {
      setCustomers([]);
      setError(loadError instanceof Error ? loadError.message : "Failed to fetch customers");
      return [];
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(initialForm);
    setFormError(null);
    setDialogMode("create");
  };

  const openEditDialog = (customer: DisplayCustomer) => {
    setEditingId(customer.id);
    setFormError(null);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone === "-" ? "" : customer.phone,
      status: customer.status,
    });
    setDialogMode("edit");
  };

  const closeFormDialog = () => {
    setDialogMode(null);
    setEditingId(null);
    setForm(initialForm);
    setFormError(null);
    setSubmitting(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (dialogMode === "edit" && currentCustomer) {
        const response = await PUT<StandardResponse<ApiCustomer>>(
          `/admin/customers/${currentCustomer.id}`,
          {
            name: form.name,
            email: form.email,
            phone: form.phone || null,
            is_active: form.status === "Active",
          }
        );

        if (response.status !== "success") {
          throw new Error(response.message || "Failed to update customer");
        }

        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === currentCustomer.id ? mapCustomer(response.data) : customer
          )
        );
        await loadCustomers({ silent: true });
      } else {
        const nextCustomer: DisplayCustomer = {
          id: `CUS-${String(customers.length + 201).padStart(3, "0")}`,
          name: form.name,
          email: form.email,
          phone: form.phone || "-",
          role: "customer",
          status: form.status,
          joinedAt: "Just now",
        };
        setCustomers((prev) => [nextCustomer, ...prev]);
      }

      closeFormDialog();
    } catch (submitError) {
      setFormError(
        submitError instanceof Error ? submitError.message : "Failed to save customer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCustomers((prev) => prev.filter((customer) => customer.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const showSkeleton = loading;
  const showEmptyState = !loading && customers.length === 0;
  const emptyMessage = error
    ? "The API could not be loaded, so the table is empty for now."
    : "No customers were returned from the API.";

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-700 bg-[#10192d]">
        <div className="flex flex-col gap-4 border-b border-slate-700 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Customer Management</h3>
            <p className="mt-1 text-sm text-slate-400">
              Manage customer accounts from the live admin API.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={openCreateDialog}
              className="bg-[#00A9AA] text-slate-950 hover:bg-[#00b8b9]"
            >
              <Plus className="h-4 w-4" />
              Create customer
            </Button>
          </div>
        </div>

        {showSkeleton ? (
          <CustomerTableSkeleton />
        ) : showEmptyState ? (
          <div className="overflow-hidden rounded-b-md border-t border-slate-700 bg-[#10192d]">
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-slate-300">{emptyMessage}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                Empty table state
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border border-slate-800 bg-slate-950">
                          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-300">{customer.email}</TableCell>
                    <TableCell className="text-sm text-slate-300">{customer.phone}</TableCell>
                    <TableCell className="text-sm text-slate-300 capitalize">{customer.role}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                          statusClass[customer.status]
                        )}
                      >
                        {customer.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{customer.joinedAt}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 hover:text-amber-100"
                          onClick={() => openEditDialog(customer)}
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-rose-100"
                          onClick={() => setDeleteTarget(customer)}
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
        )}
      </section>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => (!open ? closeFormDialog() : null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="pr-12">
            <DialogTitle>{dialogMode === "edit" ? "Edit customer" : "Add customer"}</DialogTitle>
            <DialogDescription>
              Update the customer record shown in the admin table.
            </DialogDescription>
          </DialogHeader>

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            {formError ? (
              <div className="sm:col-span-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {formError}
              </div>
            ) : null}
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Customer name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Enter customer name"
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Enter email"
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Phone</label>
              <Input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="+62 ..."
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value as CustomerStatus }))
                }
                className="h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                onClick={closeFormDialog}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-slate-100 text-slate-950 hover:bg-white"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : dialogMode === "edit"
                    ? "Save changes"
                    : "Create customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => (!open ? setDeleteTarget(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Remove ${deleteTarget.name} from the list? This action is UI-only for now.`
                : "Remove this customer from the list?"}
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
