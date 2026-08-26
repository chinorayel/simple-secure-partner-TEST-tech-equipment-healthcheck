import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Network, ShieldCheck, Wifi } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { QUESTIONS, saveSubmission, type AnswerMap } from "@/lib/health-check/network-cctv";

export function NetworkCctvHealthCheckWidget() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});

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
  const canContinue = isDetailsStep
    ? Boolean(businessName.trim() && contactName.trim() && email.trim())
    : currentQuestion?.id === "provider-speed"
      ? Boolean(provider.trim())
      : Boolean(currentAnswer);

  const setAnswer = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const next = () => {
    if (!canContinue) return;
    if (isDetailsStep) {
      saveSubmission({
        assessment: "network-cctv",
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        provider: provider.trim(),
        answers,
      });
      localStorage.setItem(
        "sss-network-cctv-last",
        JSON.stringify({ businessName, contactName, email, phone, provider, answers }),
      );
      navigate({ to: "/health-check/network-cctv/results" });
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
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }} aria-hidden />
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
              Start Network & CCTV Health Check
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
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
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">
                        {currentQuestion.area === "connectivity" ? "Internet & Connectivity" : currentQuestion.area === "reliability" ? "Network Reliability & Power" : currentQuestion.area === "cctv" ? "CCTV & Security" : "Upgrade Readiness"}
                      </p>
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
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={step === 0 ? reset : back} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary"><ArrowLeft className="h-4 w-4" />{step === 0 ? "Cancel" : "Back"}</button>
                <button type="button" onClick={next} disabled={!canContinue} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40">{isDetailsStep ? "View my results" : "Next"}<ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <label className="block"><span className="text-xs font-semibold text-navy">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /></label>;
}
