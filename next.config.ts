import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";
import { securityHeaders } from "./src/lib/security-headers.mjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Salida standalone: la empaqueta OpenNext para Cloudflare (scripts cf:*). En Netlify (NETLIFY=true
  // al compilar) se usa la salida normal: la empaqueta su propio adaptador.
  output: process.env.NETLIFY ? undefined : "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          enforce: process.env.CSP_ENFORCE === "true",
        }),
      },
      {
        // Las direcciones provisionales (*.workers.dev, *.netlify.app) no se indexan: solo el dominio propio.
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.(workers\\.dev|netlify\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      // Un solo dominio para Google: www → sin www.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kozaeftraining.com" }],
        destination: "https://kozaeftraining.com/:path*",
        permanent: true,
      },
      // Permanente: Google consolida la portada en /es en vez de marcarla como "página con redirección temporal".
      { source: "/", destination: "/es", permanent: true },
      // /solicitud pasó a /solicitar (brief biblioteca y embudo)
      { source: "/es/solicitud", destination: "/es/solicitar", permanent: true },
    ];
  },
};

// Sentry: sin SENTRY_AUTH_TOKEN no sube source maps (los errores llegan igual, menos legibles).
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  telemetry: false,
});
