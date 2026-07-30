export default function ServiceCard({
  title,
  text,
  bookNowLabel,
  bookHref,
}: {
  title: string;
  text: string;
  bookNowLabel: string;
  bookHref: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <h4 className="font-serif text-lg text-primary">{title}</h4>
      <p className="mt-2 text-sm text-ink/70 flex-1">{text}</p>
      <a
        href={bookHref}
        className="mt-4 text-sm font-medium text-primary hover:text-primary-dark underline underline-offset-4 w-fit"
      >
        {bookNowLabel}
      </a>
    </div>
  );
}
