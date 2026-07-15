import { useEffect, useMemo, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Skeleton className="h-4 w-32 bg-muted" />
        <Skeleton className="mt-3 h-10 w-80 bg-muted" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl bg-muted" />
        <div className="mt-6 flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32 rounded-full bg-muted" />
          <Skeleton className="h-10 w-28 rounded-full bg-muted" />
          <Skeleton className="h-10 w-28 rounded-full bg-muted" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="gap-0">
            <CardHeader className="pb-4">
              <Skeleton className="h-4 w-24 bg-muted" />
              <Skeleton className="mt-3 h-9 w-24 bg-muted" />
              <Skeleton className="mt-3 h-4 w-40 bg-muted" />
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="gap-0">
          <CardHeader className="border-b border-border pb-6">
            <Skeleton className="h-4 w-28 bg-muted" />
            <Skeleton className="mt-3 h-6 w-44 bg-muted" />
          </CardHeader>
          <CardContent className="pt-6">
            <Skeleton className="h-48 w-full bg-muted" />
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader className="border-b border-border pb-6">
            <Skeleton className="h-4 w-28 bg-muted" />
            <Skeleton className="mt-3 h-6 w-40 bg-muted" />
          </CardHeader>
          <CardContent className="pt-6">
            <Skeleton className="h-48 w-full bg-muted" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function formatPaymentMethod(value?: string | null) {
  if (!value) return "-";
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
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
  const recentHistory = useMemo(
    () => (data?.recent_orders ?? []).filter((order) => isHistoryOrder(order.status)).slice(0, 5),
    [data],
  );

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="gap-0">
          <CardHeader className="pb-4">
            <CardDescription>Total orders</CardDescription>
            <CardTitle className="text-3xl font-semibold text-foreground">
              {data?.summary.total_orders ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="gap-0">
          <CardHeader className="pb-4">
            <CardDescription>Active orders</CardDescription>
            <CardTitle className="text-3xl font-semibold text-foreground">
              {data?.summary.active_orders ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="gap-0">
          <CardHeader className="pb-4">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl font-semibold text-foreground">
              {data?.summary.completed_orders ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="gap-0">
          <CardHeader className="pb-4">
            <CardDescription>Spent</CardDescription>
            <CardTitle className="text-3xl font-semibold text-foreground">
              {formatOrderCurrency(data?.summary.total_spent ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="gap-0">
          <CardHeader className="border-b border-border pb-6">
            <CardDescription>Track order</CardDescription>
            <CardTitle className="text-lg text-foreground">Current status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {trackingOrder ? (
              <div className="space-y-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Order ID
                    </p>
                    <p className="mt-2 font-mono text-lg text-foreground">{trackingOrder.id}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatOrderDate(trackingOrder.updated_at ?? trackingOrder.created_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                      getOrderStatusTone(trackingOrder.status),
                    )}
                  >
                    {getOrderStatusLabel(trackingOrder.status)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{getOrderProgress(trackingOrder.status)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${
                        trackingOrder.status === "cancelled"
                          ? "bg-rose-500"
                          : trackingOrder.status === "completed"
                            ? "bg-emerald-500"
                            : "bg-primary"
                      }`}
                      style={{ width: `${getOrderProgress(trackingOrder.status)}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Payment method
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {formatPaymentMethod(trackingOrder.payment_method)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Total
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {formatOrderCurrency(trackingOrder.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-background p-5 text-sm text-muted-foreground">
                No active orders to track yet.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="gap-0">
          <CardHeader className="border-b border-border pb-6">
            <CardDescription>Quick actions</CardDescription>
            <CardTitle className="text-lg text-foreground">Jump to common tasks</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <Link to="/my/orders">
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start rounded-xl border-border bg-background text-foreground hover:bg-accent"
                  >
                    <PackageSearch className="mr-2 h-4 w-4" />
                    Active orders
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/my/history">
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start rounded-xl border-border bg-background text-foreground hover:bg-accent"
                  >
                    <History className="mr-2 h-4 w-4" />
                    History
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/my/profile">
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start rounded-xl border-border bg-background text-foreground hover:bg-accent"
                  >
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start rounded-xl border-border bg-background text-foreground hover:bg-accent"
                  >
                    <PackageSearch className="mr-2 h-4 w-4" />
                    Browse products
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              Featured products
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Ready to order again
            </h2>
          </div>
          <Link to="/products" className="text-sm text-primary hover:opacity-80">
            Open catalog
          </Link>
        </div>

        <div className="px-5 py-5">
          <div className="space-y-4">
            {(data?.featured_products ?? []).map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 md:flex-row md:items-center"
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted md:w-28 md:flex-none">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {product.category || "Uncategorized"}
                    </p>
                    <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-foreground md:text-base">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {product.description || "No description."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:text-right">
                  <span className="text-sm font-semibold text-foreground">
                    {formatOrderCurrency(product.price)}
                  </span>
                  <Link to={`/product/${product.id}`}>
                    <Button
                      variant="outline"
                      className="h-9 rounded-md border-border bg-background text-foreground hover:bg-accent"
                    >
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
              History preview
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Your last five past orders
            </h2>
          </div>
          <Link to="/my/history" className="text-sm text-primary hover:opacity-80">
            View all
          </Link>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHistory.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <p className="font-mono text-sm text-foreground">{order.id}</p>
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
                      {formatOrderCurrency(order.total_amount)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatOrderDate(order.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/my/orders/${order.id}`} className="inline-flex items-center text-sm text-primary hover:opacity-80">
                        Track
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {!recentHistory.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No history yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}
