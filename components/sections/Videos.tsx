"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { videos } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { TituloSeccion } from "@/components/ui/TituloSeccion";

function Video({ v }: { v: (typeof videos)[number] }) {
  const [reproducir, setReproducir] = useState(false);
  return (
    <figure className="aparecer flex flex-col items-center">
      <div className="relative aspect-[9/16] h-[clamp(360px,64svh,680px)] max-w-full overflow-hidden rounded-3xl bg-primary-950 shadow-soft">
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
      <figcaption className="mt-3 text-center text-sm font-semibold text-white/85">{v.titulo}</figcaption>
    </figure>
  );
}

export function Videos() {
  if (!videos.length) return null;
  return (
    <section id="videos" className="pantalla bg-primary-900" aria-labelledby="videos-titulo">
      <div className="contenedor">
        <TituloSeccion id="videos-titulo" etiqueta="Video" titulo="Recorré la casa en video" claro compacto />
        <div className="scroll-x -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:mx-0 sm:justify-center sm:overflow-visible sm:px-0">
          {videos.map((v) => (
            <div key={v.src} className="shrink-0 snap-center">
              <Video v={v} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
