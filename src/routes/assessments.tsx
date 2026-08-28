import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { Reveal } from "@/components/site/Reveal";
import { Laptop, Network, ClipboardList, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/assessments")({
  head: () => ({
    meta: [
      { title: "Business Health Assessments | Simple Secure Solutions" },
      { name: "description", content: "Choose a business health assessment from Simple Secure Solutions." },
    ],
  }),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />
      <main>
        <section className="relative overflow-hidden pt-32 pb-14 lg:pt-40 lg:pb-16">
          <PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.3]" />
          <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">Business Health Assessments</div>
              <h1 className="mt-4 font-display text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl">Choose an assessment.</h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">Start with the area that matters most to your business right now.</p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-14 lg:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-10">
            <div className="grid gap-5 md:grid-cols-2">
              <Reveal>
                <Link to="/health-check/technology-equipment" className="group block h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated sm:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-copper-soft text-copper"><Laptop className="h-6 w-6" /></span>
                  <h2 className="mt-5 font-display text-2xl text-navy sm:text-3xl">Technology Equipment Health Check</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A practical assessment of the computers and equipment your business relies on every day.</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy">Start assessment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </Reveal>

              <Reveal delay={80}>
                <Link to="/health-check/network-cctv" className="group block h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated sm:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-copper-soft text-copper"><Network className="h-6 w-6" /></span>
                  <h2 className="mt-5 font-display text-2xl text-navy sm:text-3xl">Network &amp; CCTV Health Check</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A practical assessment of your connectivity, network reliability, power protection and CCTV readiness.</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy">Start assessment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </Reveal>

              <Reveal delay={160}>
                <Link to="/health-check/business-operations" className="group block h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated sm:p-8 md:col-span-2 lg:col-span-1">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-copper-soft text-copper"><ClipboardList className="h-6 w-6" /></span>
                  <h2 className="mt-5 font-display text-2xl text-navy sm:text-3xl">Business Operations Health Check</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A practical look at your processes, administrative workload, customer enquiries and day-to-day operations.</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy">Start assessment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
