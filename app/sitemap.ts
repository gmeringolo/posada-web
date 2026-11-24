import type { MetadataRoute } from "next";
import { negocio } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: negocio.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
