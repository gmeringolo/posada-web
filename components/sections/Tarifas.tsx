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
      tamano="sm"
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
      <div className="relative h-40 sm:h-48">
        <img src={foto} alt="" loading="lazy" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 to-primary-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-2 flex gap-1.5">
            {colores.map((c) => (
              <span key={c.id} className="size-3.5 rounded-full ring-2 ring-white" style={{ background: c.color }} title={`Casa ${c.nombre}`} />
            ))}
          </div>
          <h3 className="text-2xl text-white sm:text-3xl">{t.titulo}</h3>
          <p className="text-sm font-semibold text-white/85">{t.resumen.slice(0, 2).join(" · ")}</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        {tipo === "mostaza" && (
          <p className="mb-4 flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-3 text-sm font-bold text-primary-900">
            <CalendarRange className="size-5 shrink-0 text-accent-hover" aria-hidden="true" />
            Estadía mínima: {minimoNochesMostaza} noches
          </p>
        )}
        <ul className="grid gap-3 sm:grid-cols-3">
          {lista.map((x) => (
            <li key={x.nombre} className="relative flex flex-col rounded-2xl bg-sand p-4 text-center ring-1 ring-primary-100/70">
              {x.temporadaAlta && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-2.5 py-0.5 text-[0.65rem] font-extrabold tracking-wider whitespace-nowrap text-white uppercase">
                  Temporada alta
                </span>
              )}
              <p className="mt-1 min-h-[2.5rem] text-sm font-bold text-primary-800">{x.nombre}</p>
              <p className="mt-1 text-[1.65rem] font-extrabold whitespace-nowrap text-primary-900 sm:text-[1.75rem] xl:text-3xl">{formatoPrecio(x.precioNoche, x.moneda)}</p>
              <p className="mb-3 text-sm text-muted">por noche</p>
              <div className="mt-auto">
                <BotonDisponibilidad tipo={tipo} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Tarifas() {
  const promo = promos[0];
  const antes = antesDeReservar.filter((a) => a.texto);
  return (
    <section id="tarifas" className="seccion bg-sand" aria-labelledby="tarifas-titulo">
      <div className="contenedor">
        <TituloSeccion
          id="tarifas-titulo"
          etiqueta={temporada}
          titulo="Tarifas temporada 2026–2027"
          intro="Precios por casa y por noche, para hasta 4 personas."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Bloque tipo="1dorm" foto="/images/exterior/fila-casas-sm.webp" />
          <Bloque tipo="mostaza" foto="/images/mostaza/barbacoa-ventanales-sm.webp" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
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
                <p className="mt-4 text-lg font-bold">Fin de semana · {promo.noches} noches</p>
                <p className="text-5xl font-extrabold">{formatoPrecio(promo.precioTotal, promo.moneda)}</p>
                <p className="mt-1 text-sm font-semibold">Casas de 1 dormitorio · precio total, de viernes a domingo</p>
                <LinkWhatsApp
                  ubicacion="tarifas-promo"
                  mensaje={`Hola! Quiero consultar por la ${promo.nombre} (fin de semana, ${promo.noches} noches). Fechas: …`}
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
              Consultá precios por semana o por mes para escapadas, teletrabajo o estadías largas de abril a noviembre.
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

        <ul className="mt-8 flex flex-col items-center gap-2 text-center text-sm font-semibold text-primary-800 sm:flex-row sm:justify-center sm:gap-6">
          <li className="inline-flex items-center gap-1.5">
            <Info className="size-4 text-accent-hover" aria-hidden="true" /> Precios por casa (hasta 4 personas)
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Info className="size-4 text-accent-hover" aria-hidden="true" /> {notaRopaBlanca}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Info className="size-4 text-accent-hover" aria-hidden="true" /> Otras fechas: consultá por WhatsApp
          </li>
        </ul>

        {antes.length > 0 && (
          <div className="mt-14">
            <h3 className="mb-6 text-center text-2xl sm:text-3xl">Antes de reservar</h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {antes.map((a) => (
                <li key={a.titulo} className="aparecer flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-primary-100/70">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
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
