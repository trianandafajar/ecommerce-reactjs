import { useMemo, useState, type FormEvent } from "react";
import { Ban, Eye, PencilLine, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { adminCustomers, type AdminCustomerRow } from "@/components/admin/adminData";
import { cn } from "@/lib/utils";
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

type CustomerStatus = AdminCustomerRow["status"];
type CustomerFormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
};

const initialForm: CustomerFormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  status: "Active",
};

const statusClass: Record<CustomerStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/20",
  Blocked: "bg-rose-400/10 text-rose-200 ring-1 ring-rose-400/20",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(adminCustomers);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCustomerRow | null>(null);
  const [blockTarget, setBlockTarget] = useState<AdminCustomerRow | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerFormState>(initialForm);

  const currentCustomer = useMemo(
    () => customers.find((customer) => customer.id === editingId) ?? null,
    [customers, editingId]
  );

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(initialForm);
    setDialogMode("create");
  };

  const openEditDialog = (customer: AdminCustomerRow) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      status: customer.status,
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

    if (dialogMode === "edit" && currentCustomer) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === currentCustomer.id
            ? {
                ...customer,
                ...form,
                orders: customer.orders,
                lastSeen: "Just now",
              }
            : customer
        )
      );
    } else {
      const nextCustomer: AdminCustomerRow = {
        id: `CUS-${String(customers.length + 201).padStart(3, "0")}`,
        ...form,
        orders: "0 orders",
        lastSeen: "Just now",
      };
      setCustomers((prev) => [nextCustomer, ...prev]);
    }

    closeFormDialog();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCustomers((prev) => prev.filter((customer) => customer.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleToggleBlock = () => {
    if (!blockTarget) return;
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === blockTarget.id
          ? {
              ...customer,
              status: customer.status === "Active" ? "Blocked" : "Active",
              lastSeen: "Just now",
            }
          : customer
      )
    );
    setBlockTarget(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Customers</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">Customer management</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Manage customer access from one table. Create, edit, block, and delete
              stay in the UI for now while the backend stays untouched.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-full border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
            >
              <ShieldCheck className="h-4 w-4" />
              Review access
            </Button>
            <Button onClick={openCreateDialog} className="rounded-full bg-slate-100 text-slate-950 hover:bg-white">
              <Plus className="h-4 w-4" />
              Add customer
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active", value: customers.filter((item) => item.status === "Active").length },
          { label: "Blocked", value: customers.filter((item) => item.status === "Blocked").length },
          { label: "Total", value: customers.length },
          { label: "With orders", value: customers.filter((item) => Number(item.orders.split(" ")[0]) > 0).length },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
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
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last seen</TableHead>
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
                        <p className="text-xs text-slate-500">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">{customer.phone}</TableCell>
                  <TableCell className="text-sm text-slate-300">{customer.city}</TableCell>
                  <TableCell className="text-sm text-slate-300">{customer.orders}</TableCell>
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
                  <TableCell className="text-sm text-slate-500">{customer.lastSeen}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                        onClick={() => openEditDialog(customer)}
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                        onClick={() => setBlockTarget(customer)}
                      >
                        <Ban className="h-4 w-4" />
                        {customer.status === "Active" ? "Block" : "Unblock"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
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
      </section>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => (!open ? closeFormDialog() : null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "Edit customer" : "Add customer"}</DialogTitle>
            <DialogDescription>
              Update the customer record shown in the admin table.
            </DialogDescription>
          </DialogHeader>

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
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
              <label className="text-sm text-slate-300">City</label>
              <Input
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                placeholder="Jakarta, Bandung, etc."
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm text-slate-300">Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value as CustomerStatus }))
                }
                className="h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none"
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
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
                {dialogMode === "edit" ? "Save changes" : "Create customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedCustomer !== null} onOpenChange={(open) => (!open ? setSelectedCustomer(null) : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer details</DialogTitle>
            <DialogDescription>Read-only snapshot of the selected customer.</DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Name</p>
                <p className="mt-2 text-white">{selectedCustomer.name}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
                <p className="mt-2 text-white">{selectedCustomer.email}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Phone</p>
                <p className="mt-2 text-white">{selectedCustomer.phone}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">City</p>
                <p className="mt-2 text-white">{selectedCustomer.city}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Orders</p>
                <p className="mt-2 text-white">{selectedCustomer.orders}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
                <p className="mt-2 text-white">{selectedCustomer.status}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => (!open ? setDeleteTarget(null) : null)}>
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

      <AlertDialog open={blockTarget !== null} onOpenChange={(open) => (!open ? setBlockTarget(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{blockTarget?.status === "Active" ? "Block customer" : "Unblock customer"}</AlertDialogTitle>
            <AlertDialogDescription>
              {blockTarget
                ? blockTarget.status === "Active"
                  ? `Block ${blockTarget.name} so the account becomes inactive in the UI?`
                  : `Unblock ${blockTarget.name} and mark the account as active again?`
                : "Change the customer status?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleBlock}>
              {blockTarget?.status === "Active" ? "Block" : "Unblock"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
