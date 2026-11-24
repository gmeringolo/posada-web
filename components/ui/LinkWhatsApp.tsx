"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { linkWhatsApp } from "@/lib/whatsapp";
import { mensajeWhatsAppGeneral } from "@/data/site";
import { WhatsAppIcon } from "./IconosMarca";
import { clasesBoton, type Variante } from "./Boton";

type Props = {
  ubicacion: string;
  mensaje?: string;
  children?: ReactNode;
  variante?: Variante;
  tamano?: "sm" | "md" | "lg";
  className?: string;
  sinIcono?: boolean;
};

/** Botón que abre WhatsApp con un mensaje ya escrito y registra el clic en Analytics. */
export function LinkWhatsApp({
  ubicacion,
  mensaje = mensajeWhatsAppGeneral,
  children = "Consultar por WhatsApp",
  variante = "whatsapp",
  tamano = "md",
  className = "",
  sinIcono = false,
}: Props) {
  return (
    <a
      href={linkWhatsApp(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className={clasesBoton(variante, tamano, className)}
      onClick={() => trackEvent("whatsapp_click", { ubicacion })}
    >
      {!sinIcono && <WhatsAppIcon className="size-5" />}
      {children}
    </a>
  );
}
