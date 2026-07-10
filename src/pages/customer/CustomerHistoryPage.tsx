import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Filter, PackageSearch, Search, X } from "lucide-react";
import { GET } from "@/lib/api";
import type { StandardResponse, PaginationMeta } from "@/types/api";
import type { Order } from "@/features/order/types/order";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusTone,
} from "@/features/order/helper/customerOrderUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE = 10;

function formatPaymentMethod(value?: string | null) {
  if (!value) return "-";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function HistoryTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <Skeleton className="h-6 w-44 bg-muted" />
        <Skeleton className="mt-2 h-4 w-72 bg-muted" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <tr>
              {["Order", "Status", "Payment", "Total", "Updated", "Action"].map((label) => (
                <th key={label} className="px-5 py-3">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-36 bg-muted" />
                  <Skeleton className="mt-2 h-3 w-24 bg-muted" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-6 w-24 rounded-full bg-muted" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-28 bg-muted" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-24 bg-muted" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-28 bg-muted" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-9 w-24 rounded-full bg-muted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CustomerHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    per_page: DEFAULT_PAGE_SIZE,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const perPage = Number(searchParams.get("per_page") ?? `${DEFAULT_PAGE_SIZE}`) || DEFAULT_PAGE_SIZE;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextSearch = searchInput.trim();
      const currentSearch = searchParams.get("search") ?? "";

      if (nextSearch === currentSearch) return;

      setSearchParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        if (nextSearch) nextParams.set("search", nextSearch);
        else nextParams.delete("search");
        nextParams.set("page", "1");
        nextParams.set("kind", "history");
        return nextParams;
      }, { replace: true });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await GET<StandardResponse<Order[]>>("/orders/me", {
          params: {
            page,
            per_page: perPage,
            kind: "history",
            ...(searchParams.get("search") ? { search: searchParams.get("search") } : {}),
          },
        });

        if (response.status !== "success") {
          throw new Error(response.message || "Failed to fetch order history");
        }

        setItems(response.data);
        const meta = response.metadata?.pagination as
          | (PaginationMeta & { total_pages?: number })
          | undefined;

        if (meta) {
          setPagination({
            page: meta.page ?? page,
            per_page: meta.per_page ?? perPage,
            total: meta.total ?? response.data.length,
            pages: meta.pages ?? meta.total_pages ?? 0,
            has_next: meta.has_next ?? false,
            has_prev: meta.has_prev ?? false,
          });
        } else {
          setPagination((prev) => ({
            ...prev,
            page,
            per_page: perPage,
            total: response.data.length,
            pages: response.data.length ? 1 : 0,
          }));
        }
      } catch (fetchError) {
        setItems([]);
        setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch order history");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [page, perPage, searchParams]);

  const goToPage = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    nextParams.set("per_page", String(perPage));
    nextParams.set("kind", "history");
    setSearchParams(nextParams);
  };

  const handlePerPageChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("per_page", value);
    nextParams.set("page", "1");
    nextParams.set("kind", "history");
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setSearchInput("");
    const nextParams = new URLSearchParams();
    nextParams.set("page", "1");
    nextParams.set("per_page", String(DEFAULT_PAGE_SIZE));
    nextParams.set("kind", "history");
    setSearchParams(nextParams);
  };

  const activeFilterCount = searchInput.trim() ? 1 : 0;
  const showingFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.per_page + 1;
  const showingTo =
    pagination.total === 0 ? 0 : Math.min(pagination.page * pagination.per_page, pagination.total);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Order History</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Past and completed orders live here in the same table style as customer management.
            </p>
          </div>

          <Link to="/products">
            <Button variant="outline" className="border-border bg-background text-foreground hover:bg-accent">
              <PackageSearch className="h-4 w-4" />
              Continue shopping
            </Button>
          </Link>
        </div>

        <div className="border-b border-border bg-background px-5 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:flex-nowrap xl:items-end xl:gap-3">
            <div className="space-y-2 min-w-0 xl:flex-[2.6_1_0%]">
              <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Order ID, address, city, or phone..."
                  className="h-11 min-h-11 border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30"
                />
                {searchInput.trim() ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="space-y-2 min-w-0 xl:flex-[1_1_0%]">
              <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Per page
              </label>
              <Select
                value={String(perPage)}
                onValueChange={(value) => handlePerPageChange(value)}
              >
                <SelectTrigger className="h-11 min-h-11 w-full border-border bg-background text-sm text-foreground data-[size=default]:!h-11 data-[size=sm]:!h-11 focus:ring-primary/30">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end xl:shrink-0">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full border-border bg-background px-5 text-foreground hover:bg-accent xl:w-auto"
                onClick={resetFilters}
                disabled={activeFilterCount === 0}
              >
                <Filter className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="border-b border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {loading && items.length === 0 ? (
          <HistoryTableSkeleton />
        ) : (
          <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                  <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-muted-foreground">Order</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Payment</TableHead>
                    <TableHead className="text-muted-foreground">Total</TableHead>
                    <TableHead className="text-muted-foreground">Updated</TableHead>
                    <TableHead className="text-right text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-card">
                  {items.map((order) => (
                    <TableRow key={order.id} className="border-border hover:bg-accent/50">
                      <TableCell className="font-medium text-foreground">
                        <p className="font-mono text-sm text-foreground">{order.id}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatOrderDate(order.created_at)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                            getOrderStatusTone(order.status),
                          )}
                        >
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatPaymentMethod(order.payment_method)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatOrderCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatOrderDate(order.updated_at ?? order.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          to={`/my/orders/${order.id}`}
                          className="inline-flex items-center rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                          Track
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && !items.length ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        {error
                          ? "Unable to load history."
                          : activeFilterCount > 0
                            ? "No history orders match the current filters."
                            : "No history orders available."}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>

            {pagination.pages > 0 ? (
              <div className="border-t border-border bg-background px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {showingFrom}-{showingTo} of {pagination.total} orders
                  </div>

                  <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
                    <PaginationContent className="w-full justify-start sm:w-auto sm:justify-end">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={cn(
                            "border-border bg-background text-foreground hover:bg-accent",
                            !pagination.has_prev && "pointer-events-none opacity-50",
                          )}
                          onClick={(event) => {
                            event.preventDefault();
                            if (pagination.has_prev) goToPage(page - 1);
                          }}
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-border bg-primary/10 px-3 text-sm text-primary">
                          {page}
                        </span>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className={cn(
                            "border-border bg-background text-foreground hover:bg-accent",
                            !pagination.has_next && "pointer-events-none opacity-50",
                          )}
                          onClick={(event) => {
                            event.preventDefault();
                            if (pagination.has_next) goToPage(page + 1);
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
    </div>
  );
}
