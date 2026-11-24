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
      className="fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full border-2 border-white bg-whatsapp text-white shadow-soft sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-6" color="white" />
    </a>
  );
}
