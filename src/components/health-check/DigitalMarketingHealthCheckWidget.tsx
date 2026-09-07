import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";

export function DigitalMarketingHealthCheckWidget() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }} aria-hidden />
      <div className="relative p-6 sm:p-8 lg:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft">
          <ClipboardList className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-2xl text-navy sm:text-3xl">Digital Marketing Health Check</h3>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          11 quick questions about your website, professional email, Facebook presence, customer messaging, content, and digital marketing.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-foreground/80">
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Takes about 3 minutes</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Instant, practical results</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Free and no obligation</li>
        </ul>
        <Link to="/health-check/digital-marketing" className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90">
          Start Digital Marketing Health Check <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
