/**
 * Utilidades de fechas sin zonas horarias.
 * Todas las fechas se manejan como texto "YYYY-MM-DD" y se calculan en UTC,
 * así un día nunca "se corre" por la hora del dispositivo.
 */

export type ISODate = string; // "YYYY-MM-DD"

const MS_DIA = 86_400_000;

export function aUTC(fecha: ISODate): number {
  const [y, m, d] = fecha.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function desdeUTC(ms: number): ISODate {
  return new Date(ms).toISOString().slice(0, 10);
}

export function sumarDias(fecha: ISODate, dias: number): ISODate {
  return desdeUTC(aUTC(fecha) + dias * MS_DIA);
}

/** Cantidad de noches entre entrada y salida (salida exclusiva). */
export function noches(entrada: ISODate, salida: ISODate): number {
  return Math.round((aUTC(salida) - aUTC(entrada)) / MS_DIA);
}

/** Lista de noches de una estadía: cada elemento es la fecha en que empieza esa noche. */
export function listaNoches(entrada: ISODate, salida: ISODate): ISODate[] {
  const n = noches(entrada, salida);
  return Array.from({ length: Math.max(0, n) }, (_, i) => sumarDias(entrada, i));
}

/** Día de la semana: 0 domingo … 6 sábado. */
export function diaSemana(fecha: ISODate): number {
  return new Date(aUTC(fecha)).getUTCDay();
}

/** "MM-DD" de una fecha. */
export function mesDia(fecha: ISODate): string {
  return fecha.slice(5, 10);
}

/** ¿La fecha cae dentro del rango "MM-DD" (inclusive)? El rango puede cruzar el año (ej. 12-20 → 01-31). */
export function enRangoAnual(fecha: ISODate, desde: string, hasta: string): boolean {
  const md = mesDia(fecha);
  if (desde <= hasta) return md >= desde && md <= hasta;
  return md >= desde || md <= hasta;
}

export function hoyISO(): ISODate {
  // Fecha local del visitante (Uruguay), no UTC.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function nombreMes(mes: number): string {
  return MESES[mes];
}

/** "vie 12 de diciembre" */
export function formatoLargo(fecha: ISODate): string {
  const [, m, d] = fecha.split("-").map(Number);
  return `${DIAS[diaSemana(fecha)].slice(0, 3)} ${d} de ${MESES[m - 1]}`;
}

/** "12/12/2026" */
export function formatoCorto(fecha: ISODate): string {
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}
