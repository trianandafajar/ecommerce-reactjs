import { useEffect, useMemo, useState } from "react";
import { PackageCheck, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GET } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { StandardResponse } from "@/types/api";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardMetricTone = "cyan" | "amber" | "emerald" | "rose";

type DashboardMetric = {
  label: string;
  value: string;
  delta: string;
  tone: DashboardMetricTone;
  note: string;
};

type DashboardStage = {
  label: string;
  value: number;
  accent: string;
};

type DashboardOrder = {
  id: string;
  customer: string;
  email: string;
  amount: string;
  status: string;
  updatedAt: string | Date;
};

type DashboardSummary = {
  queue: number;
  sla: number;
  risk: number;
  latest_handoff: string;
};

type DashboardRevenuePoint = {
  label: string;
  value: number;
  orders: number;
};

type DashboardStatusPoint = {
  label: string;
  value: number;
  share: number;
  accent: string;
};

type DashboardCategoryPoint = {
  label: string;
  value: number;
};

type DashboardCharts = {
  monthly_revenue: DashboardRevenuePoint[];
  status_breakdown: DashboardStatusPoint[];
  top_categories: DashboardCategoryPoint[];
};

type DashboardResponse = {
  metrics: DashboardMetric[];
  order_stages: DashboardStage[];
  recent_orders: DashboardOrder[];
  summary: DashboardSummary;
  charts: DashboardCharts;
};

const statusClass: Record<string, string> = {
  pending: "bg-amber-400/10 text-amber-200 ring-1 ring-amber-400/20",
  paid: "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20",
  shipped: "bg-sky-400/10 text-sky-200 ring-1 ring-sky-400/20",
  completed: "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/20",
  cancelled: "bg-rose-400/10 text-rose-200 ring-1 ring-rose-400/20",
};

function formatRelativeTime(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(Math.round(diffMs / 60000), 0);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-md border border-slate-800 bg-slate-900 p-5">
            <Skeleton className="h-4 w-32 bg-white/10" />
            <Skeleton className="mt-3 h-10 w-24 bg-white/10" />
            <Skeleton className="mt-3 h-4 w-40 bg-white/10" />
            <Skeleton className="mt-5 h-6 w-20 rounded-full bg-white/10" />
          </div>
        ))}
      </section>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await GET<StandardResponse<DashboardResponse>>("/admin/dashboard");
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to load dashboard");
        }

        if (!active) return;
        setData(response.data);
      } catch (dashboardError) {
        if (!active) return;
        setData(null);
        setError(
          dashboardError instanceof Error ? dashboardError.message : "Failed to load dashboard",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => data?.metrics ?? [], [data]);
  const orders = useMemo(() => data?.recent_orders ?? [], [data]);
  const summary = data?.summary;
  const charts = data?.charts;
  const revenueSeries = charts?.monthly_revenue ?? [];
  const categorySeries = charts?.top_categories ?? [];

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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-md border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  {metric.label}
                </p>
                <h4 className="mt-3 text-3xl font-semibold text-white">{metric.value}</h4>
                <p className="mt-2 text-sm text-slate-400">{metric.note}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-slate-300">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
              {metric.delta}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-md border border-slate-800 bg-slate-900 p-5 xl:col-span-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Revenue trend</p>
              <h4 className="mt-2 text-lg font-semibold text-white">Last 6 months</h4>
            </div>
          </div>

          <div className="mt-6 h-72 rounded-md border border-slate-800 bg-slate-950 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0b1322",
                    border: "1px solid #1f2937",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#67e8f9", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#67e8f9", stroke: "#cffafe", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="rounded-md border border-slate-800 bg-slate-900 p-5 xl:col-span-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Top category</p>
              <h4 className="mt-2 text-lg font-semibold text-white">Categoty </h4>
            </div>
          </div>

          <div className="mt-6 h-64 rounded-md border border-slate-800 bg-slate-950 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "#0b1322",
                    border: "1px solid #1f2937",
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Pie
                  data={categorySeries}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={86}
                  paddingAngle={3}
                >
                  {categorySeries.map((_, index) => {
                    const palette = ["#06b6d4", "#14b8a6", "#22c55e", "#f59e0b", "#3b82f6", "#a855f7"];
                    return <Cell key={index} fill={palette[index % palette.length]} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-md border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Recent orders</p>
              <h4 className="mt-2 text-lg font-semibold text-white">Queue moving right now</h4>
            </div>
            <Link to="/admin/orders">
              <Button
                variant="outline"
                className="rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
              >
                See all
              </Button>
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-md border border-slate-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.25em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {orders.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4 text-sm font-medium text-white">{row.id}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-white">{row.customer}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">{row.amount}</td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                            statusClass[row.status],
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatRelativeTime(row.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-md border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Operations notes</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <PackageCheck className="h-4 w-4 text-cyan-300" />
                  Fulfillment status
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {summary?.queue
                    ? `${summary.queue} pending orders are waiting in the queue.`
                    : "No pending orders right now."}
                </p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Users className="h-4 w-4 text-amber-300" />
                  Dashboard snapshot
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {summary?.risk
                    ? `${summary.risk} orders need attention across pending and cancelled states.`
                    : "No risk items currently need follow-up."}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Shortcut</p>
            <div className="mt-4 grid gap-3">
              <Link to="/admin/customers">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                >
                  Manage customers
                </Button>
              </Link>
              <Link to="/admin/orders">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                >
                  Process orders
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
