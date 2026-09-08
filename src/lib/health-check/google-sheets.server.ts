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

    if (!response.ok) {
      console.error("[health-check] Google Sheets webhook failed:", await response.text());
      return { saved: false, reason: "Google Sheets webhook rejected the request" } as const;
    }

    const body = await response.text();
    if (body) {
      try {
        const parsed = JSON.parse(body) as { success?: boolean; error?: string };
        if (parsed.success === false) {
          console.error("[health-check] Google Sheets webhook error:", parsed.error);
          return { saved: false, reason: parsed.error || "Google Sheets webhook returned an error" } as const;
        }
      } catch {
        // The webhook may return a non-JSON success response; HTTP 2xx is sufficient.
      }
    }

    return { saved: true } as const;
  } catch (err) {
    console.error("[health-check] Google Sheets lead save failed:", err);
    return { saved: false, reason: "Could not reach Google Sheets webhook" } as const;
  }
}
