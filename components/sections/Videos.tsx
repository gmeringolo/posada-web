"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { videos } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { TituloSeccion } from "@/components/ui/TituloSeccion";

function Video({ v }: { v: (typeof videos)[number] }) {
  const [reproducir, setReproducir] = useState(false);
  return (
    <figure className="aparecer mx-auto w-full max-w-4xl">
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-primary-950 shadow-soft">
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
    </figure>
  );
}

export function Videos() {
  if (!videos.length) return null;
  return (
    <section id="videos" className="pantalla bg-primary-900" aria-labelledby="videos-titulo">
      <div className="contenedor">
        <TituloSeccion id="videos-titulo" etiqueta="Video" titulo="Recorré la casa en video" claro compacto />
        {videos.map((v) => (
          <Video key={v.src} v={v} />
        ))}
      </div>
    </section>
  );
}
