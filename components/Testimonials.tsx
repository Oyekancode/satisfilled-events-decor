import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

type Review = { name: string; rating: number; text: string };

export default function Testimonials({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const t = dict.testimonials;
  const reviews = t.reviews as Review[];

  return (
    <section id="testimonials" className="bg-blush/30 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-primary">
            {t.heading}
          </h2>
          <p className="mt-4 text-ink/70">{t.subheading}</p>
        </div>

        {reviews.length === 0 ? (
          <p className="mt-12 text-center text-sm text-ink/50">{t.empty}</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={`${review.name}-${review.text.slice(0, 10)}`}
                className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm"
              >
                <StarRating value={review.rating} size={16} />
                <p className="mt-3 text-sm text-ink/80">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-3 text-sm font-medium text-primary">
                  {review.name}
                </p>
              </div>
            ))}
          </div>
        )}

        <ReviewForm dict={dict} locale={locale} />
      </div>
    </section>
  );
}
