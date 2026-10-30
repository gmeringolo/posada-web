import { Info } from "lucide-react";
import { comodidades, notaRopaBlanca } from "@/data/site";
import { Icono } from "@/components/ui/Icono";
import { TituloSeccion } from "@/components/ui/TituloSeccion";

export function Servicios() {
  const destacadas = comodidades.filter((c) => c.destacada);
  const resto = comodidades.filter((c) => !c.destacada);
  return (
    <section id="servicios" className="seccion" aria-labelledby="servicios-titulo">
      <div className="contenedor">
        <TituloSeccion
          id="servicios-titulo"
          etiqueta="Comodidades"
          titulo="Todo lo que necesitás para descansar"
          intro="Cada casa es independiente y está totalmente equipada. Solo traé tu ropa de cama y toallas."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {destacadas.map((c) => (
            <div key={c.titulo} className="aparecer flex items-center gap-4 rounded-2xl bg-primary-600 p-5 text-white shadow-card">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/15">
                <Icono nombre={c.icono} className="size-6" />
              </span>
              <div>
                <p className="font-bold">{c.titulo}</p>
                {c.detalle && <p className="text-sm text-white/80">{c.detalle}</p>}
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-6 grid gap-x-8 gap-y-5 rounded-3xl bg-sand p-6 sm:grid-cols-2 sm:p-10 lg:grid-cols-3">
          {resto.map((c) => (
            <li key={c.titulo} className="aparecer flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-primary-600 shadow-sm">
                <Icono nombre={c.icono} />
              </span>
              <div>
                <p className="font-bold text-primary-900">{c.titulo}</p>
                {c.detalle && <p className="text-sm text-muted">{c.detalle}</p>}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 flex items-center justify-center gap-2 text-center font-semibold text-primary-800">
          <Info className="size-5 shrink-0 text-accent-hover" aria-hidden="true" /> {notaRopaBlanca}
        </p>
      </div>
    </section>
  );
}
