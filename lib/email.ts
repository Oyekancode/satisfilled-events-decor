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
  wishlist: string;
  locale: string;
};

const NOTIFY_EMAIL = "iamsatisfilled@gmail.com";

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
    ["Wishlist", payload.wishlist],
  ];

  const html = `
    <h2>New inquiry from SatisFilled Events & Decor website</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="font-weight:600;vertical-align:top">${label}</td><td>${escapeHtml(
              value || "-"
            ).replaceAll("\n", "<br/>")}</td></tr>`
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

export type ReviewPayload = {
  name: string;
  rating: number;
  text: string;
  locale: string;
};

export async function sendReviewEmail(payload: ReviewPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const resend = new Resend(apiKey);

  const stars = "★".repeat(payload.rating) + "☆".repeat(5 - payload.rating);

  const html = `
    <h2>New review submitted on SatisFilled Events & Decor website</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Rating:</strong> ${stars} (${payload.rating}/5)</p>
    <p><strong>Review:</strong><br/>${escapeHtml(payload.text).replaceAll(
      "\n",
      "<br/>"
    )}</p>
    <p style="color:#888;font-size:12px">This review is not published automatically — add it to dictionaries/en.json and dictionaries/cz.json under "testimonials.reviews" to publish it.</p>
  `;

  await resend.emails.send({
    from: "SatisFilled Website <onboarding@resend.dev>",
    to: NOTIFY_EMAIL,
    subject: `New ${payload.rating}★ Review — ${payload.name}`,
    html,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
