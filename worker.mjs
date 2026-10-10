// Entrada del Worker de Cloudflare: envuelve la web generada por OpenNext.
// Toda visita por http:// salta a https:// (301), para que el navegador nunca muestre
// "No seguro". Se hace aquí porque la web pública no pasa por src/proxy.ts.
import handler from './.open-next/worker.js';

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if (url.protocol === 'http:' && !local) {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return handler.fetch(request, env, ctx);
  },
};
