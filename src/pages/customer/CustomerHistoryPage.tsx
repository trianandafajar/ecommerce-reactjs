import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GET } from "@/lib/api";
import type { StandardResponse, PaginationMeta } from "@/types/api";
import type { Order } from "@/features/order/types/order";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusTone,
} from "@/features/order/helper/customerOrderUi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, PackageSearch } from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

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

  const formatPaymentMethod = (value?: string | null) => {
    if (!value) return "-";
    return value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextSearch = searchInput.trim();
      const currentSearch = searchParams.get("search") ?? "";
      if (nextSearch === currentSearch) {
        return;
      }

      setSearchParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        if (nextSearch) {
          nextParams.set("search", nextSearch);
        } else {
          nextParams.delete("search");
        }
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

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Order history</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Completed and past orders.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              All orders other than pending appear on this page.
            </p>
          </div>
          <Link to="/products">
            <Button className="rounded-md bg-cyan-400 text-slate-950 hover:bg-cyan-300">
              <PackageSearch className="mr-2 h-4 w-4" />
              Continue shopping
            </Button>
          </Link>
        </div>
      </section>

      <section className="rounded-md border border-slate-800 bg-slate-900 p-5">
        <div className="grid gap-3 xl:grid-cols-[1.5fr_0.6fr]">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.25em] text-slate-500">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Order ID, address, city, or phone..."
                className="h-11 rounded-md border-slate-700 bg-slate-950 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-[#00A9AA]/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.25em] text-slate-500">Per page</label>
            <select
              value={String(perPage)}
              onChange={(event) => handlePerPageChange(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="rounded-md border border-slate-800 bg-slate-900">
        <div className="overflow-hidden rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                      Loading history...
                    </td>
                  </tr>
                ) : items.length ? (
                  items.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-4">
                        <p className="font-mono text-sm text-white">{order.id}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatOrderDate(order.created_at)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium ${getOrderStatusTone(order.status)}`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {formatPaymentMethod(order.payment_method)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        {formatOrderCurrency(order.total_amount)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">
                        {formatOrderDate(order.updated_at ?? order.created_at)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link to={`/my/orders/${order.id}`} className="inline-flex items-center text-sm text-cyan-300 hover:text-cyan-200">
                          Track
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                      No history orders match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-800 px-4 py-4">
          <p className="text-sm text-slate-400">
            Showing {items.length} of {pagination.total} orders
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (pagination.has_prev) goToPage(page - 1);
                  }}
                  className={`${!pagination.has_prev ? "pointer-events-none opacity-50" : ""} border-slate-700 bg-slate-950 text-white hover:bg-slate-800`}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-cyan-300">
                  {page}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (pagination.has_next) goToPage(page + 1);
                  }}
                  className={`${!pagination.has_next ? "pointer-events-none opacity-50" : ""} border-slate-700 bg-slate-950 text-white hover:bg-slate-800`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </div>
  );
}
