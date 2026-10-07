// Revisión de seguridad de la web publicada (tras cada despliegue y en el monitor).
//
// - Archivos internos (.env, git, configuración) no descargables.
// - Cabeceras de seguridad presentes.
// - Base de datos cerrada a la clave pública de Supabase (RLS): no se leen datos privados
//   ni se puede escribir.
//
// Variables: SITE_URL (obligatoria), NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
// (opcionales: sin ellas se omite la prueba de la base de datos).
const site = (process.env.SITE_URL ?? '').replace(/\/$/, '');
if (!/^https:\/\//.test(site)) {
  console.error('SITE_URL debe ser la URL pública https://');
  process.exit(1);
}
const problems = [];

// 1. Archivos internos: deben dar 404 (o al menos no servir su contenido).
const PRIVATE_PATHS = ['/.env', '/.env.local', '/.env.production', '/.env.production.local', '/.dev.vars', '/.git/config', '/wrangler.jsonc', '/package.json', '/supabase/config.toml', '/next.config.ts'];
for (const path of PRIVATE_PATHS) {
  const res = await fetch(site + path, { redirect: 'manual' });
  const body = res.status === 200 ? await res.text() : '';
  if (res.status === 200 && /=|\[core\]|"name"|"\$schema"|project_id/.test(body)) problems.push(`se puede descargar ${path}`);
}

// 2. Cabeceras de seguridad en la portada.
const home = await fetch(`${site}/es`);
const h = home.headers;
const need = {
  'strict-transport-security': (v) => /max-age=\d{7,}/.test(v),
  'x-content-type-options': (v) => v === 'nosniff',
  'referrer-policy': (v) => v.length > 0,
};
for (const [name, ok] of Object.entries(need)) {
  const v = h.get(name) ?? '';
  if (!ok(v)) problems.push(`falta o es incorrecta la cabecera ${name} (${v || 'ausente'})`);
}
const csp = h.get('content-security-policy') ?? h.get('content-security-policy-report-only') ?? '';
if (!csp) problems.push('falta la política de seguridad de contenido (CSP)');
if (!/frame-ancestors/.test(csp) && !h.get('x-frame-options')) problems.push('la web se puede incrustar en otras páginas (falta frame-ancestors o X-Frame-Options)');

// 3. Base de datos con la clave pública.
const db = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (db && anon) {
  const headers = { apikey: anon, Authorization: `Bearer ${anon}`, 'Content-Type': 'application/json' };
  for (const table of ['leads', 'applications', 'service_requests', 'profiles', 'lead_events', 'tool_results']) {
    const res = await fetch(`${db}/rest/v1/${table}?select=*&limit=1`, { headers });
    const data = await res.json().catch(() => null);
    if (res.ok && Array.isArray(data) && data.length > 0) problems.push(`la clave pública puede leer la tabla ${table}`);
  }
  const ins = await fetch(`${db}/rest/v1/leads`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify({ email: 'revision-seguridad@example.invalid' }),
  });
  if (ins.ok) problems.push('la clave pública puede escribir en la tabla leads');
} else {
  console.log('(prueba de base de datos omitida: faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

if (problems.length) {
  console.error(`✗ Seguridad en producción: ${problems.length} problema(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`✓ Seguridad en producción correcta en ${site}`);
