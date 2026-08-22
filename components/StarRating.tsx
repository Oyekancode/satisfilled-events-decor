"use client";

import { useState } from "react";

export default function StarRating({
  value,
  onChange,
  size = 20,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = !!onChange;
  const display = hover ?? value;

  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => interactive && setHover(null)}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rating" : `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= display ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className={star <= display ? "text-primary" : "text-primary/30"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2.5l2.9 6.06 6.6.75-4.9 4.55 1.27 6.55L12 17.9l-5.87 3.5 1.27-6.55-4.9-4.55 6.6-.75L12 2.5z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
