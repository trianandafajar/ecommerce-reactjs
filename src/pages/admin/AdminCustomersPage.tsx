import { useEffect, useMemo, useState, type FormEvent } from "react";
import { PencilLine, Plus, Trash2, Filter, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type CustomerStatus = "all" | "Active" | "Inactive";

type DisplayCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: Exclude<CustomerStatus, "all">;
  joinedAt: string;
};

type CustomerFormState = {
  name: string;
  email: string;
  phone: string;
  status: Exclude<CustomerStatus, "all">;
};

type PaginationMeta = {
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
  pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
};

type CustomerListResponse = StandardResponse<ApiCustomer[]> & {
  metadata?: {
    pagination?: PaginationMeta;
    filters?: {
      search?: string | null;
      status_value?: string | null;
    };
  };
};

const initialForm: CustomerFormState = {
  name: "",
  email: "",
  phone: "",
  status: "Active",
};

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

const statusClass: Record<Exclude<CustomerStatus, "all">, string> = {
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

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
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
              {["Customer", "Email", "Phone", "Role", "Status", "Joined", "Action"].map(
                (label) => (
                  <th key={label} className="px-5 py-3">
                    {label}
                  </th>
                ),
              )}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState<DisplayCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DisplayCustomer | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerFormState>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const [pagination, setPagination] = useState<{
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  }>({
    page: DEFAULT_PAGE,
    perPage: DEFAULT_PER_PAGE,
    total: 0,
    totalPages: 0,
  });

  const currentPage = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const perPage = parsePositiveInt(
    searchParams.get("per_page"),
    DEFAULT_PER_PAGE,
  );
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "all") as CustomerStatus;

  const currentCustomer = useMemo(
    () => customers.find((customer) => customer.id === editingId) ?? null,
    [customers, editingId],
  );

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextSearch = searchInput.trim();

      if (nextSearch === search) return;

      const nextParams = new URLSearchParams(searchParams);
      if (nextSearch) nextParams.set("search", nextSearch);
      else nextParams.delete("search");
      nextParams.set("page", String(DEFAULT_PAGE));
      setSearchParams(nextParams, { replace: true });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput, search, searchParams, setSearchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const loadCustomers = async () => {
      try {
        const response = await GET<CustomerListResponse>("/admin/customers", {
          params: {
            page: currentPage,
            per_page: perPage,
            search: search || undefined,
            status_value:
              status === "all"
                ? undefined
                : status === "Active"
                  ? "active"
                  : "inactive",
          },
        });

        if (response.status !== "success") {
          throw new Error(response.message || "Failed to fetch customers");
        }

        if (!active) return;

        setCustomers(response.data.map(mapCustomer));

        const meta = response.metadata?.pagination;
        const total = meta?.total ?? response.data.length;
        const totalPages = meta?.total_pages ?? meta?.pages ?? (total > 0 ? Math.ceil(total / perPage) : 0);

        setPagination({
          page: meta?.page ?? currentPage,
          perPage: meta?.per_page ?? perPage,
          total,
          totalPages,
        });
      } catch (loadError) {
        if (!active) return;
        setCustomers([]);
        setPagination({
          page: currentPage,
          perPage,
          total: 0,
          totalPages: 0,
        });
        setError(
          loadError instanceof Error ? loadError.message : "Failed to fetch customers",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadCustomers();

    return () => {
      active = false;
    };
  }, [currentPage, perPage, search, status]);

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

  const updateSearchParams = (next: Record<string, string | number | null | undefined>, options?: { replace?: boolean }) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(next).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    setSearchParams(params, options);
  };

  const resetFilters = () => {
    setSearchInput("");
    const params = new URLSearchParams();
    params.set("page", String(DEFAULT_PAGE));
    params.set("per_page", String(DEFAULT_PER_PAGE));
    setSearchParams(params);
  };

  const goToPage = (page: number) => {
    updateSearchParams({ page }, { replace: false });
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
          },
        );

        if (response.status !== "success") {
          throw new Error(response.message || "Failed to update customer");
        }

        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === currentCustomer.id
              ? mapCustomer(response.data)
              : customer,
          ),
        );
        closeFormDialog();
        return;
      }

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
      closeFormDialog();
    } catch (submitError) {
      setFormError(
        submitError instanceof Error ? submitError.message : "Failed to save customer",
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

  const showSkeleton = loading && customers.length === 0;
  const showEmptyState = !loading && customers.length === 0;
  const activeFilterCount =
    (search.trim() ? 1 : 0) + (status !== "all" ? 1 : 0);
  const emptyMessage = error
    ? error
    : activeFilterCount > 0
      ? "No customers match the selected filters."
      : "No customers were returned from the API.";
  const pageItems = buildPaginationItems(pagination.page, pagination.totalPages);
  const showingFrom =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.perPage + 1;
  const showingTo =
    pagination.total === 0
      ? 0
      : Math.min(pagination.page * pagination.perPage, pagination.total);

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-700 bg-[#10192d]">
        <div className="flex flex-col gap-3 border-b border-slate-700 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Customer Management
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Monitor customer activity and manage account details.

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

        <div className="border-b border-slate-700 bg-[#0d1526] px-5 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:flex-nowrap xl:items-end xl:gap-3">
            <div className="space-y-2 min-w-0 xl:flex-[2.6_1_0%]">
              <label className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Search
              </label>
              <div className="relative">
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Name, email, or phone..."
                  className="h-11 min-h-11 border-slate-700 bg-[#0b1322] pr-10 text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
                />
                {searchInput.trim() ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-slate-400 hover:bg-white/5 hover:text-white"
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="space-y-2 min-w-0 xl:flex-[1_1_0%]">
              <label className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(value) => {
                  const nextParams = new URLSearchParams(searchParams);
                  if (value === "all") nextParams.delete("status");
                  else nextParams.set("status", value);
                  nextParams.set("page", String(DEFAULT_PAGE));
                  setSearchParams(nextParams, { replace: true });
                }}
              >
                <SelectTrigger className="h-11 min-h-11 w-full border-slate-700 bg-[#0b1322] text-sm text-white data-[size=default]:!h-11 data-[size=sm]:!h-11 focus:ring-[#00A9AA]/30">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-[#0b1322] text-white">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set("per_page", value);
                  nextParams.set("page", String(DEFAULT_PAGE));
                  setSearchParams(nextParams, { replace: true });
                }}
              >
                <SelectTrigger className="h-11 min-h-11 w-full border-slate-700 bg-[#0b1322] text-sm text-white data-[size=default]:!h-11 data-[size=sm]:!h-11 focus:ring-[#00A9AA]/30">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-[#0b1322] text-white">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
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
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 bg-[#0f172a] hover:bg-[#0f172a]">
                    <TableHead className="text-slate-300">Customer</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">Phone</TableHead>
                    <TableHead className="text-slate-300">Role</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Joined</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-[#10192d]">
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="border-slate-700 hover:bg-white/[0.035]"
                    >
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 border border-slate-800 bg-slate-950">
                            <AvatarFallback>
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {customer.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {customer.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-300">
                        {customer.email}
                      </TableCell>
                      <TableCell className="text-sm text-slate-300">
                        {customer.phone}
                      </TableCell>
                      <TableCell className="text-sm capitalize text-slate-300">
                        {customer.role}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                            statusClass[customer.status],
                          )}
                        >
                          {customer.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {customer.joinedAt}
                      </TableCell>
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

            {pagination.totalPages > 0 ? (
              <div className="border-t border-slate-700 bg-[#0d1526] px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-400">
                    Showing {showingFrom}-{showingTo} of {pagination.total} customers
                  </div>

                  <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
                    <PaginationContent className="w-full justify-start sm:w-auto sm:justify-end">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={cn(
                            "border-slate-700 bg-transparent text-white hover:bg-white/5",
                            pagination.page <= 1 &&
                              "pointer-events-none opacity-50",
                          )}
                          onClick={(event) => {
                            event.preventDefault();
                            if (pagination.page > 1) goToPage(pagination.page - 1);
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
                                goToPage(item);
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
                            !pagination.totalPages ||
                              pagination.page >= pagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : "",
                          )}
                          onClick={(event) => {
                            event.preventDefault();
                            if (
                              pagination.totalPages &&
                              pagination.page < pagination.totalPages
                            ) {
                              goToPage(pagination.page + 1);
                            }
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => (!open ? closeFormDialog() : null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader className="pr-12">
            <DialogTitle>
              {dialogMode === "edit" ? "Edit customer" : "Add customer"}
            </DialogTitle>
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
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Enter customer name"
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="Enter email"
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Phone</label>
              <Input
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder="+62 ..."
                className="border-slate-800 bg-slate-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Status</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as Exclude<CustomerStatus, "all">,
                  }))
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
