import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { adminLogin } from "@/lib/health-check/server-functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | Simple Secure Solutions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await adminLogin({ data: { password } });
      if (res.ok) {
        navigate({ to: "/admin/health-checks" });
      } else {
        setError(res.error || "Login failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-elevated">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft">
          <Lock className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-2xl text-navy">Admin sign in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Simple Secure Solutions Health Check submissions.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-navy">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[color:var(--danger)]/25 bg-danger-soft px-3.5 py-2.5 text-xs leading-relaxed text-[color:var(--danger)]">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="w-full rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
