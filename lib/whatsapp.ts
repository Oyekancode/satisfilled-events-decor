// WhatsApp wants the number in international format with no "+" or spaces.
export const WHATSAPP_NUMBER = "420774374600";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
