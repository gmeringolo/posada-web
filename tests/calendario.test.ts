import { describe, expect, it } from "vitest";
import { diaDeshabilitado, elegirDia, primeraSinLugar } from "@/lib/calendario";
import { nochesSinLugar, type Reserva } from "@/lib/disponibilidad";

const sinLugar = new Set(["2027-01-10", "2027-01-11"]);
const vacio = { entrada: "", salida: "" };

describe("calendario", () => {
  it("primer toque elige la entrada y pasa a la salida", () => {
    expect(elegirDia("2027-01-05", vacio, "entrada", sinLugar)).toEqual({ entrada: "2027-01-05", salida: "", foco: "salida", completo: false });
  });

  it("segundo toque posterior elige la salida", () => {
    const r = elegirDia("2027-01-08", { entrada: "2027-01-05", salida: "" }, "salida", sinLugar);
    expect(r).toMatchObject({ entrada: "2027-01-05", salida: "2027-01-08", completo: true });
  });

  it("se puede salir el día que empieza una noche sin lugar, pero no después", () => {
    const sel = { entrada: "2027-01-05", salida: "" };
    expect(elegirDia("2027-01-10", sel, "salida", sinLugar)).toMatchObject({ salida: "2027-01-10", completo: true });
    expect(diaDeshabilitado("2027-01-10", sel, "salida", "2027-01-01", sinLugar, "2027-01-10")).toBe(false);
    expect(diaDeshabilitado("2027-01-11", sel, "salida", "2027-01-01", sinLugar, "2027-01-10")).toBe(true);
    // después de la noche sin lugar se puede tocar, pero pasa a ser la nueva entrada
    expect(diaDeshabilitado("2027-01-13", sel, "salida", "2027-01-01", sinLugar, "2027-01-10")).toBe(false);
    expect(elegirDia("2027-01-13", sel, "salida", sinLugar)).toMatchObject({ entrada: "2027-01-13", salida: "", foco: "salida" });
  });

  it("tocar un día anterior a la entrada la reemplaza", () => {
    expect(elegirDia("2027-01-02", { entrada: "2027-01-05", salida: "" }, "salida", sinLugar)).toMatchObject({ entrada: "2027-01-02", salida: "", foco: "salida" });
  });

  it("no se puede entrar en una noche sin lugar ni en el pasado", () => {
    expect(elegirDia("2027-01-10", vacio, "entrada", sinLugar)).toMatchObject({ entrada: "", completo: false });
    expect(diaDeshabilitado("2027-01-10", vacio, "entrada", "2027-01-01", sinLugar, null)).toBe(true);
    expect(diaDeshabilitado("2026-12-31", vacio, "entrada", "2027-01-01", sinLugar, null)).toBe(true);
  });

  it("cambiar la entrada conserva la salida si sigue siendo válida", () => {
    expect(elegirDia("2027-01-03", { entrada: "2027-01-05", salida: "2027-01-08" }, "entrada", sinLugar)).toMatchObject({ entrada: "2027-01-03", salida: "2027-01-08", completo: true });
    expect(elegirDia("2027-01-09", { entrada: "2027-01-05", salida: "2027-01-08" }, "entrada", sinLugar)).toMatchObject({ entrada: "2027-01-09", salida: "" });
  });

  it("primeraSinLugar", () => {
    expect(primeraSinLugar("2027-01-05", sinLugar)).toBe("2027-01-10");
    expect(primeraSinLugar("2027-01-12", sinLugar, 30)).toBeNull();
  });

  it("nochesSinLugar: solo cuando las cuatro casas están ocupadas", () => {
    const reservas: Reserva[] = [
      { casa: "roja", inicio: "2027-01-01", fin: "2027-01-04" },
      { casa: "azul", inicio: "2027-01-01", fin: "2027-01-04" },
      { casa: "verde", inicio: "2027-01-02", fin: "2027-01-04" },
      { casa: "mostaza", inicio: "2027-01-01", fin: "2027-01-03" },
    ];
    expect([...nochesSinLugar("2027-01-01", "2027-01-05", reservas)]).toEqual(["2027-01-02"]);
  });
});
