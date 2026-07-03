import { useEffect, useMemo, useState, type JSX } from "react";
import { ArrowUpRight, Check, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchOrders } from "@/features/order/orderThunks";
import {
  selectOrderError,
  selectOrderLoading,
  selectOrders,
} from "@/features/order/orderSlice";
import { cn } from "@/lib/utils";
import { GET, POST } from "@/lib/api";
import type { StandardResponse } from "@/types/api";
import type { Order } from "@/features/order/types/order";

type DisplayOrder = {
  id: string;
  customer: string;
  meta: string;
  amount: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  updatedAt: string;
};

type OrderFilter = "all" | DisplayOrder["status"];
type DetailAction = "approve" | "reject" | null;

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
  return (
    [order.first_name, order.last_name].filter(Boolean).join(" ") || "Customer"
  );
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

function getProductName(item: Order["items"][number]) {
  return item.product?.name || item.product_id || "Product";
}

function getItemLineTotal(item: Order["items"][number]) {
  const unit = Number(item.price?.toString?.() ?? item.price ?? 0);
  const qty = Number(item.quantity ?? 0);
  return unit * qty;
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
              {[
                "Order",
                "Customer",
                "Amount",
                "Status",
                "Updated",
                "Action",
              ].map((header) => (
                <th key={header} className="px-5 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-28 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="mt-2 h-3 w-40 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-20 bg-white/10" />
                </td>
                <td className="px-5 py-5">
                  <Skeleton className="h-9 w-20 rounded-full bg-white/10" />
                </td>
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

function DetailSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-800 bg-[#121d33] p-4"
          >
            <Skeleton className="h-3 w-20 bg-white/10" />
            <Skeleton className="mt-4 h-5 w-40 bg-white/10" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-800 bg-[#10192d]">
        <div className="border-b border-slate-700 p-4">
          <Skeleton className="h-5 w-36 bg-white/10" />
        </div>
        <div className="divide-y divide-slate-700">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid gap-3 p-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((__, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full bg-white/10" />
              ))}
            </div>
          ))}
        </div>
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
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailAction, setDetailAction] = useState<DetailAction>(null);

  useEffect(() => {
    setHasRequested(true);
    void dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!orderDialogOpen || !selectedOrderId) return;

    let active = true;

    const loadOrderDetail = async () => {
      setDetailLoading(true);
      setDetailError(null);
      setOrderDetail(null);

      try {
        const response = await GET<StandardResponse<Order>>(
          `/admin/orders/${selectedOrderId}`,
        );
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to load order detail");
        }

        if (active) {
          setOrderDetail(response.data);
        }
      } catch (loadError) {
        if (active) {
          setDetailError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load order detail",
          );
        }
      } finally {
        if (active) {
          setDetailLoading(false);
        }
      }
    };

    void loadOrderDetail();

    return () => {
      active = false;
    };
  }, [orderDialogOpen, selectedOrderId]);

  const displayOrders = useMemo<DisplayOrder[]>(
    () => liveOrders.map(mapLiveOrder),
    [liveOrders],
  );

  const filteredOrders = useMemo(
    () =>
      filter === "all"
        ? displayOrders
        : displayOrders.filter((order) => order.status === filter),
    [displayOrders, filter],
  );

  const stats = useMemo(
    () => [
      {
        label: "Pending",
        value: filteredOrders.filter((order) => order.status === "pending")
          .length,
      },
      {
        label: "Paid",
        value: filteredOrders.filter((order) => order.status === "paid").length,
      },
      {
        label: "Shipped",
        value: filteredOrders.filter((order) => order.status === "shipped")
          .length,
      },
      {
        label: "Cancelled",
        value: filteredOrders.filter((order) => order.status === "cancelled")
          .length,
      },
    ],
    [filteredOrders],
  );

  const showSkeleton = loading || (!hasRequested && liveOrders.length === 0);
  const showEmptyState =
    hasRequested && !loading && filteredOrders.length === 0;
  const emptyMessage =
    error || filter !== "all"
      ? filter === "all"
        ? "The API could not be loaded, so the table is empty for now."
        : "No orders match the selected filter."
      : "No orders have been created yet.";

  const closeOrderDialog = () => {
    setOrderDialogOpen(false);
    setSelectedOrderId(null);
    setOrderDetail(null);
    setDetailError(null);
    setDetailLoading(false);
    setDetailAction(null);
  };

  const openOrderDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDialogOpen(true);
  };

  const refreshOrders = async () => {
    await dispatch(fetchOrders());
  };

  const handleOrderAction = async (nextStatus: "paid" | "cancelled") => {
    if (!selectedOrderId) return;

    setDetailAction(nextStatus === "paid" ? "approve" : "reject");

    try {
      const actionPath = nextStatus === "paid" ? "approve" : "reject";
      const response = await POST<StandardResponse<Order>>(
        `/admin/orders/${selectedOrderId}/${actionPath}`
      );

      if (response.status !== "success") {
        throw new Error(response.message || "Failed to update order");
      }

      setOrderDetail(response.data);
      await refreshOrders();
    } catch (updateError) {
      setDetailError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update order",
      );
    } finally {
      setDetailAction(null);
    }
  };

  const detailSubtotal =
    orderDetail?.items.reduce(
      (total, item) => total + getItemLineTotal(item),
      0,
    ) ?? 0;
  const detailGrandTotal = Number(
    orderDetail?.total_amount?.toString?.() ?? orderDetail?.total_amount ?? 0,
  );
  const detailShipping = Math.max(detailGrandTotal - detailSubtotal, 0);

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {showSkeleton
          ? Array.from({ length: 4 }).map((_, index) => (
              <OrderStatSkeleton key={index} />
            ))
          : stats.map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-slate-700 bg-[#121d33] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-slate-300">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
      </section>

      <section className="rounded-md border border-slate-700 bg-[#10192d]">
        <div className="flex flex-col gap-3 border-b border-slate-700 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Order Management
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Manage customer orders and review current status.
            </p>
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-slate-700 bg-transparent text-white hover:bg-white/5"
                >
                  <Filter className="h-4 w-4" />
                  {filter === "all"
                    ? "Filter"
                    : `Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-64 border-slate-800 bg-slate-950 p-2 text-white">
                <div className="px-2 py-1.5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Filter orders
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Choose one status at a time.
                  </p>
                </div>

                <div className="mt-2 space-y-1">
                  {[
                    { key: "all", label: "All orders" },
                    { key: "pending", label: "Pending" },
                    { key: "paid", label: "Paid" },
                    { key: "shipped", label: "Shipped" },
                    { key: "completed", label: "Completed" },
                    { key: "cancelled", label: "Cancelled" },
                  ].map((option) => {
                    const active = filter === option.key;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setFilter(option.key as OrderFilter)}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-[#00A9AA]/10 text-[#00A9AA]"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{option.label}</span>
                        {active ? <Check className="h-4 w-4" /> : null}
                      </button>
                    );
                  })}
                </div>

                {filter !== "all" ? (
                  <div className="mt-2 border-t border-slate-800 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-slate-700 bg-transparent text-white hover:bg-white/5"
                      onClick={() => setFilter("all")}
                    >
                      <X className="h-4 w-4" />
                      Clear filter
                    </Button>
                  </div>
                ) : null}
              </PopoverContent>
            </Popover>

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
                {filteredOrders.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.035]">
                    <td className="px-5 py-5 font-medium text-white">
                      {row.id}
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-medium text-white">{row.customer}</p>
                      <p className="text-xs text-slate-500">{row.meta}</p>
                    </td>
                    <td className="px-5 py-5 text-slate-300">{row.amount}</td>
                    <td className="px-5 py-5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize",
                          statusClass[row.status],
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-slate-400">
                      {row.updatedAt}
                    </td>
                    <td className="px-5 py-5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-slate-700 bg-transparent text-white hover:bg-white/5"
                        onClick={() => openOrderDialog(row.id)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Dialog
        open={orderDialogOpen}
        onOpenChange={(open) => (!open ? closeOrderDialog() : null)}
      >
        <DialogContent className="h-[80vh] w-[80vw] max-w-none overflow-hidden rounded-md border border-slate-800 bg-[#070d18] p-0 text-white shadow-2xl sm:max-w-none no-scrollbar">
          <div className="flex h-full min-h-0 flex-col">
            <DialogHeader className="shrink-0 border-b border-slate-800 bg-[#0b1322] px-8 py-5 pr-16">
              <DialogTitle className="text-xl font-semibold text-white">
                Order details
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-slate-400">
                Review customer order, purchased items, shipping address, and
                payment summary.
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-hidden">
              {detailLoading ? (
                <div className="p-8">
                  <DetailSkeleton />
                </div>
              ) : detailError ? (
                <div className="p-8">
                  <div className="rounded-md border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    {detailError}
                  </div>
                </div>
              ) : orderDetail ? (
                <div className="grid h-full min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px]">
                  <main className="min-h-0 overflow-y-auto px-8 py-6">
                    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["Customer", getCustomerName(orderDetail)],
                        [
                          "Payment",
                          orderDetail.payment_method.replace("_", " "),
                        ],
                        ["Status", orderDetail.status],
                        ["Items", `${orderDetail.items.length} items`],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-md border border-slate-800 bg-[#0f1729] p-4"
                        >
                          <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                            {label}
                          </p>
                          <p className="mt-2 break-words text-sm font-semibold capitalize text-slate-100">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <section className="overflow-hidden rounded-md border border-slate-800 bg-[#0f1729]">
                      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            Items purchased
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Product list from order detail API.
                          </p>
                        </div>

                        <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400">
                          {orderDetail.items.length} items
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="border-b border-slate-800 bg-[#0b1322] text-left text-xs text-slate-400">
                            <tr>
                              <th className="px-5 py-3 font-medium">Product</th>
                              <th className="px-5 py-3 font-medium">Qty</th>
                              <th className="px-5 py-3 font-medium">Unit</th>
                              <th className="px-5 py-3 font-medium text-right">
                                Line total
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-800">
                            {orderDetail.items.map((item) => (
                              <tr
                                key={item.id}
                                className="align-top transition-colors hover:bg-white/[0.03]"
                              >
                                <td className="px-5 py-4">
                                  <p className="font-semibold text-white">
                                    {getProductName(item)}
                                  </p>
                                  <p className="mt-1 max-w-xl break-all text-xs text-slate-500">
                                    {item.product_id}
                                  </p>
                                </td>
                                <td className="px-5 py-4 text-slate-300">
                                  {item.quantity}
                                </td>
                                <td className="px-5 py-4 text-slate-300">
                                  {formatMoney(item.price)}
                                </td>
                                <td className="px-5 py-4 text-right font-medium text-slate-100">
                                  {formatMoney(getItemLineTotal(item))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </main>

                  <aside className="min-h-0 overflow-y-auto border-t border-slate-800 bg-[#0b1322] p-6 xl:border-l xl:border-t-0">
                    <div className="space-y-4">
                      <section className="rounded-md border border-slate-800 bg-[#0f1729] p-4">
                        <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                          Shipping
                        </p>

                        <div className="mt-3 space-y-2 text-sm text-slate-300">
                          <p className="font-semibold text-white">
                            {orderDetail.first_name} {orderDetail.last_name}
                          </p>
                          <p>{orderDetail.address}</p>
                          <p>
                            {orderDetail.city}, {orderDetail.postal_code}
                          </p>
                          <p>{orderDetail.phone}</p>
                        </div>
                      </section>

                      <section className="rounded-md border border-slate-800 bg-[#0f1729] p-4">
                        <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                          Payment summary
                        </p>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>Item subtotal</span>
                            <span>{formatMoney(detailSubtotal)}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>Shipping</span>
                            <span>{formatMoney(detailShipping)}</span>
                          </div>

                          <div className="border-t border-slate-800 pt-3">
                            <div className="flex items-center justify-between text-base font-semibold text-white">
                              <span>Total</span>
                              <span>{formatMoney(detailGrandTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </aside>
                </div>
              ) : null}
            </div>

            <DialogFooter className="shrink-0 border-t border-slate-800 bg-[#0b1322] px-8 py-4">
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md border-slate-700 bg-transparent text-white hover:bg-white/5"
                  onClick={closeOrderDialog}
                >
                  Close
                </Button>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    className="rounded-md bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    disabled={!orderDetail || detailAction !== null}
                    onClick={() => handleOrderAction("paid")}
                  >
                    {detailAction === "approve" ? "Approving..." : "Approve"}
                  </Button>

                  <Button
                    type="button"
                    className="rounded-md bg-rose-500 text-white hover:bg-rose-400"
                    disabled={!orderDetail || detailAction !== null}
                    onClick={() => handleOrderAction("cancelled")}
                  >
                    {detailAction === "reject" ? "Rejecting..." : "Reject"}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
