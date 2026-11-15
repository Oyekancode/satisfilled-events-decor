import { SiWhatsapp } from "react-icons/si";
import type { Dictionary } from "@/lib/dictionaries";
import { whatsappUrl } from "@/lib/whatsapp";

export default function WhatsAppButton({ dict }: { dict: Dictionary }) {
  return (
    <a
      href={whatsappUrl(dict.whatsapp.message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.whatsapp.label}
      title={dict.whatsapp.label}
      className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:bottom-6 sm:right-6"
    >
      <SiWhatsapp className="h-7 w-7" />
    </a>
  );
}
