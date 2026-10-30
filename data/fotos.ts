/**
 * FOTOS DE LA GALERÍA
 * Para sumar una foto: copiala en public/images/<carpeta>/ en formato .webp
 * (una versión grande y otra chica terminada en -sm.webp) y agregá una línea acá.
 * El orden de esta lista es el orden en la galería.
 */

export type CategoriaFoto = "1dorm" | "mostaza" | "exterior" | "zona";
export type Ambiente = "exterior" | "living" | "cocina" | "dormitorio" | "bano" | "deck" | "parrillero" | "playa";

export type Foto = {
  src: string;
  thumb: string;
  width: number;
  height: number;
  categoria: CategoriaFoto;
  ambiente: Ambiente;
  alt: string;
};

export const filtrosGaleria: { id: "todas" | CategoriaFoto; nombre: string }[] = [
  { id: "todas", nombre: "Todas" },
  { id: "1dorm", nombre: "Casas Roja, Azul y Verde" },
  { id: "mostaza", nombre: "Casa Mostaza" },
  { id: "exterior", nombre: "Exterior" },
  { id: "zona", nombre: "La playa y la zona" },
];

export const fotos: Foto[] = [
  { src: "/images/exterior/casas-colores.webp", thumb: "/images/exterior/casas-colores-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Casas contenedor roja, azul y verde con deck techado en Bello Horizonte" },
  { src: "/images/exterior/fila-casas.webp", thumb: "/images/exterior/fila-casas-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Las casas roja, azul y verde rodeadas de jardín en Bello Horizonte" },
  { src: "/images/exterior/casa-verde-deck.webp", thumb: "/images/exterior/casa-verde-deck-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Casa verde con deck techado y flores en Bello Horizonte" },
  { src: "/images/exterior/casa-verde-jardin.webp", thumb: "/images/exterior/casa-verde-jardin-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Casa verde y jardín con césped en Bello Horizonte" },
  { src: "/images/exterior/casa-verde-lateral.webp", thumb: "/images/exterior/casa-verde-lateral-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Vista lateral de la casa verde en Bello Horizonte" },
  { src: "/images/exterior/casa-roja-deck.webp", thumb: "/images/exterior/casa-roja-deck-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Casa roja con deck techado en Bello Horizonte" },
  { src: "/images/exterior/casa-azul.webp", thumb: "/images/exterior/casa-azul-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Casa azul rodeada de vegetación en Bello Horizonte" },
  { src: "/images/exterior/casa-azul-deck.webp", thumb: "/images/exterior/casa-azul-deck-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Deck techado de la casa azul en Bello Horizonte" },
  { src: "/images/exterior/atardecer.webp", thumb: "/images/exterior/atardecer-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Las casas al atardecer en Bello Horizonte" },
  { src: "/images/exterior/casa-verde-tarde.webp", thumb: "/images/exterior/casa-verde-tarde-sm.webp", width: 1600, height: 1056, categoria: "exterior", ambiente: "exterior", alt: "Casa verde con la luz de la tarde en Bello Horizonte" },
  { src: "/images/casas-1dorm/living-deck.webp", thumb: "/images/casas-1dorm/living-deck-sm.webp", width: 1200, height: 1600, categoria: "1dorm", ambiente: "living", alt: "Living con cama marinera y salida al deck" },
  { src: "/images/casas-1dorm/living.webp", thumb: "/images/casas-1dorm/living-sm.webp", width: 1200, height: 1600, categoria: "1dorm", ambiente: "living", alt: "Living y cocina integrada de una casa de 1 dormitorio" },
  { src: "/images/casas-1dorm/living-cocina.webp", thumb: "/images/casas-1dorm/living-cocina-sm.webp", width: 1200, height: 1600, categoria: "1dorm", ambiente: "living", alt: "Living con cama marinera y cocina" },
  { src: "/images/casas-1dorm/cocina.webp", thumb: "/images/casas-1dorm/cocina-sm.webp", width: 1200, height: 1600, categoria: "1dorm", ambiente: "cocina", alt: "Cocina completa con mesa para comer" },
  { src: "/images/casas-1dorm/dormitorio.webp", thumb: "/images/casas-1dorm/dormitorio-sm.webp", width: 1200, height: 1600, categoria: "1dorm", ambiente: "dormitorio", alt: "Dormitorio con cama de 2 plazas y aire acondicionado" },
  { src: "/images/casas-1dorm/bano.webp", thumb: "/images/casas-1dorm/bano-sm.webp", width: 1600, height: 1200, categoria: "1dorm", ambiente: "bano", alt: "Baño completo con ducha" },
  { src: "/images/casas-1dorm/bano-calefon.webp", thumb: "/images/casas-1dorm/bano-calefon-sm.webp", width: 1600, height: 1200, categoria: "1dorm", ambiente: "bano", alt: "Baño con calefón y ducha con mampara" },
  { src: "/images/casas-1dorm/deck-mesa.webp", thumb: "/images/casas-1dorm/deck-mesa-sm.webp", width: 1200, height: 1600, categoria: "1dorm", ambiente: "deck", alt: "Deck techado con mesa y sillas" },
  { src: "/images/casas-1dorm/deck-picada.webp", thumb: "/images/casas-1dorm/deck-picada-sm.webp", width: 1200, height: 1600, categoria: "1dorm", ambiente: "deck", alt: "Mesa en el deck lista para comer afuera" },
  { src: "/images/casas-1dorm/deck-parrillero.webp", thumb: "/images/casas-1dorm/deck-parrillero-sm.webp", width: 1200, height: 1600, categoria: "1dorm", ambiente: "deck", alt: "Deck techado con parrillero" },
  { src: "/images/mostaza/barbacoa.webp", thumb: "/images/mostaza/barbacoa-sm.webp", width: 1600, height: 1600, categoria: "mostaza", ambiente: "parrillero", alt: "Barbacoa vidriada con mesa para 6 en la casa Mostaza" },
  { src: "/images/mostaza/barbacoa-mesa.webp", thumb: "/images/mostaza/barbacoa-mesa-sm.webp", width: 1600, height: 1600, categoria: "mostaza", ambiente: "parrillero", alt: "Mesa de madera y sillas de mimbre en la barbacoa" },
  { src: "/images/mostaza/barbacoa-ventanales.webp", thumb: "/images/mostaza/barbacoa-ventanales-sm.webp", width: 1600, height: 1600, categoria: "mostaza", ambiente: "parrillero", alt: "Barbacoa con ventanales al jardín" },
  { src: "/images/mostaza/parrillero.webp", thumb: "/images/mostaza/parrillero-sm.webp", width: 900, height: 1600, categoria: "mostaza", ambiente: "parrillero", alt: "Parrillero dentro de la barbacoa" },
  { src: "/images/mostaza/living.webp", thumb: "/images/mostaza/living-sm.webp", width: 1600, height: 1600, categoria: "mostaza", ambiente: "living", alt: "Living con sillones y biblioteca en la casa Mostaza" },
  { src: "/images/mostaza/living-comedor.webp", thumb: "/images/mostaza/living-comedor-sm.webp", width: 1200, height: 1600, categoria: "mostaza", ambiente: "living", alt: "Living comedor de la casa Mostaza" },
  { src: "/images/mostaza/cocina.webp", thumb: "/images/mostaza/cocina-sm.webp", width: 1600, height: 1600, categoria: "mostaza", ambiente: "cocina", alt: "Cocina equipada de la casa Mostaza" },
  { src: "/images/mostaza/dormitorio.webp", thumb: "/images/mostaza/dormitorio-sm.webp", width: 1600, height: 1600, categoria: "mostaza", ambiente: "dormitorio", alt: "Dormitorio con cama de 2 plazas en la casa Mostaza" },
  { src: "/images/mostaza/bano.webp", thumb: "/images/mostaza/bano-sm.webp", width: 899, height: 1344, categoria: "mostaza", ambiente: "bano", alt: "Baño de la casa Mostaza" },
  { src: "/images/mostaza/pasillo.webp", thumb: "/images/mostaza/pasillo-sm.webp", width: 900, height: 1600, categoria: "mostaza", ambiente: "living", alt: "Pasillo con ventanales en la casa Mostaza" },
];
