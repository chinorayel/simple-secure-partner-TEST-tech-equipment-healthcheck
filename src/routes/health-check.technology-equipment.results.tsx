import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { BOOKING_URL } from "@/lib/booking";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Info,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  QUESTIONS,
  PRIORITY_LABEL,
  STATUS_LABEL,
  answerLabel,
  evaluateHealthCheck,
  loadSubmission,
  type AreaStatus,
  type Priority,
  type Submission,
} from "@/lib/health-check/technology-equipment";

export const Route = createFileRoute("/health-check/technology-equipment/results")({
  head: () => ({
    meta: [
      { title: "Your Technology Equipment Health Check Results | Simple Secure Solutions" },
      {
        name: "description",
        content:
          "A clear, practical summary of your Technology Equipment Health Check: overall score, strengths, areas to review, and a recommended next step.",
      },
      {
        property: "og:title",
        content: "Your Technology Equipment Health Check Results | Simple Secure Solutions",
      },
      {
        property: "og:description",
        content:
          "Your overall score, what is working well, and the areas worth reviewing across your business technology.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsPage,
});

const statusStyles: Record<AreaStatus, string> = {
  good: "bg-success-soft text-[color:var(--success)] border-[color:var(--success)]/25",
  attention: "bg-warning-soft text-[color:var(--warning-foreground)] border-[color:var(--warning)]/35",
  priority: "bg-danger-soft text-[color:var(--danger)] border-[color:var(--danger)]/25",
};

const statusDot: Record<AreaStatus, string> = {
  good: "bg-success",
  attention: "bg-warning",
  priority: "bg-danger",
};

const priorityStyles: Record<Priority, string> = {
  high: "bg-danger-soft text-[color:var(--danger)] border-[color:var(--danger)]/25",
  medium: "bg-warning-soft text-[color:var(--warning-foreground)] border-[color:var(--warning)]/35",
  low: "bg-secondary text-navy border-border",
};

const priorityBar: Record<Priority, string> = {
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-copper",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">{children}</p>
  );
}

function ResultsPage() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSubmission(loadSubmission());
    setLoaded(true);
  }, []);

  const result = useMemo(
    () => (submission ? evaluateHealthCheck(submission.answers) : null),
    [submission],
  );

  const completedAt = submission
    ? new Date(submission.completedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />

      <main className="pt-28 pb-24">
        {!loaded ? (
          <div className="mx-auto max-w-3xl px-6 text-sm text-muted-foreground lg:px-10">
            Loading your results…
          </div>
        ) : !submission || !result ? (
          <EmptyState />
        ) : (
          <>
            {/* 1. HEADER + 2. OVERALL SCORE */}
            <section className="relative overflow-hidden bg-navy text-navy-foreground">
              <PCBLines className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 80% 0%, oklch(0.68 0.14 45 / 0.28), transparent 55%)",
                }}
              />
              <div className="relative mx-auto max-w-6xl px-6 py-14 lg:px-10 lg:py-16">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  <ClipboardList className="h-3.5 w-3.5 text-copper" />
                  Health Check System
                </div>

                <h1 className="mt-5 font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">
                  Technology Equipment
                  <span className="block text-copper">Health Check</span>
                </h1>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
                  Thank you for completing the assessment. Here are your results.
                </p>

                {(submission.businessName || completedAt) && (
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60">
                    {submission.businessName && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" aria-hidden />
                        {submission.businessName}
                      </span>
                    )}
                    {completedAt && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                        Completed {completedAt}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-10 grid gap-6 rounded-3xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
                  <ScoreDial score={result.overall.score} />
                  <div>
                    <SectionLabel>Overall result</SectionLabel>
                    <p className="mt-2 font-display text-2xl text-white sm:text-3xl">
                      {result.overall.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-copper">
                      {result.overall.headline}
                    </p>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                      {result.overall.summary}
                    </p>
                    <p className="mt-5 inline-flex items-start gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-xs leading-relaxed text-white/60">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                      This Health Check highlights potential areas of interest based on your
                      answers. It is a high-level view, not a technical audit.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. AT A GLANCE */}
            <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
              <SectionLabel>Health check at a glance</SectionLabel>
              <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">
                Your assessment areas
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {result.areas.map((area) => (
                  <div
                    key={area.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold leading-snug text-navy">{area.label}</p>
                      <span
                        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[area.status]}`}
                        aria-hidden
                      />
                    </div>
                    <span
                      className={`mt-4 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusStyles[area.status]}`}
                    >
                      {STATUS_LABEL[area.status]}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. WHAT'S WORKING WELL */}
            {result.strengths.length > 0 && (
              <section className="border-y border-border bg-surface">
                <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
                  <SectionLabel>What's working well</SectionLabel>
                  <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">
                    Positive areas in your environment
                  </h2>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    Your assessment shows several positive areas within your technology
                    environment.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {result.strengths.map((s) => (
                      <div
                        key={s.areaId}
                        className="rounded-2xl border border-[color:var(--success)]/20 bg-card p-5 shadow-soft"
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-[color:var(--success)]">
                          <Check className="h-4 w-4" aria-hidden />
                        </span>
                        <p className="mt-3.5 text-sm font-semibold text-navy">{s.title}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                          {s.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 5. AREAS TO REVIEW */}
            <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
              <SectionLabel>Areas to review</SectionLabel>
              <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">
                Where a closer look could help
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                These areas may benefit from additional attention.
              </p>

              {result.recommendations.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-[color:var(--success)]/25 bg-success-soft/60 p-6">
                  <p className="text-sm font-semibold text-navy">
                    No concerns were flagged from your answers.
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    Based on what you shared, every assessment area came back in good shape. A
                    periodic review is still worthwhile as equipment ages.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  {result.recommendations.map((rec) => (
                    <article
                      key={rec.areaId}
                      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft"
                    >
                      <span
                        className={`absolute inset-y-0 left-0 w-1 ${priorityBar[rec.priority]}`}
                        aria-hidden
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-base font-semibold text-navy">{rec.category}</p>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityStyles[rec.priority]}`}
                        >
                          {PRIORITY_LABEL[rec.priority]}
                        </span>
                      </div>

                      <div className="mt-5 space-y-4 text-[13px] leading-relaxed">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            What we found
                          </p>
                          <p className="mt-1.5 text-foreground/80">{rec.found}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Why it matters
                          </p>
                          <p className="mt-1.5 text-foreground/80">{rec.why}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-secondary/70 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-copper">
                            Recommended next step
                          </p>
                          <p className="mt-1.5 text-foreground/80">{rec.nextStep}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* 7. RECOMMENDED NEXT STEP */}
            <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-10">
              <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-navy-foreground sm:p-12">
                <PCBLines className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]" />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 15% 100%, oklch(0.58 0.13 155 / 0.25), transparent 55%)",
                  }}
                />
                <div className="relative max-w-2xl">
                  <SectionLabel>Recommended next step</SectionLabel>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/75">
                    Your Health Check provides a high-level view of your technology environment. A
                    more detailed review can help identify the specific causes of the issues
                    identified and determine which improvements should be prioritized.
                  </p>
                  <h2 className="mt-8 font-display text-2xl sm:text-3xl">
                    Want to discuss your results?
                  </h2>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-copper px-5 py-3 text-sm font-medium text-copper-foreground shadow-copper transition-colors hover:bg-copper/90"
                    >
                      Book a Consultation
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                    <Link
                      to="/health-check/technology-equipment"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
                    >
                      Retake the Health Check
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. ASSESSMENT RESPONSES */}
            <ResponsesSection answers={submission.answers} />
          </>
        )}
      </main>
    </div>
  );
}

function ScoreDial({ score }: { score: number }) {
  const size = 188;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const color =
    pct >= 70 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="mx-auto lg:mx-0" style={{ width: size, height: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
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
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl leading-none text-white">{score}</span>
          <span className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-white/55">
            out of 100
          </span>
        </div>
      </div>
    </div>
  );
}

function ResponsesSection({ answers }: { answers: Record<string, string | string[] | undefined> }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const setAll = (value: boolean) =>
    setOpen(Object.fromEntries(QUESTIONS.map((q) => [q.id, value])));

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <SectionLabel>Your assessment responses</SectionLabel>
        <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">
          Here's a summary of your answers
        </h2>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:bg-secondary"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:bg-secondary"
          >
            Collapse all
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {QUESTIONS.map((q) => {
            const isOpen = Boolean(open[q.id]);
            return (
              <div
                key={q.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => setOpen((p) => ({ ...p, [q.id]: !p[q.id] }))}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-navy">{q.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Your answer
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                      {answerLabel(q, answers)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 lg:px-10">
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-navy">
          <ShieldAlert className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-2xl text-navy">No results to show yet</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          We couldn't find a completed Technology Equipment Health Check on this device. Complete
          the assessment and your results will appear here.
        </p>
        <Link
          to="/health-check/technology-equipment"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Start the Health Check
        </Link>
      </div>
    </div>
  );
}
