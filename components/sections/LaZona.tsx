"use client";

import { Bus, Car } from "lucide-react";
import { zona } from "@/data/site";
import { Icono } from "@/components/ui/Icono";
import { TituloSeccion } from "@/components/ui/TituloSeccion";

export function LaZona() {
  const distancias = zona.distancias.filter((d) => d.distancia);
  return (
    <section id="zona" className="pantalla" aria-labelledby="zona-titulo">
      <div className="contenedor">
        <TituloSeccion id="zona-titulo" etiqueta="La zona" titulo="Bello Horizonte, en la Costa de Oro" intro={zona.intro} compacto />

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Foto: en computadora ocupa las 3 columnas */}
          <div className="aparecer overflow-hidden rounded-3xl lg:col-span-3">
            <img
              src="/images/playa/bajada-playa.webp"
              alt="Bajada de madera entre los médanos hacia la playa de Bello Horizonte"
              loading="lazy"
              className="h-[clamp(160px,26svh,340px)] w-full object-cover"
            />
          </div>

          {/* Cómo llegar: lado a lado en tablet, apilados en computadora */}
          <div className={`grid gap-4 ${zona.comoLlegar.omnibus ? "sm:grid-cols-2 lg:grid-cols-1" : ""}`}>
            <div className="aparecer rounded-2xl bg-primary-900 p-5 text-white">
              <p className="flex items-center gap-2 font-bold">
                <Car className="size-5 text-accent" aria-hidden="true" /> En auto
              </p>
              <p className="mt-1.5 text-sm text-white/85">{zona.comoLlegar.auto}</p>
            </div>
            {zona.comoLlegar.omnibus && (
              <div className="aparecer rounded-2xl bg-sand p-5 ring-1 ring-primary-100/70">
                <p className="flex items-center gap-2 font-bold text-primary-900">
                  <Bus className="size-5 text-primary-500" aria-hidden="true" /> En bus
                </p>
                <p className="mt-1.5 text-sm text-muted">{zona.comoLlegar.omnibus}</p>
              </div>
            )}
          </div>

          {/* Comercios cercanos */}
          {zona.comercios.length > 0 && (
            <div className="aparecer flex flex-col rounded-3xl bg-primary-600 px-5 py-2 text-white">
              <h3 className="sr-only">Comercios cercanos</h3>
              <ul className="flex flex-1 flex-col justify-around divide-y divide-white/15">
                {zona.comercios.map((c) => (
                  <li key={c.nombre} className="flex items-center gap-3 py-2.5 [@media(max-height:820px)]:py-2">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-accent">
                      <Icono nombre={c.icono} className="size-5" />
                    </span>
                    <span className="flex-1 text-[0.95rem] font-semibold">{c.nombre}</span>
                    <span className="text-right text-sm font-bold whitespace-nowrap text-accent">{c.distancia}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Distancias */}
          <div className="flex flex-col rounded-3xl bg-sand px-5 py-2 ring-1 ring-primary-100/70">
            <h3 className="sr-only">Distancias</h3>
            <ul className="flex flex-1 flex-col justify-around divide-y divide-primary-100">
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
