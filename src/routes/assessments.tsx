import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { PCBLines } from "@/components/site/PCBLines";
import { Reveal } from "@/components/site/Reveal";
import { TechEquipmentHealthCheckWidget } from "@/components/health-check/TechEquipmentHealthCheckWidget";
import { NetworkCctvHealthCheckWidget } from "@/components/health-check/NetworkCctvHealthCheckWidget";
import { BusinessOperationsHealthCheckWidget } from "@/components/health-check/BusinessOperationsHealthCheckWidget";
import { DigitalMarketingHealthCheckWidget } from "@/components/health-check/DigitalMarketingHealthCheckWidget";

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
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Start with the area that matters most to your business right now.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-14 lg:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div id="technology-equipment">
                  <TechEquipmentHealthCheckWidget />
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div id="network-cctv">
                  <NetworkCctvHealthCheckWidget />
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div id="business-operations">
                  <BusinessOperationsHealthCheckWidget />
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div id="digital-marketing">
                  <DigitalMarketingHealthCheckWidget />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
