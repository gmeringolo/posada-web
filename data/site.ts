/**
 * CONTENIDO DE LA WEB
 * --------------------------------------------------------------
 * Todo lo que se ve en la web sale de este archivo.
 * Para cambiar un texto, un precio, una opinión o una pregunta frecuente,
 * editá este archivo y subí el cambio: Netlify publica solo.
 *
 * Regla general: si un dato está vacío ("" o lista vacía), el bloque
 * correspondiente NO se muestra en la web. Así nunca aparece información a medias.
 * Los datos marcados con "TODO confirmar" están pendientes.
 */

import type { Promo, Tarifa } from "@/lib/precio";

/* ------------------------------------------------------------------ */
/* Datos generales                                                     */
/* ------------------------------------------------------------------ */

export const negocio = {
  nombre: "Posada Horizonte",
  url: "https://posadahorizonteuy.com",
  // Un único número para toda la web
  telefonoVisible: "096 269 002",
  telefonoInternacional: "+59896269002",
  whatsapp: "59896269002",
  direccion: "Av. 3 esq. Rambla",
  localidad: "Bello Horizonte",
  departamento: "Canelones",
  pais: "UY",
  codigoPostal: "16203",
  coordenadas: { lat: -34.7749375, lng: -55.6438125 },
  email: "", // TODO confirmar: email de contacto público (opcional)
};

export const enlaces = {
  googleMaps: "https://maps.app.goo.gl/j3tj24Wzw9FqBkm8A",
  mapaEmbed:
    "https://maps.google.com/maps?q=Posada%20Horizonte%2C%20Bello%20Horizonte%2C%20Canelones&ll=-34.7749375,-55.6438125&z=16&hl=es&output=embed",
  comoLlegar: "https://www.google.com/maps/dir/?api=1&destination=-34.7749375,-55.6438125",
  // TODO confirmar: link de "Pedir opiniones" del Perfil de Empresa de Google
  escribirOpinionGoogle: "",
  instagram: "https://www.instagram.com/posadahorizonte/", // TODO confirmar que siga activo
  facebook: "https://www.facebook.com/posadahorizonte", // TODO confirmar que siga activo
  airbnb: "https://www.airbnb.com.ar/rooms/707961511570571728", // TODO confirmar que siga activo
  appReservas: "https://reservas.posadahorizonteuy.com",
};

/** Mensaje que se precarga al abrir WhatsApp desde los botones generales. */
export const mensajeWhatsAppGeneral =
  "Hola! Quiero consultar disponibilidad. Fecha de entrada: … Fecha de salida: … Cantidad de personas: …";

/* ------------------------------------------------------------------ */
/* Supabase (consulta de disponibilidad)                               */
/* La clave "anon" es pública por diseño (la usa también la app).      */
/* Se pueden reemplazar con variables de entorno en Netlify.           */
/* ------------------------------------------------------------------ */

export const supabase = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gcxarqjzqpfwzhrkvlir.supabase.co",
  anonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjeGFycWp6cXBmd3pocmt2bGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTY4MTUsImV4cCI6MjEwODQzMjgxNX0.INWCgPQl2uWrcR8FE4lyB-esvlpShJaOxAct78EzKjY",
};

/* ------------------------------------------------------------------ */
/* Casas                                                               */
/* ------------------------------------------------------------------ */

export type TipoCasa = "1dorm" | "mostaza";
export type CasaId = "roja" | "azul" | "verde" | "mostaza";

export const casas: { id: CasaId; nombre: string; tipo: TipoCasa; color: string }[] = [
  { id: "roja", nombre: "Roja", tipo: "1dorm", color: "#C8372D" },
  { id: "azul", nombre: "Azul", tipo: "1dorm", color: "#1F63C6" },
  { id: "verde", nombre: "Verde", tipo: "1dorm", color: "#3C9A3C" },
  { id: "mostaza", nombre: "Mostaza", tipo: "mostaza", color: "#D9A21B" },
];

export const tiposDeCasa: Record<
  TipoCasa,
  {
    titulo: string;
    subtitulo: string;
    resumen: string[];
    camas: string[];
    descripcion: string;
    foto: string;
    fotoAlt: string;
  }
> = {
  "1dorm": {
    titulo: "Casas Roja, Azul y Verde",
    subtitulo: "Tres casas iguales por dentro",
    resumen: ["1 dormitorio", "Hasta 4 personas", "50 m² techados"],
    camas: ["Dormitorio: cama de 2 plazas (140 × 180)", "Living: cama marinera"],
    descripcion:
      "Casas independientes con cocina integrada, aire acondicionado en el dormitorio y deck techado con parrillero propio.",
    foto: "/images/exterior/casas-colores-sm.webp",
    fotoAlt: "Casas roja, azul y verde con deck techado",
  },
  mostaza: {
    titulo: "Casa Mostaza",
    subtitulo: "La más amplia, con barbacoa vidriada",
    resumen: ["2 dormitorios", "Hasta 4 personas", "Estadía mínima 15 noches"],
    camas: ["Dormitorio 1: cama de 2 plazas", "Dormitorio 2: cama marinera"],
    descripcion:
      "Living con biblioteca, cocina equipada y una barbacoa vidriada con parrillero y mesa para 6, rodeada de verde.",
    foto: "/images/mostaza/barbacoa-sm.webp",
    fotoAlt: "Barbacoa vidriada con mesa de madera en la casa Mostaza",
  },
};

/* ------------------------------------------------------------------ */
/* Comodidades                                                         */
/* El campo `icono` es el nombre de un ícono de lucide-react.          */
/* ------------------------------------------------------------------ */

export const comodidades: { icono: string; titulo: string; detalle?: string; destacada?: boolean }[] = [
  { icono: "Waves", titulo: "A media cuadra de la playa", destacada: true },
  { icono: "PawPrint", titulo: "Aceptamos mascotas", detalle: "Son parte de la familia", destacada: true },
  { icono: "CalendarCheck", titulo: "Abierto todo el año", destacada: true },
  { icono: "Bath", titulo: "Baño completo con calefón" },
  {
    icono: "CookingPot",
    titulo: "Cocina completa",
    detalle: "Vajilla para 6, cocina a gas, heladera con freezer, microondas y jarra eléctrica",
  },
  { icono: "AirVent", titulo: "Aire acondicionado en el dormitorio" },
  { icono: "Tv", titulo: "TV cable (DirecTV)" },
  { icono: "Wifi", titulo: "Wi-Fi" },
  { icono: "Flame", titulo: "Parrillero techado individual" },
  { icono: "Umbrella", titulo: "Sillas de playa" },
];

export const notaRopaBlanca = "No incluyen sábanas ni toallas.";

export const idealPara: { icono: string; titulo: string; texto: string }[] = [
  { icono: "Users", titulo: "Familias", texto: "Casas independientes, parrillero propio y la playa a media cuadra." },
  { icono: "PawPrint", titulo: "Con mascotas", texto: "Las mascotas son parte de la familia: nos encanta que las traigan." },
  { icono: "Sun", titulo: "Escapadas de fin de semana", texto: "Con la promo de primavera: 2 noches a precio especial." },
  { icono: "Laptop", titulo: "Teletrabajo y estadías largas", texto: "Wi-Fi, tranquilidad y abiertos todo el año." },
];

/* ------------------------------------------------------------------ */
/* Tarifas temporada verano 2026–2027                                  */
/* Fechas en formato "MM-DD" (mes-día), inclusive.                      */
/* La misma lista sirve para la sección Tarifas y para el precio        */
/* estimado de la consulta de disponibilidad.                           */
/* ------------------------------------------------------------------ */

export const temporada = "Temporada verano 2026–2027";

export const tarifas: Tarifa[] = [
  // Casas de 1 dormitorio. TODO confirmar desde qué fecha empieza "Fin de año" (por ahora 20/12).
  { tipo: "1dorm", nombre: "Fin de año, Navidad y enero", desde: "12-20", hasta: "01-31", precioNoche: 70, moneda: "USD", temporadaAlta: true },
  { tipo: "1dorm", nombre: "Febrero", desde: "02-01", hasta: "02-29", precioNoche: 60, moneda: "USD" },
  { tipo: "1dorm", nombre: "Marzo", desde: "03-01", hasta: "03-31", precioNoche: 50, moneda: "USD" },
  // Casa Mostaza (mínimo 15 noches)
  { tipo: "mostaza", nombre: "Enero", desde: "01-01", hasta: "01-31", precioNoche: 100, moneda: "USD", minimoNoches: 15, temporadaAlta: true },
  { tipo: "mostaza", nombre: "Febrero", desde: "02-01", hasta: "02-29", precioNoche: 90, moneda: "USD", minimoNoches: 15 },
  { tipo: "mostaza", nombre: "Marzo", desde: "03-01", hasta: "03-31", precioNoche: 80, moneda: "USD", minimoNoches: 15 },
];

export const minimoNochesMostaza = 15;

export const promos: Promo[] = [
  // TODO confirmar el rango exacto de la promo de primavera (por ahora 21/09 al 19/12)
  {
    tipo: "1dorm",
    nombre: "Promo primavera",
    desde: "09-21",
    hasta: "12-19",
    noches: 2,
    precioTotal: 4500,
    moneda: "UYU",
    soloFinDeSemana: true,
  },
];

/** Precios fuera de temporada (abril a noviembre). Vacío = solo se muestra "Consultá". */
export const preciosFueraDeTemporada: { tipo: TipoCasa; detalle: string }[] = [
  // Ejemplo: { tipo: "1dorm", detalle: "US$ 300 por semana" },
];

/* ------------------------------------------------------------------ */
/* Antes de reservar (vacío = no se muestra)                           */
/* ------------------------------------------------------------------ */

export const antesDeReservar: { icono: string; titulo: string; texto: string }[] = [
  { icono: "Clock", titulo: "Entrada y salida", texto: "" }, // TODO confirmar: ej. "Check-in desde las 14 h · Check-out hasta las 10 h"
  { icono: "Wallet", titulo: "Seña y pagos", texto: "" }, // TODO confirmar: seña y formas de pago
  { icono: "CalendarX", titulo: "Cancelaciones", texto: "" }, // TODO confirmar: política de cancelación
  { icono: "PawPrint", titulo: "Mascotas", texto: "" }, // TODO confirmar: cantidad, tamaño, costo extra
  { icono: "BedDouble", titulo: "Ropa de cama", texto: "No incluyen sábanas ni toallas: traé las tuyas." },
];

/* ------------------------------------------------------------------ */
/* Opiniones                                                           */
/* Solo opiniones REALES, copiadas de Google o Airbnb.                 */
/* Se corrigen únicamente errores de tipeo.                             */
/* ------------------------------------------------------------------ */

export type Opinion = {
  nombre: string;
  plataforma: "google" | "airbnb";
  estrellas?: number;
  fecha: string; // año o "mes año"
  texto: string;
};

export const opiniones: Opinion[] = [
  {
    nombre: "Patricia C.",
    plataforma: "google",
    estrellas: 5,
    fecha: "2025",
    texto:
      "Excelente, súper tranquilo y cerquita de la playa, las cabañas tienen todo lo que uno necesita, gran lugar para el descanso. Excelente atención",
  },
  {
    nombre: "Sandra L.",
    plataforma: "google",
    estrellas: 5,
    fecha: "2024",
    texto:
      "Confortable, equipado solo traé tus sábanas y toallas. A media cuadra de la rambla. Cruzás y tenés la escalerilla hacia la playa. A media cuadra el Chiringuito. Comercios cerca. Hermoso y una gran Paz. Lo recomiendo.",
  },
  {
    nombre: "Bernardo H.",
    plataforma: "google",
    estrellas: 4,
    fecha: "2018",
    texto:
      "El lugar es acogedor, las instalaciones son correctas. Hay buena sombra para los vehículos. Corre buen aire. El parrillero es cómodo, amplio. A 50 mts de la playa. Precio acorde. Muy recomendable.",
  },
];

/** Calificación promedio por plataforma. `promedio: 0` = no se muestra. */
export const calificaciones: Record<"google" | "airbnb", { promedio: number; cantidad: number; url: string }> = {
  google: { promedio: 0, cantidad: 0, url: "https://maps.app.goo.gl/j3tj24Wzw9FqBkm8A" }, // TODO confirmar promedio y cantidad
  airbnb: { promedio: 0, cantidad: 0, url: "https://www.airbnb.com.ar/rooms/707961511570571728" }, // TODO confirmar
};

/* ------------------------------------------------------------------ */
/* La zona                                                             */
/* ------------------------------------------------------------------ */

export const zona = {
  intro:
    "Bello Horizonte es un balneario tranquilo de la Costa de Oro, sobre la Ruta Interbalnearia. Calles arboladas, playas amplias y silencio: ideal para descansar a menos de una hora de Montevideo.",
  // Distancias aproximadas en auto. TODO confirmar y completar almacén y parada de ómnibus.
  distancias: [
    { icono: "Waves", lugar: "Playa", distancia: "Media cuadra" },
    { icono: "ShoppingBasket", lugar: "Almacén", distancia: "" },
    { icono: "Bus", lugar: "Parada de ómnibus", distancia: "" },
    { icono: "MapPin", lugar: "Atlántida", distancia: "≈ 15 min" },
    { icono: "Plane", lugar: "Aeropuerto de Carrasco", distancia: "≈ 35 min" },
    { icono: "Building2", lugar: "Montevideo", distancia: "≈ 1 h" },
    { icono: "Palmtree", lugar: "Punta del Este", distancia: "≈ 1 h 10 min" },
  ],
  // Qué hacer cerca (vacío = no se muestra). TODO confirmar con la posada.
  queHacer: [] as { titulo: string; texto: string; foto?: string }[],
  comoLlegar: {
    auto: "Por la Ruta Interbalnearia hasta el km 57, entrada a Bello Horizonte. Seguí hacia la rambla: estamos en Av. 3 esquina Rambla.",
    omnibus: "", // TODO confirmar: líneas y parada más cercana
  },
};

/* ------------------------------------------------------------------ */
/* Preguntas frecuentes (sin respuesta = no se muestra)                */
/* ------------------------------------------------------------------ */

export const preguntasFrecuentes: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Puedo ir con mi mascota?",
    respuesta: "Sí, aceptamos mascotas: son parte de la familia. Consultanos por WhatsApp si viajás con más de una.",
  },
  {
    pregunta: "¿Las casas tienen sábanas y toallas?",
    respuesta: "No, las casas no incluyen sábanas ni toallas. Todo lo demás está equipado: cocina, vajilla para 6, heladera, microondas y parrillero.",
  },
  { pregunta: "¿Cuál es el horario de entrada y salida?", respuesta: "" }, // TODO confirmar
  { pregunta: "¿Cómo reservo y cuánto es la seña? ¿Qué formas de pago aceptan?", respuesta: "" }, // TODO confirmar
  { pregunta: "¿Qué pasa si tengo que cancelar?", respuesta: "" }, // TODO confirmar
  {
    pregunta: "¿Alquilan fuera de temporada?",
    respuesta: "Sí, estamos abiertos todo el año. Fuera del verano consultá precios por fin de semana, semana o mes por WhatsApp.",
  },
  { pregunta: "¿Hay estacionamiento?", respuesta: "" }, // TODO confirmar
  { pregunta: "¿Cómo llego en ómnibus?", respuesta: "" }, // TODO confirmar
  {
    pregunta: "¿Cuántas personas entran en cada casa?",
    respuesta:
      "Todas las casas son para hasta 4 personas. Las casas Roja, Azul y Verde tienen un dormitorio con cama de 2 plazas y una cama marinera en el living. La casa Mostaza tiene dos dormitorios: uno con cama de 2 plazas y otro con cama marinera.",
  },
  {
    pregunta: "¿Hay Wi-Fi?",
    respuesta: "Sí, todas las casas tienen Wi-Fi y TV cable (DirecTV).",
  },
];

/* ------------------------------------------------------------------ */
/* Videos                                                              */
/* ------------------------------------------------------------------ */

export const videos: { src: string; poster: string; titulo: string }[] = [
  { src: "/videos/azul.mp4", poster: "/videos/azul-poster.webp", titulo: "Recorrida por la casa Azul y el deck" },
  { src: "/videos/azul2.mp4", poster: "/videos/azul2-poster.webp", titulo: "Recorrida por el interior de la casa Azul" },
];
