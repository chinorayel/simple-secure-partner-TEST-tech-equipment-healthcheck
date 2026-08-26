import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import {
  QUESTIONS,
  evaluateHealthCheck,
  saveSubmission,
  STATUS_LABEL,
  type AnswerMap,
  type AreaStatus,
} from "@/lib/health-check/technology-equipment";
import { submitTechEquipmentHealthCheck } from "@/lib/health-check/server-functions";
import { BOOKING_URL } from "@/lib/booking";

type Phase = "intro" | "question" | "info" | "submitting" | "result";

const statusDot: Record<AreaStatus, string> = {
  good: "bg-success",
  attention: "bg-warning",
  priority: "bg-danger",
};

interface CustomerFields {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
}

const EMPTY_CUSTOMER: CustomerFields = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function TechEquipmentHealthCheckWidget() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [customer, setCustomer] = useState<CustomerFields>(EMPTY_CUSTOMER);
  const [consent, setConsent] = useState(false);
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({});
  const [persistError, setPersistError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[questionIndex];
  const answeredCount = QUESTIONS.filter((q) => {
    const v = answers[q.id];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length;

  const result = useMemo(
    () => (phase === "result" ? evaluateHealthCheck(answers) : null),
    [phase, answers],
  );

  const setSingle = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const toggleMulti = (id: string, value: string) =>
    setAnswers((prev) => {
      const current = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      return {
        ...prev,
        [id]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });

  const goNext = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setPhase("info");
    }
  };

  const goBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else {
      setPhase("intro");
    }
  };

  const currentAnswered = currentQuestion
    ? (() => {
        const v = answers[currentQuestion.id];
        return Array.isArray(v) ? v.length > 0 : Boolean(v);
      })()
    : false;

  const validateInfo = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.businessName.trim()) errors.businessName = "Business name is required.";
    if (!customer.contactName.trim()) errors.contactName = "Contact name is required.";
    if (!customer.email.trim()) errors.email = "Email is required.";
    else if (!isValidEmail(customer.email.trim())) errors.email = "Enter a valid email address.";
    if (!consent) errors.consent = "Please confirm before submitting.";
    setInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const doPersist = async () => {
    setPersistError(null);
    try {
      const res = await submitTechEquipmentHealthCheck({
        data: {
          customer: {
            businessName: customer.businessName.trim(),
            contactName: customer.contactName.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim() || undefined,
          },
          answers,
          consent: true,
        },
      });
      if (res.ok) {
        setSubmissionId(res.id);
      } else {
        setPersistError(res.error || "We couldn't save your submission right now.");
      }
    } catch {
      setPersistError(
        "We couldn't reach our system to save your submission securely. Your results below are still accurate.",
      );
    }
  };

  const onSubmit = async () => {
    if (!validateInfo()) return;
    setPhase("submitting");

    // Preserve the existing customer experience: local results page keeps
    // working exactly as before, independent of whether secure persistence
    // succeeds.
    saveSubmission({
      businessName: customer.businessName.trim() || undefined,
      completedAt: new Date().toISOString(),
      answers,
    });

    await doPersist();
    setPhase("result");
  };

  const retryPersist = async () => {
    setPersistError(null);
    await doPersist();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }}
        aria-hidden
      />

      {phase !== "intro" && (
        <div className="relative border-b border-border bg-secondary/50 px-6 py-3 sm:px-8">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>
              {phase === "question"
                ? `Question ${questionIndex + 1} of ${QUESTIONS.length}`
                : phase === "info"
                  ? "Almost done"
                  : phase === "submitting"
                    ? "Submitting"
                    : "Your results"}
            </span>
            <span>{answeredCount} of {QUESTIONS.length} answered</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-copper transition-all duration-300"
              style={{
                width:
                  phase === "result"
                    ? "100%"
                    : `${Math.round(
                        ((phase === "info" || phase === "submitting"
                          ? QUESTIONS.length
                          : questionIndex) /
                          QUESTIONS.length) *
                          100,
                      )}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="relative p-6 sm:p-8 lg:p-10">
        {phase === "intro" && (
          <div className="text-center sm:text-left">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft sm:mx-0">
              <ClipboardList className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-5 font-display text-2xl text-navy sm:text-3xl">
              Technology Equipment Health Check
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {QUESTIONS.length} quick questions about the computers and equipment your business
              relies on. Answer at your own pace — there are no wrong answers, and "not sure" is a
              perfectly useful response.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-copper" aria-hidden />
                Takes about 3 minutes
              </li>
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-copper" aria-hidden />
                Instant, practical results
              </li>
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-copper" aria-hidden />
                No obligation
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setPhase("question")}
              className="mt-8 inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90"
            >
              Start the Health Check
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        {phase === "question" && currentQuestion && (
          <div>
            <p className="text-[15px] font-semibold leading-snug text-navy sm:text-base">
              {currentQuestion.label}
            </p>
            {currentQuestion.helper && (
              <p className="mt-1.5 text-xs text-muted-foreground">{currentQuestion.helper}</p>
            )}

            <div className="mt-5 grid gap-2">
              {currentQuestion.choices.map((c) => {
                const v = answers[currentQuestion.id];
                const selected = Array.isArray(v) ? v.includes(c.value) : v === c.value;
                return (
                  <label
                    key={c.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                      selected
                        ? "border-copper bg-copper-soft/60 text-navy"
                        : "border-border bg-background hover:bg-secondary"
                    }`}
                  >
                    <input
                      type={currentQuestion.multi ? "checkbox" : "radio"}
                      name={currentQuestion.id}
                      value={c.value}
                      checked={selected}
                      onChange={() =>
                        currentQuestion.multi
                          ? toggleMulti(currentQuestion.id, c.value)
                          : setSingle(currentQuestion.id, c.value)
                      }
                      className="h-4 w-4 accent-[var(--copper)]"
                    />
                    <span>{c.label}</span>
                  </label>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={currentQuestion.multi ? false : !currentAnswered}
                className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {questionIndex === QUESTIONS.length - 1 ? "Continue" : "Next"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}

        {(phase === "info" || phase === "submitting") && (
          <div>
            <h3 className="font-display text-xl text-navy sm:text-2xl">
              Where should we send your results?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We'll use this to save your results and follow up if you'd like to discuss them.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Business name"
                icon={Building2}
                error={infoErrors.businessName}
                required
              >
                <input
                  value={customer.businessName}
                  onChange={(e) => setCustomer((c) => ({ ...c, businessName: e.target.value }))}
                  placeholder="Your business name"
                  className={inputClass(Boolean(infoErrors.businessName))}
                  disabled={phase === "submitting"}
                />
              </Field>
              <Field label="Contact name" icon={User} error={infoErrors.contactName} required>
                <input
                  value={customer.contactName}
                  onChange={(e) => setCustomer((c) => ({ ...c, contactName: e.target.value }))}
                  placeholder="Your name"
                  className={inputClass(Boolean(infoErrors.contactName))}
                  disabled={phase === "submitting"}
                />
              </Field>
              <Field label="Email address" icon={Mail} error={infoErrors.email} required>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                  placeholder="you@business.com"
                  className={inputClass(Boolean(infoErrors.email))}
                  disabled={phase === "submitting"}
                />
              </Field>
              <Field label="Phone number" icon={Phone} optional>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                  placeholder="(optional)"
                  className={inputClass(false)}
                  disabled={phase === "submitting"}
                />
              </Field>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-xs leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                disabled={phase === "submitting"}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--copper)]"
              />
              <span>
                I agree that Simple Secure Solutions may store the information above along with my
                assessment answers, and may contact me about my results. We don't sell or share
                your information with third parties.
              </span>
            </label>
            {infoErrors.consent && (
              <p className="mt-1.5 text-xs font-medium text-[color:var(--danger)]">
                {infoErrors.consent}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPhase("question")}
                disabled={phase === "submitting"}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={phase === "submitting"}
                className="inline-flex items-center gap-1.5 rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-copper-foreground shadow-copper transition-colors hover:bg-copper/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phase === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Submitting…
                  </>
                ) : (
                  <>
                    Get my results
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {phase === "result" && result && (
          <div>
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-secondary/40 p-6 text-center sm:flex-row sm:text-left">
              <MiniScoreDial score={result.overall.score} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">
                  Overall result
                </p>
                <p className="mt-1 font-display text-2xl text-navy">{result.overall.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {result.overall.summary}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {result.areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <span className="text-xs font-medium leading-snug text-navy">{area.label}</span>
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[area.status]}`}
                    aria-hidden
                    title={STATUS_LABEL[area.status]}
                  />
                </div>
              ))}
            </div>

            {persistError ? (
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[color:var(--warning)]/40 bg-warning-soft/60 p-4 text-sm text-[color:var(--warning-foreground)] sm:flex-row sm:items-center sm:justify-between">
                <p className="leading-relaxed">{persistError}</p>
                <button
                  type="button"
                  onClick={retryPersist}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-current px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-white/40"
                >
                  Retry saving
                </button>
              </div>
            ) : (
              submissionId && (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-[color:var(--success)]/25 bg-success-soft/60 px-4 py-3 text-xs font-medium text-[color:var(--success)]">
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
                  Your submission has been securely saved.
                </div>
              )
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/health-check/technology-equipment/results"
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
        )}
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `mt-1.5 w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30 ${
    hasError ? "border-[color:var(--danger)] focus:border-[color:var(--danger)]" : "border-input focus:border-copper"
  }`;
}

function Field({
  label,
  icon: Icon,
  error,
  required,
  optional,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-navy">
        <Icon className="h-3.5 w-3.5 text-copper" aria-hidden />
        {label}
        {required && <span className="text-[color:var(--danger)]">*</span>}
        {optional && (
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        )}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-[color:var(--danger)]">{error}</p>}
    </div>
  );
}

function MiniScoreDial({ score }: { score: number }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 70 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl leading-none text-navy">{score}</span>
        <span className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  );
}
