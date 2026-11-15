import { NextRequest, NextResponse } from "next/server";
import {
  getReview,
  isStoreConfigured,
  setReviewStatus,
  tokenMatches,
} from "@/lib/review-store";

export async function POST(req: NextRequest) {
  if (!isStoreConfigured()) {
    return NextResponse.json({ error: "Not available" }, { status: 503 });
  }

  let body: { id?: unknown; token?: unknown; action?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, token, action } = body;
  if (
    typeof id !== "string" ||
    typeof token !== "string" ||
    (action !== "approve" && action !== "reject")
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const review = await getReview(id);
    // Same answer for "no such review" and "wrong token", so the response
    // never confirms that an id exists.
    if (!review || !tokenMatches(review, token)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await setReviewStatus(
      review,
      action === "approve" ? "approved" : "rejected"
    );
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    console.error("Failed to update review:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
