import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Mail, Phone, User } from "lucide-react";
import { adminGetSubmission } from "@/lib/health-check/server-functions";
import {
  answerLabel,
  PRIORITY_LABEL,
  QUESTIONS,
  STATUS_LABEL,
  type AreaStatus,
  type Priority,
} from "@/lib/health-check/technology-equipment";
import type { StoredSubmission } from "@/lib/health-check/submission-types";

export const Route = createFileRoute("/admin/health-checks/$id")({
  head: () => ({
    meta: [
      { title: "Submission | Admin | Simple Secure Solutions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSubmissionDetail,
});

type LoadState = "loading" | "ready" | "unauthorized" | "not-found" | "error";

const statusStyles: Record<AreaStatus, string> = {
  good: "bg-success-soft text-[color:var(--success)] border-[color:var(--success)]/25",
  attention: "bg-warning-soft text-[color:var(--warning-foreground)] border-[color:var(--warning)]/35",
  priority: "bg-danger-soft text-[color:var(--danger)] border-[color:var(--danger)]/25",
};

const priorityStyles: Record<Priority, string> = {
  high: "bg-danger-soft text-[color:var(--danger)] border-[color:var(--danger)]/25",
  medium: "bg-warning-soft text-[color:var(--warning-foreground)] border-[color:var(--warning)]/35",
  low: "bg-secondary text-navy border-border",
};

function AdminSubmissionDetail() {
  const { id } = useParams({ from: "/admin/health-checks/$id" });
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>("loading");
  const [submission, setSubmission] = useState<StoredSubmission | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminGetSubmission({ data: { id } });
        if (cancelled) return;
        if (res.ok) {
          setSubmission(res.submission);
          setState("ready");
        } else if (res.error === "UNAUTHORIZED") {
          setState("unauthorized");
          navigate({ to: "/admin/login" });
        } else if (res.error === "NOT_FOUND") {
          setState("not-found");
        } else {
          setState("error");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-5 lg:px-10">
          <Link
            to="/admin/health-checks"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy transition-colors hover:text-copper"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to submissions
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
        {state === "loading" && <p className="text-sm text-muted-foreground">Loading…</p>}
        {state === "not-found" && (
          <p className="text-sm text-muted-foreground">Submission not found.</p>
        )}
        {state === "error" && (
          <p className="text-sm text-[color:var(--danger)]">
            Something went wrong loading this submission.
          </p>
        )}

        {state === "ready" && submission && (
          <>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="flex items-center gap-2 font-display text-2xl text-navy">
                    <Building2 className="h-5 w-5 text-copper" aria-hidden />
                    {submission.businessName}
                  </h1>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-foreground/80">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                      {submission.contactName}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                      {submission.email}
                    </span>
                    {submission.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                        {submission.phone}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Completed{" "}
                    {new Date(submission.completedAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-4xl text-navy">
                    {submission.result.overall.score}
                  </p>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {submission.result.overall.label}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {submission.result.areas.map((area) => (
                <div key={area.id} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-navy">{area.label}</p>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${statusStyles[area.status]}`}
                  >
                    {STATUS_LABEL[area.status]}
                  </span>
                </div>
              ))}
            </div>

            {submission.result.recommendations.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg text-navy">Recommendations</h2>
                <div className="mt-4 space-y-3">
                  {submission.result.recommendations.map((rec) => (
                    <div key={rec.areaId} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-navy">{rec.category}</p>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${priorityStyles[rec.priority]}`}
                        >
                          {PRIORITY_LABEL[rec.priority]}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-foreground/80">{rec.found}</p>
                      <p className="mt-1.5 text-xs text-copper">{rec.nextStep}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-display text-lg text-navy">All answers</h2>
              <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="px-4 py-3">
                    <p className="text-xs font-semibold text-navy">{q.label}</p>
                    <p className="mt-1 text-xs text-foreground/80">
                      {answerLabel(q, submission.answers)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
