import { CheckCircle, Pulse, WarningOctagon } from '@phosphor-icons/react/dist/ssr';

/**
 * Estado de la web según el bot de vigilancia (workflow "Monitor" de GitHub, cada 15 min).
 * Lee la API pública de GitHub (repositorio público); GITHUB_TOKEN opcional para más cuota.
 */
const REPO = process.env.GITHUB_REPOSITORY_SLUG ?? 'Cesura10/kozaef-training';

type Run = { conclusion: string | null; status: string; created_at: string; html_url: string };
type Issue = { title: string; html_url: string };

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 300 },
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

const ago = (iso: string) => {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return min < 60 ? `hace ${min} min` : min < 1440 ? `hace ${Math.round(min / 60)} h` : `hace ${Math.round(min / 1440)} d`;
};

export async function MonitorStatus() {
  const [runs, issues] = await Promise.all([
    gh<{ workflow_runs: Run[] }>('/actions/workflows/monitor.yml/runs?per_page=20&branch=main'),
    gh<Issue[]>('/issues?state=open&labels=monitor'),
  ]);
  const done = (runs?.workflow_runs ?? []).filter((r) => r.status === 'completed' && r.conclusion !== 'skipped');
  const last = done[0];
  const failures = done.filter((r) => r.conclusion === 'failure').length;
  const open = issues ?? [];
  const down = open.length > 0 || last?.conclusion === 'failure';

  return (
    <section
      aria-label="Estado de la web"
      className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 text-sm ${down ? 'border-danger/50 bg-danger/10' : 'border-border bg-surface'}`}
    >
      <div className="flex items-center gap-3">
        {!last ? (
          <Pulse size={22} className="text-faint" aria-hidden />
        ) : down ? (
          <WarningOctagon size={22} weight="fill" className="text-danger" aria-hidden />
        ) : (
          <CheckCircle size={22} weight="fill" className="text-success" aria-hidden />
        )}
        <div>
          <p className="font-semibold text-fg">
            {!last ? 'Vigilancia automática: se activa al publicar la web' : down ? 'Se ha detectado un fallo en la web' : 'La web funciona correctamente'}
          </p>
          {last && (
            <p className="text-muted">
              Último chequeo {ago(last.created_at)} · {failures === 0 ? 'sin fallos' : `${failures} fallo(s)`} en los últimos {done.length} chequeos
            </p>
          )}
          {open.map((i) => (
            <a key={i.html_url} href={i.html_url} target="_blank" rel="noreferrer" className="block text-danger underline underline-offset-4">
              {i.title}
            </a>
          ))}
        </div>
      </div>
      <a
        href={`https://github.com/${REPO}/actions/workflows/monitor.yml`}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-border-strong px-4 py-2 text-xs text-muted hover:text-fg"
      >
        Ver historial
      </a>
    </section>
  );
}
