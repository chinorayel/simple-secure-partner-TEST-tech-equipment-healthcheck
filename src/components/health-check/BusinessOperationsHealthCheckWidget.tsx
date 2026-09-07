import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, ClipboardList, Loader2, Mail, Phone, Sparkles, User } from "lucide-react";
import { QUESTIONS, calculateResult, saveSubmission, type AnswerMap } from "@/lib/health-check/business-operations";
import { submitBusinessOperationsHealthCheck } from "@/lib/health-check/business-operations-server";
import { BOOKING_URL } from "@/lib/booking";

type Phase = "intro" | "question" | "info" | "submitting" | "result";
type AreaStatus = "good" | "attention" | "priority";

interface CustomerFields { businessName: string; contactName: string; email: string; phone: string; }
const EMPTY_CUSTOMER: CustomerFields = { businessName: "", contactName: "", email: "", phone: "" };

export function BusinessOperationsHealthCheckWidget() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [customer, setCustomer] = useState<CustomerFields>(EMPTY_CUSTOMER);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[step];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const result = useMemo(() => phase === "result" ? calculateResult(answers) : null, [phase, answers]);
  const progress = Math.round(((step + 1) / (QUESTIONS.length + 1)) * 100);
  const canContinue = currentQuestion ? Boolean(currentAnswer) : Boolean(customer.businessName.trim() && customer.contactName.trim() && customer.email.trim());

  const setAnswer = (value: string) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

  const next = async () => {
    if (!canContinue) return;
    if (step < QUESTIONS.length) {
      if (step < QUESTIONS.length - 1) { setStep((value) => value + 1); return; }
      setStep(QUESTIONS.length);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    const cleanCustomer = { businessName: customer.businessName.trim(), contactName: customer.contactName.trim(), email: customer.email.trim(), phone: customer.phone.trim() || undefined };
    saveSubmission({ assessment: "business-operations", ...cleanCustomer, answers });
    localStorage.setItem("sss-business-operations-last", JSON.stringify({ ...cleanCustomer, answers }));
    try {
      const response = await submitBusinessOperationsHealthCheck({ data: { customer: cleanCustomer, answers: answers as Record<string, string> } });
      if (!response.ok) { setSubmitError(response.error); return; }
      setPhase("result");
    } catch {
      setSubmitError("We couldn't submit your assessment right now. Please try again.");
    } finally { setSubmitting(false); }
  };

  const back = () => {
    if (step > 0) setStep((value) => value - 1);
    else setPhase("intro");
  };

  const reset = () => {
    setPhase("intro"); setStep(0); setAnswers({}); setCustomer(EMPTY_CUSTOMER); setSubmitError(null);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }} aria-hidden />
      <div className="relative">
        {phase === "intro" ? (
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft"><ClipboardList className="h-6 w-6" aria-hidden /></span>
            <h3 className="mt-5 font-display text-2xl text-navy sm:text-3xl">Business Operations Health Check</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">11 quick questions about workflows, repetitive work, documentation, customer enquiries, and opportunities to delegate operational support.</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Takes about 3 minutes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Instant, practical results</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Free and no obligation</li>
            </ul>
            <button type="button" onClick={() => setPhase("question")} className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90">Start Business Operations Health Check <ArrowRight className="h-4 w-4" /></button>
          </div>
        ) : phase === "result" && result ? (
          <ResultView result={result} />
        ) : (
          <>
            <div className="border-b border-border px-6 py-5 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground"><span className="font-semibold text-navy">{step === QUESTIONS.length ? "Almost done" : `Question ${step + 1} of ${QUESTIONS.length}`}</span><span>{step === QUESTIONS.length ? "Your details" : `${Object.values(answers).filter(Boolean).length} answered`}</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-copper transition-all duration-300" style={{ width: `${step === QUESTIONS.length ? 100 : progress}%` }} /></div>
            </div>
            <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              {step < QUESTIONS.length ? (
                <>
                  <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft"><ClipboardList className="h-5 w-5" /></span><div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">Business Operations</p><h3 className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">{currentQuestion.label}</h3></div></div>
                  <div className="mt-8 grid gap-2.5">{currentQuestion.choices.map((choice) => <label key={choice.value} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 text-sm transition-colors ${currentAnswer === choice.value ? "border-copper bg-copper-soft/60 text-navy" : "border-border bg-background hover:bg-secondary"}`}><input type="radio" name={currentQuestion.id} value={choice.value} checked={currentAnswer === choice.value} onChange={() => setAnswer(choice.value)} className="h-4 w-4 accent-[var(--copper)]" /><span>{choice.label}</span></label>)}</div>
                </>
              ) : (
                <div>
                  <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft"><CheckCircle2 className="h-5 w-5" /></span><div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">Final step</p><h3 className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">Where should we send your results?</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your results will appear immediately after submission. We don't send the customer a copy of the results.</p></div></div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2"><Field label="Business name" icon={Building2} value={customer.businessName} onChange={(v) => setCustomer((c) => ({ ...c, businessName: v }))} placeholder="Your business name" /><Field label="Contact name" icon={User} value={customer.contactName} onChange={(v) => setCustomer((c) => ({ ...c, contactName: v }))} placeholder="Your name" /><Field label="Email address" icon={Mail} value={customer.email} onChange={(v) => setCustomer((c) => ({ ...c, email: v }))} placeholder="you@business.com" type="email" /><Field label="Phone number" icon={Phone} value={customer.phone} onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))} placeholder="(optional)" /></div>
                  {submitError && <p className="mt-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{submitError}</p>}
                </div>
              )}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={step === 0 ? reset : back} disabled={submitting} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary disabled:opacity-40"><ArrowLeft className="h-4 w-4" />{step === 0 ? "Cancel" : "Back"}</button><button type="button" onClick={next} disabled={!canContinue || submitting} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40">{step === QUESTIONS.length ? (submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : <>View my results <ArrowRight className="h-4 w-4" /></>) : "Next"}<ArrowRight className="h-4 w-4" /></button></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ResultView({ result }: { result: ReturnType<typeof calculateResult> }) {
  const areas = businessAreas(result.score, result.maxScore);
  return <div className="p-6 sm:p-8 lg:p-10">
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:flex-row sm:text-left"><MiniScoreDial score={result.percentage} /><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Overall result</p><p className="mt-1 font-display text-2xl text-navy">{result.label}</p><p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{result.summary}</p></div></div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{areas.map((area) => <div key={area.id} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3"><span className="text-xs font-medium leading-snug text-navy">{area.label}</span><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot(area.status)}`} title={statusLabel(area.status)} aria-label={statusLabel(area.status)} /></div>)}</div>
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Link to="/health-check/business-operations/results" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90">View full detailed results <ArrowRight className="h-4 w-4" /></Link><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary"><Sparkles className="h-4 w-4 text-copper" />Book a Consultation</a></div>
  </div>;
}

function businessAreas(score: number, maxScore: number) {
  const ratio = score / maxScore;
  const status: AreaStatus = ratio >= 0.8 ? "good" : ratio >= 0.55 ? "attention" : "priority";
  return [
    { id: "workflow", label: "Workflow & Task Management", status },
    { id: "process", label: "Processes & Documentation", status },
    { id: "team", label: "Team & Handover", status },
    { id: "customer", label: "Customer Enquiries", status },
  ];
}

function statusLabel(status: AreaStatus) { return status === "good" ? "Good" : status === "attention" ? "Needs Attention" : "Priority Review"; }
function statusDot(status: AreaStatus) { return status === "good" ? "bg-success" : status === "attention" ? "bg-warning" : "bg-danger"; }

function MiniScoreDial({ score }: { score: number }) {
  const size = 112; const stroke = 10; const radius = (size - stroke) / 2; const circumference = 2 * Math.PI * radius; const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  return <div className="relative h-28 w-28 shrink-0"><svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" /><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-copper transition-all duration-700" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-2xl leading-none text-navy">{score}</span><span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">/ 100</span></div></div>;
}

function Field({ label, icon: Icon, value, onChange, placeholder, type = "text" }: { label: string; icon: typeof Building2; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <label className="block"><span className="flex items-center gap-1.5 text-xs font-semibold text-navy"><Icon className="h-3.5 w-3.5 text-copper" />{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /></label>;
}
