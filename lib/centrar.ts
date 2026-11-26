/** Alto de la barra de navegación fija. */
const ALTO_NAVBAR = 72;

/**
 * Lleva un elemento al centro de la pantalla, descontando la barra de navegación fija.
 * Si no entra completo, lo deja arriba (justo debajo de la barra) para que se lea desde el principio.
 * Espera dos frames para que el contenido nuevo ya esté dibujado antes de medir.
 */
export function centrarEnPantalla(el: HTMLElement | null) {
  if (!el) return;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const caja = el.getBoundingClientRect();
      const visible = window.innerHeight - ALTO_NAVBAR;
      const margen = caja.height < visible ? (visible - caja.height) / 2 : 12;
      const destino = window.scrollY + caja.top - ALTO_NAVBAR - margen;
      const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, destino), behavior: reducir ? "auto" : "smooth" });
    }),
  );
}
