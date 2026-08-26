import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { Reveal } from "@/components/site/Reveal";
import { TechEquipmentHealthCheckWidget } from "@/components/health-check/TechEquipmentHealthCheckWidget";
import { BOOKING_URL } from "@/lib/booking";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Cloud,
  Headphones,
  Laptop,
  Network,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/technology-solutions")({
  head: () => ({
    meta: [
      { title: "Technology Solutions | Simple Secure Solutions" },
      {
        name: "description",
        content:
          "Managed IT, network solutions, CCTV, and cloud & security support for small and growing businesses — plus free business health assessments.",
      },
      { property: "og:title", content: "Technology Solutions | Simple Secure Solutions" },
      {
        property: "og:description",
        content:
          "Reliable, managed technology for your business — with focused health assessments to help identify where you may need support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TechnologySolutionsPage,
});

const capabilities = [
  { icon: Laptop, label: "Managed IT", detail: "Day-to-day management and support for your computers and systems." },
  { icon: Headphones, label: "IT Support", detail: "Responsive help when something isn't working the way it should." },
  { icon: Network, label: "Network Solutions", detail: "Reliable, secure networking for your office or site." },
  { icon: Camera, label: "CCTV", detail: "Surveillance systems sized to your business." },
  { icon: Cloud, label: "Cloud & Security", detail: "Cloud storage, backup, and security fundamentals done right." },
];

function TechnologySolutionsPage() {
  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24">
          <PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.3]" />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
            <Reveal>
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Laptop className="h-3.5 w-3.5 text-copper" />
                Technology Solutions
              </div>
              <h1 className="mt-5 font-display text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl">
                Reliable technology,
                <span className="block text-copper">quietly managed.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Managed IT, networking, CCTV, and cloud & security — so the technology your
                business depends on stays out of the way and just works.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90"
                >
                  Book a Consultation
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href="#health-check"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary"
                >
                  Take a free Health Check
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="border-y border-border bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                What we manage
              </div>
              <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
                Everything your team touches, handled.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-copper-soft text-copper">
                    <c.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-navy">{c.label}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {c.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BUSINESS HEALTH ASSESSMENTS */}
        <section id="health-check" className="relative overflow-hidden py-20 lg:py-28">
          <PCBLines variant="divider" className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full" opacity={0.5} />
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <Reveal>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                  Business Health Assessments
                </div>
                <h2 className="mt-3 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">
                  Find the right health check for your business.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  We offer multiple focused assessments, each designed to look at a different
                  area of your business. Choose the one that best fits your current needs and
                  get a clearer picture of where things stand and where improvements may help.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-foreground/80">
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden />
                    Free, no-obligation assessments
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden />
                    Practical results and recommended next steps
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden />
                    Start with the area most relevant to your business
                  </li>
                </ul>
              </Reveal>

              <Reveal delay={100}>
                <div className="space-y-5">
                  <TechEquipmentHealthCheckWidget />

                  <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
                    <div
                      className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl"
                      style={{ background: "radial-gradient(circle, var(--copper-soft), transparent 70%)" }}
                      aria-hidden
                    />
                    <div className="relative p-6 sm:p-8 lg:p-10">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-navy-foreground shadow-soft">
                        <Network className="h-6 w-6" aria-hidden />
                      </span>
                      <h3 className="mt-5 font-display text-2xl text-navy sm:text-3xl">
                        Network & CCTV Health Check
                      </h3>
                      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                        Check your internet reliability, Wi-Fi, backup power, failover, and CCTV
                        coverage. Answer at your own pace — whether you already have CCTV or are
                        considering it, this assessment helps identify where your business may need
                        stronger network and security foundations.
                      </p>
                      <ul className="mt-6 space-y-2 text-sm text-foreground/80">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-copper" aria-hidden />
                          Takes about 3 minutes
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-copper" aria-hidden />
                          Practical network & security results
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-copper" aria-hidden />
                          No obligation
                        </li>
                      </ul>
                      <a
                        href="/health-check/network-cctv/"
                        className="mt-8 inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-medium text-navy-foreground shadow-soft transition-colors hover:bg-navy/90"
                      >
                        Start the Health Check
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
