import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Building2, CheckCircle2, ClipboardList, Mail, Phone, User } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { QUESTIONS, saveSubmission, type AnswerMap } from "@/lib/health-check/digital-marketing";
import { submitDigitalMarketingHealthCheck } from "@/lib/health-check/digital-marketing-server";

export const Route = createFileRoute("/health-check/digital-marketing/")({
  head: () => ({
    meta: [
      { title: "Digital Marketing Health Check | Simple Secure Solutions" },
      { name: "description", content: "A practical health check for your website, professional email, social media, customer messaging and digital marketing." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DigitalMarketingHealthCheck,
});

function DigitalMarketingHealthCheck() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answered = QUESTIONS.filter((q) => Boolean(answers[q.id])).length;
  const setAnswer = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !contactName.trim() || !email.trim()) return;
    setSubmitting(true);
    setError(null);
    const customer = { businessName: businessName.trim(), contactName: contactName.trim(), email: email.trim(), phone: phone.trim() };
    saveSubmission({ assessment: "digital-marketing", ...customer, completedAt: new Date().toISOString(), answers });
    localStorage.setItem("sss-digital-marketing-last", JSON.stringify({ ...customer, answers }));
    try {
      const r = await submitDigitalMarketingHealthCheck({ data: { customer: { ...customer, phone: customer.phone || undefined }, answers: answers as Record<string, string> } });
      if (!r.ok) { setError(r.error); setSubmitting(false); return; }
      navigate({ to: "/health-check/digital-marketing/results" });
    } catch {
      setError("We couldn't submit your assessment right now. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />
      <main className="relative overflow-hidden pt-28 pb-24">
        <PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.35]" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <ClipboardList className="h-3.5 w-3.5 text-copper" />
            Business Marketing Assessment
          </div>
          <h1 className="mt-5 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">
            Digital Marketing
            <span className="block text-copper">Health Check</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Answer practical questions about your website, professional email, Facebook presence, customer messaging, content and digital marketing. There are no wrong answers.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-5 flex items-center gap-3">
                <Building2 className="h-5 w-5 text-copper" />
                <div>
                  <p className="font-semibold text-navy">Your business</p>
                  <p className="text-xs text-muted-foreground">We'll use these details to prepare your assessment.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name" icon={Building2} value={businessName} onChange={setBusinessName} placeholder="Your business name" />
                <Field label="Your name" icon={User} value={contactName} onChange={setContactName} placeholder="Your name" />
                <Field label="Email" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
                <Field label="Phone" icon={Phone} value={phone} onChange={setPhone} placeholder="09xx xxx xxxx" />
              </div>
            </div>

            <SectionTitle title="Website & Professional Presence" />
            {QUESTIONS.filter((q) => ["website", "professional-email"].includes(q.id)).map((q, i) => <QuestionCard key={q.id} q={q} index={i + 1} value={answers[q.id]} onChange={setAnswer} />)}

            <SectionTitle title="Facebook & Social Presence" />
            {QUESTIONS.filter((q) => ["facebook", "social-consistency"].includes(q.id)).map((q, i) => <QuestionCard key={q.id} q={q} index={i + 3} value={answers[q.id]} onChange={setAnswer} />)}

            <SectionTitle title="Customer Messaging & Enquiries" />
            {QUESTIONS.filter((q) => ["online-contact", "messenger"].includes(q.id)).map((q, i) => <QuestionCard key={q.id} q={q} index={i + 5} value={answers[q.id]} onChange={setAnswer} />)}

            <SectionTitle title="Content & Planning" />
            {QUESTIONS.filter((q) => ["visual-content", "content-planning"].includes(q.id)).map((q, i) => <QuestionCard key={q.id} q={q} index={i + 7} value={answers[q.id]} onChange={setAnswer} />)}

            <SectionTitle title="Marketing Strategy & Growth" />
            {QUESTIONS.filter((q) => ["target-customer", "marketing-conversion"].includes(q.id)).map((q, i) => <QuestionCard key={q.id} q={q} index={i + 9} value={answers[q.id]} onChange={setAnswer} />)}

            {error && <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{error}</div>}

            <div className="sticky bottom-4 rounded-2xl border border-border bg-card/95 p-4 shadow-elevated backdrop-blur">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">{answered} of {QUESTIONS.length} questions answered</p>
                <button type="submit" disabled={submitting || !businessName.trim() || !contactName.trim() || !email.trim()} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-40">
                  {submitting ? "Preparing results…" : "View my results"}
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

function SectionTitle({ title }: { title: string }) {
  return <div className="flex items-center gap-3 pt-5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-copper-soft text-copper"><ClipboardList className="h-5 w-5" /></span><h2 className="font-display text-xl text-navy">{title}</h2></div>;
}

function QuestionCard({ q, index, value, onChange }: { q: typeof QUESTIONS[number]; index: number; value?: string; onChange: (id: string, value: string) => void }) {
  return <fieldset className="rounded-2xl border border-border bg-card p-6 shadow-soft"><legend className="sr-only">{q.label}</legend><div className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-navy">{index}</span><div><p className="text-[15px] font-semibold leading-snug text-navy">{q.label}</p>{q.helper && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{q.helper}</p>}</div></div><div className="mt-4 grid gap-2">{q.choices.map((c) => <label key={c.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${value === c.value ? "border-copper bg-copper-soft/60 text-navy" : "border-border bg-background hover:bg-secondary"}`}><input type="radio" name={q.id} value={c.value} checked={value === c.value} onChange={() => onChange(q.id, c.value)} className="h-4 w-4 accent-[var(--copper)]" /><span>{c.label}</span></label>)}</div></fieldset>;
}

function Field({ label, icon: Icon, value, onChange, placeholder, type = "text" }: { label: string; icon: typeof Building2; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return <label className="block"><span className="flex items-center gap-1.5 text-xs font-semibold text-navy"><Icon className="h-3.5 w-3.5 text-copper" />{label}</span><input required={label !== "Phone"} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /></label>;
}
