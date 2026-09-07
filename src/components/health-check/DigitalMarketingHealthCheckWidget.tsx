import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, ClipboardList, Loader2, Mail, Phone, Sparkles, User } from "lucide-react";
import { QUESTIONS, calculateResult, saveSubmission, type AnswerMap } from "@/lib/health-check/digital-marketing";
import { submitDigitalMarketingHealthCheck } from "@/lib/health-check/digital-marketing-server";
import { BOOKING_URL } from "@/lib/booking";

type Phase = "intro" | "question" | "info" | "submitting" | "result";
interface CustomerFields { businessName: string; contactName: string; email: string; phone: string; }
const EMPTY_CUSTOMER: CustomerFields = { businessName: "", contactName: "", email: "", phone: "" };

export function DigitalMarketingHealthCheckWidget() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [customer, setCustomer] = useState<CustomerFields>(EMPTY_CUSTOMER);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const currentQuestion = QUESTIONS[step];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const result = useMemo(() => phase === "result" ? calculateResult(answers) : null, [phase, answers]);
  const answeredCount = QUESTIONS.filter((q) => Boolean(answers[q.id])).length;
  const canContinue = currentQuestion ? Boolean(currentAnswer) : Boolean(customer.businessName.trim() && customer.contactName.trim() && customer.email.trim());

  const next = async () => {
    if (!canContinue) return;
    if (step < QUESTIONS.length - 1) { setStep((value) => value + 1); return; }
    if (step === QUESTIONS.length - 1) { setStep(QUESTIONS.length); return; }
    setSubmitting(true);
    setSubmitError(null);
    const cleanCustomer = { businessName: customer.businessName.trim(), contactName: customer.contactName.trim(), email: customer.email.trim(), phone: customer.phone.trim() || undefined };
    saveSubmission({ assessment: "digital-marketing", ...cleanCustomer, answers });
    localStorage.setItem("sss-digital-marketing-last", JSON.stringify({ ...cleanCustomer, answers }));
    try {
      const response = await submitDigitalMarketingHealthCheck({ data: { customer: cleanCustomer, answers: answers as Record<string, string> } });
      if (!response.ok) { setSubmitError(response.error); return; }
      setPhase("result");
    } catch { setSubmitError("We couldn't submit your assessment right now. Please try again."); }
    finally { setSubmitting(false); }
  };

  const back = () => {
    if (step > 0) setStep((value) => value - 1);
    else setPhase("intro");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }} aria-hidden />
      <div className="relative">
        {phase === "intro" ? (
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft"><ClipboardList className="h-6 w-6" aria-hidden /></span>
            <h3 className="mt-5 font-display text-2xl text-navy sm:text-3xl">Digital Marketing Health Check</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{QUESTIONS.length} quick questions about your website, professional email, Facebook presence, customer messaging, content, and digital marketing.</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Takes about 3 minutes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Instant, practical results</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-copper" />Free and no obligation</li>
            </ul>
            <button type="button" onClick={() => setPhase("question")} className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90">Start Digital Marketing Health Check <ArrowRight className="h-4 w-4" /></button>
          </div>
        ) : phase === "result" && result ? (
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:flex-row sm:text-left"><MiniScoreDial score={result.percentage} /><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Overall result</p><p className="mt-1 font-display text-2xl text-navy">{result.label}</p><p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{result.summary}</p></div></div>
            <div className="mt-8 rounded-2xl bg-secondary/60 p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Areas to consider</p><div className="mt-3 space-y-2">{result.opportunities.slice(0, 4).map((item) => <div key={item} className="flex gap-2 text-sm text-navy"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" />{item}</div>)}</div></div>
            <div className="mt-7 flex flex-wrap gap-3"><Link to="/health-check/digital-marketing/results" className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground">View full detailed results <ArrowRight className="h-4 w-4" /></Link><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-navy">Book a Consultation</a></div>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-6 py-5 sm:px-8 lg:px-10"><div className="flex items-center justify-between gap-4 text-xs text-muted-foreground"><span className="font-semibold text-navy">{step < QUESTIONS.length ? `Question ${step + 1} of ${QUESTIONS.length}` : "Almost done"}</span><span>{answeredCount} of {QUESTIONS.length} answered</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-copper transition-all duration-300" style={{ width: `${step >= QUESTIONS.length ? 100 : Math.round(((step + 1) / (QUESTIONS.length + 1)) * 100)}%` }} /></div></div>
            <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              {step < QUESTIONS.length ? (
                <>
                  <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft"><ClipboardList className="h-5 w-5" /></span><div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">Digital Marketing</p><h3 className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">{currentQuestion.label}</h3></div></div>
                  <div className="mt-8 grid gap-2.5">{currentQuestion.choices.map((choice) => <label key={choice.value} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 text-sm transition-colors ${currentAnswer === choice.value ? "border-copper bg-copper-soft/60 text-navy" : "border-border bg-background hover:bg-secondary"}`}><input type="radio" name={currentQuestion.id} value={choice.value} checked={currentAnswer === choice.value} onChange={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: choice.value }))} className="h-4 w-4 accent-[var(--copper)]" /><span>{choice.label}</span></label>)}</div>
                </>
              ) : (
                <div><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft"><CheckCircle2 className="h-5 w-5" /></span><div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">Final step</p><h3 className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">Where should we send your results?</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your results will appear immediately after submission. We don't send the customer a copy of the results.</p></div></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><Field label="Business name" icon={Building2} value={customer.businessName} onChange={(v) => setCustomer((c) => ({ ...c, businessName: v }))} placeholder="Your business name" /><Field label="Contact name" icon={User} value={customer.contactName} onChange={(v) => setCustomer((c) => ({ ...c, contactName: v }))} placeholder="Your name" /><Field label="Email address" icon={Mail} value={customer.email} onChange={(v) => setCustomer((c) => ({ ...c, email: v }))} placeholder="you@business.com" type="email" /><Field label="Phone number" icon={Phone} value={customer.phone} onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))} placeholder="(optional)" type="tel" /></div>{submitError && <p className="mt-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{submitError}</p>}</div>
              )}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={step === 0 ? () => setPhase("intro") : back} disabled={submitting} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary disabled:opacity-40"><ArrowLeft className="h-4 w-4" />{step === 0 ? "Cancel" : "Back"}</button><button type="button" onClick={next} disabled={!canContinue || submitting} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40">{step === QUESTIONS.length ? (submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : <>View my results <ArrowRight className="h-4 w-4" /></>) : "Next"}<ArrowRight className="h-4 w-4" /></button></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MiniScoreDial({ score }: { score: number }) { const size = 112; const stroke = 10; const radius = (size - stroke) / 2; const circumference = 2 * Math.PI * radius; const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference; return <div className="relative h-28 w-28 shrink-0"><svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" /><circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-copper transition-all duration-700" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-2xl leading-none text-navy">{score}</span><span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">/ 100</span></div></div>; }
function Field({ label, icon: Icon, value, onChange, placeholder, type = "text" }: { label: string; icon: typeof Building2; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) { return <label className="block"><span className="flex items-center gap-1.5 text-xs font-semibold text-navy"><Icon className="h-3.5 w-3.5 text-copper" />{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /></label>; }
