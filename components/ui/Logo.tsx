type Props = {
  variante?: "azul" | "blanco";
  className?: string;
};

/** Contenedor de puerto visto en perspectiva, con la línea del horizonte. */
export function IconoContenedor({ color = "currentColor", className }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 44" className={className} aria-hidden="true" fill="none">
      {/* frente (puertas) */}
      <path d="M2 4 L20 6 L20 40 L2 42 Z" fill={color} />
      <path d="M7 5.5 V40.5 M12.5 6 V40 M16.5 6.3 V39.7" stroke="white" strokeOpacity=".55" strokeWidth="1.4" />
      {/* lateral */}
      <path d="M21.5 6.2 L62 11 L62 34 L21.5 39.8 Z" fill={color} fillOpacity=".86" />
      <path
        d="M26 7 V39 M30.5 7.5 V38.4 M35 8 V37.8 M39.5 8.6 V37.1 M44 9.1 V36.5 M48.5 9.6 V35.9 M53 10.1 V35.2 M57.5 10.6 V34.6"
        stroke="white"
        strokeOpacity=".4"
        strokeWidth="1.1"
      />
    </svg>
  );
}

export function Logo({ variante = "azul", className = "" }: Props) {
  const colorTexto = variante === "blanco" ? "text-white" : "text-primary-700";
  const colorIcono = variante === "blanco" ? "#ffffff" : "#1e5077";
  const linea = variante === "blanco" ? "bg-white/70" : "bg-primary-600/60";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <IconoContenedor color={colorIcono} className="h-9 w-auto shrink-0 sm:h-10" />
      <span className={`relative flex flex-col leading-none ${colorTexto}`}>
        <span className="font-script text-[1.35rem] sm:text-[1.5rem]">Posada</span>
        <span className={`my-0.5 block h-px w-full ${linea}`} />
        <span className="pl-3 font-script text-[1.35rem] sm:text-[1.5rem]">Horizonte</span>
      </span>
      <span className="sr-only">Posada Horizonte</span>
    </span>
  );
}
