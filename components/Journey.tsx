import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";

export default function Journey({ dict }: { dict: Dictionary }) {
  return (
    <section id="journey" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-primary">
          {dict.journey.heading}
        </h2>
        <p className="mt-4 text-ink/70">{dict.journey.subheading}</p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg order-2 lg:order-1">
          <Image
            src="/images/decor-iva-one.jpg"
            alt="Balloon decor styling in progress"
            fill
            className="object-cover"
          />
        </div>

        <ol className="order-1 lg:order-2 space-y-8">
          {dict.journey.steps.map((step, i) => (
            <li key={step.title} className="flex gap-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-cream">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-xl text-primary">
                  {step.title}
                </h3>
                <p className="mt-1 text-ink/70">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
