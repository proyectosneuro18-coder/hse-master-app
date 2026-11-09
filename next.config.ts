import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false, // el badge de "N Issues" de next dev ensuciaba los screenshots de QA
  cacheComponents: true,
  partialPrefetching: true,
  // Encabezados de seguridad (61 Gate 9). La CSP solo fija frame-ancestors (nadie puede meter la
  // app dentro de un iframe ajeno); una CSP completa de scripts queda anotada en ESTADO.md.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
