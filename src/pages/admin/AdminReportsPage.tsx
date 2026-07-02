import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Reports</p>
        <h3 className="mt-2 text-3xl font-semibold text-white">Signals and summaries</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Reporting is a static mock for now, designed to slot charts and exports
          in later without reworking the dashboard shell.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button className="rounded-full bg-slate-100 text-slate-950 hover:bg-white">
            <Download className="h-4 w-4" />
            Export report
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-slate-700 bg-slate-950 text-white hover:bg-slate-800"
          >
            <BarChart3 className="h-4 w-4" />
            Open analytics
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5 text-white">
          Monthly revenue chart placeholder
        </div>
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5 text-white">
          Fulfillment chart placeholder
        </div>
      </section>
    </div>
  );
}
