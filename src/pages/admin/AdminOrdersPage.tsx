import { useEffect, useMemo, useState, type JSX } from "react";
import { ArrowUpRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import PageBreadcrumb from "@/components/PageBreadCrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchOrders } from "@/features/order/orderThunks";
import {
  selectOrderError,
  selectOrderLoading,
  selectOrders,
} from "@/features/order/orderSlice";
import { cn } from "@/lib/utils";
import type { Order } from "@/features/order/types/order";

type DisplayOrder = {
  id: string;
  customer: string;
  meta: string;
  amount: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  updatedAt: string;
};

const statusClass: Record<DisplayOrder["status"], string> = {
  pending: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  paid: "bg-[#00A9AA]/10 text-[#00A9AA] ring-1 ring-[#00A9AA]/20",
  shipped: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20",
  completed: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20",
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

function formatOrderTime(createdAt: string) {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return createdAt;

  const diff = Date.now() - created.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function getCustomerName(order: Order) {
  return [order.first_name, order.last_name].filter(Boolean).join(" ") || "Customer";
}

function mapLiveOrder(order: Order): DisplayOrder {
  return {
    id: order.id,
    customer: getCustomerName(order),
    meta: order.city ?? order.address,
    amount: formatMoney(order.total_amount),
    status: order.status,
    updatedAt: formatOrderTime(order.created_at),
  };
}

function OrderStatSkeleton() {
  return (
    <div className="rounded-md border border-slate-700 bg-[#121d33] p-5">
      <Skeleton className="h-4 w-20 bg-white/10" />
      <Skeleton className="mt-4 h-8 w-14 bg-white/10" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-slate-700 bg-[#121d33]">
      <div className="border-b border-slate-700 p-6">
        <Skeleton className="h-6 w-40 bg-white/10" />
        <Skeleton className="mt-3 h-4 w-72 bg-white/10" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-700 text-left text-xs text-slate-400">
            <tr>
              {["Order", "Customer", "Amount", "Status", "Updated", "Action"].map((header) => (
                <th key={header} className="px-5 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-5 py-5"><Skeleton className="h-4 w-28 bg-white/10" /></td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="mt-2 h-3 w-40 bg-white/10" />
                </td>
                <td className="px-5 py-5"><Skeleton className="h-4 w-24 bg-white/10" /></td>
                <td className="px-5 py-5"><Skeleton className="h-6 w-20 rounded-full bg-white/10" /></td>
                <td className="px-5 py-5"><Skeleton className="h-4 w-20 bg-white/10" /></td>
                <td className="px-5 py-5"><Skeleton className="h-9 w-20 rounded-full bg-white/10" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyTableState({ message }: { message: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-700 bg-[#121d33]">
      <div className="border-b border-slate-700 p-6">
        <h4 className="text-base font-semibold text-white">Order Queue</h4>
        <p className="mt-2 text-sm text-slate-400">
          There are no orders to show right now.
        </p>
      </div>
      <div className="px-6 py-14 text-center">
        <p className="text-sm text-slate-300">{message}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">
          Empty table state
        </p>
      </div>
    </div>
  );
}

export default function AdminOrdersPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const liveOrders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    setHasRequested(true);
    void dispatch(fetchOrders());
  }, [dispatch]);

  const displayOrders = useMemo<DisplayOrder[]>(() => {
    return liveOrders.map(mapLiveOrder);
  }, [liveOrders]);

  const stats = useMemo(
    () => [
      {
        label: "Pending",
        value: displayOrders.filter((order) => order.status === "pending").length,
      },
      {
        label: "Paid",
        value: displayOrders.filter((order) => order.status === "paid").length,
      },
      {
        label: "Shipped",
        value: displayOrders.filter((order) => order.status === "shipped").length,
      },
      {
        label: "Cancelled",
        value: displayOrders.filter((order) => order.status === "cancelled").length,
      },
    ],
    [displayOrders]
  );

  const showSkeleton = loading || (!hasRequested && liveOrders.length === 0);
  const showEmptyState = hasRequested && !loading && liveOrders.length === 0;
  const emptyMessage = error
    ? "The API could not be loaded, so the table is empty for now."
    : "No orders have been created yet.";

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Orders" />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {showSkeleton
          ? Array.from({ length: 4 }).map((_, index) => <OrderStatSkeleton key={index} />)
          : stats.map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-slate-700 bg-[#121d33] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-slate-300">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
      </section>

      <section className="rounded-md border border-slate-700 bg-[#10192d]">
        <div className="flex flex-col gap-3 border-b border-slate-700 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Order Queue</h3>
            <p className="mt-1 text-sm text-slate-400">
              Manage customer orders and review current status.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-700 bg-transparent text-white hover:bg-white/5"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>

            <Button className="bg-[#00A9AA] text-slate-950 hover:bg-[#00b8b9]">
              Export
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showSkeleton ? (
          <TableSkeleton />
        ) : showEmptyState ? (
          <EmptyTableState message={emptyMessage} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-slate-700 bg-[#0f172a] text-left text-xs text-slate-300">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Updated</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700 bg-[#10192d]">
                {displayOrders.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.035]">
                    <td className="px-5 py-5 font-medium text-white">{row.id}</td>
                    <td className="px-5 py-5">
                      <p className="font-medium text-white">{row.customer}</p>
                      <p className="text-xs text-slate-500">{row.meta}</p>
                    </td>
                    <td className="px-5 py-5 text-slate-300">{row.amount}</td>
                    <td className="px-5 py-5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize",
                          statusClass[row.status]
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-slate-400">{row.updatedAt}</td>
                    <td className="px-5 py-5">
                      <Link to="/admin/orders">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full border-slate-700 bg-transparent text-white hover:bg-white/5"
                        >
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
