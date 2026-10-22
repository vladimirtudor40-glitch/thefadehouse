import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/barbershopData";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 }];
}
