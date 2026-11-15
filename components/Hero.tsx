"use client";

import { useEffect, useRef, useState } from "react";
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

const COUNT = heroImages.length;
const ROTATE_MS = 5000;
const SNAP_MS = 450;
// How far the finger must move before we decide if it's a sideways swipe
// (ours) or an up/down scroll (the browser's).
const AXIS_LOCK_PX = 8;

function wrap(n: number) {
  return ((n % COUNT) + COUNT) % COUNT;
}

// Where slide `index` sits relative to the one on screen:
// 0 = showing, -1 = just off the left edge, +1 = just off the right edge.
function offsetOf(index: number, active: number) {
  let offset = wrap(index - active);
  if (offset > COUNT / 2) offset -= COUNT;
  return offset;
}

type TouchState = {
  x: number;
  y: number;
  time: number;
  axis: "x" | "y" | null;
};

export default function Hero({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  // True for one beat when jumping to a non-neighbouring slide (dot click),
  // so we cut straight there instead of sweeping across the screen.
  const [instant, setInstant] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touch = useRef<TouchState | null>(null);

  // Auto-advance. Restarts after every slide change (timer, dot, or swipe)
  // and pauses entirely while a finger is dragging.
  useEffect(() => {
    if (dragging) return;
    const id = setTimeout(() => setActive((i) => wrap(i + 1)), ROTATE_MS);
    return () => clearTimeout(id);
  }, [active, dragging]);

  useEffect(() => {
    if (!instant) return;
    const id = setTimeout(() => setInstant(false), 60);
    return () => clearTimeout(id);
  }, [instant]);

  function goTo(target: number) {
    const next = wrap(target);
    const distance = wrap(next - active);
    const isNeighbour = distance === 1 || distance === COUNT - 1;
    if (next !== active && !isNeighbour) setInstant(true);
    setActive(next);
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, time: Date.now(), axis: null };
  }

  function handleTouchMove(e: React.TouchEvent) {
    const start = touch.current;
    if (!start) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    if (start.axis === null) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (start.axis !== "x") return; // vertical: let the page scroll

    const width = sectionRef.current?.offsetWidth ?? window.innerWidth;
    setDragging(true);
    setDragX(Math.max(-width, Math.min(width, dx)));
  }

  function finishTouch(e: React.TouchEvent, cancelled: boolean) {
    const start = touch.current;
    touch.current = null;
    if (!start || start.axis !== "x") return;

    const dx = e.changedTouches[0].clientX - start.x;
    const width = sectionRef.current?.offsetWidth ?? window.innerWidth;
    const elapsed = Math.max(1, Date.now() - start.time);
    const farEnough = Math.abs(dx) > width * 0.2;
    const quickFlick = Math.abs(dx) > 30 && Math.abs(dx) / elapsed > 0.4;

    if (!cancelled && (farEnough || quickFlick)) {
      goTo(active + (dx < 0 ? 1 : -1));
    }
    setDragging(false);
    setDragX(0);
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[85vh] min-h-[560px] overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={(e) => finishTouch(e, false)}
      onTouchCancel={(e) => finishTouch(e, true)}
    >
      {heroImages.map((src, i) => {
        const offset = offsetOf(i, active);
        const near = Math.abs(offset) <= 1;
        return (
          <div
            key={src}
            aria-hidden={offset !== 0}
            className="absolute inset-0"
            style={{
              transform: `translateX(calc(${offset * 100}% + ${near ? dragX : 0}px))`,
              visibility: near ? "visible" : "hidden",
              transition:
                dragging || instant || !near
                  ? "none"
                  : `transform ${SNAP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              className="object-cover"
            />
          </div>
        );
      })}

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
            onClick={() => goTo(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === active ? "bg-cream" : "bg-cream/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
