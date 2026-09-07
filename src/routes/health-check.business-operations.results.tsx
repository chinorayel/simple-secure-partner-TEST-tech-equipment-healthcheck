import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CircleAlert, ClipboardCheck, Sparkles } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { BOOKING_URL } from "@/lib/booking";
import { calculateResult, QUESTIONS, type AnswerMap } from "@/lib/health-check/business-operations";

export const Route = createFileRoute("/health-check/business-operations/results")({
  head: () => ({ meta: [{ title: "Your Business Operations Health Check Results | Simple Secure Solutions" }, { name: "robots", content: "noindex" }] }),
  component: ResultsPage,
});

type AreaStatus = "good" | "attention" | "priority";

function ResultsPage() {
  const raw = typeof window !== "undefined" ? localStorage.getItem("sss-business-operations-last") : null;
  const data = raw ? JSON.parse(raw) as { answers?: AnswerMap; businessName?: string; contactName?: string } : { answers: {} };
  const answers = data.answers ?? {};
  const result = calculateResult(answers);
  const areas = getAreas(answers);
  const name = data.contactName || data.businessName || "Your business";

  return <div id="top" className="min-h-screen bg-background"><Nav /><main className="relative overflow-hidden pt-28 pb-24"><PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.35]" /><div className="relative mx-auto max-w-5xl px-6 lg:px-10">
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-[#332d38] p-7 text-navy-foreground shadow-elevated sm:p-10"><PCBLines variant="corner" className="pointer-events-none absolute inset-0 h-full w-full opacity-40" /><div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-copper">Business Operations Health Check</p><h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{name} — your operations at a glance.</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-navy-foreground/75">Your answers highlight how your workflows, processes, team handovers, customer enquiries and day-to-day operational support are working today.</p></div><ScoreDial score={result.percentage} /></div></section>

    <section className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-copper-soft text-copper"><Sparkles className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Overall Result</p><h2 className="mt-1 font-display text-3xl text-navy">{result.label}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.summary}</p></div></div></section>

    <section className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Health Check at a Glance</p><h2 className="mt-1 font-display text-2xl text-navy">Your assessment areas</h2></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{areas.map((area) => <div key={area.id} className="rounded-2xl border border-border bg-background p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold leading-snug text-navy">{area.label}</p><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot(area.status)}`} title={statusLabel(area.status)} /></div><p className="mt-3 text-xs font-medium text-muted-foreground">{statusLabel(area.status)}</p></div>)}</div></section>

    <section className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Areas to Review</p><h2 className="mt-1 font-display text-2xl text-navy">Where improvements may help</h2><div className="mt-5 space-y-3">{result.opportunities.map((item) => <div key={item} className="flex gap-3 rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed text-navy"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-copper" />{item}</div>)}</div></section>

    <section className="mt-6 rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Assessment Detail</p><h2 className="mt-1 font-display text-2xl text-navy">What your answers suggest</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{areas.map((area) => <div key={area.id} className="rounded-2xl border border-border bg-background p-5"><div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${statusDot(area.status)}`} /><h3 className="font-display text-xl text-navy">{area.label}</h3></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.detail}</p></div>)}</div></section>

    <section className="mt-6 overflow-hidden rounded-3xl bg-navy p-7 text-navy-foreground shadow-elevated sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Recommended Next Step</p><h2 className="mt-1 font-display text-2xl sm:text-3xl">Turn the findings into practical improvements.</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy-foreground/70">Depending on your answers, that may mean improving workflows, documenting SOPs, reducing repetitive work, strengthening enquiry follow-up, or delegating selected administrative and operational tasks.</p><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-copper px-5 py-3 text-sm font-medium text-copper-foreground shadow-copper transition-colors hover:bg-copper/90">Book a Consultation <ArrowRight className="h-4 w-4" /></a></section>

    <div className="mt-8 flex flex-wrap gap-3"><Link to="/assessments" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-navy"><ArrowLeft className="h-4 w-4" />Back to Health Checks</Link><Link to="/health-check/business-operations" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-navy">Retake <ArrowRight className="h-4 w-4" /></Link></div>
  </div></main></div>;
}

function getAreas(answers: AnswerMap) {
  return [
    area("workflow", "Workflow & Task Management", ["day-to-day-management", "task-delays"], answers, "This area looks at how clearly work is assigned and how easily tasks move between people without avoidable delays."),
    area("process", "Processes & Documentation", ["process-documentation", "new-employee-training"], answers, "This area reflects how well important processes are documented and how consistently new team members can learn their responsibilities."),
    area("team", "Team & Handover", ["key-employee-handover", "wasted-time"], answers, "This area considers whether knowledge can be handed over smoothly and whether the team spends unnecessary time searching, following up or correcting mistakes."),
    area("customer", "Customer Enquiries", ["calls-enquiries", "missed-enquiries"], answers, "This area looks at how customer enquiries are captured, tracked and followed up so opportunities are less likely to be missed."),
  ];
}

function area(id: string, label: string, questionIds: string[], answers: AnswerMap, detail: string) {
  const points = questionIds.map((questionId) => QUESTIONS.find((q) => q.id === questionId)?.choices.find((c) => c.value === answers[questionId])?.points ?? 0);
  const average = points.reduce((sum, value) => sum + value, 0) / questionIds.length;
  const status: AreaStatus = average >= 3.5 ? "good" : average >= 2.5 ? "attention" : "priority";
  return { id, label, status, detail };
}

function statusLabel(status: AreaStatus) { return status === "good" ? "Good" : status === "attention" ? "Needs Attention" : "Priority Review"; }
function statusDot(status: AreaStatus) { return status === "good" ? "bg-success" : status === "attention" ? "bg-warning" : "bg-danger"; }

function ScoreDial({ score }: { score: number }) {
  const size = 150; const stroke = 12; const radius = (size - stroke) / 2; const circumference = 2 * Math.PI * radius; const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  return <div className="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40"><svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-navy-foreground/10" /><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-copper" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-4xl leading-none">{score}</span><span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-foreground/60">/ 100</span></div></div>;
}
