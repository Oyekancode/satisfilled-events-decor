import type { Metadata } from "next";
import ReviewApproval from "@/components/ReviewApproval";
import {
  getReview,
  isStoreConfigured,
  tokenMatches,
} from "@/lib/review-store";

// Private page: never cached, never indexed by search engines.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Manage review",
  robots: { index: false, follow: false },
};

function Message({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
      <p className="max-w-md text-center text-ink/70">{children}</p>
    </main>
  );
}

export default async function ManageReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t } = await searchParams;

  if (!isStoreConfigured()) {
    return <Message>Review approval isn&apos;t set up yet.</Message>;
  }

  const review = await getReview(id).catch(() => null);

  // Identical message for "doesn't exist" and "wrong link".
  if (!review || !t || !tokenMatches(review, t)) {
    return <Message>This link isn&apos;t valid.</Message>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
      <ReviewApproval
        id={review.id}
        token={t}
        name={review.name}
        rating={review.rating}
        text={review.text}
        locale={review.locale}
        createdAt={review.createdAt}
        initialStatus={review.status}
      />
    </main>
  );
}
