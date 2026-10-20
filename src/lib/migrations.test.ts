import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Supabase, desde el 30-oct-2026: una tabla nueva en "public" sin GRANT explícito no es accesible
 * desde la web ("permission denied"). Toda migración desde esa fecha que cree una tabla debe dar
 * sus permisos en el mismo archivo.
 */
const DIR = join(process.cwd(), 'supabase', 'migrations');
const DESDE = '20261030000000';

describe('migraciones', () => {
  const nuevas = readdirSync(DIR).filter((f) => f.endsWith('.sql') && f.slice(0, 14) >= DESDE);
  it.each(nuevas.length ? nuevas : ['(ninguna todavía)'])('%s: cada tabla nueva lleva su GRANT', (f) => {
    if (!f.endsWith('.sql')) return;
    const sql = readFileSync(join(DIR, f), 'utf8').toLowerCase();
    const tablas = [...sql.matchAll(/create table (?:if not exists )?(?:public\.)?"?([a-z0-9_]+)"?/g)].map((m) => m[1]);
    for (const t of tablas) {
      expect(sql, `${f}: falta "grant ... on public.${t} to authenticated, service_role" (y anon si la lee la web pública)`).toMatch(
        new RegExp(`grant [^;]+ on (?:table )?(?:public\\.)?${t}\\b`),
      );
    }
  });
});
