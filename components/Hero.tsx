import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";

export default function Hero({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section className="relative overflow-hidden bg-blush/40">
      <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-primary">
            {dict.hero.tagline_pre}{" "}
            <span className="font-script text-primary-light text-5xl sm:text-6xl">
              {dict.hero.tagline_em}
            </span>
          </h1>
          <p className="mt-6 text-lg text-ink/70 max-w-md">
            {dict.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`/${locale}#services`}
              className="rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary hover:bg-primary hover:text-cream transition-colors"
            >
              {dict.hero.cta_services}
            </a>
            <a
              href={`/${locale}#contact`}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-cream hover:bg-primary-dark transition-colors"
            >
              {dict.hero.cta_book}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg col-span-1 row-span-2">
            <Image
              src="/images/decor-babyshower-dilara.jpg"
              alt="Balloon arch baby shower backdrop"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/images/decor-agata-one.jpg"
              alt="Birthday balloon backdrop"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/images/decor-baby-giana.jpg"
              alt="Baby shower balloon arch"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
