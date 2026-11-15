import { NextResponse } from "next/server";
import { listApprovedReviews } from "@/lib/review-store";

export const dynamic = "force-dynamic";

// Public list of approved reviews (name, stars, text only).
// Vercel's edge caches it for a few seconds so a busy page doesn't hit the
// database on every visit (Vercel-CDN-Cache-Control applies to Vercel's edge
// only). Browsers are told to always re-check, so a newly approved review is
// never hidden by a stale copy in someone's browser.
export async function GET() {
  let reviews: Awaited<ReturnType<typeof listApprovedReviews>> = [];
  try {
    reviews = await listApprovedReviews();
  } catch (err) {
    console.error("Failed to load reviews:", err);
  }

  return NextResponse.json(
    { reviews },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Vercel-CDN-Cache-Control": "s-maxage=20, stale-while-revalidate=40",
      },
    }
  );
}
