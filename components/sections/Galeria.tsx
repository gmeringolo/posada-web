"use client";

import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { filtrosGaleria, fotos, type Foto } from "@/data/fotos";
import { videos } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { useEstado } from "@/components/layout/Estado";

function Visor({ lista, indice, onCerrar, onCambiar }: { lista: Foto[]; indice: number; onCerrar: () => void; onCambiar: (i: number) => void }) {
  const foto = lista[indice];
  const toque = useRef<number | null>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  const anterior = useCallback(() => onCambiar((indice - 1 + lista.length) % lista.length), [indice, lista.length, onCambiar]);
  const siguiente = useCallback(() => onCambiar((indice + 1) % lista.length), [indice, lista.length, onCambiar]);

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    cerrarRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previo?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anterior, siguiente, onCerrar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${indice + 1} de ${lista.length}: ${foto.alt}`}
      className="fixed inset-0 z-[70] flex flex-col bg-primary-950/95 backdrop-blur-sm"
      onClick={onCerrar}
      onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (toque.current === null) return;
        const dx = e.changedTouches[0].clientX - toque.current;
        if (Math.abs(dx) > 50) {
          if (dx > 0) anterior();
          else siguiente();
        }
        toque.current = null;
      }}
    >
      <div className="flex items-center justify-between p-3 text-white sm:p-5">
        <p className="text-sm font-semibold text-white/80">
          {indice + 1} / {lista.length}
        </p>
        <button
          ref={cerrarRef}
          type="button"
          aria-label="Cerrar"
          onClick={onCerrar}
          className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <X className="size-6" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20" onClick={(e) => e.stopPropagation()}>
        <img key={foto.src} src={foto.src} alt={foto.alt} className="max-h-full max-w-full rounded-lg object-contain" />
        <button
          type="button"
          aria-label="Foto anterior"
          onClick={anterior}
          className="absolute left-2 hidden size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25 sm:grid"
        >
          <ChevronLeft className="size-7" />
        </button>
        <button
          type="button"
          aria-label="Foto siguiente"
          onClick={siguiente}
          className="absolute right-2 hidden size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25 sm:grid"
        >
          <ChevronRight className="size-7" />
        </button>
      </div>
      <p className="p-4 text-center text-sm text-white/85 sm:p-6" onClick={(e) => e.stopPropagation()}>
        {foto.alt}
      </p>
    </div>
  );
}

function Video({ v }: { v: (typeof videos)[number] }) {
  const [reproducir, setReproducir] = useState(false);
  return (
    <figure className="aparecer overflow-hidden rounded-2xl bg-primary-950 shadow-card">
      <div className="relative mx-auto aspect-[9/16] max-h-[640px]">
        {reproducir ? (
          <video src={v.src} poster={v.poster} controls autoPlay playsInline preload="none" className="size-full bg-black object-contain">
            Tu navegador no puede reproducir este video.
          </video>
        ) : (
          <button
            type="button"
            className="group relative size-full"
            aria-label={`Reproducir video: ${v.titulo}`}
            onClick={() => {
              setReproducir(true);
              trackEvent("video_play", { video: v.titulo });
            }}
          >
            <img src={v.poster} alt="" loading="lazy" className="size-full object-cover opacity-90 transition group-hover:opacity-100" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-accent text-ink shadow-soft transition group-hover:scale-110">
                <Play className="ml-1 size-7 fill-current" aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="p-4 text-center text-sm font-semibold text-white/90">{v.titulo}</figcaption>
    </figure>
  );
}

export function Galeria() {
  const { filtroGaleria, setFiltroGaleria } = useEstado();
  const [abierta, setAbierta] = useState<number | null>(null);

  const filtrosConFotos = filtrosGaleria.filter((f) => f.id === "todas" || fotos.some((x) => x.categoria === f.id));
  const lista = filtroGaleria === "todas" ? fotos : fotos.filter((f) => f.categoria === filtroGaleria);

  return (
    <section id="galeria" className="seccion bg-sand" aria-labelledby="galeria-titulo">
      <div className="contenedor">
        <TituloSeccion id="galeria-titulo" etiqueta="Galería" titulo="Mirá las casas por dentro y por fuera" />

        <div className="scroll-x -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="group" aria-label="Filtrar fotos">
          {filtrosConFotos.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filtroGaleria === f.id}
              onClick={() => setFiltroGaleria(f.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                filtroGaleria === f.id ? "bg-primary-600 text-white shadow-card" : "bg-white text-primary-800 ring-1 ring-primary-100 hover:bg-primary-50"
              }`}
            >
              {f.nombre}
            </button>
          ))}
        </div>

        <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
          {lista.map((f, i) => (
            <li key={f.src} className="mb-3 break-inside-avoid sm:mb-4">
              <button
                type="button"
                onClick={() => {
                  setAbierta(i);
                  trackEvent("gallery_open", { foto: f.src });
                }}
                className="group block w-full overflow-hidden rounded-2xl bg-primary-100"
                aria-label={`Ampliar foto: ${f.alt}`}
              >
                <img
                  src={f.thumb}
                  alt={f.alt}
                  width={f.width}
                  height={f.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full transition duration-500 group-hover:scale-[1.04]"
                />
              </button>
            </li>
          ))}
        </ul>

        {videos.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-6 text-center text-2xl sm:text-3xl">Recorré la casa en video</h3>
            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
              {videos.map((v) => (
                <Video key={v.src} v={v} />
              ))}
            </div>
          </div>
        )}
      </div>

      {abierta !== null && lista[abierta] && (
        <Visor lista={lista} indice={abierta} onCerrar={() => setAbierta(null)} onCambiar={setAbierta} />
      )}
    </section>
  );
}
