import { diaSemana, enRangoAnual, listaNoches, noches, type ISODate } from "./fechas";

export type Moneda = "USD" | "UYU";
export type Tipo = "1dorm" | "mostaza";

export type Tarifa = {
  tipo: Tipo;
  nombre: string; // "Enero", "Fin de año y enero"…
  fechas?: string; // texto opcional con las fechas, ej. "23/12 al 31/01"
  desde: string; // "MM-DD", inclusive
  hasta: string; // "MM-DD", inclusive (puede cruzar el año)
  precioNoche: number;
  moneda: Moneda;
  minimoNoches?: number;
  temporadaAlta?: boolean;
};

export type Promo = {
  tipo: Tipo;
  nombre: string;
  desde: string; // "MM-DD"
  hasta: string; // "MM-DD"
  noches: number;
  precioTotal: number;
  moneda: Moneda;
  soloFinDeSemana: boolean; // entrada viernes, salida domingo
};

export type TramoPrecio = { periodo: string; noches: number; precioNoche: number; subtotal: number };

export type ResultadoPrecio =
  | { estado: "ok"; total: number; moneda: Moneda; desglose: TramoPrecio[]; promo?: string; noches: number }
  | { estado: "consultar"; motivo: "sin-tarifa" | "monedas-distintas"; noches: number }
  | { estado: "minimo"; minimo: number; noches: number }
  | { estado: "invalido"; noches: number };

/**
 * Calcula el precio estimado de una estadía, noche por noche.
 * - Cada noche toma el precio del período en que cae (la noche del día de salida no se cobra).
 * - Si alguna noche no tiene tarifa o se mezclan monedas: "a consultar" (nunca se inventa un precio).
 * - La promo aplica si la estadía coincide exactamente con sus condiciones.
 */
export function calcularPrecio(
  tipo: Tipo,
  entrada: ISODate,
  salida: ISODate,
  tarifas: Tarifa[],
  promos: Promo[] = [],
): ResultadoPrecio {
  const n = noches(entrada, salida);
  if (!entrada || !salida || n <= 0) return { estado: "invalido", noches: Math.max(0, n) };

  const delTipo = tarifas.filter((t) => t.tipo === tipo);
  const minimo = Math.max(0, ...delTipo.map((t) => t.minimoNoches ?? 0));
  if (minimo > 0 && n < minimo) return { estado: "minimo", minimo, noches: n };

  // Promo (ej. fin de semana de 2 noches, viernes a domingo)
  for (const p of promos.filter((p) => p.tipo === tipo)) {
    const coincideNoches = n === p.noches;
    const finde = !p.soloFinDeSemana || (diaSemana(entrada) === 5 && diaSemana(salida) === 0);
    const enRango = listaNoches(entrada, salida).every((d) => enRangoAnual(d, p.desde, p.hasta));
    if (coincideNoches && finde && enRango) {
      return {
        estado: "ok",
        total: p.precioTotal,
        moneda: p.moneda,
        desglose: [{ periodo: p.nombre, noches: n, precioNoche: p.precioTotal / n, subtotal: p.precioTotal }],
        promo: p.nombre,
        noches: n,
      };
    }
  }

  const desglose: TramoPrecio[] = [];
  let moneda: Moneda | null = null;
  for (const noche of listaNoches(entrada, salida)) {
    const t = delTipo.find((t) => enRangoAnual(noche, t.desde, t.hasta));
    if (!t) return { estado: "consultar", motivo: "sin-tarifa", noches: n };
    if (moneda && moneda !== t.moneda) return { estado: "consultar", motivo: "monedas-distintas", noches: n };
    moneda = t.moneda;
    const ultimo = desglose[desglose.length - 1];
    if (ultimo && ultimo.periodo === t.nombre && ultimo.precioNoche === t.precioNoche) {
      ultimo.noches += 1;
      ultimo.subtotal += t.precioNoche;
    } else {
      desglose.push({ periodo: t.nombre, noches: 1, precioNoche: t.precioNoche, subtotal: t.precioNoche });
    }
  }

  const total = desglose.reduce((s, d) => s + d.subtotal, 0);
  return { estado: "ok", total, moneda: moneda ?? "USD", desglose, noches: n };
}

/** "US$ 470" o "$ 4.500" */
export function formatoPrecio(monto: number, moneda: Moneda): string {
  const n = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(monto);
  return moneda === "USD" ? `US$ ${n}` : `$ ${n}`;
}

/** Precio por noche más bajo de un tipo de casa (para "desde US$ X"). */
export function precioDesde(tipo: Tipo, tarifas: Tarifa[]): { precio: number; moneda: Moneda } | null {
  const lista = tarifas.filter((t) => t.tipo === tipo);
  if (!lista.length) return null;
  const min = lista.reduce((a, b) => (b.precioNoche < a.precioNoche ? b : a));
  return { precio: min.precioNoche, moneda: min.moneda };
}

/** Texto del desglose: "5 noches de enero × US$ 70 + 2 noches de febrero × US$ 60" */
export function textoDesglose(r: Extract<ResultadoPrecio, { estado: "ok" }>): string {
  if (r.promo) return `${r.promo}: ${r.noches} noches`;
  return r.desglose
    .map((d) => `${d.noches} ${d.noches === 1 ? "noche" : "noches"} (${d.periodo}) × ${formatoPrecio(d.precioNoche, r.moneda)}`)
    .join(" + ");
}
