import { negocio } from "@/data/site";

/** Link de WhatsApp con un mensaje ya escrito. */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
