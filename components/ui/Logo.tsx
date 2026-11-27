type Props = {
  variante?: "azul" | "blanco";
  /** "grande" para el footer y la página 404; el normal es para la barra de navegación. */
  tamano?: "normal" | "grande";
  className?: string;
};

/**
 * Logo original de Posada Horizonte (contenedor + "Posada Horizonte").
 * Imágenes en public/images/logo-azul.webp y logo-blanco.webp, hechas a partir del logo original.
 */
export function Logo({ variante = "azul", tamano = "normal", className = "" }: Props) {
  return (
    <img
      src={`/images/logo-${variante}.webp`}
      alt="Posada Horizonte"
      width={640}
      height={198}
      decoding="async"
      className={`block w-auto ${tamano === "grande" ? "h-12" : "h-9 sm:h-10"} ${className}`}
    />
  );
}
