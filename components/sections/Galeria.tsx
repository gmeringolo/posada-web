"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { filtrosGaleria, fotos, type Foto } from "@/data/fotos";
import { trackEvent } from "@/lib/analytics";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { useEstado } from "@/components/layout/Estado";

export function Visor({ lista, indice, onCerrar, onCambiar }: { lista: Foto[]; indice: number; onCerrar: () => void; onCambiar: (i: number) => void }) {
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

/** Fotos que se muestran en el mosaico cuando el filtro es "Todas" (las demás se ven en el visor). */
const DESTACADAS = [
  "/images/exterior/casas-colores.webp",
  "/images/mostaza/barbacoa.webp",
  "/images/casas-1dorm/living-deck.webp",
  "/images/casas-1dorm/deck-mesa.webp",
  "/images/mostaza/dormitorio.webp",
];

const POSICIONES = [
  "col-span-2 row-span-1 md:row-span-2", // foto grande
  "",
  "",
  "",
  "",
];

export function Galeria() {
  const { filtroGaleria, setFiltroGaleria } = useEstado();
  const [abierta, setAbierta] = useState<number | null>(null);

  const filtrosConFotos = filtrosGaleria.filter((f) => f.id === "todas" || fotos.some((x) => x.categoria === f.id));
  const lista = filtroGaleria === "todas" ? fotos : fotos.filter((f) => f.categoria === filtroGaleria);
  const mosaico =
    filtroGaleria === "todas"
      ? (DESTACADAS.map((src) => fotos.find((f) => f.src === src)).filter(Boolean) as Foto[])
      : lista.slice(0, 5);
  const restantes = lista.length - mosaico.length;

  function abrir(foto: Foto) {
    const i = lista.findIndex((f) => f.src === foto.src);
    setAbierta(Math.max(0, i));
    trackEvent("gallery_open", { foto: foto.src });
  }

  return (
    <section id="galeria" className="pantalla bg-sand" aria-labelledby="galeria-titulo">
      <div className="contenedor">
        <TituloSeccion id="galeria-titulo" etiqueta="Galería" titulo="Mirá las casas por dentro y por fuera" compacto />

        <div className="scroll-x -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="group" aria-label="Filtrar fotos">
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

        <ul className="grid auto-rows-[clamp(110px,17svh,230px)] grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 md:auto-rows-[clamp(130px,24svh,290px)]">
          {mosaico.map((f, i) => {
            const ultima = i === mosaico.length - 1 && restantes > 0;
            return (
              <li key={f.src} className={POSICIONES[i] ?? ""}>
                <button
                  type="button"
                  onClick={() => abrir(f)}
                  className="group relative block size-full overflow-hidden rounded-2xl bg-primary-100"
                  aria-label={ultima ? `Ver las ${lista.length} fotos` : `Ampliar foto: ${f.alt}`}
                >
                  <img
                    src={i === 0 ? f.src : f.thumb}
                    alt={f.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  {ultima && (
                    <span className="absolute inset-0 grid place-items-center bg-primary-950/60 text-white transition group-hover:bg-primary-950/70">
                      <span className="text-center">
                        <span className="block font-display text-3xl sm:text-4xl">+{restantes}</span>
                        <span className="text-sm font-bold">fotos</span>
                      </span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => abrir(lista[0])}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-bold text-white shadow-card transition hover:bg-primary-700"
          >
            <Images className="size-5" aria-hidden="true" /> Ver las {lista.length} fotos
          </button>
        </div>
      </div>

      {abierta !== null && lista[abierta] && (
        <Visor lista={lista} indice={abierta} onCerrar={() => setAbierta(null)} onCambiar={setAbierta} />
      )}
    </section>
  );
}
