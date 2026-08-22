"use client";

import { useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import EstimateBuilder from "./EstimateBuilder";
import ContactForm from "./ContactForm";

export default function WishlistSection({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [guestCount, setGuestCount] = useState("");
  const [wishlist, setWishlist] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggle(item: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  function clear() {
    setSelected(new Set());
    setGuestCount("");
  }

  function addToInquiry() {
    const lines = Array.from(selected).map((item) => `- ${item}`);
    if (guestCount) lines.push(`- ${dict.estimate.guestCount}: ${guestCount}`);
    setWishlist(lines.join("\n"));

    setJustAdded(true);
    if (addedTimeout.current) clearTimeout(addedTimeout.current);
    addedTimeout.current = setTimeout(() => setJustAdded(false), 4000);

    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <EstimateBuilder
        dict={dict}
        selected={selected}
        onToggle={toggle}
        guestCount={guestCount}
        onGuestCountChange={setGuestCount}
        onClear={clear}
        onAddToInquiry={addToInquiry}
        justAdded={justAdded}
      />
      <ContactForm
        dict={dict}
        locale={locale}
        wishlist={wishlist}
        onSubmitted={() => {
          setSelected(new Set());
          setGuestCount("");
          setWishlist("");
        }}
      />
    </>
  );
}
