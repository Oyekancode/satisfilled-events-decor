"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/locales";

function pathWithLocale(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/");
  segments[1] = nextLocale;
  return segments.join("/") || `/${nextLocale}`;
}

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          <Link
            href={pathWithLocale(pathname, l)}
            className={
              l === locale
                ? "text-primary underline underline-offset-4"
                : "text-ink/60 hover:text-primary"
            }
          >
            {l.toUpperCase()}
          </Link>
          {i < locales.length - 1 && <span className="text-ink/30">|</span>}
        </span>
      ))}
    </div>
  );
}
