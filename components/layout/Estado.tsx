"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CategoriaFoto } from "@/data/fotos";
import type { TipoCasa } from "@/data/site";

/** Datos de una consulta que viajan entre secciones (Tarifas → Disponibilidad → Contacto). */
export type Consulta = {
  entrada?: string;
  salida?: string;
  personas?: number;
  tipo?: TipoCasa;
  casa?: string;
  precio?: string;
};

type Estado = {
  consulta: Consulta;
  actualizarConsulta: (c: Consulta) => void;
  /** Carga datos en el formulario de Contacto (lo vuelve a montar con esos valores). */
  precargarFormulario: (c: Consulta) => void;
  versionFormulario: number;
  filtroGaleria: "todas" | CategoriaFoto;
  setFiltroGaleria: (f: "todas" | CategoriaFoto) => void;
  irA: (id: string) => void;
};

const Ctx = createContext<Estado | null>(null);

export function EstadoProvider({ children }: { children: ReactNode }) {
  const [consulta, setConsulta] = useState<Consulta>({});
  const [filtroGaleria, setFiltroGaleria] = useState<"todas" | CategoriaFoto>("todas");
  const [versionFormulario, setVersionFormulario] = useState(0);

  const actualizarConsulta = useCallback((c: Consulta) => setConsulta((prev) => ({ ...prev, ...c })), []);
  const precargarFormulario = useCallback((c: Consulta) => {
    setConsulta((prev) => ({ ...prev, ...c }));
    setVersionFormulario((v) => v + 1);
  }, []);
  const irA = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const valor = useMemo(
    () => ({ consulta, actualizarConsulta, precargarFormulario, versionFormulario, filtroGaleria, setFiltroGaleria, irA }),
    [consulta, actualizarConsulta, precargarFormulario, versionFormulario, filtroGaleria, irA],
  );

  // Aparición suave de los elementos con la clase .aparecer
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".aparecer");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useEstado(): Estado {
  const v = useContext(Ctx);
  if (!v) throw new Error("useEstado fuera de EstadoProvider");
  return v;
}
