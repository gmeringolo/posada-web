import { BotonWhatsAppFlotante } from "@/components/layout/BotonWhatsAppFlotante";
import { EstadoProvider } from "@/components/layout/Estado";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Casas } from "@/components/sections/Casas";
import { Contacto } from "@/components/sections/Contacto";
import { Disponibilidad } from "@/components/sections/Disponibilidad";
import { Galeria } from "@/components/sections/Galeria";
import { Hero } from "@/components/sections/Hero";
import { IdealPara } from "@/components/sections/IdealPara";
import { LaZona } from "@/components/sections/LaZona";
import { Opiniones } from "@/components/sections/Opiniones";
import { PreguntasFrecuentes } from "@/components/sections/PreguntasFrecuentes";
import { Servicios } from "@/components/sections/Servicios";
import { PromosYCondiciones, Tarifas } from "@/components/sections/Tarifas";
import { Videos } from "@/components/sections/Videos";
import { opiniones } from "@/data/site";

/**
 * Página principal (one page).
 * Cada sección vive en su propio archivo en /components/sections
 * y acá solo se unen en orden.
 */
export default function Home() {
  return (
    <EstadoProvider>
      <Navbar conOpiniones={opiniones.length > 0} />
      <main id="contenido">
        <Hero />
        <Casas />
        <Servicios />
        <IdealPara />
        <Galeria />
        <Videos />
        <Opiniones />
        <Tarifas />
        <PromosYCondiciones />
        <Disponibilidad />
        <LaZona />
        <PreguntasFrecuentes />
        <Contacto />
      </main>
      <Footer />
      <BotonWhatsAppFlotante />
    </EstadoProvider>
  );
}
