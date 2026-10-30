import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Página no encontrada · Posada Horizonte" };

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-primary-900 px-6 text-center text-white">
      <img src="/images/hero-mobile.webp" alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-25" />
      <div>
        <Logo variante="blanco" className="mb-10" />
        <p className="text-sm font-bold tracking-[0.2em] text-accent uppercase">Error 404</p>
        <h1 className="mt-3 text-4xl text-white sm:text-5xl">Esta página se fue a la playa</h1>
        <p className="mx-auto mt-4 max-w-md text-white/85">La dirección que buscás no existe. Volvé al inicio para ver las casas y consultar disponibilidad.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-accent px-7 py-4 font-bold text-ink hover:bg-accent-hover">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
