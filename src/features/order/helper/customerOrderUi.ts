import type { Order } from "../types/order";

const STATUS_STEPS: Record<Order["status"], number> = {
  pending: 25,
  paid: 50,
  shipped: 75,
  completed: 100,
  cancelled: 100,
};

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_TONES: Record<Order["status"], string> = {
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  paid: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  shipped: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  cancelled: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};

export function getOrderProgress(status: Order["status"]) {
  return STATUS_STEPS[status] ?? 0;
}

export function getOrderStatusLabel(status: Order["status"]) {
  return STATUS_LABELS[status] ?? status;
}

export function getOrderStatusTone(status: Order["status"]) {
  return STATUS_TONES[status] ?? "border-slate-700 bg-slate-900 text-slate-300";
}

export function formatOrderDate(value?: string | Date | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatOrderCurrency(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value ?? 0);
  if (Number.isNaN(amount)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isActiveOrder(status: Order["status"]) {
  return status === "pending";
}

export function isHistoryOrder(status: Order["status"]) {
  return status !== "pending";
}
