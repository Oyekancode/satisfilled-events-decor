"use client";

import { useState } from "react";
import StarRating from "./StarRating";

type Status = "pending" | "approved" | "rejected";

type Props = {
  id: string;
  token: string;
  name: string;
  rating: number;
  text: string;
  locale: string;
  createdAt: string;
  initialStatus: Status;
};

const statusStyles: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<Status, string> = {
  pending: "Waiting for your decision",
  approved: "Approved — showing on the website",
  rejected: "Rejected — not showing on the website",
};

export default function ReviewApproval({
  id,
  token,
  name,
  rating,
  text,
  locale,
  createdAt,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [justChanged, setJustChanged] = useState(false);

  async function decide(action: "approve" | "reject") {
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/review/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token, action }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { status: Status };
      setStatus(data.status);
      setJustChanged(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-primary/10 bg-white p-8 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-ink/50">
        New review · {new Date(createdAt).toLocaleString("en-GB")} ·{" "}
        {locale.toUpperCase()} site
      </p>

      <div className="mt-4">
        <StarRating value={rating} size={24} />
      </div>
      <p className="mt-4 whitespace-pre-line text-ink/90">
        &ldquo;{text}&rdquo;
      </p>
      <p className="mt-4 font-medium text-primary">{name}</p>

      <p
        className={`mt-6 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
      >
        {statusLabels[status]}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {status !== "approved" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => decide("approve")}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            Approve
          </button>
        )}
        {status !== "rejected" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => decide("reject")}
            className="rounded-full border border-primary/40 px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-blush/40 disabled:opacity-60"
          >
            {status === "approved" ? "Remove from website" : "Reject"}
          </button>
        )}
      </div>

      {justChanged && !error && (
        <p className="mt-4 text-sm text-ink/70">
          {status === "approved"
            ? "Saved. It will appear on the website within about a minute."
            : "Saved. It won't be shown on the website."}
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-700">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
