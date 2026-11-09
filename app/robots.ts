import type { MetadataRoute } from "next";

const SITIO = "https://www.hse-master-app.com";

// Solo el camino de venta y las páginas legales se indexan; la app interna, el panel y los
// Pases QR (datos de trabajadores) nunca deben aparecer en buscadores.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/legal/"],
      disallow: ["/app", "/panel", "/pase/", "/api/", "/auth/", "/acceso-vencido", "/login", "/onboarding", "/paywall"],
    },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
