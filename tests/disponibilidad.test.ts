import { describe, expect, it } from "vitest";
import {
  casasLibres,
  diasOcupados,
  estaLibre,
  fechasLibresCercanas,
  normalizarReservas,
  type Reserva,
} from "@/lib/disponibilidad";

const reservas: Reserva[] = [
  { casa: "roja", inicio: "2027-01-10", fin: "2027-01-15" },
  { casa: "azul", inicio: "2027-01-10", fin: "2027-01-20" },
  { casa: "verde", inicio: "2027-01-12", fin: "2027-01-14" },
  { casa: "mostaza", inicio: "2027-01-01", fin: "2027-01-31" },
];

describe("estaLibre", () => {
  it("detecta superposición", () => {
    expect(estaLibre("roja", "2027-01-12", "2027-01-18", reservas)).toBe(false);
  });

  it("una reserva puede empezar el día que termina otra", () => {
    expect(estaLibre("roja", "2027-01-15", "2027-01-18", reservas)).toBe(true);
    expect(estaLibre("roja", "2027-01-05", "2027-01-10", reservas)).toBe(true);
  });
});

describe("casasLibres", () => {
  it("cuenta casas libres de 1 dormitorio", () => {
    expect(casasLibres("1dorm", "2027-01-15", "2027-01-17", reservas)).toEqual(["roja", "verde"]);
    expect(casasLibres("1dorm", "2027-01-12", "2027-01-13", reservas)).toEqual([]);
  });

  it("Mostaza ocupada todo enero", () => {
    expect(casasLibres("mostaza", "2027-01-05", "2027-01-25", reservas)).toEqual([]);
    expect(casasLibres("mostaza", "2027-01-31", "2027-02-15", reservas)).toEqual(["mostaza"]);
  });
});

describe("diasOcupados", () => {
  it("1 dormitorio: ocupado solo si las 3 están ocupadas", () => {
    const dias = diasOcupados("1dorm", 2027, 0, reservas);
    expect([...dias].sort()).toEqual(["2027-01-12", "2027-01-13"]);
  });

  it("Mostaza: noches de la reserva, sin el día de salida", () => {
    const dias = diasOcupados("mostaza", 2027, 0, reservas);
    expect(dias.size).toBe(30);
    expect(dias.has("2027-01-31")).toBe(false);
  });
});

describe("fechasLibresCercanas", () => {
  it("sugiere las fechas libres más cercanas", () => {
    const sug = fechasLibresCercanas("1dorm", "2027-01-12", 2, reservas, { max: 2 });
    expect(sug[0]).toEqual({ entrada: "2027-01-14", salida: "2027-01-16", libres: 1 });
    expect(sug.length).toBe(2);
  });

  it("no sugiere fechas antes del mínimo", () => {
    const sug = fechasLibresCercanas("1dorm", "2027-01-12", 2, reservas, { minimo: "2027-01-12" });
    sug.forEach((s) => expect(s.entrada >= "2027-01-12").toBe(true));
  });
});

describe("normalizarReservas", () => {
  it("descarta filas inválidas", () => {
    const r = normalizarReservas([
      { casa: "roja", inicio: "2027-01-01", fin: "2027-01-03" },
      { casa: "otra", inicio: "2027-01-01", fin: "2027-01-03" },
      { casa: "azul" },
      null,
    ]);
    expect(r).toEqual([{ casa: "roja", inicio: "2027-01-01", fin: "2027-01-03" }]);
  });
});
