import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ClipboardCheck, TrendingUp } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { calculateResult, type AnswerMap } from "@/lib/health-check/business-operations";

export const Route = createFileRoute("/health-check/business-operations/results")({
  head: () => ({ meta: [{ title: "Business Operations Health Check Results | Simple Secure Solutions" }, { name: "robots", content: "noindex" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const raw = typeof window !== "undefined" ? localStorage.getItem("sss-business-operations-last") : null;
  const data = raw ? JSON.parse(raw) as { answers?: AnswerMap; businessName?: string } : { answers: {} };
  const result = calculateResult(data.answers ?? {});

  return <div id="top" className="min-h-screen bg-background"><Nav /><main className="relative overflow-hidden pt-28 pb-24"><PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.35]" /><div className="relative mx-auto max-w-3xl px-6 lg:px-10">
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"><ClipboardCheck className="h-3.5 w-3.5 text-copper" />Your Health Check Results</div>
    <h1 className="mt-5 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">{result.label}</h1>
    <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{result.summary}</p>
    <div className="mt-8 rounded-2xl border border-border bg-card p-7 shadow-soft"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Overall Health Score</p><p className="mt-2 font-display text-5xl text-navy">{result.score}<span className="text-2xl text-muted-foreground"> / {result.maxScore}</span></p></div><TrendingUp className="h-8 w-8 text-copper" /></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-copper" style={{ width: `${result.percentage}%` }} /></div><p className="mt-2 text-right text-xs text-muted-foreground">{result.percentage}%</p></div>
    <section className="mt-6 rounded-2xl border border-border bg-card p-7 shadow-soft"><h2 className="font-display text-2xl text-navy">Areas worth looking at</h2><div className="mt-5 space-y-3">{result.opportunities.map((item) => <div key={item} className="flex gap-3 rounded-xl bg-secondary/60 p-4 text-sm text-navy"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-copper" />{item}</div>)}</div></section>
    <section className="mt-6 rounded-2xl border border-border bg-card p-7 shadow-soft"><h2 className="font-display text-2xl text-navy">What this can mean for your business</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Some businesses benefit from improving their processes, documenting workflows, or reducing repetitive work. Others may benefit from delegating selected administrative and operational tasks so owners and teams can spend more time on customers, products, and growth.</p><p className="mt-4 text-sm font-semibold text-navy">We'll review your answers and contact you personally to discuss what may make sense for your business.</p></section>
    <div className="mt-8 flex flex-wrap gap-3"><Link to="/assessments" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-navy">Back to Health Checks</Link><Link to="/" className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-medium text-navy-foreground">Back to Home <ArrowRight className="h-4 w-4" /></Link></div>
  </div></main></div>;
}
