import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Reports</p>
        <h3 className="mt-2 text-3xl font-semibold text-foreground">Signals and summaries</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Reporting is a static mock for now, designed to slot charts and exports
          in later without reworking the dashboard shell.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export report
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-border bg-background text-foreground hover:bg-accent"
          >
            <BarChart3 className="h-4 w-4" />
            Open analytics
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border bg-card p-5 text-foreground shadow-sm">
          Monthly revenue chart placeholder
        </div>
        <div className="rounded-[1.5rem] border border-border bg-card p-5 text-foreground shadow-sm">
          Fulfillment chart placeholder
        </div>
      </section>
    </div>
  );
}
