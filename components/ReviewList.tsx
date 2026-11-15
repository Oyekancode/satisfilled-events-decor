"use client";

import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

export type Review = { name: string; rating: number; text: string };

// Shows approved reviews. The page itself stays fast and fully static; the
// list is fetched after load, so a newly approved review appears without
// anyone having to redeploy the site.
export default function ReviewList({
  initial,
  emptyText,
}: {
  initial: Review[];
  emptyText: string;
}) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [loaded, setLoaded] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad"))))
      .then((data: { reviews: Review[] }) => {
        if (!cancelled) setReviews([...data.reviews, ...initialRef.current]);
      })
      .catch(() => {
        // Keep whatever we already have (e.g. hand-added reviews).
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (reviews.length === 0) {
    return loaded ? (
      <p className="mt-12 text-center text-sm text-ink/50">{emptyText}</p>
    ) : null;
  }

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {reviews.map((review, i) => (
        <div
          key={`${review.name}-${i}`}
          className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm"
        >
          <StarRating value={review.rating} size={16} />
          <p className="mt-3 whitespace-pre-line text-sm text-ink/80">
            &ldquo;{review.text}&rdquo;
          </p>
          <p className="mt-3 text-sm font-medium text-primary">{review.name}</p>
        </div>
      ))}
    </div>
  );
}
