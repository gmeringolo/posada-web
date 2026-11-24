"use client";

import { AlertCircle, ArrowLeft, CalendarSearch, CircleCheck, CircleX, Info, LoaderCircle, Send } from "lucide-react";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { casas, minimoNoches, promos, supabase, tarifas, tiposDeCasa, type TipoCasa } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { enviarFormularioNetlify } from "@/lib/formularios";
import { casasLibres, fechasLibresCercanas, obtenerReservas, type Reserva } from "@/lib/disponibilidad";
import { formatoCorto, formatoLargo, hoyISO, noches as contarNoches, sumarDias, type ISODate } from "@/lib/fechas";
import { calcularPrecio, formatoPrecio, textoDesglose, type ResultadoPrecio } from "@/lib/precio";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { Boton } from "@/components/ui/Boton";
import { LinkWhatsApp } from "@/components/ui/LinkWhatsApp";

type Carga = "cargando" | "ok" | "error";
type Envio = "inicial" | "enviando" | "ok" | "error";
const TIPOS: TipoCasa[] = ["1dorm", "mostaza"];
const MAX_PERSONAS = 4;

function nombresCasas(ids: string[]) {
  return ids.map((id) => casas.find((c) => c.id === id)?.nombre ?? id).join(", ");
}

function mensajeWhatsApp(tipo: TipoCasa, entrada: ISODate, salida: ISODate, personas: number, precio: ResultadoPrecio) {
  const n = contarNoches(entrada, salida);
  const p = precio.estado === "ok" ? ` Precio: ${formatoPrecio(precio.total, precio.moneda)}.` : "";
  return `Hola! Quiero consultar disponibilidad en ${tipo === "mostaza" ? "la casa Mostaza" : "una casa de 1 dormitorio (Roja, Azul o Verde)"}. Entrada: ${formatoLargo(entrada)} (${formatoCorto(entrada)}). Salida: ${formatoLargo(salida)} (${formatoCorto(salida)}). ${n} noches, ${personas} ${personas === 1 ? "persona" : "personas"}.${p}`;
}

/* ------------------------------ Resultado ----------------------------- */

function TarjetaResultado({
  tipo,
  entrada,
  salida,
  personas,
  reservas,
  carga,
  hoy,
  reservando,
  onSugerencia,
  onReservar,
}: {
  tipo: TipoCasa;
  entrada: ISODate;
  salida: ISODate;
  personas: number;
  reservas: Reserva[];
  carga: Carga;
  hoy: ISODate;
  reservando: boolean;
  onSugerencia: (e: ISODate, s: ISODate) => void;
  onReservar: () => void;
}) {
  const n = contarNoches(entrada, salida);
  const precio = calcularPrecio(tipo, entrada, salida, tarifas, promos);
  const total = tipo === "1dorm" ? 3 : 1;
  const libres = carga === "ok" ? casasLibres(tipo, entrada, salida, reservas) : [];
  const minimo = minimoNoches[tipo];
  const bajoMinimo = n < minimo;
  const hayLugar = carga === "ok" && libres.length > 0 && !bajoMinimo;
  const sugerencias =
    carga === "ok" && !bajoMinimo && libres.length === 0 ? fechasLibresCercanas(tipo, entrada, n, reservas, { minimo: hoy }) : [];
  const colores = casas.filter((c) => c.tipo === tipo);

  let estado: { icono: typeof CircleCheck; texto: string; clase: string };
  if (bajoMinimo)
    estado = {
      icono: Info,
      texto: `${tipo === "mostaza" ? "La casa Mostaza tiene" : "Las casas de 1 dormitorio tienen"} estadía mínima de ${minimo} noches`,
      clase: "text-accent-hover",
    };
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
    <article
      className={`rounded-3xl bg-white p-5 shadow-card ring-1 sm:p-6 ${reservando ? "ring-2 ring-primary-500" : hayLugar ? "ring-green-600/30" : "ring-primary-100/70"}`}
    >
      <div className="mb-1.5 flex gap-1">
        {colores.map((c) => (
          <span key={c.id} className="size-3 rounded-full" style={{ background: c.color }} title={`Casa ${c.nombre}`} />
        ))}
      </div>
      <h3 className="text-xl sm:text-2xl">{tiposDeCasa[tipo].titulo}</h3>
      <p className={`mt-3 flex items-center gap-2 font-bold ${estado.clase}`} aria-live="polite">
        <EstadoIcono className={`size-5 shrink-0 ${carga === "cargando" && !bajoMinimo ? "animate-spin" : ""}`} aria-hidden="true" />
        {estado.texto}
      </p>

      {tipo === "1dorm" && hayLugar && <p className="mt-1 text-sm text-muted">Libres: {nombresCasas(libres)}</p>}

      {!bajoMinimo && (carga !== "ok" || libres.length > 0) && (
        <div className="mt-4 rounded-2xl bg-sand p-4">
          {precio.estado === "ok" ? (
            <>
              <p className="text-sm font-semibold text-muted">
                Precio total · {n} {n === 1 ? "noche" : "noches"}
              </p>
              <p className="text-3xl font-extrabold text-primary-900">{formatoPrecio(precio.total, precio.moneda)}</p>
              <p className="mt-1 text-sm text-muted">{textoDesglose(precio)}</p>
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
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <LinkWhatsApp ubicacion={`disponibilidad-${tipo}`} mensaje={mensajeWhatsApp(tipo, entrada, salida, personas, precio)} tamano="sm">
            Consultar
          </LinkWhatsApp>
          <Boton variante="primario" tamano="sm" onClick={onReservar} aria-expanded={reservando}>
            Reservar
          </Boton>
        </div>
      )}
      {bajoMinimo && (
        <Boton variante="suave" tamano="sm" className="mt-4" onClick={() => onSugerencia(entrada, sumarDias(entrada, minimo))}>
          Ver {minimo} noches desde el {formatoCorto(entrada).slice(0, 5)}
        </Boton>
      )}
    </article>
  );
}

/* --------------------------- Formulario de reserva --------------------------- */

/**
 * Pedido de reserva. Se envía a Netlify Forms como "reserva" (aparte de "consulta")
 * con todos los datos que carga la app de reservas: casa, entrada, salida, nombre,
 * teléfono, adultos, menores, mascotas, moneda, precio por noche, total, seña y comentarios.
 */
function FormularioReserva({
  tipo,
  entrada,
  salida,
  personas,
  libres,
  onCerrar,
}: {
  tipo: TipoCasa;
  entrada: ISODate;
  salida: ISODate;
  personas: number;
  libres: string[];
  onCerrar: () => void;
}) {
  const [envio, setEnvio] = useState<Envio>("inicial");
  const [respaldo, setRespaldo] = useState("");
  const [adultos, setAdultos] = useState(Math.max(1, personas));
  const [menores, setMenores] = useState(0);
  const n = contarNoches(entrada, salida);
  const precio = calcularPrecio(tipo, entrada, salida, tarifas, promos);
  const ok = precio.estado === "ok" ? precio : null;
  const precioNoche = ok ? (ok.desglose.length === 1 ? ok.desglose[0].precioNoche : Math.round(ok.total / n)) : null;
  const casa = tipo === "mostaza" ? "Mostaza" : libres.length ? `1 dormitorio (libres: ${nombresCasas(libres)})` : "1 dormitorio";
  const excede = adultos + menores > MAX_PERSONAS;

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (excede || !form.reportValidity()) return;
    setEnvio("enviando");
    try {
      await enviarFormularioNetlify(form);
      setEnvio("ok");
      trackEvent("reserva_submit", { tipo, noches: n, personas: adultos + menores });
    } catch (err) {
      console.warn("[reserva]", err);
      // Si no se pudo enviar, armamos el mismo pedido para mandarlo por WhatsApp
      const d = new FormData(form);
      const v = (k: string) => String(d.get(k) ?? "").trim();
      setRespaldo(
        [
          "Hola! Quiero hacer una consulta de reserva.",
          `Casa: ${casa}`,
          `Entrada: ${formatoCorto(entrada)} · Salida: ${formatoCorto(salida)} (${n} noches)`,
          `Nombre: ${v("nombre")} · Teléfono: ${v("telefono")}`,
          `Adultos: ${v("adultos")} · Menores: ${v("menores")} · Mascotas: ${v("mascotas")}`,
          ok ? `Total: ${formatoPrecio(ok.total, ok.moneda)}` : "",
          v("mensaje") ? `Mensaje: ${v("mensaje")}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      );
      setEnvio("error");
    }
  }

  if (envio === "ok")
    return (
      <div className="grid place-items-center rounded-3xl bg-white p-6 text-center shadow-card ring-1 ring-primary-100/70" role="status">
        <div>
          <CircleCheck className="mx-auto size-14 text-green-600" aria-hidden="true" />
          <p className="mt-4 font-display text-2xl text-primary-900">¡Recibimos tu consulta de reserva!</p>
          <div className="mt-4 rounded-2xl bg-accent-soft p-4 text-left text-sm text-primary-900">
            <p className="font-bold">Todavía no es una reserva confirmada.</p>
            <p className="mt-1">
              Es una consulta: la disponibilidad que muestra la web es orientativa. A la brevedad te escribimos por WhatsApp para
              confirmarte que la casa quedó reservada y coordinar la seña del 50 %.
            </p>
          </div>
          <button type="button" className="mt-6 font-bold text-primary-600 underline" onClick={onCerrar}>
            Volver
          </button>
        </div>
      </div>
    );

  return (
    <form
      name="reserva"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={enviar}
      className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-primary-100/70 sm:p-6"
    >
      <input type="hidden" name="form-name" value="reserva" />
      <p className="hidden">
        <label>
          No completes este campo: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      {/* Datos de la estadía (los completa la web) */}
      <input type="hidden" name="casa" value={casa} />
      <input type="hidden" name="entrada" value={entrada} />
      <input type="hidden" name="salida" value={salida} />
      <input type="hidden" name="noches" value={n} />
      <input type="hidden" name="moneda" value={ok?.moneda ?? ""} />
      <input type="hidden" name="precio_noche" value={precioNoche ?? "a consultar"} />
      <input type="hidden" name="total" value={ok ? ok.total : "a consultar"} />
      <input type="hidden" name="sena" value={ok ? Math.round(ok.total / 2) : "a consultar"} />
      <input type="hidden" name="detalle_precio" value={ok ? textoDesglose(ok) : ""} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl">Consulta de reserva</h3>
          <p className="mt-0.5 text-sm font-semibold text-muted">
            {tiposDeCasa[tipo].titulo} · {formatoCorto(entrada).slice(0, 5)} al {formatoCorto(salida).slice(0, 5)} · {n} noches
          </p>
        </div>
        <button type="button" onClick={onCerrar} className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" /> Volver
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="r-nombre" className="etiqueta">
            Nombre y apellido *
          </label>
          <input id="r-nombre" name="nombre" required autoComplete="name" className="campo" placeholder="Tu nombre" />
        </div>
        <div>
          <label htmlFor="r-tel" className="etiqueta">
            Teléfono / WhatsApp *
          </label>
          <input id="r-tel" name="telefono" type="tel" required autoComplete="tel" className="campo" placeholder="099 123 456" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="r-adultos" className="etiqueta">
            Adultos
          </label>
          <select id="r-adultos" name="adultos" className="campo" value={adultos} onChange={(e) => setAdultos(Number(e.target.value))}>
            {[1, 2, 3, 4].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="r-menores" className="etiqueta">
            Menores
          </label>
          <select id="r-menores" name="menores" className="campo" value={menores} onChange={(e) => setMenores(Number(e.target.value))}>
            {[0, 1, 2, 3].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="r-mascotas" className="etiqueta">
            Mascotas
          </label>
          <select id="r-mascotas" name="mascotas" className="campo" defaultValue="0">
            {[0, 1, 2, 3].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>
      {excede && (
        <p role="alert" className="mt-2 text-sm font-semibold text-red-700">
          Las casas son para hasta {MAX_PERSONAS} personas en total.
        </p>
      )}
      <div className="mt-3">
        <label htmlFor="r-mensaje" className="etiqueta">
          Mensaje
        </label>
        <input id="r-mensaje" name="mensaje" className="campo" placeholder="Algo que quieras contarnos (opcional)" />
      </div>
      {envio === "error" && (
        <div role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">
          <p>No pudimos enviar tu consulta. Mandala por WhatsApp con un toque: ya va con todos tus datos.</p>
          {respaldo && (
            <LinkWhatsApp ubicacion="reserva-respaldo" mensaje={respaldo} tamano="sm" className="mt-2.5 w-full">
              Enviar por WhatsApp
            </LinkWhatsApp>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={envio === "enviando" || excede}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-bold text-white shadow-card transition hover:bg-primary-700 disabled:opacity-60"
      >
        {envio === "enviando" ? (
          <>
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> Enviando…
          </>
        ) : (
          <>
            <Send className="size-5" aria-hidden="true" /> Enviar consulta de reserva
          </>
        )}
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        {ok && <>Total {formatoPrecio(ok.total, ok.moneda)} · </>}Es una consulta: te confirmamos la reserva por WhatsApp.
      </p>
    </form>
  );
}

/* ------------------------------ Sección ------------------------------ */

const sinSuscripcion = () => () => {};

export function Disponibilidad() {
  // Fecha de hoy en el navegador (en el build queda vacía, así no se "congela")
  const hoy = useSyncExternalStore(sinSuscripcion, hoyISO, () => "");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [carga, setCarga] = useState<Carga>("cargando");
  const [entrada, setEntrada] = useState<ISODate>("");
  const [salida, setSalida] = useState<ISODate>("");
  const [personas, setPersonas] = useState(2);
  const [buscado, setBuscado] = useState<{ entrada: ISODate; salida: ISODate; personas: number } | null>(null);
  const [reservando, setReservando] = useState<TipoCasa | null>(null);
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

  function buscar(e?: FormEvent, ent = entrada, sal = salida) {
    e?.preventDefault();
    if (!ent || !sal) return setError("Elegí la fecha de entrada y la de salida.");
    if (sal <= ent) return setError("La salida tiene que ser después de la entrada.");
    if (hoy && ent < hoy) return setError("La entrada no puede ser en el pasado.");
    setError("");
    setReservando(null);
    setBuscado({ entrada: ent, salida: sal, personas });
    const libres = carga === "ok" ? TIPOS.map((t) => casasLibres(t, ent, sal, reservas).length) : [];
    const precio = calcularPrecio("1dorm", ent, sal, tarifas, promos);
    trackEvent("availability_check", {
      entrada: ent,
      salida: sal,
      noches: contarNoches(ent, sal),
      personas,
      casas_libres: libres.reduce((a, b) => a + b, 0),
      precio: precio.estado === "ok" ? `${precio.moneda} ${precio.total}` : "consultar",
    });
  }

  function aplicarFechas(e: ISODate, s: ISODate) {
    setEntrada(e);
    setSalida(s);
    buscar(undefined, e, s);
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

        <form
          onSubmit={buscar}
          className="aparecer mx-auto grid max-w-4xl gap-4 rounded-3xl bg-primary-900 p-5 shadow-soft sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end sm:p-6"
        >
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
          <div className="mx-auto mt-8 grid max-w-4xl items-start gap-5 md:grid-cols-2">
            {TIPOS.filter((t) => !reservando || t === reservando).map((t) => (
              <TarjetaResultado
                key={t}
                tipo={t}
                entrada={buscado.entrada}
                salida={buscado.salida}
                personas={buscado.personas}
                reservas={reservas}
                carga={carga}
                hoy={hoy}
                reservando={reservando === t}
                onSugerencia={aplicarFechas}
                onReservar={() => setReservando(t)}
              />
            ))}
            {reservando && (
              // El formulario ocupa el lugar de la otra tarjeta: a la derecha de las casas de 1 dormitorio, a la izquierda de la Mostaza
              <div className={reservando === "mostaza" ? "md:order-first" : ""}>
                <FormularioReserva
                  tipo={reservando}
                  entrada={buscado.entrada}
                  salida={buscado.salida}
                  personas={buscado.personas}
                  libres={carga === "ok" ? casasLibres(reservando, buscado.entrada, buscado.salida, reservas) : []}
                  onCerrar={() => setReservando(null)}
                />
              </div>
            )}
          </div>
        )}

        {carga === "error" && (
          <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center sm:flex-row sm:text-left">
            <AlertCircle className="size-6 shrink-0 text-accent-hover" aria-hidden="true" />
            <p className="flex-1 font-semibold text-primary-900">
              No pudimos cargar la disponibilidad en este momento. Consultanos por WhatsApp y te respondemos a la brevedad.
            </p>
            <LinkWhatsApp ubicacion="disponibilidad-error" tamano="sm" />
          </div>
        )}

      </div>
    </section>
  );
}
