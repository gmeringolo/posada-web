"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { diaDeshabilitado, elegirDia, primeraSinLugar, salidaValida, semanasDelMes, type Foco, type Rango } from "@/lib/calendario";
import { nombreMes, sumarDias, type ISODate } from "@/lib/fechas";

const DIAS = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];

type Props = {
  entrada: ISODate;
  salida: ISODate;
  foco: Foco;
  hoy: ISODate;
  /** Noches sin lugar en ninguna casa: se tachan y no se pueden elegir. */
  sinLugar: Set<ISODate>;
  onCambiar: (r: Rango & { foco: Foco; completo: boolean }) => void;
  onCerrar: () => void;
};

function mesDe(fecha: ISODate) {
  return { anio: Number(fecha.slice(0, 4)), mes: Number(fecha.slice(5, 7)) - 1 };
}

function sumarMeses({ anio, mes }: { anio: number; mes: number }, n: number) {
  const t = anio * 12 + mes + n;
  return { anio: Math.floor(t / 12), mes: t % 12 };
}

/**
 * Calendario propio para elegir entrada y salida (reemplaza al del navegador).
 * Solo se resalta el día de hoy y las fechas elegidas; las noches sin lugar aparecen tachadas.
 * En celular muestra un mes; desde tablet, dos.
 */
export function Calendario({ entrada, salida, foco, hoy, sinLugar, onCambiar, onCerrar }: Props) {
  const inicio = mesDe(entrada || hoy);
  const [base, setBase] = useState(inicio);
  const [hover, setHover] = useState<ISODate | null>(null);
  const enfocar = useRef<ISODate | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const minimo = mesDe(hoy);
  const enMinimo = base.anio * 12 + base.mes <= minimo.anio * 12 + minimo.mes;

  const rango = { entrada, salida };
  const tope = foco === "salida" && entrada ? primeraSinLugar(entrada, sinLugar) : null;
  // Fin del rango a pintar: la salida elegida o, mientras se elige, el día bajo el puntero
  // Día que recibe el foco con Tab (el resto se recorre con las flechas)
  const primeroMes = `${base.anio}-${String(base.mes + 1).padStart(2, "0")}-01`;
  const activo = (foco === "salida" && salida) || entrada || (hoy > primeroMes ? hoy : primeroMes);
  const fin = salida || (foco === "salida" && hover && salidaValida(hover, entrada, tope) ? hover : "");

  // Foco con el teclado al cambiar de mes
  useEffect(() => {
    if (!enfocar.current) return;
    raiz.current?.querySelector<HTMLButtonElement>(`[data-fecha="${enfocar.current}"]`)?.focus();
    enfocar.current = null;
  }, [base]);

  // Al abrir, el foco va a la fecha elegida o al primer día disponible
  useEffect(() => {
    const el =
      raiz.current?.querySelector<HTMLButtonElement>(`[data-fecha="${foco === "salida" && salida ? salida : entrada}"]`) ??
      raiz.current?.querySelector<HTMLButtonElement>("button[data-fecha]:not(:disabled)");
    el?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function mover(e: KeyboardEvent<HTMLButtonElement>, dia: ISODate) {
    const pasos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key === "Escape") return onCerrar();
    if (!(e.key in pasos)) return;
    e.preventDefault();
    const destino = sumarDias(dia, pasos[e.key]);
    if (hoy && destino < hoy) return;
    const boton = raiz.current?.querySelector<HTMLButtonElement>(`[data-fecha="${destino}"]`);
    if (boton && boton.offsetParent !== null) return boton.focus();
    setBase(sumarMeses(base, destino < dia ? -1 : 1));
    enfocar.current = destino;
  }

  function Mes({ desplazamiento }: { desplazamiento: number }) {
    const { anio, mes } = sumarMeses(base, desplazamiento);
    const titulo = nombreMes(mes);
    return (
      <div className={desplazamiento ? "hidden sm:block" : ""}>
        <p className="mb-2 text-center font-bold text-primary-900 capitalize" aria-live="polite">
          {titulo} {anio}
        </p>
        <table className="w-full border-collapse" role="grid" aria-label={`${titulo} ${anio}`}>
          <thead>
            <tr>
              {DIAS.map((d) => (
                <th key={d} scope="col" className="pb-1 text-[0.7rem] font-bold text-muted">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semanasDelMes(anio, mes).map((semana, i) => (
              <tr key={i}>
                {semana.map((dia, j) => {
                  if (!dia) return <td key={j} />;
                  const deshabilitado = diaDeshabilitado(dia, rango, foco, hoy, sinLugar, tope);
                  const tachado = sinLugar.has(dia) && !(hoy && dia < hoy);
                  const esEntrada = dia === entrada;
                  const esFin = !!fin && dia === fin;
                  const adentro = !!entrada && !!fin && dia > entrada && dia < fin;
                  const esHoy = dia === hoy;
                  // Franja celeste continua entre entrada y salida
                  const franja = adentro
                    ? "bg-primary-50"
                    : esEntrada && fin
                      ? "bg-[linear-gradient(to_right,transparent_50%,var(--color-primary-50)_50%)]"
                      : esFin && entrada
                        ? "bg-[linear-gradient(to_left,transparent_50%,var(--color-primary-50)_50%)]"
                        : "";
                  const elegido = esEntrada || (esFin && !!salida);
                  return (
                    <td key={j} className={`p-0 py-0.5 ${franja}`}>
                      <button
                        type="button"
                        data-fecha={dia}
                        disabled={deshabilitado}
                        tabIndex={dia === activo ? 0 : -1}
                        aria-pressed={elegido}
                        aria-label={`${Number(dia.slice(8))} de ${titulo}${esHoy ? ", hoy" : ""}${tachado ? ", sin lugar" : ""}${esEntrada ? ", entrada" : ""}${esFin && salida ? ", salida" : ""}`}
                        onClick={() => onCambiar(elegirDia(dia, rango, foco, sinLugar))}
                        onMouseEnter={() => setHover(dia)}
                        onKeyDown={(e) => mover(e, dia)}
                        className={`relative mx-auto grid size-10 place-items-center rounded-full text-sm transition sm:size-11 ${
                          elegido
                            ? "bg-primary-600 font-bold text-white"
                            : esFin
                              ? "bg-primary-100 font-semibold text-primary-900"
                              : deshabilitado
                                ? `cursor-default text-muted/40 ${tachado ? "line-through decoration-muted/60" : ""}`
                                : `text-ink hover:bg-primary-100 ${esHoy ? "font-extrabold text-primary-700" : ""}`
                        }`}
                      >
                        {Number(dia.slice(8))}
                        {esHoy && !elegido && <span className="absolute bottom-1 size-1 rounded-full bg-accent" aria-hidden="true" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      ref={raiz}
      role="dialog"
      aria-label={foco === "entrada" ? "Elegí la fecha de entrada" : "Elegí la fecha de salida"}
      onMouseLeave={() => setHover(null)}
      onKeyDown={(e) => e.key === "Escape" && onCerrar()}
      className="rounded-3xl bg-white p-4 text-ink shadow-soft ring-1 ring-primary-100 sm:p-5"
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => setBase(sumarMeses(base, -1))}
          disabled={enMinimo}
          aria-label="Mes anterior"
          className="absolute top-0 left-0 grid size-8 place-items-center rounded-full text-primary-700 transition hover:bg-primary-50 disabled:opacity-30"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setBase(sumarMeses(base, 1))}
          aria-label="Mes siguiente"
          className="absolute top-0 right-0 grid size-8 place-items-center rounded-full text-primary-700 transition hover:bg-primary-50"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
        <div className="grid gap-6 sm:grid-cols-2">
          {Mes({ desplazamiento: 0 })}
          {Mes({ desplazamiento: 1 })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-primary-100 pt-3 text-xs text-muted">
        <p className="font-semibold text-primary-800">{foco === "entrada" || !entrada ? "Elegí la fecha de entrada" : "Ahora elegí la salida"}</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> Hoy
          </span>
          {sinLugar.size > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="text-muted/60 line-through" aria-hidden="true">
                12
              </span>{" "}
              Sin lugar
            </span>
          )}
          {(entrada || salida) && (
            <button
              type="button"
              onClick={() => onCambiar({ entrada: "", salida: "", foco: "entrada", completo: false })}
              className="font-bold text-primary-600 hover:underline"
            >
              Borrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
