import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ClipboardList } from "lucide-react";
import { BusinessOperationsHealthCheckWidget } from "@/components/health-check/BusinessOperationsHealthCheckWidget";

export function HomeAssessmentExtras() {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (window.location.pathname !== "/") return;
    const grid = document.querySelector<HTMLElement>("#assessments .mt-10.grid");
    setTarget(grid);
  }, []);

  if (!target) return null;

  return createPortal(
    <>
      <div>
        <BusinessOperationsHealthCheckWidget />
      </div>
      <div>
        <div className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <ClipboardList className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Marketing</p>
              <h3 className="mt-1 font-display text-2xl text-navy">Marketing Health Check</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Assess your marketing presence, online assets, branding, and customer-facing visibility. We are preparing this assessment now.
              </p>
              <span className="mt-5 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </>,
    target,
  );
}
