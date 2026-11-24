import { MapPin, Phone } from "lucide-react";
import { enlaces, negocio } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { AirbnbIcon, FacebookIcon, GoogleIcon, InstagramIcon } from "@/components/ui/IconosMarca";

export function Footer() {
  const redes = [
    { href: enlaces.instagram, nombre: "Instagram", Icono: InstagramIcon },
    { href: enlaces.facebook, nombre: "Facebook", Icono: FacebookIcon },
    { href: enlaces.airbnb, nombre: "Airbnb", Icono: AirbnbIcon },
    { href: enlaces.googleMaps, nombre: "Google Maps", Icono: GoogleIcon },
  ].filter((r) => r.href);
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 pt-14 pb-6 text-white/85">
      <div className="contenedor grid gap-10 md:grid-cols-3">
        <div>
          <a href="#inicio" aria-label="Volver al inicio">
            <Logo variante="blanco" tamano="grande" />
          </a>
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Casas totalmente equipadas a media cuadra de la playa en Bello Horizonte, Canelones.
          </p>
        </div>
        <div className="md:justify-self-center md:text-center">
          <p className="mb-3 font-bold text-white">Contacto</p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5 md:justify-center">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={enlaces.googleMaps} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                {negocio.direccion}, {negocio.localidad}, {negocio.departamento}
              </a>
            </li>
            <li className="flex items-center gap-2.5 md:justify-center">
              <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`tel:${negocio.telefonoInternacional}`} className="hover:text-white hover:underline">
                {negocio.telefonoVisible}
              </a>
              <span className="text-white/60">({negocio.contacto})</span>
            </li>
          </ul>
        </div>
        <div className="md:mr-6 md:justify-self-end">
          <p className="mb-3 font-bold text-white">Seguinos</p>
          <ul className="flex flex-wrap gap-3">
            {redes.map(({ href, nombre, Icono }) => (
              <li key={nombre}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nombre}
                  title={nombre}
                  className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  <Icono className="size-5" color="white" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="contenedor mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
        <p>
          © {anio} {negocio.nombre} · Diseño y desarrollo: Gianella Meringolo
        </p>
      </div>
    </footer>
  );
}
