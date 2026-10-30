"use client";

import { CircleCheck, LoaderCircle, MapPin, Navigation, Phone, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { enlaces, negocio } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { LinkWhatsApp } from "@/components/ui/LinkWhatsApp";
import { useEstado } from "@/components/layout/Estado";

type Envio = "inicial" | "enviando" | "ok" | "error";

/** El mapa de Google se carga recién cuando el visitante llega a esta parte. */
function MapaGoogle() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="h-[320px] overflow-hidden rounded-2xl bg-primary-50 ring-1 ring-primary-100 sm:h-[360px]">
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
  const [casa, setCasa] = useState(consulta.casa ?? "Indistinta");
  const [mensaje, setMensaje] = useState(
    consulta.precio ? `Hola! Vi en la web un precio estimado de ${consulta.precio}. Quiero confirmar la disponibilidad.` : "",
  );

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setEnvio("enviando");
    try {
      const datos = new FormData(form);
      const body = new URLSearchParams(datos as unknown as Record<string, string>).toString();
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) throw new Error(String(res.status));
      setEnvio("ok");
      trackEvent("form_submit", { casa, personas });
      form.reset();
      setEntrada("");
      setSalida("");
      setMensaje("");
    } catch {
      setEnvio("error");
    }
  }

  return (
          <div className="rounded-3xl bg-sand p-5 ring-1 ring-primary-100/70 sm:p-8">
            {envio === "ok" ? (
              <div className="grid h-full min-h-80 place-items-center text-center" role="status">
                <div>
                  <CircleCheck className="mx-auto size-14 text-green-600" aria-hidden="true" />
                  <p className="mt-4 font-display text-2xl text-primary-900">¡Gracias por tu consulta!</p>
                  <p className="mt-2 text-muted">Te respondemos a la brevedad, en general por WhatsApp.</p>
                  <button type="button" className="mt-6 font-bold text-primary-600 underline" onClick={() => setEnvio("inicial")}>
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
                    No completes este campo: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div className="sm:col-span-2">
                  <label htmlFor="c-nombre" className="etiqueta">
                    Nombre *
                  </label>
                  <input id="c-nombre" name="nombre" required autoComplete="name" className="campo" placeholder="Tu nombre" />
                </div>
                <div>
                  <label htmlFor="c-email" className="etiqueta">
                    Email *
                  </label>
                  <input id="c-email" name="email" type="email" required autoComplete="email" className="campo" placeholder="tu@email.com" />
                </div>
                <div>
                  <label htmlFor="c-tel" className="etiqueta">
                    Teléfono / WhatsApp
                  </label>
                  <input id="c-tel" name="telefono" type="tel" autoComplete="tel" className="campo" placeholder="099 123 456" />
                </div>
                <div>
                  <label htmlFor="c-entrada" className="etiqueta">
                    Fecha de entrada
                  </label>
                  <input id="c-entrada" name="entrada" type="date" className="campo" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
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
                <div>
                  <label htmlFor="c-personas" className="etiqueta">
                    Cantidad de personas
                  </label>
                  <select id="c-personas" name="personas" className="campo" value={personas} onChange={(e) => setPersonas(e.target.value)}>
                    {["1", "2", "3", "4"].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-casa" className="etiqueta">
                    Casa de preferencia
                  </label>
                  <select id="c-casa" name="casa" className="campo" value={casa} onChange={(e) => setCasa(e.target.value)}>
                    {["Indistinta", "Roja", "Azul", "Verde", "Mostaza"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <fieldset className="sm:col-span-2">
                  <legend className="etiqueta">¿Viajás con mascota?</legend>
                  <div className="flex gap-3">
                    {["No", "Sí"].map((v) => (
                      <label key={v} className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 ring-1 ring-primary-100 has-checked:ring-2 has-checked:ring-primary-500">
                        <input type="radio" name="mascota" value={v} defaultChecked={v === "No"} className="accent-primary-600" />
                        {v}
                      </label>
                    ))}
                  </div>
                </fieldset>
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
                  <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800 sm:col-span-2">
                    No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={envio === "enviando"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3.5 font-bold text-white shadow-card transition hover:bg-primary-700 disabled:opacity-60 sm:col-span-2"
                >
                  {envio === "enviando" ? (
                    <>
                      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> Enviando…
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
    <section id="contacto" className="seccion" aria-labelledby="contacto-titulo">
      <div className="contenedor">
        <TituloSeccion
          id="contacto-titulo"
          etiqueta="Contacto"
          titulo="Consultá sin compromiso"
          intro="Escribinos por WhatsApp o dejanos tus datos y te respondemos a la brevedad."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulario (se vuelve a montar al precargar datos) */}
          <Formulario key={versionFormulario} />

          {/* Datos, WhatsApp y mapa */}
          <div className="aparecer flex flex-col gap-5">
            <div className="rounded-3xl bg-primary-900 p-6 text-white sm:p-8">
              <p className="text-lg font-bold">La forma más rápida de consultar</p>
              <p className="mt-1 text-white/80">Escribinos y te respondemos a la brevedad.</p>
              <LinkWhatsApp ubicacion="contacto" tamano="lg" className="mt-5 w-full sm:w-auto">
                Escribinos al {negocio.telefonoVisible}
              </LinkWhatsApp>
              <ul className="mt-6 space-y-3 text-white/90">
                <li className="flex items-center gap-3">
                  <MapPin className="size-5 shrink-0 text-accent" aria-hidden="true" />
                  {negocio.direccion}, {negocio.localidad}, {negocio.departamento}
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-5 shrink-0 text-accent" aria-hidden="true" />
                  <a href={`tel:${negocio.telefonoInternacional}`} className="hover:underline">
                    {negocio.telefonoVisible}
                  </a>
                </li>
              </ul>
            </div>
            <MapaGoogle />
            <a
              href={enlaces.comoLlegar}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("directions_click", { ubicacion: "contacto" })}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full border-2 border-primary-600 px-5 py-2.5 font-bold text-primary-700 transition hover:bg-primary-600 hover:text-white"
            >
              <Navigation className="size-5" aria-hidden="true" /> Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
