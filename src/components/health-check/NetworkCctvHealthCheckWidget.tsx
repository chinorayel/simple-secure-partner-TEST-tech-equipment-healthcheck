import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Network, ShieldCheck, Sparkles, Wifi } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { QUESTIONS, calculateResult, saveSubmission, type AnswerMap } from "@/lib/health-check/network-cctv";
import { submitNetworkCctvHealthCheck } from "@/lib/health-check/server-functions";
import { BOOKING_URL } from "@/lib/booking";

export function NetworkCctvHealthCheckWidget() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const cctvStatus = answers["cctv"];
  const visibleQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.id !== "cctv-interest" || cctvStatus === "no" || cctvStatus === "unsure"),
    [cctvStatus],
  );
  const totalSteps = visibleQuestions.length + 1;
  const isDetailsStep = step === visibleQuestions.length;
  const currentQuestion = visibleQuestions[step];
  const progress = Math.round(((step + 1) / totalSteps) * 100);
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const result = useMemo(() => (submitted ? calculateResult(answers) : null), [submitted, answers]);

  const canContinue = isDetailsStep
    ? Boolean(businessName.trim() && contactName.trim() && email.trim()) && !submitting
    : currentQuestion?.id === "provider-speed"
      ? Boolean(provider.trim())
      : Boolean(currentAnswer);

  const setAnswer = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const next = async () => {
    if (!canContinue) return;

    if (isDetailsStep) {
      setSubmitting(true);
      setSubmitError(null);
      const customer = {
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      };

      saveSubmission({
        assessment: "network-cctv",
        ...customer,
        provider: provider.trim(),
        answers,
      });
      localStorage.setItem(
        "sss-network-cctv-last",
        JSON.stringify({ businessName, contactName, email, phone, provider, answers }),
      );

      try {
        const res = await submitNetworkCctvHealthCheck({
          data: { customer, provider: provider.trim() || undefined, answers },
        });
        if (!res.ok) {
          setSubmitError(res.error);
          setSubmitting(false);
          return;
        }
        setSubmitted(true);
      } catch {
        setSubmitError("We couldn't submit your assessment right now. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setStep((value) => value + 1);
  };

  const back = () => setStep((value) => Math.max(0, value - 1));

  const reset = () => {
    setStarted(false);
    setStep(0);
    setBusinessName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setProvider("");
    setAnswers({});
    setSubmitError(null);
    setSubmitted(false);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative">
        {!started ? (
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft">
              <Network className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-5 font-display text-2xl text-navy sm:text-3xl">Network & CCTV Health Check</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              15 quick questions about your business internet, Wi-Fi, backup power, failover, and CCTV coverage. Answer at your own pace — there are no wrong answers, and “not sure” is a perfectly useful response.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-copper" aria-hidden />Takes about 3 minutes</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-copper" aria-hidden />Instant, practical results</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-copper" aria-hidden />Free and no obligation</li>
            </ul>
            <button type="button" onClick={() => setStarted(true)} className="mt-8 inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90">
              Start Network & CCTV Health Check<ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : submitted && result ? (
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:flex-row sm:text-left">
              <MiniScoreDial score={result.overallScore} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">Overall result</p>
                <p className="mt-1 font-display text-2xl text-navy">{result.headline}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {result.areas.map((area) => (
                <div key={area.id} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3">
                  <span className="text-xs font-medium leading-snug text-navy">{area.label}</span>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot(area.status)}`} title={statusLabel(area.status)} aria-label={statusLabel(area.status)} />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/health-check/network-cctv/results"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90"
              >
                View full detailed results
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary"
              >
                <Sparkles className="h-4 w-4 text-copper" aria-hidden />
                Book a Consultation
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-6 py-5 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span className="font-semibold text-navy">{isDetailsStep ? "Almost done" : `Question ${step + 1} of ${totalSteps}`}</span>
                <span>{isDetailsStep ? "Your details" : `${Object.values(answers).filter(Boolean).length} answered`}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-copper transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              {!isDetailsStep && currentQuestion ? (
                <>
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft">
                      {currentQuestion.area === "cctv" ? <Camera className="h-5 w-5" /> : currentQuestion.area === "reliability" ? <Network className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">{currentQuestion.area === "connectivity" ? "Internet & Connectivity" : currentQuestion.area === "reliability" ? "Network Reliability & Power" : currentQuestion.area === "cctv" ? "CCTV & Security" : "Upgrade Readiness"}</p>
                      <h3 className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">{currentQuestion.label}</h3>
                      {currentQuestion.helper && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{currentQuestion.helper}</p>}
                    </div>
                  </div>
                  {currentQuestion.id === "provider-speed" ? (
                    <input value={provider} onChange={(event) => setProvider(event.target.value)} placeholder="e.g. PLDT Fiber 200 Mbps" className="mt-8 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:border-copper focus:ring-2 focus:ring-ring/30" />
                  ) : (
                    <div className="mt-8 grid gap-2.5">
                      {currentQuestion.choices.map((choice) => (
                        <label key={choice.value} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 text-sm transition-colors ${currentAnswer === choice.value ? "border-copper bg-copper-soft/60 text-navy" : "border-border bg-background hover:bg-secondary"}`}>
                          <input type="radio" name={currentQuestion.id} value={choice.value} checked={currentAnswer === choice.value} onChange={() => setAnswer(currentQuestion.id, choice.value)} className="h-4 w-4 accent-[var(--copper)]" />
                          <span>{choice.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft"><CheckCircle2 className="h-5 w-5" /></span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">Final step</p>
                      <h3 className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">Where should we send your results?</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A few details help us identify your assessment and prepare useful next steps.</p>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Field label="Business name" value={businessName} onChange={setBusinessName} placeholder="Your business name" />
                    <Field label="Your name" value={contactName} onChange={setContactName} placeholder="Your name" />
                    <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
                    <Field label="Phone (optional)" value={phone} onChange={setPhone} placeholder="09xx xxx xxxx" />
                  </div>
                  {submitError && <p className="mt-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{submitError}</p>}
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={step === 0 ? reset : back} disabled={submitting} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary disabled:opacity-40"><ArrowLeft className="h-4 w-4" />{step === 0 ? "Cancel" : "Back"}</button>
                <button type="button" onClick={next} disabled={!canContinue} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40">{isDetailsStep ? (submitting ? "Submitting…" : "View my results") : "Next"}<ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function statusLabel(status: "good" | "attention" | "priority") {
  return status === "good" ? "Good" : status === "attention" ? "Needs Attention" : "Priority Review";
}

function statusDot(status: "good" | "attention" | "priority") {
  return status === "good" ? "bg-success" : status === "attention" ? "bg-warning" : "bg-danger";
}

function MiniScoreDial({ score }: { score: number }) {
  const size = 112;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-copper transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl leading-none text-navy">{score}</span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <label className="block"><span className="text-xs font-semibold text-navy">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /></label>;
}
