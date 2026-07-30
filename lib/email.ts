import { Resend } from "resend";

export type InquiryPayload = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: string;
  vision: string;
  locale: string;
};

const NOTIFY_EMAIL = "omololairere@gmail.com";

export async function sendInquiryEmail(payload: InquiryPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const resend = new Resend(apiKey);

  const rows = [
    ["Name", payload.name],
    ["Phone", payload.phone],
    ["Email", payload.email],
    ["Event Type", payload.eventType],
    ["Event Date", payload.eventDate],
    ["Location", payload.location],
    ["Guest Count", payload.guestCount],
    ["Vision", payload.vision],
  ];

  const html = `
    <h2>New inquiry from SatisFilled Events & Decor website</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="font-weight:600;vertical-align:top">${label}</td><td>${escapeHtml(
              value || "-"
            )}</td></tr>`
        )
        .join("")}
    </table>
  `;

  await resend.emails.send({
    from: "SatisFilled Website <onboarding@resend.dev>",
    to: NOTIFY_EMAIL,
    replyTo: payload.email || undefined,
    subject: `New Inquiry: ${payload.eventType || "Event"} — ${payload.name}`,
    html,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
