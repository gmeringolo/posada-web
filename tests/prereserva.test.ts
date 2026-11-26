import { afterEach, describe, expect, it, vi } from "vitest";
import { solicitarReserva, type PedidoReserva } from "@/lib/disponibilidad";

const config = { url: "https://ejemplo.supabase.co/", anonKey: "clave" };
const pedido: PedidoReserva = {
  tipo: "1dorm",
  entrada: "2027-01-10",
  salida: "2027-01-12",
  nombre: "Juan Pérez",
  telefono: "099 123 456",
  adultos: 2,
  menores: 1,
  mascotas: 0,
  moneda: "USD",
  total: 100,
};

function respuesta(status: number, cuerpo: unknown) {
  return vi.fn().mockResolvedValue(new Response(JSON.stringify(cuerpo), { status }));
}

afterEach(() => vi.unstubAllGlobals());

describe("solicitarReserva", () => {
  it("devuelve la casa asignada y manda los datos a la función de Supabase", async () => {
    const fetch = respuesta(200, "verde");
    vi.stubGlobal("fetch", fetch);
    expect(await solicitarReserva(config, pedido)).toEqual({ estado: "ok", casa: "verde" });
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("https://ejemplo.supabase.co/rest/v1/rpc/solicitar_reserva");
    expect(JSON.parse(init.body)).toMatchObject({ p_tipo: "1dorm", p_inicio: "2027-01-10", p_fin: "2027-01-12", p_ninos: 1, p_total: 100, p_comentarios: null });
  });

  it("sin lugar cuando otra persona pidió antes (PH020)", async () => {
    vi.stubGlobal("fetch", respuesta(400, { code: "PH020", message: "No hay casas libres en esas fechas" }));
    expect(await solicitarReserva(config, pedido)).toEqual({ estado: "sin-lugar" });
  });

  it("error técnico ante cualquier otra falla", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", respuesta(404, { code: "PGRST202" }));
    expect(await solicitarReserva(config, pedido)).toEqual({ estado: "error" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("sin red")));
    expect(await solicitarReserva(config, pedido)).toEqual({ estado: "error" });
  });
});
