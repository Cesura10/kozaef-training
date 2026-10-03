import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // La raíz va al idioma por defecto. Redirección estática: no ejecuta el proxy.
  async redirects() {
    return [
      { source: "/", destination: "/es", permanent: false },
      // /solicitud pasó a /solicitar (brief biblioteca y embudo)
      { source: "/es/solicitud", destination: "/es/solicitar", permanent: true },
    ];
  },
};

export default nextConfig;
