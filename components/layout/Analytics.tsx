"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useSyncExternalStore } from "react";
import { CLAVE_CONSENTIMIENTO, GA_ID } from "@/lib/analytics";

type Decision = "aceptado" | "rechazado" | null;

function leer(): Decision {
  try {
    const v = localStorage.getItem(CLAVE_CONSENTIMIENTO);
    return v === "aceptado" || v === "rechazado" ? v : null;
  } catch {
    return null;
  }
}

const EVENTO = "posada-cookies-cambio";
let enMemoria: Decision = null; // por si el navegador no permite guardar

function guardar(v: Exclude<Decision, null>) {
  enMemoria = v;
  try {
    localStorage.setItem(CLAVE_CONSENTIMIENTO, v);
  } catch {
    /* navegador sin almacenamiento: la decisión vale solo para esta visita */
  }
  window.dispatchEvent(new Event(EVENTO));
}

function suscribir(cb: () => void) {
  window.addEventListener(EVENTO, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENTO, cb);
    window.removeEventListener("storage", cb);
  };
}

/** "ssr" mientras se arma la página en el build: no se muestra nada. */
const decisionActual = () => leer() ?? enMemoria ?? "pendiente";

/**
 * Google Analytics con aviso de cookies.
 * - Sin NEXT_PUBLIC_GA_ID: no se carga nada y no aparece el aviso.
 * - Con ID: se carga solo si el visitante acepta.
 */
export function Analytics() {
  const decision = useSyncExternalStore(suscribir, decisionActual, () => "ssr");

  if (!GA_ID || decision === "ssr") return null;

  return (
    <>
      {decision === "aceptado" && <GoogleAnalytics gaId={GA_ID} />}
      {decision === "pendiente" && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl bg-primary-950 p-4 text-white shadow-soft sm:bottom-5 sm:p-5"
        >
          <p className="text-sm leading-relaxed text-white/90">
            Usamos cookies de Google Analytics para saber cómo se usa la web y mejorarla. ¿Nos dejás medir tu visita?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-ink hover:bg-accent-hover"
              onClick={() => {
                guardar("aceptado");
              }}
            >
              Aceptar
            </button>
            <button
              type="button"
              className="rounded-full border border-white/40 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
              onClick={() => {
                guardar("rechazado");
              }}
            >
              Rechazar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
