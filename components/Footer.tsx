import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-auto bg-primary text-cream">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SatisFilled Events & Decor"
            width={36}
            height={36}
            className="rounded-full bg-cream"
          />
          <span className="font-script text-lg">{dict.footer.motto}</span>
        </div>
        <p className="text-xs text-cream/70">
          © {new Date().getFullYear()} SatisFilled Events &amp; Decor.{" "}
          {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
