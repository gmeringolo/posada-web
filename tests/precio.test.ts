import { describe, expect, it } from "vitest";
import { calcularPrecio, formatoPrecio, precioDesde, type Promo, type Tarifa } from "@/lib/precio";
import { promos as promosSitio, tarifas as tarifasSitio } from "@/data/site";

const tarifas: Tarifa[] = [
  { tipo: "1dorm", nombre: "Fin de año y enero", desde: "12-20", hasta: "01-31", precioNoche: 70, moneda: "USD" },
  { tipo: "1dorm", nombre: "Febrero", desde: "02-01", hasta: "02-29", precioNoche: 60, moneda: "USD" },
  { tipo: "1dorm", nombre: "Marzo", desde: "03-01", hasta: "03-31", precioNoche: 50, moneda: "USD" },
  { tipo: "mostaza", nombre: "Enero", desde: "01-01", hasta: "01-31", precioNoche: 100, moneda: "USD", minimoNoches: 15 },
  { tipo: "mostaza", nombre: "Febrero", desde: "02-01", hasta: "02-29", precioNoche: 90, moneda: "USD", minimoNoches: 15 },
];

const promos: Promo[] = [
  { tipo: "1dorm", nombre: "Promo primavera", desde: "09-21", hasta: "12-19", noches: 2, precioTotal: 4500, moneda: "UYU", soloFinDeSemana: true },
];

describe("calcularPrecio", () => {
  it("estadía dentro de un solo mes", () => {
    const r = calcularPrecio("1dorm", "2027-02-10", "2027-02-15", tarifas, promos);
    expect(r).toMatchObject({ estado: "ok", total: 300, moneda: "USD", noches: 5 });
  });

  it("estadía que cruza enero y febrero suma cada tramo", () => {
    const r = calcularPrecio("1dorm", "2027-01-27", "2027-02-03", tarifas, promos);
    expect(r.estado).toBe("ok");
    if (r.estado !== "ok") return;
    expect(r.total).toBe(5 * 70 + 2 * 60);
    expect(r.desglose).toEqual([
      { periodo: "Fin de año y enero", noches: 5, precioNoche: 70, subtotal: 350 },
      { periodo: "Febrero", noches: 2, precioNoche: 60, subtotal: 120 },
    ]);
  });

  it("fin de año que cruza el año usa la misma tarifa", () => {
    const r = calcularPrecio("1dorm", "2026-12-28", "2027-01-04", tarifas, promos);
    expect(r).toMatchObject({ estado: "ok", total: 7 * 70, noches: 7 });
  });

  it("el día de salida no se cobra", () => {
    const r = calcularPrecio("1dorm", "2027-01-31", "2027-02-01", tarifas, promos);
    expect(r).toMatchObject({ estado: "ok", total: 70, noches: 1 });
  });

  it("promo primavera: viernes a domingo dentro del rango", () => {
    // 2 de octubre de 2026 es viernes
    const r = calcularPrecio("1dorm", "2026-10-02", "2026-10-04", tarifas, promos);
    expect(r).toMatchObject({ estado: "ok", total: 4500, moneda: "UYU", promo: "Promo primavera" });
  });

  it("promo primavera no aplica si no es viernes a domingo", () => {
    const r = calcularPrecio("1dorm", "2026-10-05", "2026-10-07", tarifas, promos);
    expect(r).toMatchObject({ estado: "consultar", motivo: "sin-tarifa" });
  });

  it("noches sin tarifa: precio a consultar", () => {
    const r = calcularPrecio("1dorm", "2027-03-28", "2027-04-03", tarifas, promos);
    expect(r).toMatchObject({ estado: "consultar", motivo: "sin-tarifa" });
  });

  it("nunca suma monedas distintas", () => {
    const mezcla: Tarifa[] = [
      { tipo: "1dorm", nombre: "A", desde: "05-01", hasta: "05-15", precioNoche: 10, moneda: "USD" },
      { tipo: "1dorm", nombre: "B", desde: "05-16", hasta: "05-31", precioNoche: 400, moneda: "UYU" },
    ];
    const r = calcularPrecio("1dorm", "2027-05-14", "2027-05-18", mezcla);
    expect(r).toMatchObject({ estado: "consultar", motivo: "monedas-distintas" });
  });

  it("Mostaza con menos de 15 noches muestra el mínimo", () => {
    const r = calcularPrecio("mostaza", "2027-01-05", "2027-01-12", tarifas, promos);
    expect(r).toMatchObject({ estado: "minimo", minimo: 15, noches: 7 });
  });

  it("Mostaza con 15 noches entre enero y febrero", () => {
    const r = calcularPrecio("mostaza", "2027-01-25", "2027-02-09", tarifas, promos);
    expect(r).toMatchObject({ estado: "ok", total: 7 * 100 + 8 * 90, noches: 15 });
  });

  it("fechas inválidas", () => {
    expect(calcularPrecio("1dorm", "2027-02-10", "2027-02-10", tarifas).estado).toBe("invalido");
    expect(calcularPrecio("1dorm", "2027-02-10", "2027-02-05", tarifas).estado).toBe("invalido");
  });

  it("las tarifas reales del sitio calculan bien una semana de enero", () => {
    const r = calcularPrecio("1dorm", "2027-01-10", "2027-01-17", tarifasSitio, promosSitio);
    expect(r).toMatchObject({ estado: "ok", total: 490, moneda: "USD" });
  });
});

describe("formatos", () => {
  it("formatea dólares y pesos", () => {
    expect(formatoPrecio(470, "USD")).toBe("US$ 470");
    expect(formatoPrecio(4500, "UYU")).toBe("$ 4.500");
  });

  it("precio desde", () => {
    expect(precioDesde("1dorm", tarifas)).toEqual({ precio: 50, moneda: "USD" });
    expect(precioDesde("mostaza", tarifas)).toEqual({ precio: 90, moneda: "USD" });
  });
});
