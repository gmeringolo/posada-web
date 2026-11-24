type Props = {
  variante?: "azul" | "blanco";
  className?: string;
};

/**
 * Logo original de Posada Horizonte (contenedor + "Posada Horizonte").
 * Imágenes en public/images/logo-azul.webp y logo-blanco.webp, hechas a partir del logo original.
 */
export function Logo({ variante = "azul", className = "" }: Props) {
  return (
    <img
      src={`/images/logo-${variante}.webp`}
      alt="Posada Horizonte"
      width={544}
      height={168}
      decoding="async"
      className={`block h-11 w-auto sm:h-[3.25rem] ${className}`}
    />
  );
}
