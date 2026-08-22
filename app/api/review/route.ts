import { NextRequest, NextResponse } from "next/server";
import { sendReviewEmail, type ReviewPayload } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: Partial<ReviewPayload>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const rating = Number(body.rating);

  const payload: ReviewPayload = {
    name: String(body.name ?? "").slice(0, 200),
    rating: Number.isInteger(rating) ? Math.min(5, Math.max(1, rating)) : 0,
    text: String(body.text ?? "").slice(0, 2000),
    locale: String(body.locale ?? "en").slice(0, 5),
  };

  if (!payload.name || !payload.text || payload.rating < 1) {
    return NextResponse.json(
      { error: "Name, rating and review text are required" },
      { status: 400 }
    );
  }

  try {
    await sendReviewEmail(payload);
  } catch (err) {
    console.error("Failed to send review email:", err);
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
