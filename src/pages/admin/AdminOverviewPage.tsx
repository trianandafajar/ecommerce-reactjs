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
  Label,
  Legend,
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

const categoryPalette = [
  "#06b6d4",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#a855f7",
];

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
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <Skeleton className="h-4 w-32 bg-muted" />
            <Skeleton className="mt-3 h-10 w-24 bg-muted" />
            <Skeleton className="mt-3 h-4 w-40 bg-muted" />
            <Skeleton className="mt-5 h-6 w-20 rounded-full bg-muted" />
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
        const response =
          await GET<StandardResponse<DashboardResponse>>("/admin/dashboard");
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to load dashboard");
        }

        if (!active) return;
        setData(response.data);
      } catch (dashboardError) {
        if (!active) return;
        setData(null);
        setError(
          dashboardError instanceof Error
            ? dashboardError.message
            : "Failed to load dashboard",
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
  const total = useMemo(
    () => categorySeries.reduce((sum, item) => sum + item.value, 0),
    [categorySeries],
  );

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {metric.label}
                </p>
                <h4 className="mt-3 text-3xl font-semibold text-foreground">
                  {metric.value}
                </h4>
                {/* <p className="mt-2 text-sm text-muted-foreground">{metric.note}</p> */}
              </div>
              <div className="rounded-2xl border border-border bg-muted p-3 text-muted-foreground">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              {metric.delta}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                Revenue trend
              </p>
              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Last 6 months
              </h4>
            </div>
          </div>

          <div className="mt-6 h-72 rounded-2xl border border-border bg-background p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueSeries}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    color: "var(--foreground)",
                  }}
                  labelStyle={{ color: "var(--muted-foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: "var(--primary)",
                    stroke: "var(--background)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:col-span-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                Top category
              </p>
              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Category
              </h4>
            </div>
        </div>

          <div className="mt-6 h-[300px] bg-background">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value, name) => [`${value}`, name]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    color: "var(--foreground)",
                  }}
                />

                <Pie
                  data={categorySeries}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="40%"
                  innerRadius={52}
                  outerRadius={86}
                  paddingAngle={1}
                  stroke="var(--background)"
                  strokeWidth={2}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      Number(innerRadius) +
                      (Number(outerRadius) - Number(innerRadius)) * 0.55;

                    const x =
                      Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
                    const y =
                      Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

                    const percentage =
                      total > 0 ? Math.round((Number(value) / total) * 100) : 0;

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#ffffff"
                        fontSize={10}
                        fontWeight={700}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {percentage}%
                      </text>
                    );
                  }}
                >
                  {categorySeries.map((item, index) => (
                    <Cell
                      key={item.label}
                      fill={categoryPalette[index % categoryPalette.length]}
                    />
                  ))}

                  <Label
                    position="center"
                    content={({ viewBox }: any) => {
                      const cx = viewBox?.cx;
                      const cy = viewBox?.cy;

                      if (cx == null || cy == null) return null;

                      return (
                        <g>
                          <text
                            x={cx}
                            y={cy - 8}
                            textAnchor="middle"
                            fill="var(--foreground)"
                            fontSize={12}
                            fontWeight={500}
                          >
                            Total
                          </text>

                          <text
                            x={cx}
                            y={cy + 14}
                            textAnchor="middle"
                            fill="var(--foreground)"
                            fontSize={18}
                            fontWeight={700}
                          >
                            {total}
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingTop: 0, fontSize: 12 }}
                  formatter={(value) => (
                    <span className="text-[11px] text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                Recent orders
              </p>
              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Queue moving right now
              </h4>
            </div>
            <Link to="/admin/orders">
              <Button
                variant="outline"
                className="rounded-md border-border bg-background text-foreground hover:bg-accent"
              >
                See all
              </Button>
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted text-left text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {orders.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        {row.id}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {row.customer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.email}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {row.amount}
                      </td>
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
                      <td className="px-4 py-4 text-sm text-muted-foreground">
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
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              Operations notes
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <PackageCheck className="h-4 w-4 text-cyan-300" />
                  Fulfillment status
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {summary?.queue
                    ? `${summary.queue} pending orders are waiting in the queue.`
                    : "No pending orders right now."}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Users className="h-4 w-4 text-amber-300" />
                  Dashboard snapshot
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {summary?.risk
                    ? `${summary.risk} orders need attention across pending and cancelled states.`
                    : "No risk items currently need follow-up."}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              Shortcut
            </p>
            <div className="mt-4 grid gap-3">
              <Link to="/admin/customers">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-border bg-background text-foreground hover:bg-accent"
                >
                  Manage customers
                </Button>
              </Link>
              <Link to="/admin/orders">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-border bg-background text-foreground hover:bg-accent"
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
