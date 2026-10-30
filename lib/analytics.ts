/**
 * Eventos de Google Analytics 4.
 * Si Analytics no está cargado (sin ID o el visitante no aceptó cookies), no hace nada.
 */

type Parametros = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type Evento =
  | "whatsapp_click"
  | "form_submit"
  | "availability_check"
  | "gallery_open"
  | "video_play"
  | "review_link_click"
  | "directions_click";

export function trackEvent(nombre: Evento, params: Parametros = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", nombre, params);
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const CLAVE_CONSENTIMIENTO = "posada-cookies";
