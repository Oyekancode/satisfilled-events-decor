import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";
import ServiceCard from "./ServiceCard";

const categoryImages: Record<string, string | null> = {
  Decor: "/images/decor-christening-emily.jpg",
  Events: "/images/decor-bearly-wait.jpg",
  Výzdoba: "/images/decor-christening-emily.jpg",
  Akce: "/images/decor-bearly-wait.jpg",
};

export default function Services({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section id="services" className="bg-blush/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-primary">
            {dict.services.heading}
          </h2>
          <p className="mt-4 text-ink/70">{dict.services.subheading}</p>
        </div>

        <div className="mt-16 space-y-16">
          {dict.services.categories.map((category) => {
            const image = categoryImages[category.title] ?? null;
            return (
              <div key={category.title}>
                <div className="flex items-center gap-4 mb-6">
                  {image && (
                    <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0 shadow">
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-2xl text-primary">
                    {category.title}
                  </h3>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item) => (
                    <ServiceCard
                      key={item.title}
                      title={item.title}
                      text={item.text}
                      bookNowLabel={dict.services.bookNow}
                      bookHref={`/${locale}#contact`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
