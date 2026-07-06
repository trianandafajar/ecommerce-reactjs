import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GET } from "@/lib/api";
import type { StandardResponse } from "@/types/api";
import type { Order } from "@/features/order/types/order";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderProgress,
  getOrderStatusLabel,
  getOrderStatusTone,
} from "@/features/order/helper/customerOrderUi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function TrackSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <Skeleton className="h-4 w-32 bg-white/10" />
        <Skeleton className="mt-3 h-8 w-56 bg-white/10" />
        <Skeleton className="mt-3 h-4 w-80 bg-white/10" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
          <Skeleton className="h-5 w-40 bg-white/10" />
          <Skeleton className="mt-4 h-32 w-full bg-white/10" />
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
          <Skeleton className="h-5 w-32 bg-white/10" />
          <Skeleton className="mt-4 h-44 w-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function CustomerOrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadOrder = async () => {
      if (!orderId) {
        setError("Order not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await GET<StandardResponse<Order>>(`/orders/${orderId}/track`);
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to load order tracking");
        }

        if (!mounted) return;
        setOrder(response.data);
      } catch (trackError) {
        if (!mounted) return;
        setOrder(null);
        setError(trackError instanceof Error ? trackError.message : "Failed to load order tracking");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadOrder();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  if (loading && !order) {
    return <TrackSkeleton />;
  }

  if (!order) {
    return (
      <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-rose-200">{error ?? "Order not found"}</p>
        <div className="mt-4">
          <Link to="/my/orders">
            <Button variant="outline" className="rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
              Back to orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = getOrderProgress(order.status);
  const paymentMethod = order.payment_method
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const milestones = [
    { label: "Pending", done: progress >= 25, value: 25 },
    { label: "Paid", done: progress >= 50, value: 50 },
    { label: "Shipped", done: progress >= 75, value: 75 },
    { label: "Completed", done: progress >= 100, value: 100 },
  ];

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Tracking</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Order {order.id}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Status terakhir diambil langsung dari API sehingga kamu selalu melihat posisi terbaru.
            </p>
          </div>
          <Link to="/my/orders">
            <Button variant="outline" className="rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
              Back to orders
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Status</p>
              <h2 className="mt-2 text-lg font-semibold text-white">Progress timeline</h2>
            </div>
            <span className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium ${getOrderStatusTone(order.status)}`}>
              {getOrderStatusLabel(order.status)}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-md bg-slate-800">
                <div
                  className={`h-2 rounded-md ${
                    order.status === "cancelled"
                      ? "bg-rose-500"
                      : order.status === "completed"
                        ? "bg-emerald-500"
                        : "bg-cyan-400"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {milestones.map((milestone) => (
                <div
                  key={milestone.label}
                  className={`rounded-md border px-4 py-3 ${
                    milestone.done
                      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                      : "border-slate-800 bg-slate-950 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{milestone.label}</span>
                    <span className="text-xs">{milestone.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Order info</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Created</span>
                <span>{formatOrderDate(order.created_at)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Updated</span>
                <span>{formatOrderDate(order.updated_at ?? order.created_at)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Payment</span>
                <span>{paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Total</span>
                <span>{formatOrderCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Shipping</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>{[order.first_name, order.last_name].filter(Boolean).join(" ") || "Customer"}</p>
              <p>{order.phone || "-"}</p>
              <p>{order.address}</p>
              <p>{[order.city, order.postal_code].filter(Boolean).join(", ") || "-"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-800 bg-slate-900 p-6">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Items</p>
        <div className="mt-5 overflow-hidden rounded-md border border-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-white">{item.product?.name ?? item.product_id}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">{item.quantity}</td>
                    <td className="px-4 py-4 text-sm text-slate-300">{formatOrderCurrency(item.price)}</td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      {formatOrderCurrency(Number(item.price) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
