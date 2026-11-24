"use client";

import { mensajeWhatsAppGeneral } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { linkWhatsApp } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/IconosMarca";

export function BotonWhatsAppFlotante() {
  return (
    <a
      href={linkWhatsApp(mensajeWhatsAppGeneral)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      onClick={() => trackEvent("whatsapp_click", { ubicacion: "flotante" })}
      className="fixed right-4 bottom-4 z-40 text-whatsapp drop-shadow-[0_2px_4px_rgb(0_0_0/0.35)] sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-14" color="currentColor" />
    </a>
  );
}
