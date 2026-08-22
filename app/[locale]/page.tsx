import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/locales";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WishlistSection from "@/components/WishlistSection";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);
  const url = `https://satisfilled.com/${locale}`;
  const ogLocale = locale === "cz" ? "cs_CZ" : "en_US";

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: url,
      languages: { en: "https://satisfilled.com/en", cs: "https://satisfilled.com/cz" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url,
      locale: ogLocale,
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/opengraph-image.jpg"],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header dict={dict} locale={locale} />
      <main>
        <Hero dict={dict} locale={locale} />
        <Journey dict={dict} />
        <Services dict={dict} locale={locale} />
        <Testimonials dict={dict} locale={locale} />
        <WishlistSection dict={dict} locale={locale} />
      </main>
      <Footer dict={dict} />
    </div>
  );
}
