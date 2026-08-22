"use client";

import type { Dictionary } from "@/lib/dictionaries";

export default function EstimateBuilder({
  dict,
  selected,
  onToggle,
  onClear,
  onAddToInquiry,
  justAdded,
}: {
  dict: Dictionary;
  selected: Set<string>;
  onToggle: (item: string) => void;
  onClear: () => void;
  onAddToInquiry: () => void;
  justAdded: boolean;
}) {
  const e = dict.estimate;
  const selectedList = Array.from(selected);

  return (
    <section id="estimate" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-primary">
          {e.heading}
        </h2>
        <p className="mt-4 text-ink/70">{e.subheading}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          {dict.services.categories.map((category) => (
            <div key={category.title}>
              <h3 className="font-serif text-xl text-primary mb-3">
                {category.title}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {category.items.map((item) => {
                  const key = `${category.title} — ${item.title}`;
                  const checked = selected.has(key);
                  return (
                    <label
                      key={item.title}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        checked
                          ? "border-primary bg-blush/40 text-primary"
                          : "border-primary/15 bg-white text-ink/80 hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(key)}
                        className="accent-primary"
                      />
                      {item.title}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg text-primary">
              {e.selectionsHeading}
            </h3>

            {selectedList.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">{e.empty}</p>
            ) : (
              <ul className="mt-3 space-y-1.5 text-sm text-ink/80 max-h-64 overflow-y-auto pr-1">
                {selectedList.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 text-xs text-ink/50">{e.note}</p>

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={onAddToInquiry}
                disabled={selectedList.length === 0}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-cream hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {e.addToInquiry}
              </button>
              {selectedList.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs text-ink/50 hover:text-primary underline underline-offset-4"
                >
                  {e.clear}
                </button>
              )}
              {justAdded && (
                <p className="text-sm text-green-700">{e.added}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
