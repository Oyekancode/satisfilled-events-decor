import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import ReviewForm from "./ReviewForm";
import ReviewList, { type Review } from "./ReviewList";

export default function Testimonials({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const t = dict.testimonials;
  // Hand-added reviews from the dictionary files still work; approved reviews
  // from the website's form are loaded alongside them by ReviewList.
  const handAdded = t.reviews as Review[];

  return (
    <section id="testimonials" className="bg-blush/30 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-primary">
            {t.heading}
          </h2>
          <p className="mt-4 text-ink/70">{t.subheading}</p>
        </div>

        <ReviewList initial={handAdded} emptyText={t.empty} />

        <ReviewForm dict={dict} locale={locale} />
      </div>
    </section>
  );
}
