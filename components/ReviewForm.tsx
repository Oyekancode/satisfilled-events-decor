"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import StarRating from "./StarRating";

type Status = "idle" | "submitting" | "success" | "error";

export default function ReviewForm({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const f = dict.testimonials.form;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) return;
    setStatus("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating, locale }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      form.reset();
      setRating(0);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-16 max-w-xl mx-auto rounded-2xl border border-primary/10 bg-white p-8 shadow-sm">
      <h3 className="font-serif text-xl text-primary text-center">
        {f.heading}
      </h3>
      <p className="mt-2 text-sm text-ink/70 text-center">{f.subheading}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium text-ink/80">{f.rating}</span>
          <StarRating value={rating} onChange={setRating} size={28} />
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink/80">{f.name}</span>
          <input
            type="text"
            name="name"
            required
            className="rounded-lg border border-primary/20 px-3 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink/80">{f.text}</span>
          <textarea
            name="text"
            rows={4}
            required
            placeholder={f.textPlaceholder}
            className="rounded-lg border border-primary/20 px-3 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>

        <button
          type="submit"
          disabled={status === "submitting" || rating === 0}
          className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-cream hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {status === "submitting" ? f.submitting : f.submit}
        </button>

        {status === "success" && (
          <p className="text-sm text-green-700 text-center">{f.success}</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-700 text-center">{f.error}</p>
        )}
      </form>
    </div>
  );
}
