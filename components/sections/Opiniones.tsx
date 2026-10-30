"use client";

import { ExternalLink, Quote, Star } from "lucide-react";
import { useState } from "react";
import { calificaciones, enlaces, opiniones, type Opinion } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { AirbnbIcon, GoogleIcon } from "@/components/ui/IconosMarca";
import { BotonLink } from "@/components/ui/Boton";

const PLATAFORMA = {
  google: { nombre: "Google", Icono: GoogleIcon, color: "#4285F4" },
  airbnb: { nombre: "Airbnb", Icono: AirbnbIcon, color: "#FF5A5F" },
};

function Estrellas({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`size-4 ${i <= n ? "fill-accent text-accent" : "text-primary-100"}`} aria-hidden="true" />
      ))}
    </span>
  );
}

function Tarjeta({ o }: { o: Opinion }) {
  const [abierta, setAbierta] = useState(false);
  const larga = o.texto.length > 220;
  const p = PLATAFORMA[o.plataforma];
  return (
    <figure className="aparecer flex h-full w-[85vw] max-w-sm shrink-0 snap-start flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-primary-100/70 sm:w-auto sm:max-w-none">
      <Quote className="size-8 text-accent" aria-hidden="true" />
      <blockquote className="mt-3 flex-1 text-[1.02rem] leading-relaxed text-ink">
        <p>{larga && !abierta ? `${o.texto.slice(0, 210).trimEnd()}…` : o.texto}</p>
        {larga && (
          <button type="button" className="mt-2 text-sm font-bold text-primary-600 underline" onClick={() => setAbierta((v) => !v)}>
            {abierta ? "Leer menos" : "Leer más"}
          </button>
        )}
      </blockquote>
      <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-primary-50 pt-4">
        <div>
          <p className="font-bold text-primary-900">{o.nombre}</p>
          <p className="text-sm text-muted">{o.fecha}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {o.estrellas ? <Estrellas n={o.estrellas} /> : null}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
            <p.Icono className="size-3.5" color={p.color} /> Opinión en {p.nombre}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

export function Opiniones() {
  if (!opiniones.length) return null;
  const resumen = (["google", "airbnb"] as const).filter((k) => calificaciones[k].url);
  const fmt = (n: number) => n.toLocaleString("es-UY", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <section id="opiniones" className="seccion" aria-labelledby="opiniones-titulo">
      <div className="contenedor">
        <TituloSeccion
          id="opiniones-titulo"
          etiqueta="Opiniones"
          titulo="Lo que dicen nuestros huéspedes"
          intro="Opiniones reales de quienes ya se quedaron en Posada Horizonte."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-4">
          {resumen.map((k) => {
            const c = calificaciones[k];
            const p = PLATAFORMA[k];
            return (
              <a
                key={k}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("review_link_click", { plataforma: k })}
                className="aparecer flex items-center gap-4 rounded-2xl bg-sand px-5 py-4 ring-1 ring-primary-100 transition hover:ring-primary-300"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-white shadow-sm">
                  <p.Icono className="size-6" color={p.color} />
                </span>
                <span>
                  {c.promedio > 0 ? (
                    <span className="flex items-center gap-1.5 font-extrabold text-primary-900">
                      <Star className="size-4 fill-accent text-accent" aria-hidden="true" /> {fmt(c.promedio)}
                      {c.cantidad > 0 && <span className="font-semibold text-muted">· {c.cantidad} opiniones</span>}
                    </span>
                  ) : (
                    <span className="block font-extrabold text-primary-900">{p.nombre}</span>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                    Ver todas las opiniones <ExternalLink className="size-3.5" aria-hidden="true" />
                  </span>
                </span>
              </a>
            );
          })}
        </div>

        <div className="scroll-x -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {opiniones.map((o) => (
            <Tarjeta key={o.nombre + o.fecha} o={o} />
          ))}
        </div>

        {enlaces.escribirOpinionGoogle && (
          <div className="mt-10 text-center">
            <BotonLink href={enlaces.escribirOpinionGoogle} externo variante="contorno">
              ¿Ya te quedaste con nosotros? Dejanos tu opinión en Google
            </BotonLink>
          </div>
        )}
      </div>
    </section>
  );
}
