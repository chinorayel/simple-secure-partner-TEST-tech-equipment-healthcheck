import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { Reveal } from "@/components/site/Reveal";
import { TechEquipmentHealthCheckWidget } from "@/components/health-check/TechEquipmentHealthCheckWidget";
import { NetworkCctvHealthCheckWidget } from "@/components/health-check/NetworkCctvHealthCheckWidget";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/assessments")({
  head: () => ({
    meta: [
      { title: "Business Health Assessments | Simple Secure Solutions" },
      {
        name: "description",
        content:
          "Choose a focused business health assessment from Simple Secure Solutions to understand where technology and network improvements may help.",
      },
    ],
  }),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />
      <main>
        <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
          <PCBLines className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.3]" />
          <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
            <Reveal>
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-copper" />
                Business Health Assessments
              </div>
              <h1 className="mt-5 font-display text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl">
                Find the right health check for your business.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                We offer focused assessments designed to look at different areas of your business.
                Choose the one that best fits your current needs and get a clearer picture of where
                things stand and where improvements may help.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="health-check" className="relative overflow-hidden border-t border-border bg-surface py-16 lg:py-24">
          <PCBLines variant="divider" className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full" opacity={0.5} />
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
              <Reveal>
                <div className="lg:sticky lg:top-28">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                    Start with what matters most
                  </div>
                  <h2 className="mt-3 font-display text-3xl leading-[1.1] text-navy sm:text-4xl">
                    Practical, no-obligation assessments.
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    Answer a few practical questions at your own pace. There are no wrong answers,
                    and “not sure” is a useful response.
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
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="space-y-6">
                  <TechEquipmentHealthCheckWidget />
                  <NetworkCctvHealthCheckWidget />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
