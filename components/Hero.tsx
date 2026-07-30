"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";

const heroImages = [
  "/images/decor-babyshower-dilara.jpg",
  "/images/decor-agata-one.jpg",
  "/images/decor-baby-giana.jpg",
  "/images/decor-iva-one.jpg",
  "/images/decor-christening-emily.jpg",
  "/images/decor-bearly-wait.jpg",
];

const ROTATE_MS = 5000;

export default function Hero({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % heroImages.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
      {heroImages.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-primary-dark/50" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-2xl text-center text-cream">
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight drop-shadow">
            {dict.hero.tagline_pre}{" "}
            <span className="font-script text-5xl sm:text-6xl text-blush">
              {dict.hero.tagline_em}
            </span>
          </h1>
          <p className="mt-6 text-lg text-cream/90 drop-shadow">
            {dict.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`/${locale}#services`}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-cream hover:bg-primary-dark transition-colors"
            >
              {dict.hero.cta_services}
            </a>
            <a
              href={`/${locale}#contact`}
              className="rounded-full border border-cream px-6 py-3 text-sm font-medium text-cream hover:bg-cream hover:text-primary transition-colors"
            >
              {dict.hero.cta_book}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroImages.map((src, i) => (
          <button
            key={src}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === active ? "bg-cream" : "bg-cream/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
