import { ArrowUpRight, Clock3, PackageCheck, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { adminMetrics, adminOrders, orderStages } from "@/components/admin/adminData";
import { cn } from "@/lib/utils";

const statusClass: Record<string, string> = {
  Pending: "bg-amber-400/10 text-amber-200 ring-1 ring-amber-400/20",
  Paid: "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20",
  Shipped: "bg-sky-400/10 text-sky-200 ring-1 ring-sky-400/20",
  Completed: "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/20",
  Cancelled: "bg-rose-400/10 text-rose-200 ring-1 ring-rose-400/20",
};

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="relative">
            <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-cyan-400" />
            <div className="pl-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                Admin overview
              </p>
              <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                One room for orders, customers, and the whole store flow.
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                This admin surface is built like an operations console: calm, dense,
                and meant for quick decisions. Orders move from pending to shipped
                without losing context.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                  Review backlog
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                >
                  Export report
                </Button>
                <Link to="/admin/orders">
                  <Button
                    variant="outline"
                    className="rounded-full border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                  >
                    Open orders
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Queue</p>
                  <p className="mt-2 text-2xl font-semibold text-white">428</p>
                  <p className="mt-1 text-sm text-slate-400">orders awaiting action</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">SLA</p>
                  <p className="mt-2 text-2xl font-semibold text-white">96.4%</p>
                  <p className="mt-1 text-sm text-slate-400">fulfilled on time</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Risk</p>
                  <p className="mt-2 text-2xl font-semibold text-white">14</p>
                  <p className="mt-1 text-sm text-slate-400">needs escalation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Fulfillment pulse
                </p>
                <h4 className="mt-2 text-lg font-semibold text-white">
                  Status progression
                </h4>
              </div>
              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                12 status updates
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {orderStages.map((stage) => (
                <div key={stage.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{stage.label}</span>
                    <span className="text-slate-500">{stage.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={cn("h-full rounded-full", stage.accent)}
                      style={{ width: `${stage.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Clock3 className="h-4 w-4 text-cyan-300" />
                Latest handoff
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                18 orders moved from paid to shipped in the last hour. No blockers
                detected in the packing queue.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.6rem] border border-slate-800 bg-slate-900 p-5"
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

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Recent orders</p>
              <h4 className="mt-2 text-lg font-semibold text-white">Queue moving right now</h4>
            </div>
            <Link to="/admin/orders">
              <Button
                variant="outline"
                className="rounded-full border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
              >
                See all
              </Button>
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-800">
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
                  {adminOrders.map((row) => (
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
                            statusClass[row.status]
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">{row.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Operations notes</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <PackageCheck className="h-4 w-4 text-cyan-300" />
                  Packaging lane is clear
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Orders shipped before 3 PM are tracking on schedule.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Users className="h-4 w-4 text-amber-300" />
                  Customer follow-up
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  14 customers need reply for payment verification or address checks.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Shortcut</p>
            <div className="mt-4 grid gap-3">
              <Link to="/admin/customers">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-2xl border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
                >
                  Manage customers
                </Button>
              </Link>
              <Link to="/admin/orders">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-2xl border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
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
