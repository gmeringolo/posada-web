import { PawPrint, Star, Users, Waves } from "lucide-react";
import { calificaciones } from "@/data/site";
import { LinkWhatsApp } from "@/components/ui/LinkWhatsApp";
import { BotonLink } from "@/components/ui/Boton";

function SelloConfianza() {
  const items = (["google", "airbnb"] as const)
    .map((p) => ({ p, ...calificaciones[p] }))
    .filter((c) => c.promedio > 0);
  if (!items.length) return null;
  const fmt = (n: number) => n.toLocaleString("es-UY", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <p className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
      {items.map((c) => (
        <span key={c.p} className="inline-flex items-center gap-1.5">
          <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
          {fmt(c.promedio)} en {c.p === "google" ? "Google" : "Airbnb"}
          {c.cantidad > 0 && <span className="font-normal text-white/80">({c.cantidad} opiniones)</span>}
        </span>
      ))}
    </p>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-primary-900 pt-28 pb-16 sm:items-center sm:pb-24">
      <picture className="absolute inset-0 -z-10">
        <source media="(max-width: 767px)" srcSet="/images/hero-mobile.webp" />
        <img
          src="/images/hero.webp"
          alt="Casas roja, azul y verde con deck techado, a media cuadra de la playa en Bello Horizonte"
          className="size-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-950/90 via-primary-900/55 to-primary-900/30 sm:bg-gradient-to-r sm:from-primary-950/85 sm:via-primary-900/50 sm:to-transparent" />

      <div className="contenedor">
        <div className="max-w-2xl">
          <p className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-extrabold tracking-[0.15em] text-ink uppercase">
            Bello Horizonte · Canelones
          </p>
          <h1 className="text-[2.6rem] leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Casas totalmente equipadas a media cuadra de la playa
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90 sm:text-xl">
            Cuatro casas independientes para hasta 4 personas, con parrillero propio y lugar para tu mascota. Abierto todo el año.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BotonLink href="#disponibilidad" variante="acento" tamano="lg">
              Ver disponibilidad
            </BotonLink>
            <LinkWhatsApp ubicacion="hero" variante="contorno-claro" tamano="lg" />
          </div>
          <SelloConfianza />
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem] font-semibold text-white">
            <li className="inline-flex items-center gap-2">
              <Waves className="size-5 text-accent" aria-hidden="true" /> A media cuadra de la playa
            </li>
            <li className="inline-flex items-center gap-2">
              <Users className="size-5 text-accent" aria-hidden="true" /> Hasta 4 personas
            </li>
            <li className="inline-flex items-center gap-2">
              <PawPrint className="size-5 text-accent" aria-hidden="true" /> Aceptamos mascotas
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
