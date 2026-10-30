import { idealPara } from "@/data/site";
import { Icono } from "@/components/ui/Icono";

export function IdealPara() {
  return (
    <section className="bg-primary-900 py-16 text-white sm:py-20" aria-labelledby="ideal-titulo">
      <div className="contenedor">
        <h2 id="ideal-titulo" className="aparecer mb-10 text-center text-3xl text-white sm:text-4xl">
          Ideal para…
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {idealPara.map((i) => (
            <li key={i.titulo} className="aparecer rounded-2xl bg-white/7 p-6 ring-1 ring-white/10">
              <span className="grid size-12 place-items-center rounded-xl bg-accent text-ink">
                <Icono nombre={i.icono} />
              </span>
              <p className="mt-4 text-lg font-bold">{i.titulo}</p>
              <p className="mt-1 text-white/80">{i.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
