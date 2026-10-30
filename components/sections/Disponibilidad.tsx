"use client";

import { AlertCircle, CalendarSearch, ChevronLeft, ChevronRight, CircleCheck, CircleX, Info, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { casas, minimoNochesMostaza, promos, supabase, tarifas, tiposDeCasa, type TipoCasa } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import {
  casasLibres,
  diasOcupados,
  fechasLibresCercanas,
  obtenerReservas,
  type Reserva,
} from "@/lib/disponibilidad";
import { formatoCorto, formatoLargo, hoyISO, nombreMes, noches as contarNoches, sumarDias, type ISODate } from "@/lib/fechas";
import { calcularPrecio, formatoPrecio, textoDesglose, type ResultadoPrecio } from "@/lib/precio";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { Boton } from "@/components/ui/Boton";
import { LinkWhatsApp } from "@/components/ui/LinkWhatsApp";
import { useEstado } from "@/components/layout/Estado";

type Carga = "cargando" | "ok" | "error";
const TIPOS: TipoCasa[] = ["1dorm", "mostaza"];
const NOMBRE_CORTO: Record<TipoCasa, string> = { "1dorm": "Casas de 1 dormitorio", mostaza: "Casa Mostaza" };

/* ---------------------------- Calendario ---------------------------- */

function Mes({
  anio,
  mes,
  ocupados,
  hoy,
  entrada,
  salida,
  onElegir,
}: {
  anio: number;
  mes: number;
  ocupados: Set<ISODate>;
  hoy: ISODate;
  entrada?: ISODate;
  salida?: ISODate;
  onElegir: (d: ISODate) => void;
}) {
  const primero = new Date(Date.UTC(anio, mes, 1));
  const offset = (primero.getUTCDay() + 6) % 7; // semana empieza el lunes
  const diasMes = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  const celdas: (ISODate | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: diasMes }, (_, i) => `${anio}-${String(mes + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`),
  ];

  return (
    <div>
      <p className="mb-3 text-center font-display text-xl text-primary-900 capitalize">
        {nombreMes(mes)} {anio}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted" aria-hidden="true">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <span key={i} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`${nombreMes(mes)} ${anio}`}>
        {celdas.map((d, i) => {
          if (!d) return <span key={`v${i}`} />;
          const pasado = d < hoy;
          const ocupado = ocupados.has(d);
          const esEntrada = d === entrada;
          const esSalida = d === salida;
          const enRango = entrada && salida && d > entrada && d < salida;
          let clases = "text-primary-900 hover:bg-primary-100";
          if (pasado) clases = "text-primary-900/25 cursor-not-allowed";
          else if (ocupado) clases = "bg-primary-50 text-primary-900/35 line-through decoration-2 cursor-not-allowed";
          if (enRango) clases = ocupado ? "bg-red-100 text-red-800 line-through" : "bg-primary-100 text-primary-900";
          if (esEntrada || esSalida) clases = "bg-primary-600 text-white font-extrabold";
          const deshabilitado = pasado || (ocupado && !entrada) || (ocupado && !!entrada && !!salida);
          return (
            <button
              key={d}
              type="button"
              disabled={pasado}
              onClick={() => !deshabilitado && onElegir(d)}
              aria-label={`${formatoLargo(d)}${ocupado ? ", ocupado" : ", libre"}`}
              aria-pressed={esEntrada || esSalida}
              className={`aspect-square rounded-lg text-sm font-semibold transition ${clases}`}
            >
              {Number(d.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ Resultado ----------------------------- */

function mensajeWhatsApp(tipo: TipoCasa, entrada: ISODate, salida: ISODate, personas: number, precio: ResultadoPrecio) {
  const n = contarNoches(entrada, salida);
  const p = precio.estado === "ok" ? ` Precio estimado: ${formatoPrecio(precio.total, precio.moneda)}.` : "";
  return `Hola! Quiero consultar disponibilidad en ${tipo === "mostaza" ? "la casa Mostaza" : "una casa de 1 dormitorio (Roja, Azul o Verde)"}. Entrada: ${formatoLargo(entrada)} (${formatoCorto(entrada)}). Salida: ${formatoLargo(salida)} (${formatoCorto(salida)}). ${n} noches, ${personas} ${personas === 1 ? "persona" : "personas"}.${p}`;
}

function TarjetaResultado({
  tipo,
  entrada,
  salida,
  personas,
  reservas,
  carga,
  hoy,
  onSugerencia,
}: {
  tipo: TipoCasa;
  entrada: ISODate;
  salida: ISODate;
  personas: number;
  reservas: Reserva[];
  carga: Carga;
  hoy: ISODate;
  onSugerencia: (e: ISODate, s: ISODate) => void;
}) {
  const { precargarFormulario, irA } = useEstado();
  const n = contarNoches(entrada, salida);
  const precio = calcularPrecio(tipo, entrada, salida, tarifas, promos);
  const total = tipo === "1dorm" ? 3 : 1;
  const libres = carga === "ok" ? casasLibres(tipo, entrada, salida, reservas) : [];
  const bajoMinimo = tipo === "mostaza" && n < minimoNochesMostaza;
  const hayLugar = carga === "ok" && libres.length > 0 && !bajoMinimo;
  const sugerencias =
    carga === "ok" && !bajoMinimo && libres.length === 0 ? fechasLibresCercanas(tipo, entrada, n, reservas, { minimo: hoy }) : [];
  const colores = casas.filter((c) => c.tipo === tipo);

  let estado: { icono: typeof CircleCheck; texto: string; clase: string };
  if (bajoMinimo)
    estado = { icono: Info, texto: `La casa Mostaza tiene estadía mínima de ${minimoNochesMostaza} noches`, clase: "text-accent-hover" };
  else if (carga === "cargando") estado = { icono: LoaderCircle, texto: "Consultando disponibilidad…", clase: "text-primary-500" };
  else if (carga === "error") estado = { icono: AlertCircle, texto: "No pudimos verificar la disponibilidad", clase: "text-muted" };
  else if (libres.length > 0)
    estado = {
      icono: CircleCheck,
      texto: tipo === "1dorm" ? `${libres.length} de ${total} casas libres` : "Libre en esas fechas",
      clase: "text-green-700",
    };
  else estado = { icono: CircleX, texto: tipo === "1dorm" ? "Las 3 casas están ocupadas" : "Ocupada en esas fechas", clase: "text-red-700" };

  const EstadoIcono = estado.icono;

  return (
    <article className={`rounded-3xl bg-white p-5 shadow-card ring-1 sm:p-6 ${hayLugar ? "ring-green-600/30" : "ring-primary-100/70"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-1.5 flex gap-1">
            {colores.map((c) => (
              <span key={c.id} className="size-3 rounded-full" style={{ background: c.color }} title={`Casa ${c.nombre}`} />
            ))}
          </div>
          <h3 className="text-xl sm:text-2xl">{tiposDeCasa[tipo].titulo}</h3>
        </div>
      </div>
      <p className={`mt-3 flex items-center gap-2 font-bold ${estado.clase}`} aria-live="polite">
        <EstadoIcono className={`size-5 shrink-0 ${carga === "cargando" && !bajoMinimo ? "animate-spin" : ""}`} aria-hidden="true" />
        {estado.texto}
      </p>

      {tipo === "1dorm" && hayLugar && (
        <p className="mt-1 text-sm text-muted">
          Libres: {libres.map((id) => casas.find((c) => c.id === id)?.nombre).join(", ")}
        </p>
      )}

      {!bajoMinimo && (carga !== "ok" || libres.length > 0) && (
        <div className="mt-4 rounded-2xl bg-sand p-4">
          {precio.estado === "ok" ? (
            <>
              <p className="text-sm font-semibold text-muted">
                Precio total estimado · {n} {n === 1 ? "noche" : "noches"}
              </p>
              <p className="text-3xl font-extrabold text-primary-900">{formatoPrecio(precio.total, precio.moneda)}</p>
              <p className="mt-1 text-sm text-muted">{textoDesglose(precio)}</p>
              <p className="mt-2 text-xs text-muted">Precio estimado por casa. Te lo confirmamos por WhatsApp.</p>
            </>
          ) : (
            <p className="font-semibold text-primary-900">Precio a consultar para esas fechas</p>
          )}
        </div>
      )}

      {sugerencias.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-bold text-primary-900">Fechas libres cercanas:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {sugerencias.map((s) => (
              <li key={s.entrada}>
                <button
                  type="button"
                  onClick={() => onSugerencia(s.entrada, s.salida)}
                  className="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700 hover:bg-primary-100"
                >
                  {formatoCorto(s.entrada).slice(0, 5)} al {formatoCorto(s.salida).slice(0, 5)}
                  {tipo === "1dorm" && ` · ${s.libres} libre${s.libres > 1 ? "s" : ""}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!bajoMinimo && (hayLugar || carga === "error") && (
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <LinkWhatsApp ubicacion={`disponibilidad-${tipo}`} mensaje={mensajeWhatsApp(tipo, entrada, salida, personas, precio)} tamano="sm" />
          <Boton
            variante="contorno"
            tamano="sm"
            onClick={() => {
              precargarFormulario({
                entrada,
                salida,
                personas,
                tipo,
                casa: tipo === "mostaza" ? "Mostaza" : "Indistinta",
                precio: precio.estado === "ok" ? formatoPrecio(precio.total, precio.moneda) : "",
              });
              irA("contacto");
            }}
          >
            Completar formulario
          </Boton>
        </div>
      )}
      {bajoMinimo && (
        <Boton variante="suave" tamano="sm" className="mt-4" onClick={() => onSugerencia(entrada, sumarDias(entrada, minimoNochesMostaza))}>
          Ver {minimoNochesMostaza} noches desde el {formatoCorto(entrada).slice(0, 5)}
        </Boton>
      )}
    </article>
  );
}

/* ------------------------------ Sección ------------------------------ */

const sinSuscripcion = () => () => {};

export function Disponibilidad() {
  const { consulta, actualizarConsulta } = useEstado();
  // Fecha de hoy en el navegador (en el build queda vacía, así no se "congela")
  const hoy = useSyncExternalStore(sinSuscripcion, hoyISO, () => "");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [carga, setCarga] = useState<Carga>("cargando");
  const [entrada, setEntrada] = useState<ISODate>("");
  const [salida, setSalida] = useState<ISODate>("");
  const [personas, setPersonas] = useState(2);
  const [buscado, setBuscado] = useState<{ entrada: ISODate; salida: ISODate; personas: number } | null>(null);
  const tipoCal: TipoCasa = consulta.tipo ?? "1dorm";
  const setTipoCal = (t: TipoCasa) => actualizarConsulta({ tipo: t });
  // Mes que se muestra, contado desde el mes actual (0 = este mes)
  const [desplazamiento, setDesplazamiento] = useState(0);
  const [error, setError] = useState("");

  // Carga las fechas ocupadas al abrir la página
  useEffect(() => {
    if (!hoy) return;
    const ctrl = new AbortController();
    obtenerReservas(supabase, hoy, sumarDias(hoy, 540), ctrl.signal)
      .then((r) => {
        setReservas(r);
        setCarga("ok");
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return;
        console.warn("[disponibilidad]", e);
        setCarga("error");
      });
    return () => ctrl.abort();
  }, [hoy]);

  const indiceHoy = hoy ? Number(hoy.slice(0, 4)) * 12 + Number(hoy.slice(5, 7)) - 1 : null;
  const meses = useMemo(() => {
    if (indiceHoy === null) return [];
    return [0, 1].map((k) => {
      const total = indiceHoy + desplazamiento + k;
      return { anio: Math.floor(total / 12), mes: total % 12 };
    });
  }, [indiceHoy, desplazamiento]);

  const ocupadosPorMes = useMemo(
    () => meses.map((m) => (carga === "ok" ? diasOcupados(tipoCal, m.anio, m.mes, reservas) : new Set<ISODate>())),
    [meses, carga, tipoCal, reservas],
  );

  function mostrarMesDe(fecha: ISODate) {
    if (indiceHoy === null) return;
    const indice = Number(fecha.slice(0, 4)) * 12 + Number(fecha.slice(5, 7)) - 1;
    setDesplazamiento(Math.min(16, Math.max(0, indice - indiceHoy)));
  }

  function buscar(e?: FormEvent, ent = entrada, sal = salida) {
    e?.preventDefault();
    if (!ent || !sal) return setError("Elegí la fecha de entrada y la de salida.");
    if (sal <= ent) return setError("La salida tiene que ser después de la entrada.");
    if (hoy && ent < hoy) return setError("La entrada no puede ser en el pasado.");
    setError("");
    setBuscado({ entrada: ent, salida: sal, personas });
    if (e) mostrarMesDe(ent);
    const libres = carga === "ok" ? TIPOS.map((t) => casasLibres(t, ent, sal, reservas).length) : [];
    const precio = calcularPrecio("1dorm", ent, sal, tarifas, promos);
    trackEvent("availability_check", {
      entrada: ent,
      salida: sal,
      noches: contarNoches(ent, sal),
      personas,
      casas_libres: libres.reduce((a, b) => a + b, 0),
      precio_estimado: precio.estado === "ok" ? `${precio.moneda} ${precio.total}` : "consultar",
    });
  }

  function elegirDia(d: ISODate) {
    if (!entrada || (entrada && salida) || d <= entrada) {
      setEntrada(d);
      setSalida("");
      setBuscado(null);
    } else {
      setSalida(d);
      buscar(undefined, entrada, d);
    }
  }

  function aplicarFechas(e: ISODate, s: ISODate) {
    setEntrada(e);
    setSalida(s);
    buscar(undefined, e, s);
    mostrarMesDe(e);
  }

  function moverMes(delta: number) {
    setDesplazamiento((d) => Math.min(16, Math.max(0, d + delta)));
  }

  return (
    <section id="disponibilidad" className="seccion bg-sand" aria-labelledby="disp-titulo">
      <div className="contenedor">
        <TituloSeccion
          id="disp-titulo"
          etiqueta="Disponibilidad"
          titulo="Consultá fechas y precio al instante"
          intro="Elegí tus fechas y te mostramos qué casas están libres y cuánto sale la estadía."
        />

        <form onSubmit={buscar} className="aparecer mx-auto grid max-w-4xl gap-4 rounded-3xl bg-primary-900 p-5 shadow-soft sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end sm:p-6">
          <div>
            <label htmlFor="d-entrada" className="mb-1.5 block text-sm font-bold text-white">
              Entrada
            </label>
            <input
              id="d-entrada"
              type="date"
              className="campo"
              min={hoy || undefined}
              value={entrada}
              onChange={(e) => {
                setEntrada(e.target.value);
                if (salida && e.target.value >= salida) setSalida("");
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="d-salida" className="mb-1.5 block text-sm font-bold text-white">
              Salida
            </label>
            <input
              id="d-salida"
              type="date"
              className="campo"
              min={entrada ? sumarDias(entrada, 1) : hoy || undefined}
              value={salida}
              onChange={(e) => setSalida(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="d-personas" className="mb-1.5 block text-sm font-bold text-white">
              Personas
            </label>
            <select id="d-personas" className="campo sm:w-28" value={personas} onChange={(e) => setPersonas(Number(e.target.value))}>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-accent px-6 font-bold text-ink shadow-card transition hover:bg-accent-hover"
          >
            <CalendarSearch className="size-5" aria-hidden="true" /> Ver disponibilidad
          </button>
          {error && (
            <p role="alert" className="font-semibold text-accent sm:col-span-4">
              {error}
            </p>
          )}
        </form>

        {buscado && (
          <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
            {TIPOS.map((t) => (
              <TarjetaResultado
                key={t}
                tipo={t}
                entrada={buscado.entrada}
                salida={buscado.salida}
                personas={buscado.personas}
                reservas={reservas}
                carga={carga}
                hoy={hoy}
                onSugerencia={aplicarFechas}
              />
            ))}
          </div>
        )}

        {carga === "error" && (
          <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-3 rounded-2xl bg-sand p-5 text-center sm:flex-row sm:text-left">
            <AlertCircle className="size-6 shrink-0 text-accent-hover" aria-hidden="true" />
            <p className="flex-1 font-semibold text-primary-900">
              No pudimos cargar el calendario en este momento. Consultanos por WhatsApp y te respondemos a la brevedad.
            </p>
            <LinkWhatsApp ubicacion="disponibilidad-error" tamano="sm" />
          </div>
        )}

        {carga !== "error" && (
          <div className="aparecer mx-auto mt-10 max-w-4xl rounded-3xl bg-white p-5 shadow-card ring-1 ring-primary-100/70 sm:p-8">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex rounded-full bg-primary-50 p-1" role="group" aria-label="Ver calendario de">
                {TIPOS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tipoCal === t}
                    onClick={() => setTipoCal(t)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${tipoCal === t ? "bg-primary-600 text-white shadow" : "text-primary-800"}`}
                  >
                    {NOMBRE_CORTO[t]}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moverMes(-1)}
                  className="grid size-10 place-items-center rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => moverMes(1)}
                  className="grid size-10 place-items-center rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>

            {carga === "cargando" ? (
              <div className="grid h-72 place-items-center rounded-2xl bg-sand" aria-busy="true">
                <p className="flex items-center gap-2 font-semibold text-primary-700">
                  <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> Cargando calendario…
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {meses.map((m, i) => (
                  <div key={`${m.anio}-${m.mes}`} className={i === 1 ? "hidden md:block" : ""}>
                    <Mes
                      anio={m.anio}
                      mes={m.mes}
                      ocupados={ocupadosPorMes[i]}
                      hoy={hoy}
                      entrada={entrada}
                      salida={salida}
                      onElegir={elegirDia}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="size-4 rounded bg-white ring-1 ring-primary-200" /> Libre
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-4 rounded bg-primary-50 ring-1 ring-primary-100" /> Ocupado
                {tipoCal === "1dorm" && " (las 3 casas)"}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-4 rounded bg-primary-600" /> Tus fechas
              </span>
            </div>
            <p className="mt-3 text-center text-sm text-muted">Tocá un día para elegir la entrada y otro para la salida.</p>
          </div>
        )}

        <p className="mt-6 text-center text-sm font-semibold text-primary-800">
          La disponibilidad es orientativa. Confirmamos tu reserva por WhatsApp.
        </p>
      </div>
    </section>
  );
}
