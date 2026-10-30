"use client";

import { Bus, Car, Navigation } from "lucide-react";
import { enlaces, zona } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { Icono } from "@/components/ui/Icono";
import { TituloSeccion } from "@/components/ui/TituloSeccion";

export function LaZona() {
  const distancias = zona.distancias.filter((d) => d.distancia);
  return (
    <section id="zona" className="pantalla" aria-labelledby="zona-titulo">
      <div className="contenedor">
        <TituloSeccion id="zona-titulo" etiqueta="La zona" titulo="Bello Horizonte, en la Costa de Oro" intro={zona.intro} compacto />

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Foto + cómo llegar */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="aparecer overflow-hidden rounded-3xl">
              <img
                src="/images/exterior/casa-verde-jardin.webp"
                alt="Jardín y casas de Posada Horizonte en Bello Horizonte"
                loading="lazy"
                className="h-[clamp(160px,28svh,360px)] w-full object-cover"
              />
            </div>
            <div className={`grid gap-4 ${zona.comoLlegar.omnibus ? "sm:grid-cols-2" : ""}`}>
              <div className="aparecer rounded-2xl bg-primary-900 p-5 text-white">
                <p className="flex items-center gap-2 font-bold">
                  <Car className="size-5 text-accent" aria-hidden="true" /> En auto
                </p>
                <p className="mt-1.5 text-sm text-white/85">{zona.comoLlegar.auto}</p>
              </div>
              {zona.comoLlegar.omnibus && (
                <div className="aparecer rounded-2xl bg-sand p-5 ring-1 ring-primary-100/70">
                  <p className="flex items-center gap-2 font-bold text-primary-900">
                    <Bus className="size-5 text-primary-500" aria-hidden="true" /> En ómnibus
                  </p>
                  <p className="mt-1.5 text-sm text-muted">{zona.comoLlegar.omnibus}</p>
                </div>
              )}
            </div>
          </div>

          {/* Distancias */}
          <div className="flex flex-col lg:col-span-2">
            <h3 className="mb-3 text-2xl">Distancias</h3>
            <ul className="divide-y divide-primary-100 rounded-3xl bg-sand px-5 ring-1 ring-primary-100/70">
              {distancias.map((d) => (
                <li key={d.lugar} className="flex items-center gap-3 py-2.5 [@media(max-height:820px)]:py-2">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-primary-600 shadow-sm">
                    <Icono nombre={d.icono} className="size-5" />
                  </span>
                  <span className="flex-1 text-[0.95rem] font-semibold text-primary-900">{d.lugar}</span>
                  <span className="text-right text-sm font-bold whitespace-nowrap text-primary-600">{d.distancia}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">Tiempos en auto, aproximados.</p>
            <a
              href={enlaces.comoLlegar}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("directions_click", { ubicacion: "zona" })}
              className="mt-4 inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-5 py-3 font-bold text-ink hover:bg-accent-hover"
            >
              <Navigation className="size-5" aria-hidden="true" /> Cómo llegar en Google Maps
            </a>
          </div>
        </div>

        {zona.queHacer.length > 0 && (
          <div className="mt-14">
            <h3 className="mb-6 text-center text-2xl sm:text-3xl">Qué hacer cerca</h3>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {zona.queHacer.map((q) => (
                <li key={q.titulo} className="aparecer overflow-hidden rounded-2xl bg-white shadow-card">
                  {q.foto && <img src={q.foto} alt="" loading="lazy" className="aspect-video w-full object-cover" />}
                  <div className="p-5">
                    <p className="font-bold text-primary-900">{q.titulo}</p>
                    <p className="mt-1 text-muted">{q.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
