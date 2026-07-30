import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/locales";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Services from "@/components/Services";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

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
        <ContactForm dict={dict} locale={locale} />
      </main>
      <Footer dict={dict} />
    </div>
  );
}
