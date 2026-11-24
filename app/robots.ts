import type { MetadataRoute } from "next";
import { negocio } from "@/data/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${negocio.url}/sitemap.xml` };
}
