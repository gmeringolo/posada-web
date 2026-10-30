import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Dancing_Script, Nunito } from "next/font/google";
import { Analytics } from "@/components/layout/Analytics";
import { enlaces, negocio, preguntasFrecuentes, comodidades } from "@/data/site";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif", display: "swap" });
const dancing = Dancing_Script({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-dancing", display: "swap" });

const titulo = "Posada Horizonte · Casas en alquiler en Bello Horizonte, Canelones";
const descripcion =
  "Alquiler de casas totalmente equipadas a media cuadra de la playa en Bello Horizonte, Costa de Oro. Para hasta 4 personas, aceptamos mascotas y abrimos todo el año. Consultá disponibilidad y precios de temporada.";

export const metadata: Metadata = {
  metadataBase: new URL(negocio.url),
  title: titulo,
  description: descripcion,
  alternates: { canonical: "/" },
  keywords: [
    "alquiler de casas Bello Horizonte",
    "casas en alquiler Canelones",
    "Costa de Oro",
    "alquiler temporada",
    "acepta mascotas",
    "a media cuadra de la playa",
    "Posada Horizonte",
  ],
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: negocio.url,
    siteName: negocio.nombre,
    title: titulo,
    description: descripcion,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Casas roja, azul y verde de Posada Horizonte" }],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: ["/og-image.jpg"] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1e5077",
  width: "device-width",
  initialScale: 1,
};

function DatosEstructurados() {
  const lodging = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: negocio.nombre,
    url: negocio.url,
    telephone: negocio.telefonoInternacional,
    image: [`${negocio.url}/og-image.jpg`, `${negocio.url}/images/hero.webp`],
    description: descripcion,
    address: {
      "@type": "PostalAddress",
      streetAddress: negocio.direccion,
      addressLocality: negocio.localidad,
      addressRegion: negocio.departamento,
      postalCode: negocio.codigoPostal,
      addressCountry: negocio.pais,
    },
    geo: { "@type": "GeoCoordinates", latitude: negocio.coordenadas.lat, longitude: negocio.coordenadas.lng },
    hasMap: enlaces.googleMaps,
    petsAllowed: true,
    numberOfRooms: 4,
    amenityFeature: comodidades.map((c) => ({ "@type": "LocationFeatureSpecification", name: c.titulo, value: true })),
    sameAs: [enlaces.googleMaps, enlaces.instagram, enlaces.facebook, enlaces.airbnb].filter(Boolean),
  };
  const faqs = preguntasFrecuentes.filter((p) => p.respuesta);
  const faq = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((p) => ({ "@type": "Question", name: p.pregunta, acceptedAnswer: { "@type": "Answer", text: p.respuesta } })),
      }
    : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lodging) }} />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}
    </>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-UY" className={`${nunito.variable} ${dmSerif.variable} ${dancing.variable}`}>
      <head>
        <DatosEstructurados />
        <noscript>
          <style>{`.aparecer{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-bold">
          Saltar al contenido
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
