// Avisa a Bing (y al resto de buscadores IndexNow) de las URLs del sitemap.
// Se ejecuta tras desplegar: npm run indexnow. Sin INDEXNOW_KEY o SITE_URL no hace nada.
const site = process.env.NEXT_PUBLIC_SITE_URL;
const key = process.env.INDEXNOW_KEY;
if (!site || !key || site.includes('localhost')) {
  console.log('IndexNow: omitido (falta NEXT_PUBLIC_SITE_URL de producción o INDEXNOW_KEY).');
  process.exit(0);
}
const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/indexnow.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URL(s) enviadas -> HTTP ${res.status}`);
