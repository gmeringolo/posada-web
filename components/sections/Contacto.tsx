"use client";

import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { enlaces } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import {
  enviarFormularioNetlify,
  MENSAJE_ERROR_ENVIO,
} from "@/lib/formularios";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { useEstado } from "@/components/layout/Estado";

type Envio = "inicial" | "enviando" | "ok" | "error";

/** El mapa de Google se carga recién cuando el visitante llega a esta parte. */
function MapaGoogle() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setVisible(true), io.disconnect()),
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="h-[320px] overflow-hidden rounded-3xl bg-primary-50 ring-1 ring-primary-100 sm:h-[360px] lg:h-full"
    >
      {visible && (
        <iframe
          src={enlaces.mapaEmbed}
          title="Ubicación de Posada Horizonte en Google Maps"
          className="size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
    </div>
  );
}

function Formulario() {
  const { consulta } = useEstado();
  const [envio, setEnvio] = useState<Envio>("inicial");
  // Valores iniciales: lo que venga precargado desde Disponibilidad
  const [entrada, setEntrada] = useState(consulta.entrada ?? "");
  const [salida, setSalida] = useState(consulta.salida ?? "");
  const [personas, setPersonas] = useState(String(consulta.personas ?? 2));
  const [casa, setCasa] = useState(consulta.casa ?? "1 dormitorio");
  const [mensaje, setMensaje] = useState(
    consulta.precio
      ? `Hola! Vi en la web un precio estimado de ${consulta.precio}. Quiero confirmar la disponibilidad.`
      : "",
  );

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setEnvio("enviando");
    try {
      await enviarFormularioNetlify(form);
      setEnvio("ok");
      trackEvent("form_submit", { casa, personas });
      form.reset();
      setEntrada("");
      setSalida("");
      setMensaje("");
      setCasa("1 dormitorio");
    } catch {
      setEnvio("error");
    }
  }

  return (
    <div className="h-full rounded-3xl bg-sand p-5 ring-1 ring-primary-100/70 sm:p-8">
      {envio === "ok" ? (
        <div
          className="grid h-full min-h-80 place-items-center text-center"
          role="status"
        >
          <div>
            <CircleCheck
              className="mx-auto size-14 text-green-600"
              aria-hidden="true"
            />
            <p className="mt-4 font-display text-2xl text-primary-900">
              ¡Gracias por tu consulta!
            </p>
            <p className="mt-2 text-muted">
              Te respondemos a la brevedad, en general por WhatsApp.
            </p>
            <button
              type="button"
              className="mt-6 font-bold text-primary-600 underline"
              onClick={() => setEnvio("inicial")}
            >
              Enviar otra consulta
            </button>
          </div>
        </div>
      ) : (
        <form
          name="consulta"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={enviar}
          className="grid gap-4 sm:grid-cols-2"
        >
          <input type="hidden" name="form-name" value="consulta" />
          <p className="hidden">
            <label>
              No completes este campo:{" "}
              <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="c-nombre" className="etiqueta">
              Nombre *
            </label>
            <input
              id="c-nombre"
              name="nombre"
              required
              autoComplete="name"
              className="campo"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="c-tel" className="etiqueta">
              Teléfono / WhatsApp
            </label>
            <input
              id="c-tel"
              name="telefono"
              type="tel"
              autoComplete="tel"
              className="campo"
              placeholder="099 123 456"
            />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="c-email" className="etiqueta">
              Email *
            </label>
            <input
              id="c-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="campo"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="c-entrada" className="etiqueta">
              Fecha de entrada
            </label>
            <input
              id="c-entrada"
              name="entrada"
              type="date"
              className="campo"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="c-salida" className="etiqueta">
              Fecha de salida
            </label>
            <input
              id="c-salida"
              name="salida"
              type="date"
              className="campo"
              min={entrada || undefined}
              value={salida}
              onChange={(e) => setSalida(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-[9.5rem_1fr]">
            <div>
              <label
                htmlFor="c-personas"
                className="etiqueta whitespace-nowrap"
              >
                Cantidad de personas
              </label>
              <select
                id="c-personas"
                name="personas"
                className="campo"
                value={personas}
                onChange={(e) => setPersonas(e.target.value)}
              >
                {["1", "2", "3", "4"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend className="etiqueta">Casa de preferencia</legend>
              <div className="flex min-h-[50px] flex-wrap items-center gap-x-6 gap-y-2">
                {["1 dormitorio", "2 dormitorios"].map((v) => (
                  <label
                    key={v}
                    className="flex cursor-pointer items-center gap-2 font-semibold text-primary-900"
                  >
                    <input
                      type="radio"
                      name="casa"
                      value={v}
                      checked={casa === v}
                      onChange={() => setCasa(v)}
                      className="size-4 accent-primary-600"
                    />
                    {v}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-mensaje" className="etiqueta">
              Mensaje *
            </label>
            <textarea
              id="c-mensaje"
              name="mensaje"
              required
              rows={4}
              className="campo resize-y"
              placeholder="Contanos qué fechas te interesan y cualquier consulta."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
          </div>
          {envio === "error" && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800 sm:col-span-2"
            >
              {MENSAJE_ERROR_ENVIO}
            </p>
          )}
          <button
            type="submit"
            disabled={envio === "enviando"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3.5 font-bold text-white shadow-card transition hover:bg-primary-700 disabled:opacity-60 sm:col-span-2"
          >
            {envio === "enviando" ? (
              <>
                <LoaderCircle
                  className="size-5 animate-spin"
                  aria-hidden="true"
                />{" "}
                Enviando…
              </>
            ) : (
              <>
                <Send className="size-5" aria-hidden="true" /> Enviar consulta
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export function Contacto() {
  const { versionFormulario } = useEstado();

  return (
    <section
      id="contacto"
      className="seccion"
      aria-labelledby="contacto-titulo"
    >
      <div className="contenedor">
        <TituloSeccion
          id="contacto-titulo"
          etiqueta="Contacto"
          titulo="Consultá sin compromiso"
          intro="Envianos tus datos y te respondemos a la brevedad."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulario (se vuelve a montar al precargar datos) */}
          <Formulario key={versionFormulario} />

          {/* Mapa: ocupa la misma altura que el formulario */}
          <div className="aparecer">
            <MapaGoogle />
          </div>
        </div>
      </div>
    </section>
  );
}
