import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type Variante = "primario" | "acento" | "contorno" | "contorno-claro" | "whatsapp" | "suave";
type Tamano = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTES: Record<Variante, string> = {
  primario: "bg-primary-600 text-white shadow-card hover:bg-primary-700",
  acento: "bg-accent text-ink shadow-card hover:bg-accent-hover",
  contorno: "border-2 border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white",
  "contorno-claro": "border-2 border-white/90 text-white hover:bg-white hover:text-primary-800",
  whatsapp: "bg-whatsapp-dark text-white shadow-card hover:bg-[#0b6635]",
  suave: "bg-primary-50 text-primary-700 hover:bg-primary-100",
};

const TAMANOS: Record<Tamano, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-[0.95rem]",
  lg: "px-7 py-4 text-base",
};

export function clasesBoton(variante: Variante = "primario", tamano: Tamano = "md", extra = "") {
  return `${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${extra}`;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variante?: Variante;
  tamano?: Tamano;
  children: ReactNode;
  externo?: boolean;
};

export function BotonLink({ variante, tamano, className = "", externo, children, ...rest }: LinkProps) {
  const ext = externo ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={clasesBoton(variante, tamano, className)} {...ext} {...rest}>
      {children}
    </a>
  );
}

type BotonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; tamano?: Tamano; children: ReactNode };

export function Boton({ variante, tamano, className = "", children, type = "button", ...rest }: BotonProps) {
  return (
    <button type={type} className={clasesBoton(variante, tamano, className)} {...rest}>
      {children}
    </button>
  );
}
