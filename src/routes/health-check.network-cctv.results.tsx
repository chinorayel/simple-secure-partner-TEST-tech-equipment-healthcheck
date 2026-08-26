import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert, ShieldCheck, Wifi } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { calculateResult, type AnswerMap } from "@/lib/health-check/network-cctv";

export const Route = createFileRoute("/health-check/network-cctv/results")({
  head: () => ({
    meta: [
      { title: "Your Network & CCTV Health Check Results | Simple Secure Solutions" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Results,
});

function Results() {
  const stored = typeof window !== "undefined" ? localStorage.getItem("sss-network-cctv-last") : null;
  const data = useMemo(() => {
    try { return stored ? JSON.parse(stored) as { businessName?: string; contactName?: string; email?: string; phone?: string; provider?: string; answers: AnswerMap } : null; }
    catch { return null; }
  }, [stored]);
  const result = useMemo(() => calculateResult(data?.answers ?? {}), [data]);

  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />
      <main className="relative overflow-hidden pt-28 pb-24">
        <PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.35]" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-copper" /> Assessment Results</div>
          <h1 className="mt-5 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">Your Network & CCTV <span className="text-copper">Health Check</span></h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{data?.businessName ? `${data.businessName} — ` : ""}{result.summary}</p>

          <div className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-soft">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Overall assessment</p><h2 className="mt-2 font-display text-2xl text-navy">{result.headline}</h2></div>
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4 border-copper-soft bg-background"><span className="text-2xl font-semibold text-navy">{result.overallScore}</span><span className="text-[10px] text-muted-foreground">/ 100</span></div>
            </div>
          </div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {result.areas.map((area) => <AreaCard key={area.id} {...area} />)}
          </section>

          <section className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Recommended improvements</p>
            <h2 className="mt-2 font-display text-2xl text-navy">Where you may benefit from an upgrade</h2>
            <div className="mt-5 grid gap-3">{result.recommendations.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-border bg-background p-4 text-sm text-navy"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-copper" />{item}</div>)}</div>
          </section>

          <section className="mt-8 rounded-3xl border border-navy/10 bg-navy p-7 text-navy-foreground shadow-elevated">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">Next step</p>
            <h2 className="mt-2 font-display text-2xl">Want us to review your results?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-80">Simple Secure Solutions can review the areas identified in this assessment and help you prioritize practical improvements such as UPS/battery backup, 4G/5G failover, Wi-Fi optimization and CCTV solutions.</p>
            <a href="/#contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-white">Book a Business Consultation <Wifi className="h-4 w-4" /></a>
          </section>

          <div className="mt-8 flex flex-wrap gap-4"><Link to="/health-check/network-cctv/" className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-copper"><ArrowLeft className="h-4 w-4" /> Retake assessment</Link><Link to="/" className="text-sm font-medium text-muted-foreground hover:text-navy">Back to Simple Secure Solutions</Link></div>
        </div>
      </main>
    </div>
  );
}

function AreaCard({ label, status, score, opportunity }: { label: string; status: "good" | "attention" | "priority"; score: number; opportunity: string }) {
  const statusLabel = status === "good" ? "Good" : status === "attention" ? "Needs Attention" : "Priority Review";
  return <div className="rounded-3xl border border-border bg-card p-6 shadow-soft"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-navy">{label}</p><p className="mt-1 text-xs text-muted-foreground">{statusLabel}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-navy">{Math.round(score * 10)}</div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-copper" style={{ width: `${Math.min(100, score * 10)}%` }} /></div><div className="mt-4 flex gap-2 text-xs leading-relaxed text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" />{opportunity}</div></div>;
}
