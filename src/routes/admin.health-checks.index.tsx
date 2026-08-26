import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, LogOut, Mail, Phone, ShieldCheck } from "lucide-react";
import {
  adminListSubmissions,
  adminLogout,
} from "@/lib/health-check/server-functions";
import type { SubmissionSummary } from "@/lib/health-check/submission-types";

export const Route = createFileRoute("/admin/health-checks/")({
  head: () => ({
    meta: [
      { title: "Health Check Submissions | Admin | Simple Secure Solutions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSubmissionsList,
});

type LoadState = "loading" | "ready" | "unauthorized" | "error";

function AdminSubmissionsList() {
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>("loading");
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminListSubmissions();
        if (cancelled) return;
        if (res.ok) {
          setSubmissions(res.submissions);
          setState("ready");
        } else if (res.error === "UNAUTHORIZED") {
          setState("unauthorized");
          navigate({ to: "/admin/login" });
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
  }, [navigate]);

  const onLogout = async () => {
    await adminLogout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-copper">
              Admin
            </p>
            <h1 className="mt-1 font-display text-xl text-navy">
              Technology Equipment Health Check submissions
            </h1>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        {state === "loading" && (
          <p className="text-sm text-muted-foreground">Loading submissions…</p>
        )}

        {state === "error" && (
          <p className="text-sm text-[color:var(--danger)]">
            Something went wrong loading submissions. Please refresh the page.
          </p>
        )}

        {state === "ready" && submissions.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
            <ShieldCheck className="mx-auto h-8 w-8 text-copper" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">No submissions yet.</p>
          </div>
        )}

        {state === "ready" && submissions.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/60 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Business</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Score</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((s) => (
                  <tr
                    key={s.id}
                    className="cursor-pointer transition-colors hover:bg-secondary/40"
                    onClick={() => navigate({ to: "/admin/health-checks/$id", params: { id: s.id } })}
                  >
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2 font-medium text-navy">
                        <Building2 className="h-3.5 w-3.5 text-copper" aria-hidden />
                        {s.businessName}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-foreground/80">
                      <div>{s.contactName}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" aria-hidden />
                          {s.email}
                        </span>
                        {s.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" aria-hidden />
                            {s.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-navy">{s.overallScore}</td>
                    <td className="px-5 py-4 text-foreground/80">{s.overallLabel}</td>
                    <td className="px-5 py-4 text-foreground/80">
                      {new Date(s.completedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
