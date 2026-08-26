import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Camera, ClipboardList, Wifi } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { QUESTIONS, saveSubmission, type AnswerMap } from "@/lib/health-check/network-cctv";

export const Route = createFileRoute("/health-check/network-cctv/")({
  head: () => ({
    meta: [
      { title: "Network & CCTV Health Check | Simple Secure Solutions" },
      { name: "description", content: "A practical assessment of your business internet, network reliability, power protection and CCTV readiness." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NetworkCctvHealthCheck,
});

function NetworkCctvHealthCheck() {
  const navigate = useNavigate();
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

  const answered = visibleQuestions.filter((q) => Boolean(answers[q.id]) || (q.id === "provider-speed" && provider.trim())).length;

  const setAnswer = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSubmission({
      assessment: "network-cctv",
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      provider: provider.trim(),
      answers,
    });
    localStorage.setItem("sss-network-cctv-last", JSON.stringify({ businessName, contactName, email, phone, provider, answers }));
    navigate({ to: "/health-check/network-cctv/results" });
  };

  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />
      <main className="relative overflow-hidden pt-28 pb-24">
        <PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.35]" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <ClipboardList className="h-3.5 w-3.5 text-copper" />
            Business Technology Assessment
          </div>
          <h1 className="mt-5 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">
            Network & CCTV
            <span className="block text-copper">Health Check</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Answer a practical set of questions about your business internet, Wi-Fi, network reliability, power protection and CCTV. There are no technical answers you need to know — “I'm not sure” is a useful answer.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-5 flex items-center gap-3">
                <Wifi className="h-5 w-5 text-copper" />
                <div>
                  <p className="font-semibold text-navy">Your business</p>
                  <p className="text-xs text-muted-foreground">We'll use these details to prepare your assessment.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name" value={businessName} onChange={setBusinessName} placeholder="Your business name" />
                <Field label="Your name" value={contactName} onChange={setContactName} placeholder="Your name" />
                <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
                <Field label="Phone" value={phone} onChange={setPhone} placeholder="09xx xxx xxxx" />
              </div>
            </div>

            <SectionTitle icon={<Wifi className="h-5 w-5" />} title="Internet & Connectivity" />
            {visibleQuestions.filter((q) => q.area === "connectivity").map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i + 1} value={answers[q.id]} onChange={setAnswer} provider={provider} setProvider={setProvider} />
            ))}

            <SectionTitle icon={<Wifi className="h-5 w-5" />} title="Network Reliability & Power" />
            {visibleQuestions.filter((q) => q.area === "reliability").map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i + 1} value={answers[q.id]} onChange={setAnswer} provider={provider} setProvider={setProvider} />
            ))}

            <SectionTitle icon={<Camera className="h-5 w-5" />} title="CCTV & Security" />
            {visibleQuestions.filter((q) => q.area === "cctv").map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i + 1} value={answers[q.id]} onChange={setAnswer} provider={provider} setProvider={setProvider} />
            ))}

            <SectionTitle icon={<ClipboardList className="h-5 w-5" />} title="Upgrade Readiness" />
            {visibleQuestions.filter((q) => q.area === "planning").map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i + 1} value={answers[q.id]} onChange={setAnswer} provider={provider} setProvider={setProvider} />
            ))}

            <div className="sticky bottom-4 rounded-2xl border border-border bg-card/95 p-4 shadow-elevated backdrop-blur">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">{answered} questions answered</p>
                <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90">
                  View my results <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return <label className="block"><span className="text-xs font-semibold text-navy">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /></label>;
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <div className="flex items-center gap-3 pt-5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-copper-soft text-copper">{icon}</span><h2 className="font-display text-xl text-navy">{title}</h2></div>;
}

function QuestionCard({ q, index, value, onChange, provider, setProvider }: { q: typeof QUESTIONS[number]; index: number; value?: string; onChange: (id: string, value: string) => void; provider: string; setProvider: (v: string) => void }) {
  return <fieldset className="rounded-2xl border border-border bg-card p-6 shadow-soft"><legend className="sr-only">{q.label}</legend><div className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-navy">{index}</span><div><p className="text-[15px] font-semibold leading-snug text-navy">{q.label}</p>{q.helper && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{q.helper}</p>}</div></div>{q.id === "provider-speed" ? <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g. PLDT Fiber 200 Mbps" className="mt-4 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-ring/30" /> : <div className="mt-4 grid gap-2">{q.choices.map((c) => <label key={c.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${value === c.value ? "border-copper bg-copper-soft/60 text-navy" : "border-border bg-background hover:bg-secondary"}`}><input type="radio" name={q.id} value={c.value} checked={value === c.value} onChange={() => onChange(q.id, c.value)} className="h-4 w-4 accent-[var(--copper)]" /><span>{c.label}</span></label>)}</div>}</fieldset>;
}
