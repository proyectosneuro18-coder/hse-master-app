import type { MetadataRoute } from "next";

const SITIO = "https://www.hse-master-app.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITIO}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITIO}/legal/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITIO}/legal/terminos`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITIO}/legal/reembolsos`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
