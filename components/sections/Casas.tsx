"use client";

import { BedDouble, Check, Images } from "lucide-react";
import { casas, tarifas, tiposDeCasa, type TipoCasa } from "@/data/site";
import { formatoPrecio, precioDesde } from "@/lib/precio";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { Boton } from "@/components/ui/Boton";
import { useEstado } from "@/components/layout/Estado";

function Tarjeta({ tipo }: { tipo: TipoCasa }) {
  const t = tiposDeCasa[tipo];
  const colores = casas.filter((c) => c.tipo === tipo);
  const desde = precioDesde(tipo, tarifas);
  const { setFiltroGaleria, actualizarConsulta, irA } = useEstado();

  return (
    <article className="aparecer group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-primary-100/70">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={t.foto}
          alt={t.fotoAlt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur">
          {colores.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 text-xs font-bold text-ink">
              <span className="size-3 rounded-full ring-2 ring-white" style={{ background: c.color }} aria-hidden="true" />
              {c.nombre}
            </span>
          ))}
        </div>
        {desde && (
          <p className="absolute right-4 bottom-4 rounded-2xl bg-primary-900/85 px-3.5 py-2 text-right text-white backdrop-blur">
            <span className="block text-[0.7rem] font-semibold tracking-wider uppercase opacity-80">desde</span>
            <span className="text-xl font-extrabold">{formatoPrecio(desde.precio, desde.moneda)}</span>
            <span className="text-sm opacity-80"> /noche</span>
          </p>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="text-sm font-bold text-primary-500">{t.subtitulo}</p>
        <h3 className="mt-1 text-2xl sm:text-3xl">{t.titulo}</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {t.resumen.map((r) => (
            <li key={r} className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-800">
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-muted">{t.descripcion}</p>
        <ul className="mt-4 space-y-2">
          {t.camas.map((c) => (
            <li key={c} className="flex items-start gap-2 text-[0.95rem]">
              <BedDouble className="mt-0.5 size-5 shrink-0 text-primary-500" aria-hidden="true" />
              {c}
            </li>
          ))}
          <li className="flex items-start gap-2 text-[0.95rem]">
            <Check className="mt-0.5 size-5 shrink-0 text-primary-500" aria-hidden="true" />
            Parrillero, Wi-Fi, TV cable y sillas de playa
          </li>
        </ul>
        <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
          <Boton
            variante="suave"
            onClick={() => {
              setFiltroGaleria(tipo);
              irA("galeria");
            }}
          >
            <Images className="size-5" aria-hidden="true" /> Ver fotos
          </Boton>
          <Boton
            variante="primario"
            onClick={() => {
              actualizarConsulta({ tipo });
              irA("disponibilidad");
            }}
          >
            Ver disponibilidad
          </Boton>
        </div>
      </div>
    </article>
  );
}

export function Casas() {
  return (
    <section id="casas" className="seccion bg-sand" aria-labelledby="casas-titulo">
      <div className="contenedor">
        <TituloSeccion
          id="casas-titulo"
          etiqueta="Las casas"
          titulo="Casas en alquiler en Bello Horizonte"
          intro="Cuatro casas independientes, todas para hasta 4 personas. Las Roja, Azul y Verde son iguales por dentro; la Mostaza es la más amplia."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <Tarjeta tipo="1dorm" />
          <Tarjeta tipo="mostaza" />
        </div>
      </div>
    </section>
  );
}
