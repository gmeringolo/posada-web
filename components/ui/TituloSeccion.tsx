import type { ReactNode } from "react";

type Props = {
  etiqueta?: string;
  titulo: ReactNode;
  intro?: ReactNode;
  centrado?: boolean;
  claro?: boolean;
  id?: string;
  /** Versión más baja, para secciones que tienen que entrar en una pantalla. */
  compacto?: boolean;
};

export function TituloSeccion({ etiqueta, titulo, intro, centrado = true, claro = false, id, compacto = false }: Props) {
  return (
    <div className={`aparecer max-w-2xl ${compacto ? "mb-6 sm:mb-8" : "mb-12"} ${centrado ? "mx-auto text-center" : ""}`}>
      {etiqueta && (
        <p className={`${compacto ? "mb-2" : "mb-3"} text-sm font-bold tracking-[0.18em] uppercase ${claro ? "text-accent" : "text-primary-500"}`}>
          {etiqueta}
        </p>
      )}
      <h2 id={id} className={`text-3xl leading-tight ${compacto ? "sm:text-[2.3rem]" : "sm:text-[2.6rem]"} ${claro ? "text-white" : ""}`}>
        {titulo}
      </h2>
      {intro && <p className={`${compacto ? "mt-2 hidden text-lg sm:block [@media(max-height:820px)]:hidden" : "mt-4 text-lg"} ${claro ? "text-white/85" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}
