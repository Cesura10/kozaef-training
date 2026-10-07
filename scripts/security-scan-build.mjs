// Revisión de seguridad del código que se envía al navegador (se ejecuta en CI tras el build).
//
// 1. Señuelos: CI compila con valores falsos "KZ_SENUELO_..." en todas las variables secretas.
//    Si alguno aparece en .next/static, una clave de servidor se ha colado en el código público.
// 2. Patrones de claves conocidas (JWT service_role, PostHog phx_, secreta de Turnstile, PEM,
//    URL de base de datos con contraseña, GitHub, Stripe, AWS).
// 3. Nombres prohibidos: una variable NEXT_PUBLIC_* se incrusta en el navegador, así que no
//    puede llamarse como un secreto (SECRET, SERVICE_ROLE, PRIVATE, PASSWORD, PERSONAL...).
//
// Uso: node scripts/security-scan-build.mjs [carpeta]   (por defecto .next/static)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? '.next/static';
const problems = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|mjs|css|html|json|txt|map|rsc|body)$/.test(name)) out.push(p);
  }
  return out;
}

const PATTERNS = [
  ['señuelo de una variable secreta', /KZ_SENUELO_[A-Z_]+/],
  ['JWT de Supabase con rol service_role', /eyJ[\w-]+\.[\w-]*c2VydmljZV9yb2xl[\w-]*\.[\w-]+/],
  ['llave privada de PostHog (phx_)', /phx_[A-Za-z0-9]{20,}/],
  // La clave pública de Turnstile mide 24 caracteres; la secreta, 35.
  ['clave secreta de Turnstile', /\b0x4[A-Za-z0-9_-]{32,}\b/],
  ['clave privada PEM', /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['URL de base de datos con contraseña', /postgres(ql)?:\/\/[^\s"'`:/]+:[^\s"'`@]+@/],
  ['token de GitHub', /\b(ghp|gho|ghs|ghu)_[A-Za-z0-9]{30,}\b|github_pat_[A-Za-z0-9_]{40,}/],
  ['clave secreta de Stripe', /\b(sk|rk)_live_[A-Za-z0-9]{20,}\b/],
  ['clave de AWS', /\bAKIA[0-9A-Z]{16}\b/],
];

let files = [];
try {
  files = walk(root);
} catch {
  console.error(`No existe ${root}: ejecuta antes "npm run build".`);
  process.exit(1);
}
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const [label, re] of PATTERNS) {
    const m = text.match(re);
    if (m) problems.push(`${label} en ${relative('.', f)} (${m[0].slice(0, 14)}…)`);
  }
}

// Nombres de variables públicas que parecen secretos, en todo el código fuente.
const SECRET_NAME = /NEXT_PUBLIC_[A-Z0-9_]*(SECRET|SERVICE_ROLE|PRIVATE|PASSWORD|PERSONAL_API|DB_PASS|AUTH_TOKEN)[A-Z0-9_]*/g;
// Interruptores públicos (true/false), no secretos: activan el acceso con contraseña.
const ALLOWED_NAMES = new Set(['NEXT_PUBLIC_AUTH_PASSWORD']);
for (const dir of ['src', 'scripts', '.github']) {
  let list = [];
  try {
    list = walk(dir).concat(
      readdirSync(dir, { recursive: true })
        .map((n) => join(dir, String(n)))
        .filter((p) => /\.(ts|tsx|mjs|yml|yaml)$/.test(p)),
    );
  } catch {
    continue;
  }
  for (const f of new Set(list)) {
    if (f.endsWith('security-scan-build.mjs')) continue;
    for (const name of new Set(readFileSync(f, 'utf8').match(SECRET_NAME) ?? [])) {
      if (!ALLOWED_NAMES.has(name)) problems.push(`variable pública con nombre de secreto: ${name} en ${f}`);
    }
  }
}

if (problems.length) {
  console.error(`✗ Revisión de seguridad: ${problems.length} problema(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`✓ Revisión de seguridad: ${files.length} archivos públicos sin secretos.`);
