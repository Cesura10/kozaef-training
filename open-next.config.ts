// Adaptador de Cloudflare (OpenNext). Caché de solo lectura sobre assets estáticos:
// suficiente porque la web pública es SSG, y NO requiere R2 (que pide tarjeta).
// Si algún día se usa ISR (revalidación), cambiar a KV o R2 conscientemente (ver §13).
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
