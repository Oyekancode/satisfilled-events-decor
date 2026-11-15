"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import { galleryItems, type GalleryCategory } from "@/lib/gallery";

type Filter = "all" | GalleryCategory;

const SWIPE_THRESHOLD = 50;

export default function Gallery({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const g = dict.gallery;
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const items =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  const filters: Filter[] = ["all", "birthdays", "events"];

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((i) =>
        i === null ? i : (i + direction + items.length) % items.length
      );
    },
    [items.length]
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex, step]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }
    step(deltaX < 0 ? 1 : -1);
  }

  const current = openIndex !== null ? items[openIndex] : null;

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-primary">
          {g.heading}
        </h2>
        <p className="mt-4 text-ink/70">{g.subheading}</p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === f
                ? "border-primary bg-primary text-cream"
                : "border-primary/30 text-primary hover:bg-blush/40"
            }`}
          >
            {g.filters[f]}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-2 gap-4 md:columns-3">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative mb-4 block w-full overflow-hidden rounded-2xl shadow-sm break-inside-avoid"
          >
            <Image
              src={item.src}
              alt={item.title[locale]}
              width={item.width}
              height={item.height}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-dark/80 to-transparent px-3 pb-3 pt-8 text-left text-sm text-cream opacity-0 transition-opacity group-hover:opacity-100">
              {item.title[locale]}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title[locale]}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            aria-label={g.close}
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
          >
            &times;
          </button>

          <button
            type="button"
            aria-label={g.previous}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:flex"
          >
            &#8249;
          </button>

          <figure
            className="flex max-h-full max-w-full flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.title[locale]}
              width={current.width}
              height={current.height}
              sizes="100vw"
              priority
              className="h-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {current.title[locale]}
              <span className="ml-2 text-white/40">
                {openIndex! + 1} / {items.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label={g.next}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:flex"
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
}
