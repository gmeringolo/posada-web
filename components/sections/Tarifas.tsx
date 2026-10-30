"use client";

import { CalendarRange, Info, Sparkles } from "lucide-react";
import {
  antesDeReservar,
  casas,
  minimoNochesMostaza,
  notaRopaBlanca,
  preciosFueraDeTemporada,
  promos,
  tarifas,
  temporada,
  tiposDeCasa,
  type TipoCasa,
} from "@/data/site";
import { formatoPrecio } from "@/lib/precio";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { Icono } from "@/components/ui/Icono";
import { Boton } from "@/components/ui/Boton";
import { LinkWhatsApp } from "@/components/ui/LinkWhatsApp";
import { useEstado } from "@/components/layout/Estado";

function BotonDisponibilidad({ tipo }: { tipo: TipoCasa }) {
  const { actualizarConsulta, irA } = useEstado();
  return (
    <Boton
      variante="suave"
      className="w-full"
      onClick={() => {
        actualizarConsulta({ tipo });
        irA("disponibilidad");
      }}
    >
      Ver disponibilidad
    </Boton>
  );
}

function Bloque({ tipo, foto }: { tipo: TipoCasa; foto: string }) {
  const t = tiposDeCasa[tipo];
  const lista = tarifas.filter((x) => x.tipo === tipo);
  const colores = casas.filter((c) => c.tipo === tipo);
  if (!lista.length) return null;
  return (
    <div className="aparecer overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-primary-100/70">
      <div className="relative h-[clamp(110px,15svh,170px)]">
        <img src={foto} alt="" loading="lazy" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 to-primary-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-2 flex gap-1.5">
            {colores.map((c) => (
              <span key={c.id} className="size-3.5 rounded-full ring-2 ring-white" style={{ background: c.color }} title={`Casa ${c.nombre}`} />
            ))}
          </div>
          <h3 className="text-2xl text-white sm:text-[1.75rem]">{t.titulo}</h3>
          <p className="text-sm font-semibold text-white/85">{t.resumen.slice(0, 2).join(" · ")}</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        {tipo === "mostaza" && (
          <p className="mb-4 flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-2.5 text-sm font-bold text-primary-900">
            <CalendarRange className="size-5 shrink-0 text-accent-hover" aria-hidden="true" />
            Estadía mínima: {minimoNochesMostaza} noches
          </p>
        )}
        <ul className={`grid grid-cols-2 gap-3 ${lista.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
          {lista.map((x) => (
            <li key={x.nombre} className="relative flex flex-col justify-center rounded-2xl bg-sand px-2 pt-5 pb-3 text-center ring-1 ring-primary-100/70">
              {x.temporadaAlta && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-2.5 py-0.5 text-[0.65rem] font-extrabold tracking-wider whitespace-nowrap text-white uppercase">
                  Temporada alta
                </span>
              )}
              <p className="text-[0.8rem] leading-tight font-bold text-primary-800">{x.nombre}</p>
              {x.fechas && <p className="text-[0.7rem] text-muted">{x.fechas}</p>}
              <p className="mt-1.5 text-2xl font-extrabold whitespace-nowrap text-primary-900 xl:text-[1.7rem]">{formatoPrecio(x.precioNoche, x.moneda)}</p>
              <p className="text-xs text-muted">por noche</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <BotonDisponibilidad tipo={tipo} />
        </div>
      </div>
    </div>
  );
}

export function Tarifas() {
  return (
    <section id="tarifas" className="pantalla bg-sand" aria-labelledby="tarifas-titulo">
      <div className="contenedor">
        <TituloSeccion
          id="tarifas-titulo"
          etiqueta={temporada}
          titulo="Tarifas temporada 2026–2027"
          intro="Precios por casa y por noche, para hasta 4 personas."
          compacto
        />
        <div className="carrusel">
          <Bloque tipo="1dorm" foto="/images/exterior/fila-casas-sm.webp" />
          <Bloque tipo="mostaza" foto="/images/mostaza/barbacoa-ventanales-sm.webp" />
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-primary-600 lg:hidden" aria-hidden="true">Deslizá para ver la casa Mostaza →</p>
        <ul className="mt-5 hidden flex-col items-center gap-1.5 text-center text-sm font-semibold text-primary-800 sm:flex sm:flex-row sm:justify-center sm:gap-6">
          <li className="inline-flex items-center gap-1.5">
            <Info className="size-4 text-accent-hover" aria-hidden="true" /> Precios por casa (hasta 4 personas)
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Info className="size-4 text-accent-hover" aria-hidden="true" /> {notaRopaBlanca}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Info className="size-4 text-accent-hover" aria-hidden="true" /> Seña del 50 % para reservar
          </li>
        </ul>
      </div>
    </section>
  );
}

/** Promo de fin de semana, fuera de temporada y condiciones para reservar. */
export function PromosYCondiciones() {
  const promo = promos[0];
  const antes = antesDeReservar.filter((a) => a.texto);
  return (
    <section id="promos" className="seccion" aria-labelledby="promos-titulo">
      <div className="contenedor">
        <h2 id="promos-titulo" className="sr-only">
          Promociones y condiciones
        </h2>
        <div className="grid gap-8 lg:grid-cols-2">
          {promo && (
            <div className="aparecer relative overflow-hidden rounded-3xl bg-accent p-6 text-ink shadow-card sm:p-8">
              <img
                src="/images/casas-1dorm/deck-mesa-sm.webp"
                alt=""
                loading="lazy"
                className="absolute inset-y-0 right-0 hidden h-full w-2/5 object-cover sm:block"
                style={{ maskImage: "linear-gradient(to right, transparent, black 45%)" }}
              />
              <div className="relative sm:max-w-[60%]">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-extrabold tracking-wider text-white uppercase">
                  <Sparkles className="size-3.5" aria-hidden="true" /> {promo.nombre}
                </p>
                <p className="mt-4 text-lg font-bold">Viernes a domingo · {promo.noches} noches</p>
                <p className="text-5xl font-extrabold">{formatoPrecio(promo.precioTotal, promo.moneda)}</p>
                <p className="mt-1 text-sm font-semibold">Casas de 1 dormitorio · precio total · del 1 de abril al 30 de noviembre</p>
                <LinkWhatsApp
                  ubicacion="tarifas-promo"
                  mensaje={`Hola! Quiero consultar por la ${promo.nombre} (viernes a domingo, ${promo.noches} noches). Fechas: …`}
                  variante="primario"
                  className="mt-5"
                >
                  Consultar la promo
                </LinkWhatsApp>
              </div>
            </div>
          )}

          <div className="aparecer rounded-3xl bg-primary-900 p-6 text-white shadow-card sm:p-8">
            <p className="text-sm font-bold tracking-[0.15em] text-accent uppercase">Fuera de temporada</p>
            <h3 className="mt-2 text-2xl text-white sm:text-3xl">Abiertos todo el año</h3>
            <p className="mt-3 text-white/85">
              ¿Una semana, un mes o una estadía larga para teletrabajar? Consultanos y te pasamos el precio para tus fechas.
            </p>
            {preciosFueraDeTemporada.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {preciosFueraDeTemporada.map((p) => (
                  <li key={p.tipo + p.detalle} className="font-semibold">
                    {tiposDeCasa[p.tipo].titulo}: {p.detalle}
                  </li>
                ))}
              </ul>
            )}
            <LinkWhatsApp
              ubicacion="tarifas-fuera-temporada"
              mensaje="Hola! Quiero consultar precios fuera de temporada. Fechas: … Cantidad de personas: …"
              variante="acento"
              className="mt-5"
            >
              Consultar precios
            </LinkWhatsApp>
          </div>
        </div>

        {antes.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-6 text-center text-2xl sm:text-3xl">Antes de reservar</h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {antes.map((a) => (
                <li key={a.titulo} className="aparecer flex items-start gap-4 rounded-2xl bg-sand p-5 ring-1 ring-primary-100/70">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-primary-600 shadow-sm">
                    <Icono nombre={a.icono} />
                  </span>
                  <div>
                    <p className="font-bold text-primary-900">{a.titulo}</p>
                    <p className="text-[0.95rem] text-muted">{a.texto}</p>
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
