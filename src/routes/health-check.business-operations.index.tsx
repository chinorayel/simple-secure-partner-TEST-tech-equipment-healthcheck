import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { ArrowRight, Building2, ClipboardList, Mail, Phone, User } from "lucide-react";
import { QUESTIONS, saveSubmission, type AnswerMap } from "@/lib/health-check/business-operations";

export const Route = createFileRoute("/health-check/business-operations/")({
  head: () => ({ meta: [{ title: "Business Operations Health Check | Simple Secure Solutions" }, { name: "description", content: "A practical health check for your business operations, processes and back-office workload." }, { name: "robots", content: "noindex" }] }),
  component: BusinessOperationsHealthCheck,
});

function BusinessOperationsHealthCheck() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});

  const answered = QUESTIONS.filter((q) => Boolean(answers[q.id])).length;
  const setSingle = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSubmission({ assessment: "business-operations", businessName: businessName.trim(), contactName: contactName.trim(), email: email.trim(), phone: phone.trim(), completedAt: new Date().toISOString(), answers });
    localStorage.setItem("sss-business-operations-last", JSON.stringify({ businessName, contactName, email, phone, answers }));
    navigate({ to: "/health-check/business-operations/results" });
  };

  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />
      <main className="relative overflow-hidden pt-28 pb-24">
        <PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.35]" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"><ClipboardList className="h-3.5 w-3.5 text-copper" />Health Check System</div>
          <h1 className="mt-5 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">Business Operations <span className="block text-copper">Health Check</span></h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">A practical look at how your business handles its day-to-day operations, processes and administrative work. There are no wrong answers.</p>
          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-5 flex items-center gap-3"><Building2 className="h-5 w-5 text-copper" /><div><p className="font-semibold text-navy">Your business</p><p className="text-xs text-muted-foreground">We'll use these details to prepare your health check.</p></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name" icon={Building2} value={businessName} onChange={setBusinessName} placeholder="Your business name" />
                <Field label="Your name" icon={User} value={contactName} onChange={setContactName} placeholder="Your name" />
                <Field label="Email" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
                <Field label="Phone" icon={Phone} value={phone} onChange={setPhone} placeholder="09xx xxx xxxx" />
              </div>
            </div>
            {QUESTIONS.map((q, i) => (
              <fieldset key={q.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <legend className="sr-only">{q.label}</legend>
                <div className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-navy">{i + 1}</span><p className="text-[15px] font-semibold leading-snug text-navy">{q.label}</p></div>
                <div className="mt-4 grid gap-2">
                  {q.choices.map((c) => {
                    const selected = answers[q.id] === c.value;
                    return <label key={c.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${selected ? "border-copper bg-copper-soft/60 text-navy" : "border-border bg-background hover:bg-secondary"}`}><input type="radio" name={q.id} value={c.value} checked={selected} onChange={() => setSingle(q.id, c.value)} className="h-4 w-4 accent-[var(--copper)]" /><span>{c.label}</span></label>;
                  })}
                </div>
              </fieldset>
            ))}
            <div className="sticky bottom-4 rounded-2xl border border-border bg-card/95 p-4 shadow-elevated backdrop-blur"><div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground">{answered} of {QUESTIONS.length} questions answered</p><button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90">View my results <ArrowRight className="h-4 w-4" aria-hidden /></button></div></div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange, placeholder, type = "text" }: { label: string; icon: typeof Building2; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return <label className="block"><span className="flex items-center gap-1.5 text-xs font-semibold text-navy"><Icon className="h-3.5 w-3.5 text-copper" />{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /></label>;
}
