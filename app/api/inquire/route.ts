import { NextRequest, NextResponse } from "next/server";
import { sendInquiryEmail, type InquiryPayload } from "@/lib/email";
import { appendInquiryToSheet } from "@/lib/sheets";

export async function POST(req: NextRequest) {
  let body: Partial<InquiryPayload>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const payload: InquiryPayload = {
    name: String(body.name ?? "").slice(0, 200),
    phone: String(body.phone ?? "").slice(0, 50),
    email: String(body.email ?? "").slice(0, 200),
    eventType: String(body.eventType ?? "").slice(0, 100),
    eventDate: String(body.eventDate ?? "").slice(0, 50),
    location: String(body.location ?? "").slice(0, 200),
    guestCount: String(body.guestCount ?? "").slice(0, 20),
    vision: String(body.vision ?? "").slice(0, 2000),
    locale: String(body.locale ?? "en").slice(0, 5),
  };

  if (!payload.name || !payload.phone || !payload.email) {
    return NextResponse.json(
      { error: "Name, phone and email are required" },
      { status: 400 }
    );
  }

  const results = await Promise.allSettled([
    sendInquiryEmail(payload),
    appendInquiryToSheet(payload),
  ]);

  const [emailResult, sheetResult] = results;
  const emailFailed = emailResult.status === "rejected";
  const sheetFailed = sheetResult.status === "rejected";

  if (emailResult.status === "rejected") {
    console.error("Failed to send inquiry email:", emailResult.reason);
  }
  if (sheetResult.status === "rejected") {
    console.error("Failed to log inquiry to sheet:", sheetResult.reason);
  }

  if (emailFailed && sheetFailed) {
    return NextResponse.json(
      { error: "Failed to process inquiry" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
