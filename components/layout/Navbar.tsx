"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const LINKS = [
  { href: "#casas", texto: "Casas" },
  { href: "#galeria", texto: "Galería" },
  { href: "#opiniones", texto: "Opiniones" },
  { href: "#tarifas", texto: "Tarifas" },
  { href: "#disponibilidad", texto: "Disponibilidad" },
  { href: "#zona", texto: "La zona" },
];

export function Navbar({ conOpiniones }: { conOpiniones: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState("");

  const links = LINKS.filter((l) => conOpiniones || l.href !== "#opiniones");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resalta la sección visible
  useEffect(() => {
    const ids = [...LINKS.map((l) => l.href.slice(1)), "contacto"];
    const secciones = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiva(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secciones.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Bloquea el scroll con el menú abierto
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  const solido = scrolled || abierto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solido ? "bg-white/95 shadow-[0_2px_20px_-8px_rgb(12_29_44/0.25)] backdrop-blur" : "bg-gradient-to-b from-primary-950/50 to-transparent"
      }`}
    >
      <nav className="contenedor flex h-[72px] items-center justify-between gap-4" aria-label="Principal">
        <a href="#inicio" className="shrink-0" aria-label="Posada Horizonte, ir al inicio" onClick={() => setAbierto(false)}>
          <Logo variante={solido ? "azul" : "blanco"} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const esActiva = activa === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={esActiva ? "true" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition ${
                    solido
                      ? esActiva
                        ? "bg-primary-50 text-primary-700"
                        : "text-ink/80 hover:text-primary-700"
                      : esActiva
                        ? "bg-white/15 text-white"
                        : "text-white/90 hover:text-white"
                  }`}
                >
                  {l.texto}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contacto"
            onClick={() => setAbierto(false)}
            className={`rounded-full px-4 py-2 text-sm font-bold shadow-card transition sm:px-5 sm:py-2.5 sm:text-[0.95rem] ${
              solido ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-white text-primary-700 hover:bg-primary-50"
            }`}
          >
            Contacto
          </a>
          <button
            type="button"
            className={`grid size-11 place-items-center rounded-full lg:hidden ${solido ? "text-primary-800 hover:bg-primary-50" : "text-white hover:bg-white/15"}`}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Menú mobile */}
      <div
        id="menu-movil"
        className={`overflow-hidden bg-white transition-[max-height] duration-300 lg:hidden ${abierto ? "max-h-[calc(100dvh-72px)] border-t border-primary-50" : "max-h-0"}`}
      >
        <ul className="contenedor flex flex-col py-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setAbierto(false)}
                className="block rounded-xl px-3 py-3.5 text-lg font-semibold text-ink hover:bg-primary-50"
              >
                {l.texto}
              </a>
            </li>
          ))}
          <li className="mt-2 mb-3">
            <a
              href="#contacto"
              onClick={() => setAbierto(false)}
              className="block rounded-full bg-primary-600 px-5 py-3.5 text-center text-lg font-bold text-white"
            >
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
