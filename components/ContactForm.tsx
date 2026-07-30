"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locales";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const f = dict.contact.form;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-3xl sm:text-4xl text-primary">
            {dict.contact.heading}
          </h2>
          <p className="mt-4 text-ink/70">{dict.contact.subheading}</p>
          <p className="mt-6 font-script text-2xl text-primary-light">
            {dict.contact.motto}
          </p>

          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-primary">
                {dict.contact.details.email}
              </dt>
              <dd className="text-ink/70">omololairere@gmail.com</dd>
            </div>
            <div>
              <dt className="font-medium text-primary">
                {dict.contact.details.phone}
              </dt>
              <dd className="text-ink/70">+420 774 374 600</dd>
            </div>
            <div>
              <dt className="font-medium text-primary">
                {dict.contact.details.location}
              </dt>
              <dd className="text-ink/70">K Podjezdu, Prague 4</dd>
            </div>
            <div>
              <dt className="font-medium text-primary">
                {dict.contact.details.instagram}
              </dt>
              <dd className="text-ink/70">
                @satisfilled_catering
                <br />
                @satisfilledevents_and_decors
              </dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 grid gap-5 sm:grid-cols-2 bg-white rounded-3xl p-8 shadow-sm border border-primary/10"
        >
          <Field label={f.name} name="name" required />
          <Field label={f.phone} name="phone" type="tel" required />
          <Field label={f.email} name="email" type="email" required className="sm:col-span-2" />

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink/80">{f.eventType}</span>
            <select
              name="eventType"
              required
              className="rounded-lg border border-primary/20 px-3 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {f.eventTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <Field label={f.eventDate} name="eventDate" type="date" />
          <Field label={f.location} name="location" />
          <Field label={f.guestCount} name="guestCount" type="number" />

          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-ink/80">{f.vision}</span>
            <textarea
              name="vision"
              rows={4}
              placeholder={f.visionPlaceholder}
              className="rounded-lg border border-primary/20 px-3 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="sm:col-span-2 mt-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-cream hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {status === "submitting" ? f.submitting : f.submit}
          </button>

          {status === "success" && (
            <p className="sm:col-span-2 text-sm text-green-700">
              {f.success}
            </p>
          )}
          {status === "error" && (
            <p className="sm:col-span-2 text-sm text-red-700">{f.error}</p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className ?? ""}`}>
      <span className="font-medium text-ink/80">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="rounded-lg border border-primary/20 px-3 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </label>
  );
}
