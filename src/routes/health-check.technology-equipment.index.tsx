import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { ArrowRight, ClipboardList } from "lucide-react";
import {
  QUESTIONS,
  saveSubmission,
  type AnswerMap,
} from "@/lib/health-check/technology-equipment";

export const Route = createFileRoute("/health-check/technology-equipment/")({
  head: () => ({
    meta: [
      { title: "Technology Equipment Health Check | Simple Secure Solutions" },
      {
        name: "description",
        content:
          "Answer a short set of questions about your business computers and get a clear, practical view of your technology environment.",
      },
      {
        property: "og:title",
        content: "Technology Equipment Health Check | Simple Secure Solutions",
      },
      {
        property: "og:description",
        content:
          "A short, practical health check for the computers and equipment your business relies on every day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HealthCheckForm,
});

function HealthCheckForm() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});

  const answered = QUESTIONS.filter((q) => {
    const v = answers[q.id];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length;

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSubmission({
      businessName: businessName.trim() || undefined,
      completedAt: new Date().toISOString(),
      answers,
    });
    navigate({ to: "/health-check/technology-equipment/results" });
  };

  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />

      <main className="relative overflow-hidden pt-28 pb-24">
        <PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.35]" />

        <div className="relative mx-auto max-w-3xl px-6 lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <ClipboardList className="h-3.5 w-3.5 text-copper" />
            Health Check System
          </div>

          <h1 className="mt-5 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">
            Technology Equipment
            <span className="block text-copper">Health Check</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            A short set of practical questions about the computers and equipment your business
            relies on. There are no wrong answers — “not sure” is a perfectly useful answer.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <label
                htmlFor="businessName"
                className="text-sm font-semibold text-navy"
              >
                Business name <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30"
              />
            </div>

            {QUESTIONS.map((q, i) => (
              <fieldset
                key={q.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <legend className="sr-only">{q.label}</legend>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-navy">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold leading-snug text-navy">{q.label}</p>
                    {q.helper && (
                      <p className="mt-1 text-xs text-muted-foreground">{q.helper}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {q.choices.map((c) => {
                    const v = answers[q.id];
                    const selected = Array.isArray(v)
                      ? v.includes(c.value)
                      : v === c.value;
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
                          type={q.multi ? "checkbox" : "radio"}
                          name={q.id}
                          value={c.value}
                          checked={selected}
                          onChange={() =>
                            q.multi ? toggleMulti(q.id, c.value) : setSingle(q.id, c.value)
                          }
                          className="h-4 w-4 accent-[var(--copper)]"
                        />
                        <span>{c.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="sticky bottom-4 rounded-2xl border border-border bg-card/95 p-4 shadow-elevated backdrop-blur">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {answered} of {QUESTIONS.length} questions answered
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90"
                >
                  View my results
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
