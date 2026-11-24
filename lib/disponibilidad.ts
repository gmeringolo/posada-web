import { aUTC, listaNoches, sumarDias, type ISODate } from "./fechas";

export type CasaId = "roja" | "azul" | "verde" | "mostaza";
export type Tipo = "1dorm" | "mostaza";

/** Una reserva tal como la devuelve la función pública de Supabase: solo casa y fechas. */
export type Reserva = { casa: CasaId; inicio: ISODate; fin: ISODate };

export const CASAS_POR_TIPO: Record<Tipo, CasaId[]> = {
  "1dorm": ["roja", "azul", "verde"],
  mostaza: ["mostaza"],
};

/**
 * ¿La casa está libre entre entrada y salida?
 * Hay superposición si inicio < salida && fin > entrada.
 * El día de salida de una reserva puede ser el de entrada de la siguiente.
 */
export function estaLibre(casa: CasaId, entrada: ISODate, salida: ISODate, reservas: Reserva[]): boolean {
  return !reservas.some((r) => r.casa === casa && r.inicio < salida && r.fin > entrada);
}

/** Casas libres de un tipo para esas fechas. */
export function casasLibres(tipo: Tipo, entrada: ISODate, salida: ISODate, reservas: Reserva[]): CasaId[] {
  return CASAS_POR_TIPO[tipo].filter((c) => estaLibre(c, entrada, salida, reservas));
}

/** ¿Esa noche (fecha de entrada de la noche) está ocupada la casa? */
function nocheOcupada(casa: CasaId, noche: ISODate, reservas: Reserva[]): boolean {
  return reservas.some((r) => r.casa === casa && r.inicio <= noche && r.fin > noche);
}

/**
 * Noches ocupadas de un mes para un tipo de casa.
 * Para las casas de 1 dormitorio, una noche figura ocupada solo si LAS TRES están ocupadas.
 * `mes` es 0–11.
 */
export function diasOcupados(tipo: Tipo, anio: number, mes: number, reservas: Reserva[]): Set<ISODate> {
  const primero = `${anio}-${String(mes + 1).padStart(2, "0")}-01`;
  const siguiente = mes === 11 ? `${anio + 1}-01-01` : `${anio}-${String(mes + 2).padStart(2, "0")}-01`;
  const ocupados = new Set<ISODate>();
  for (const noche of listaNoches(primero, siguiente)) {
    if (CASAS_POR_TIPO[tipo].every((c) => nocheOcupada(c, noche, reservas))) ocupados.add(noche);
  }
  return ocupados;
}

/**
 * Busca las fechas libres más cercanas con la misma cantidad de noches,
 * moviendo la entrada hasta `rango` días antes o después (sin pasar de `minimo`).
 * Devuelve hasta `max` opciones ordenadas por cercanía.
 */
export function fechasLibresCercanas(
  tipo: Tipo,
  entrada: ISODate,
  cantNoches: number,
  reservas: Reserva[],
  opciones: { rango?: number; max?: number; minimo?: ISODate } = {},
): { entrada: ISODate; salida: ISODate; libres: number }[] {
  const { rango = 30, max = 2, minimo } = opciones;
  const resultado: { entrada: ISODate; salida: ISODate; libres: number }[] = [];
  for (let d = 1; d <= rango && resultado.length < max; d++) {
    for (const delta of [d, -d]) {
      const e = sumarDias(entrada, delta);
      if (minimo && aUTC(e) < aUTC(minimo)) continue;
      const s = sumarDias(e, cantNoches);
      const libres = casasLibres(tipo, e, s, reservas).length;
      if (libres > 0 && resultado.length < max) resultado.push({ entrada: e, salida: s, libres });
    }
  }
  return resultado;
}

/** Normaliza lo que llega de Supabase (descarta filas inválidas). */
export function normalizarReservas(data: unknown): Reserva[] {
  if (!Array.isArray(data)) return [];
  const validas: CasaId[] = ["roja", "azul", "verde", "mostaza"];
  return data.flatMap((r) => {
    if (!r || typeof r !== "object") return [];
    const { casa, inicio, fin } = r as Record<string, unknown>;
    if (typeof casa !== "string" || !validas.includes(casa as CasaId)) return [];
    if (typeof inicio !== "string" || typeof fin !== "string") return [];
    return [{ casa: casa as CasaId, inicio: inicio.slice(0, 10), fin: fin.slice(0, 10) }];
  });
}

/**
 * Consulta la función pública `disponibilidad` de Supabase.
 * Solo devuelve casa y fechas: nunca datos de huéspedes.
 */
export async function obtenerReservas(
  config: { url: string; anonKey: string },
  desde: ISODate,
  hasta: ISODate,
  signal?: AbortSignal,
): Promise<Reserva[]> {
  if (!config.url || !config.anonKey) throw new Error("Supabase sin configurar");
  const res = await fetch(`${config.url.replace(/\/$/, "")}/rest/v1/rpc/disponibilidad`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ desde, hasta }),
    signal,
  });
  if (!res.ok) throw new Error(`Supabase respondió ${res.status}`);
  return normalizarReservas(await res.json());
}
