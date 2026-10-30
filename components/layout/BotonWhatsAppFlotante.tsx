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
      className="latido fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-soft transition hover:scale-105 sm:right-6 sm:bottom-6 sm:size-16"
    >
      <WhatsAppIcon className="size-8 sm:size-9" color="white" />
    </a>
  );
}
