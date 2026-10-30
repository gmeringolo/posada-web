import type { NextConfig } from "next";

// Exportación estática: Netlify sirve la carpeta `out/`.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;
