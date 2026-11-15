import { NextRequest, NextResponse } from "next/server";
import { sendReviewEmail, type ReviewPayload } from "@/lib/email";
import {
  allowSubmission,
  createPendingReview,
  isStoreConfigured,
} from "@/lib/review-store";
import { SITE_URL } from "@/lib/site";

export async function POST(req: NextRequest) {
  let body: Partial<ReviewPayload> & { website?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Spam trap: real visitors never see or fill this hidden field, bots do.
  // Pretend it worked so the bot doesn't learn anything.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const rating = Number(body.rating);

  const payload: ReviewPayload = {
    name: String(body.name ?? "").slice(0, 200),
    // Anything that isn't a whole number from 1 to 5 is rejected below.
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 0,
    text: String(body.text ?? "").slice(0, 2000),
    locale: String(body.locale ?? "en").slice(0, 5),
  };

  if (!payload.name || !payload.text || payload.rating < 1) {
    return NextResponse.json(
      { error: "Name, rating and review text are required" },
      { status: 400 }
    );
  }

  // With storage set up, the review is saved as "pending" and the email carries
  // a private approve/reject link. Without it, the email is notification-only.
  let manageUrl: string | undefined;
  let saved = false;

  if (isStoreConfigured()) {
    try {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      if (!(await allowSubmission(ip))) {
        return NextResponse.json(
          { error: "Too many reviews submitted. Please try again later." },
          { status: 429 }
        );
      }
      const review = await createPendingReview(payload);
      manageUrl = `${SITE_URL}/manage-review/${review.id}?t=${review.token}`;
      saved = true;
    } catch (err) {
      console.error("Failed to store review:", err);
    }
  }

  let emailed = false;
  try {
    await sendReviewEmail(payload, manageUrl);
    emailed = true;
  } catch (err) {
    console.error("Failed to send review email:", err);
  }

  if (!saved && !emailed) {
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
