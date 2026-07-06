import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, History, PackageSearch, UserRound } from "lucide-react";
import { GET } from "@/lib/api";
import type { StandardResponse } from "@/types/api";
import type { Order } from "@/features/order/types/order";
import type { Product } from "@/features/product/types/product";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderProgress,
  getOrderStatusLabel,
  getOrderStatusTone,
  isHistoryOrder,
} from "@/features/order/helper/customerOrderUi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type CustomerDashboardResponse = {
  summary: {
    total_orders: number;
    active_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    total_spent: string;
  };
  tracking_order: Order | null;
  latest_order: Order | null;
  recent_orders: Order[];
  featured_products: Product[];
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <Skeleton className="h-4 w-40 bg-white/10" />
        <Skeleton className="mt-3 h-8 w-64 bg-white/10" />
        <Skeleton className="mt-3 h-4 w-96 bg-white/10" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-md border border-slate-800 bg-slate-900 p-5">
            <Skeleton className="h-4 w-24 bg-white/10" />
            <Skeleton className="mt-3 h-8 w-20 bg-white/10" />
            <Skeleton className="mt-3 h-4 w-32 bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function formatPaymentMethod(value?: string | null) {
  if (!value) return "-";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CustomerDashboardPage() {
  const [data, setData] = useState<CustomerDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await GET<StandardResponse<CustomerDashboardResponse>>("/customer/dashboard");
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to load customer dashboard");
        }

        if (!mounted) return;
        setData(response.data);
      } catch (dashboardError) {
        if (!mounted) return;
        setData(null);
        setError(
          dashboardError instanceof Error
            ? dashboardError.message
            : "Failed to load customer dashboard",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const trackingOrder = data?.tracking_order ?? data?.latest_order ?? null;
  const recentHistory = (data?.recent_orders ?? []).filter((order) => isHistoryOrder(order.status)).slice(0, 5);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Customer dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Track orders, history, and your next purchase.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              All data comes directly from the live API, so order status and history stay in sync.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/my/orders">
              <Button variant="outline" className="rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                <PackageSearch className="mr-2 h-4 w-4" />
                Active orders
              </Button>
            </Link>
            <Link to="/my/history">
              <Button variant="outline" className="rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
            </Link>
            <Link to="/my/profile">
              <Button variant="outline" className="rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                <UserRound className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-md border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Total orders</p>
          <p className="mt-3 text-3xl font-semibold text-white">{data?.summary.total_orders ?? 0}</p>
          <p className="mt-2 text-sm text-slate-400">Every order you have placed.</p>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Active orders</p>
          <p className="mt-3 text-3xl font-semibold text-white">{data?.summary.active_orders ?? 0}</p>
          <p className="mt-2 text-sm text-slate-400">Orders that are still being processed or shipped.</p>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Completed</p>
          <p className="mt-3 text-3xl font-semibold text-white">{data?.summary.completed_orders ?? 0}</p>
          <p className="mt-2 text-sm text-slate-400">Orders that have already been completed.</p>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Spent</p>
          <p className="mt-3 text-3xl font-semibold text-white">{formatOrderCurrency(data?.summary.total_spent ?? 0)}</p>
          <p className="mt-2 text-sm text-slate-400">Total purchases that have been successfully paid.</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Track order</p>
              <h2 className="mt-2 text-lg font-semibold text-white">Current status</h2>
            </div>
            {trackingOrder ? (
              <Link to={`/my/orders/${trackingOrder.id}`}>
                <Button variant="outline" className="rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                  View details
                </Button>
              </Link>
            ) : null}
          </div>

          {trackingOrder ? (
            <div className="mt-6 space-y-5 rounded-md border border-slate-800 bg-slate-950 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Order ID</p>
                  <p className="mt-2 font-mono text-lg text-white">{trackingOrder.id}</p>
                  <p className="mt-2 text-sm text-slate-400">{formatOrderDate(trackingOrder.updated_at ?? trackingOrder.created_at)}</p>
                </div>
                <span className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium ${getOrderStatusTone(trackingOrder.status)}`}>
                  {getOrderStatusLabel(trackingOrder.status)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Progress</span>
                  <span>{getOrderProgress(trackingOrder.status)}%</span>
                </div>
                <div className="h-2 rounded-md bg-slate-800">
                  <div
                    className={`h-2 rounded-md ${
                      trackingOrder.status === "cancelled"
                        ? "bg-rose-500"
                        : trackingOrder.status === "completed"
                          ? "bg-emerald-500"
                          : "bg-cyan-400"
                    }`}
                    style={{ width: `${getOrderProgress(trackingOrder.status)}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-slate-800 bg-slate-900 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Payment method</p>
                  <p className="mt-2 text-sm text-white">{formatPaymentMethod(trackingOrder.payment_method)}</p>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-900 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total</p>
                  <p className="mt-2 text-sm text-white">{formatOrderCurrency(trackingOrder.total_amount)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-md border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
              No active orders to track yet.
            </div>
          )}
        </div>

        <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Quick actions</p>
          <div className="mt-5 space-y-3">
            <Link to="/my/orders">
              <Button variant="outline" className="w-full justify-start rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                <PackageSearch className="mr-2 h-4 w-4" />
                Open order history
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link to="/my/history">
              <Button variant="outline" className="w-full justify-start rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                <History className="mr-2 h-4 w-4" />
                View history
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link to="/my/profile">
              <Button variant="outline" className="w-full justify-start rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                <UserRound className="mr-2 h-4 w-4" />
                Open profile
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">History preview</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Your last five past orders</h2>
          </div>
          <Link to="/my/history" className="text-sm text-cyan-300 hover:text-cyan-200">
            View all
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-md border border-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {recentHistory.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4">
                      <p className="font-mono text-sm text-white">{order.id}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium ${getOrderStatusTone(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">{formatOrderCurrency(order.total_amount)}</td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {formatOrderDate(order.created_at)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link to={`/my/orders/${order.id}`} className="text-sm text-cyan-300 hover:text-cyan-200">
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
                {!recentHistory.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                      No history yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Featured products</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Ready to order again</h2>
          </div>
          <Link to="/products" className="text-sm text-cyan-300 hover:text-cyan-200">
            Open catalog
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(data?.featured_products ?? []).map((product) => (
            <div key={product.id} className="overflow-hidden rounded-md border border-slate-800 bg-slate-950">
              <div className="aspect-square bg-slate-900">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{product.category || "Uncategorized"}</p>
                  <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-white">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{product.description || "No description."}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{formatOrderCurrency(product.price)}</span>
                  <Link to={`/product/${product.id}`}>
                    <Button variant="outline" className="h-9 rounded-md border-slate-700 bg-slate-900 text-white hover:bg-slate-800">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
