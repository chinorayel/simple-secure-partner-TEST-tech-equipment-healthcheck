type Customer = {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
};

export async function saveHealthCheckLeadToGoogleSheets(input: {
  assessment: string;
  customer: Customer;
  score: number | string;
  result: string;
  opportunities?: string[];
}) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return { saved: false, reason: "GOOGLE_SHEETS_WEBHOOK_URL is not configured" } as const;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({
        date: new Date().toISOString(),
        assessment: input.assessment,
        businessName: input.customer.businessName,
        contactName: input.customer.contactName,
        email: input.customer.email,
        phone: input.customer.phone || "",
        score: input.score,
        result: input.result,
        opportunities: input.opportunities || [],
      }),
    });

    const body = await response.text();

    if (!response.ok) {
      const detail = body.replace(/\s+/g, " ").trim().slice(0, 300);
      const reason = `Google Sheets webhook returned ${response.status} ${response.statusText}${detail ? `: ${detail}` : ""}`;
      console.error("[health-check] Google Sheets webhook failed:", reason);
      return { saved: false, reason } as const;
    }

    try {
      const parsed = JSON.parse(body) as { success?: boolean; error?: string };
      if (parsed.success === false) {
        const reason = parsed.error || "Google Sheets webhook returned an error";
        console.error("[health-check] Google Sheets webhook error:", reason);
        return { saved: false, reason } as const;
      }
      if (parsed.success !== true) {
        const reason = "Google Sheets webhook returned an unexpected JSON response";
        console.error("[health-check] Google Sheets webhook error:", body.slice(0, 300));
        return { saved: false, reason } as const;
      }
      return { saved: true } as const;
    } catch {
      const detail = body.replace(/\s+/g, " ").trim().slice(0, 300);
      const reason = `Google Sheets webhook returned a non-JSON response${detail ? `: ${detail}` : ""}`;
      console.error("[health-check] Google Sheets webhook error:", reason);
      return { saved: false, reason } as const;
    }
  } catch (err) {
    console.error("[health-check] Google Sheets lead save failed:", err);
    return { saved: false, reason: "Could not reach Google Sheets webhook" } as const;
  }
}
