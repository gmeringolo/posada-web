"use client";

import { siWhatsapp } from "simple-icons";
import { mensajeWhatsAppGeneral } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { linkWhatsApp } from "@/lib/whatsapp";

/** Botón flotante: solo el ícono de WhatsApp, relleno verde con reborde y teléfono en blanco. */
export function BotonWhatsAppFlotante() {
  return (
    <a
      href={linkWhatsApp(mensajeWhatsAppGeneral)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      onClick={() => trackEvent("whatsapp_click", { ubicacion: "flotante" })}
      className="fixed right-4 bottom-4 z-40 drop-shadow-[0_2px_6px_rgb(0_0_0/0.3)] sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="size-14" aria-hidden="true">
        {/* Relleno verde dentro del globo (el contorno blanco del ícono lo tapa por fuera) */}
        <circle cx="12" cy="12" r="10.6" fill="#25D366" />
        <path d="M2.6 21.4 4.4 15.6 8.4 19.6Z" fill="#25D366" />
        <path d={siWhatsapp.path} fill="white" />
      </svg>
    </a>
  );
}
