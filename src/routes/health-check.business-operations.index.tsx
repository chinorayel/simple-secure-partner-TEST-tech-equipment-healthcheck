import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, ClipboardList, Mail, Phone, Sparkles, User } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { QUESTIONS, calculateResult, saveSubmission, type AnswerMap } from "@/lib/health-check/business-operations";
import { submitBusinessOperationsHealthCheck } from "@/lib/health-check/business-operations-server";
import { BOOKING_URL } from "@/lib/booking";

export const Route = createFileRoute("/health-check/business-operations/")({
  head: () => ({ meta: [{ title: "Business Operations Health Check | Simple Secure Solutions" }, { name: "description", content: "A practical health check for your business operations, processes and back-office workload." }, { name: "robots", content: "noindex" }] }),
  component: BusinessOperationsHealthCheck,
});

type Phase = "intro" | "question" | "info" | "submitting" | "result";

function BusinessOperationsHealthCheck() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[step];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const result = calculateResult(answers);
  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);
  const setAnswer = (value: string) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

  const submit = async () => {
    if (!businessName.trim() || !contactName.trim() || !email.trim()) return;
    setPhase("submitting");
    setSubmitError(null);
    saveSubmission({ assessment: "business-operations", businessName: businessName.trim(), contactName: contactName.trim(), email: email.trim(), phone: phone.trim(), completedAt: new Date().toISOString(), answers });
    localStorage.setItem("sss-business-operations-last", JSON.stringify({ businessName, contactName, email, phone, answers }));
    try {
      const response = await submitBusinessOperationsHealthCheck({ data: { customer: { businessName: businessName.trim(), contactName: contactName.trim(), email: email.trim(), phone: phone.trim() || undefined }, answers: answers as Record<string, string> } });
      if (!response.ok) {
        setSubmitError(response.error);
        setPhase("info");
        return;
      }
      setPhase("result");
    } catch {
      setSubmitError("We couldn't submit your assessment right now. Please try again.");
      setPhase("info");
    }
  };

  return <div id="top" className="min-h-screen bg-background"><Nav /><main className="relative overflow-hidden pt-28 pb-24"><PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.35]" /><div className="relative mx-auto max-w-3xl px-6 lg:px-10">
    {phase === "intro" && <Intro onStart={() => setPhase("question")} />}
    {phase === "question" && currentQuestion && <QuestionStep step={step} currentQuestion={currentQuestion} currentAnswer={currentAnswer} progress={progress} setAnswer={setAnswer} onBack={() => setStep((s) => s - 1)} onNext={() => step === QUESTIONS.length - 1 ? setPhase("info") : setStep((s) => s + 1)} />}
    {phase === "info" && <Info businessName={businessName} contactName={contactName} email={email} phone={phone} setBusinessName={setBusinessName} setContactName={setContactName} setEmail={setEmail} setPhone={setPhone} onBack={() => setPhase("question")} onSubmit={submit} error={submitError} />}
    {phase === "submitting" && <section className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-copper-soft text-copper"><Sparkles className="h-7 w-7 animate-pulse" /></div><h1 className="mt-6 font-display text-3xl text-navy">Preparing your results…</h1><p className="mt-3 text-sm text-muted-foreground">We're securely processing your assessment.</p></section>}
    {phase === "result" && <ResultView result={result} />}
  </div></main></div>;
}

function Intro({ onStart }: { onStart: () => void }) { return <section className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-10"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-copper-soft text-copper"><ClipboardList className="h-7 w-7" /></div><p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-copper">Business Operations Health Check</p><h1 className="mt-3 font-display text-4xl leading-[1.05] text-navy sm:text-5xl">See where your operations can work better.</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">A practical 11-question assessment covering workflows, repetitive work, documentation, customer enquiries and day-to-day operational support.</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><Mini title="11" text="quick questions" /><Mini title="4" text="result levels" /><Mini title="Free" text="no obligation" /></div><button type="button" onClick={onStart} className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft">Start Health Check <ArrowRight className="h-4 w-4" /></button></section>; }
function Mini({ title, text }: { title: string; text: string }) { return <div className="rounded-2xl bg-secondary/70 p-4"><p className="font-display text-2xl text-navy">{title}</p><p className="mt-1 text-xs text-muted-foreground">{text}</p></div>; }
function QuestionStep({ step, currentQuestion, currentAnswer, progress, setAnswer, onBack, onNext }: { step: number; currentQuestion: typeof QUESTIONS[number]; currentAnswer: string | undefined; progress: number; setAnswer: (value: string) => void; onBack: () => void; onNext: () => void }) { return <><div className="mb-8"><div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">Business Operations Health Check</div><h1 className="mt-3 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">Let's look at how your business operates.</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Choose the answer that best describes your business today. There are no wrong answers.</p></div><div className="mb-6"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>Question {step + 1} of {QUESTIONS.length}</span><span>{progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-copper transition-all" style={{ width: `${progress}%` }} /></div></div><fieldset className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"><legend className="sr-only">{currentQuestion.label}</legend><div className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-copper-soft text-sm font-semibold text-copper">{step + 1}</span><h2 className="font-display text-2xl leading-tight text-navy">{currentQuestion.label}</h2></div><div className="mt-7 grid gap-3">{currentQuestion.choices.map((choice) => <label key={choice.value} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm leading-relaxed transition-colors ${currentAnswer === choice.value ? "border-copper bg-copper-soft/60 text-navy" : "border-border bg-background hover:bg-secondary"}`}><input type="radio" name={currentQuestion.id} value={choice.value} checked={currentAnswer === choice.value} onChange={() => setAnswer(choice.value)} className="mt-0.5 h-4 w-4 accent-[var(--copper)]" /><span>{choice.label}</span></label>)}</div></fieldset><div className="mt-5 flex items-center justify-between"><button type="button" disabled={step === 0} onClick={onBack} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-navy disabled:opacity-40"><ArrowLeft className="h-4 w-4" />Back</button><button type="button" disabled={!currentAnswer} onClick={onNext} className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground disabled:opacity-40">{step === QUESTIONS.length - 1 ? "Continue" : "Next"}<ArrowRight className="h-4 w-4" /></button></div></>; }
function Info({ businessName, contactName, email, phone, setBusinessName, setContactName, setEmail, setPhone, onBack, onSubmit, error }: { businessName: string; contactName: string; email: string; phone: string; setBusinessName: (v: string) => void; setContactName: (v: string) => void; setEmail: (v: string) => void; setPhone: (v: string) => void; onBack: () => void; onSubmit: () => void; error: string | null }) { const valid = businessName.trim() && contactName.trim() && email.trim(); return <section className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-copper">Almost there</p><h1 className="mt-3 font-display text-3xl text-navy sm:text-4xl">Tell us where to reach you.</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">We'll use these details to prepare your assessment. Your results are shown immediately, and we don't send the customer a copy.</p>{error && <div className="mt-5 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</div>}<div className="mt-7 grid gap-4 sm:grid-cols-2"><Field label="Business name" icon={Building2} value={businessName} onChange={setBusinessName} placeholder="Your business name" /><Field label="Your name" icon={User} value={contactName} onChange={setContactName} placeholder="Your name" /><Field label="Email" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="you@company.com" /><Field label="Phone" icon={Phone} value={phone} onChange={setPhone} placeholder="09xx xxx xxxx" /></div><div className="mt-7 flex items-center justify-between"><button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-navy"><ArrowLeft className="h-4 w-4" />Back</button><button type="button" disabled={!valid} onClick={onSubmit} className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground disabled:opacity-40">View my results <ArrowRight className="h-4 w-4" /></button></div></section>; }
function Field({ label, icon: Icon, value, onChange, placeholder, type = "text" }: { label: string; icon: typeof Building2; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) { return <label className="block"><span className="flex items-center gap-1.5 text-xs font-semibold text-navy"><Icon className="h-3.5 w-3.5 text-copper" />{label}</span><input required={label !== "Phone"} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /></label>; }
function ResultView({ result }: { result: ReturnType<typeof calculateResult> }) { return <section className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-10"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-copper-soft text-copper"><Sparkles className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-copper">Overall Result</p><h1 className="mt-1 font-display text-3xl text-navy sm:text-4xl">{result.label}</h1></div></div><div className="mt-8 flex items-center gap-6"><div className="grid h-28 w-28 shrink-0 place-items-center rounded-full border-[10px] border-secondary"><div className="text-center"><p className="font-display text-3xl text-navy">{result.score}</p><p className="text-[10px] text-muted-foreground">/ {result.maxScore}</p></div></div><div><p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p><p className="mt-3 text-sm font-semibold text-navy">{result.percentage}% operational health score</p></div></div><div className="mt-8 rounded-2xl bg-secondary/60 p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Areas to consider</p><div className="mt-3 space-y-2">{result.opportunities.slice(0, 4).map((item) => <div key={item} className="flex gap-2 text-sm text-navy"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" />{item}</div>)}</div></div><div className="mt-7 flex flex-wrap gap-3"><Link to="/health-check/business-operations/results" className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground">View full detailed results <ArrowRight className="h-4 w-4" /></Link><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-navy">Book a Consultation</a></div></section>; }
