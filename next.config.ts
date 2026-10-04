import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers.mjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          enforce: process.env.CSP_ENFORCE === "true",
        }),
      },
    ];
  },
  async redirects() {
    return [
      { source: "/", destination: "/es", permanent: false },
      // /solicitud pasó a /solicitar (brief biblioteca y embudo)
      { source: "/es/solicitud", destination: "/es/solicitar", permanent: true },
    ];
  },
};

export default nextConfig;
