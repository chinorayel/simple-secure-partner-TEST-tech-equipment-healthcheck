import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouterState } from "@tanstack/react-router";
import { DigitalMarketingHealthCheckWidget } from "@/components/health-check/DigitalMarketingHealthCheckWidget";
import { BusinessOperationsHealthCheckWidget } from "@/components/health-check/BusinessOperationsHealthCheckWidget";

export function HomeAssessmentExtras() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => { if (pathname !== "/") { setTarget(null); return; } setTarget(document.querySelector<HTMLElement>("#assessments .mt-10.grid")); }, [pathname]);
  if (!target) return null;
  return createPortal(<><div><BusinessOperationsHealthCheckWidget /></div><div><DigitalMarketingHealthCheckWidget /></div></>, target);
}
