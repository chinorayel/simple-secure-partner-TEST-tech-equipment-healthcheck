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
    try {
      return stored
        ? (JSON.parse(stored) as {
            businessName?: string;
            contactName?: string;
            email?: string;
            phone?: string;
            provider?: string;
            answers: AnswerMap;
          })
        : null;
    } catch {
      return null;
    }
  }, [stored]);
  const result = useMemo(() => calculateResult(data?.answers ?? {}), [data]);

  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />
      <main className="pt-28 pb-24">
        <section className="relative overflow-hidden bg-navy text-navy-foreground">
          <PCBLines className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]" />
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 80% 0%, oklch(0.68 0.14 45 / 0.28), transparent 55%)" }} />
          <div className="relative mx-auto max-w-6xl px-6 py-14 lg:px-10 lg:py-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              <ShieldCheck className="h-3.5 w-3.5 text-copper" />
              Health Check System
            </div>
            <h1 className="mt-5 font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">
              Network &amp; CCTV
              <span className="block text-copper">Health Check</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
              {data?.businessName ? `${data.businessName} — ` : ""}{result.summary}
            </p>

            <div className="mt-10 grid gap-6 rounded-3xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
              <ScoreDial score={result.overallScore} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Overall result</p>
                <p className="mt-2 font-display text-2xl text-white sm:text-3xl">{result.headline}</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">{result.summary}</p>
                <p className="mt-5 inline-flex items-start gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-xs leading-relaxed text-white/60">
                  This Health Check highlights potential areas of interest based on your answers. It is a high-level view, not a technical audit.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Health check at a glance</p>
          <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">Your assessment areas</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {result.areas.map((area) => (
              <div key={area.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-snug text-navy">{area.label}</p>
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusDot(area.status)}`} aria-hidden />
                </div>
                <span className="mt-4 inline-flex rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy">
                  {statusLabel(area.status)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Areas to review</p>
            <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">Where a closer look could help</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              These areas may benefit from additional attention based on your answers.
            </p>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {result.recommendations.map((item) => (
                <article key={item} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <span className="absolute inset-y-0 left-0 w-1 bg-copper" aria-hidden />
                  <div className="flex gap-3">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                    <p className="text-sm leading-relaxed text-foreground/80">{item}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Assessment detail</p>
          <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">Network &amp; CCTV findings</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {result.areas.map((area) => (
              <div key={area.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-navy">{area.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{statusLabel(area.status)}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-navy">{Math.round(area.score * 10)}</div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-copper" style={{ width: `${Math.min(100, area.score * 10)}%` }} />
                </div>
                <div className="mt-4 flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                  {area.opportunity}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-navy-foreground sm:p-12">
            <PCBLines className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]" />
            <div className="relative max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Recommended next step</p>
              <h2 className="mt-4 font-display text-2xl sm:text-3xl">Want to discuss your results?</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/75">
                Simple Secure Solutions can review the areas identified in this assessment and help you prioritize practical improvements such as UPS/battery backup, 4G/5G failover, Wi-Fi optimization and CCTV solutions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-copper px-5 py-3 text-sm font-medium text-copper-foreground shadow-copper transition-colors hover:bg-copper/90">
                  Book a Consultation
                  <Wifi className="h-4 w-4" />
                </a>
                <Link to="/health-check/network-cctv/" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                  Retake the Health Check
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-6 lg:px-10">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-navy">Back to Simple Secure Solutions</Link>
        </div>
      </main>
    </div>
  );
}

function statusLabel(status: "good" | "attention" | "priority") {
  return status === "good" ? "Good" : status === "attention" ? "Needs Attention" : "Priority Review";
}

function statusDot(status: "good" | "attention" | "priority") {
  return status === "good" ? "bg-success" : status === "attention" ? "bg-warning" : "bg-danger";
}

function ScoreDial({ score }: { score: number }) {
  const size = 188;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div className="relative h-48 w-48 shrink-0">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-copper" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl leading-none text-white">{score}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">/ 100</span>
      </div>
    </div>
  );
}
