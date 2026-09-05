import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";

export function BusinessOperationsHealthCheckWidget() {
  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-copper-soft text-copper">
          <ClipboardList className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">Business Operations</p>
          <h3 className="mt-1 font-display text-2xl text-navy">Business Operations Health Check</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            11 quick questions about workflows, repetitive work, documentation, customer enquiries, and opportunities to delegate operational support.
          </p>
          <div className="mt-5 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-copper" />Takes about 3 minutes</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-copper" />Instant, practical results</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-copper" />Free and no obligation</div>
          </div>
          <Link to="/health-check/business-operations" className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90">
            Start Business Operations Health Check
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
