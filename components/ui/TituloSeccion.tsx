import type { ReactNode } from "react";

type Props = {
  etiqueta?: string;
  titulo: ReactNode;
  intro?: ReactNode;
  centrado?: boolean;
  claro?: boolean;
  id?: string;
};

export function TituloSeccion({ etiqueta, titulo, intro, centrado = true, claro = false, id }: Props) {
  return (
    <div className={`aparecer mb-12 max-w-2xl ${centrado ? "mx-auto text-center" : ""}`}>
      {etiqueta && (
        <p className={`mb-3 text-sm font-bold tracking-[0.18em] uppercase ${claro ? "text-accent" : "text-primary-500"}`}>
          {etiqueta}
        </p>
      )}
      <h2 id={id} className={`text-3xl leading-tight sm:text-[2.6rem] ${claro ? "text-white" : ""}`}>
        {titulo}
      </h2>
      {intro && <p className={`mt-4 text-lg ${claro ? "text-white/85" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}
