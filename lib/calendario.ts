import { sumarDias, type ISODate } from "./fechas";

/**
 * Lógica del calendario de la consulta de disponibilidad (sin React, para poder testearla).
 * Las noches sin lugar no se pueden elegir como entrada ni quedar dentro de la estadía,
 * pero sí pueden ser el día de salida (ese día se libera la casa).
 */

export type Rango = { entrada: ISODate; salida: ISODate };
export type Foco = "entrada" | "salida";

/** Primera noche sin lugar a partir de `desde` (o null si no hay en los próximos `limite` días). */
export function primeraSinLugar(desde: ISODate, sinLugar: Set<ISODate>, limite = 540): ISODate | null {
  if (!sinLugar.size) return null;
  for (let i = 0; i < limite; i++) {
    const d = sumarDias(desde, i);
    if (sinLugar.has(d)) return d;
  }
  return null;
}

/** ¿Ese día sirve como salida para la entrada elegida? (no deja ninguna noche sin lugar adentro) */
export function salidaValida(dia: ISODate, entrada: ISODate, tope: ISODate | null): boolean {
  return !!entrada && dia > entrada && (tope === null || dia <= tope);
}

/**
 * ¿Ese día no se puede tocar? Pasado o sin lugar; mientras se elige la salida, una noche sin lugar
 * igual se puede tocar si sirve como día de salida.
 * (Un día posterior a una noche sin lugar sí se puede tocar: pasa a ser la nueva entrada.)
 */
export function diaDeshabilitado(dia: ISODate, rango: Rango, foco: Foco, hoy: ISODate, sinLugar: Set<ISODate>, tope: ISODate | null): boolean {
  if (hoy && dia < hoy) return true;
  if (foco === "salida" && salidaValida(dia, rango.entrada, tope)) return false;
  return sinLugar.has(dia);
}

/** Resultado de tocar un día: el nuevo rango, a qué campo pasa el foco y si ya está completo. */
export function elegirDia(dia: ISODate, rango: Rango, foco: Foco, sinLugar: Set<ISODate>): Rango & { foco: Foco; completo: boolean } {
  if (foco === "salida" && rango.entrada && dia > rango.entrada) {
    const tope = primeraSinLugar(rango.entrada, sinLugar);
    if (tope === null || dia <= tope) return { entrada: rango.entrada, salida: dia, foco: "entrada", completo: true };
  }
  if (sinLugar.has(dia)) return { ...rango, foco, completo: false };
  // Nueva entrada: se conserva la salida solo si sigue siendo válida
  const tope = primeraSinLugar(dia, sinLugar);
  const salidaValida = rango.salida && rango.salida > dia && (tope === null || rango.salida <= tope);
  return salidaValida
    ? { entrada: dia, salida: rango.salida, foco: "entrada", completo: true }
    : { entrada: dia, salida: "", foco: "salida", completo: false };
}
