import { ChevronDown } from "lucide-react";
import { preguntasFrecuentes } from "@/data/site";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { LinkWhatsApp } from "@/components/ui/LinkWhatsApp";

export function PreguntasFrecuentes() {
  const lista = preguntasFrecuentes.filter((p) => p.respuesta);
  if (!lista.length) return null;
  return (
    <section id="preguntas" className="seccion bg-sand" aria-labelledby="faq-titulo">
      <div className="contenedor max-w-3xl">
        <TituloSeccion id="faq-titulo" etiqueta="Preguntas frecuentes" titulo="Todo lo que nos suelen preguntar" />
        <div className="space-y-3">
          {lista.map((p) => (
            <details key={p.pregunta} className="group aparecer rounded-2xl bg-white ring-1 ring-primary-100/70 open:shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left font-bold text-primary-900 [&::-webkit-details-marker]:hidden">
                {p.pregunta}
                <ChevronDown className="size-5 shrink-0 text-primary-500 transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-muted">{p.respuesta}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="mb-4 font-semibold text-primary-900">¿Tenés otra pregunta?</p>
          <LinkWhatsApp ubicacion="preguntas" mensaje="Hola! Tengo una consulta: " />
        </div>
      </div>
    </section>
  );
}
