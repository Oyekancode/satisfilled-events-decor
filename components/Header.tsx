"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}#journey`, label: dict.nav.journey },
    { href: `/${locale}#services`, label: dict.nav.services },
    { href: `/${locale}#gallery`, label: dict.nav.gallery },
    { href: `/${locale}#estimate`, label: dict.nav.estimate },
    { href: `/${locale}#contact`, label: dict.nav.contact },
    { href: `/${locale}#testimonials`, label: dict.nav.testimonials },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-primary/10">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-20">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SatisFilled Events & Decor"
            width={48}
            height={48}
            className="rounded-full"
            priority
          />
          <span className="hidden sm:block font-serif text-lg text-primary">
            SatisFilled Events &amp; Decor
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <LocaleSwitcher locale={locale} />
          <a
            href={`/${locale}#contact`}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-cream hover:bg-primary-dark transition-colors"
          >
            {dict.nav.bookNow}
          </a>
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden text-primary text-2xl leading-none"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-primary/10 bg-cream px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink/70 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <LocaleSwitcher locale={locale} />
          <a
            href={`/${locale}#contact`}
            onClick={() => setOpen(false)}
            className="rounded-full bg-primary px-5 py-2 text-center text-sm font-medium text-cream"
          >
            {dict.nav.bookNow}
          </a>
        </div>
      )}
    </header>
  );
}
