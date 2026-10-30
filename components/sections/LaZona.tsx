"use client";

import { Bus, Car, Navigation } from "lucide-react";
import { enlaces, zona } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { Icono } from "@/components/ui/Icono";
import { TituloSeccion } from "@/components/ui/TituloSeccion";

export function LaZona() {
  const distancias = zona.distancias.filter((d) => d.distancia);
  return (
    <section id="zona" className="seccion bg-sand" aria-labelledby="zona-titulo">
      <div className="contenedor">
        <TituloSeccion id="zona-titulo" etiqueta="La zona" titulo="Bello Horizonte, en la Costa de Oro" intro={zona.intro} />

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="aparecer overflow-hidden rounded-3xl lg:col-span-3">
            <img
              src="/images/exterior/casa-verde-jardin.webp"
              alt="Jardín y casas de Posada Horizonte en Bello Horizonte"
              loading="lazy"
              className="size-full max-h-[460px] object-cover"
            />
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-2xl">Distancias aproximadas</h3>
            <ul className="divide-y divide-primary-100 rounded-3xl bg-white px-5 shadow-card ring-1 ring-primary-100/70">
              {distancias.map((d) => (
                <li key={d.lugar} className="flex items-center gap-4 py-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
                    <Icono nombre={d.icono} className="size-5" />
                  </span>
                  <span className="flex-1 font-semibold text-primary-900">{d.lugar}</span>
                  <span className="text-right text-sm font-bold text-primary-600">{d.distancia}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">Tiempos en auto, aproximados.</p>
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

        <div className={`mt-14 grid gap-5 ${zona.comoLlegar.omnibus ? "md:grid-cols-2" : ""}`}>
          <div className="aparecer rounded-3xl bg-primary-900 p-6 text-white sm:p-8">
            <h3 className="flex items-center gap-3 text-2xl text-white">
              <Car className="size-7 text-accent" aria-hidden="true" /> Cómo llegar en auto
            </h3>
            <p className="mt-3 text-white/85">{zona.comoLlegar.auto}</p>
            <a
              href={enlaces.comoLlegar}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("directions_click", { ubicacion: "zona" })}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-bold text-ink hover:bg-accent-hover"
            >
              <Navigation className="size-5" aria-hidden="true" /> Abrir en Google Maps
            </a>
          </div>
          {zona.comoLlegar.omnibus && (
            <div className="aparecer rounded-3xl bg-white p-6 shadow-card ring-1 ring-primary-100/70 sm:p-8">
              <h3 className="flex items-center gap-3 text-2xl">
                <Bus className="size-7 text-primary-500" aria-hidden="true" /> En ómnibus
              </h3>
              <p className="mt-3 text-muted">{zona.comoLlegar.omnibus}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
