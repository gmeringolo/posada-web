"use client";

import { useState, useSyncExternalStore } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import { diaDeshabilitado, elegirDia, primeraSinLugar, salidaValida, type Foco, type Rango } from "@/lib/calendario";
import type { ISODate } from "@/lib/fechas";

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

/** "YYYY-MM-DD" → Date local (el calendario trabaja con fechas locales). */
function aFecha(iso: ISODate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Date local → "YYYY-MM-DD". */
function aISO(f: Date): ISODate {
  return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, "0")}-${String(f.getDate()).padStart(2, "0")}`;
}

// Dos meses desde tablet, uno en celular
const consultaTablet = "(min-width: 40rem)";
function suscribirTablet(cb: () => void) {
  const mq = window.matchMedia(consultaTablet);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Calendario de la consulta de disponibilidad (react-day-picker), en lugar del selector del navegador.
 * Solo se resalta el día de hoy y las fechas elegidas; las noches sin lugar aparecen tachadas.
 * La lógica de qué se puede elegir está en lib/calendario.ts.
 */
export function Calendario({ entrada, salida, foco, hoy, sinLugar, onCambiar, onCerrar }: Props) {
  const [hover, setHover] = useState<ISODate | null>(null);
  const dosMeses = useSyncExternalStore(suscribirTablet, () => window.matchMedia(consultaTablet).matches, () => false);

  const rango = { entrada, salida };
  const tope = foco === "salida" && entrada ? primeraSinLugar(entrada, sinLugar) : null;
  // Fin del rango a pintar: la salida elegida o, mientras se elige, el día bajo el puntero
  const fin = salida || (foco === "salida" && hover && salidaValida(hover, entrada, tope) ? hover : "");
  const dia = (f: Date) => aISO(f);

  return (
    <div
      role="dialog"
      aria-label={foco === "entrada" || !entrada ? "Elegí la fecha de entrada" : "Elegí la fecha de salida"}
      onKeyDown={(e) => e.key === "Escape" && onCerrar()}
      onMouseLeave={() => setHover(null)}
      className="rounded-3xl bg-white p-3 text-ink shadow-soft ring-1 ring-primary-100 sm:p-5"
    >
      <DayPicker
        className="calendario"
        locale={es}
        numberOfMonths={dosMeses ? 2 : 1}
        defaultMonth={aFecha(entrada || hoy)}
        startMonth={aFecha(hoy)}
        disabled={(f) => diaDeshabilitado(dia(f), rango, foco, hoy, sinLugar, tope)}
        modifiers={{
          // Entrada sola: círculo lleno. Con fin: franja entre entrada y fin.
          range_start: (f) => !!entrada && dia(f) === entrada,
          range_end: (f) => (fin ? dia(f) === fin : !!entrada && dia(f) === entrada),
          range_middle: (f) => !!entrada && !!fin && dia(f) > entrada && dia(f) < fin,
          previa: (f) => !salida && !!fin && dia(f) === fin,
          sinLugar: (f) => sinLugar.has(dia(f)),
        }}
        modifiersClassNames={{ previa: "calendario-previa", sinLugar: "calendario-sin-lugar" }}
        onDayClick={(f, m) => {
          if (!m.disabled) onCambiar(elegirDia(dia(f), rango, foco, sinLugar));
        }}
        onDayMouseEnter={(f) => setHover(dia(f))}
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-primary-100 px-1 pt-3 text-xs text-muted">
        <p className="font-semibold text-primary-800">{foco === "entrada" || !entrada ? "Elegí la fecha de entrada" : "Ahora elegí la salida"}</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> Hoy
          </span>
          {sinLugar.size > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="text-muted/60 line-through" aria-hidden="true">
                12
              </span>
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
