import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // La web se exporta estática con imágenes ya optimizadas a WebP;
      // next/image no agrega optimización en este modo.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },
];

export default config;
