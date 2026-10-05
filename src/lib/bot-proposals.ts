import 'server-only';
import { parse } from 'yaml';
import { classifyProposal, type Proposal, type ValidationState } from './bot-proposals-core';

/**
 * Propuestas del bot de artículos en GitHub (repositorio público: sin token y gratis).
 * GITHUB_READ_TOKEN (solo lectura) es opcional: sube el límite de 60 a 5.000 consultas/hora.
 * Caché de 5 minutos. La web NUNCA publica ni cierra: solo lee y enlaza a GitHub.
 */
const REPO = process.env.GITHUB_REPOSITORY_SLUG ?? 'Cesura10/kozaef-training';

type PR = {
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
  head: { ref: string; sha: string };
};

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_READ_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_READ_TOKEN}` } : {}),
      },
      next: { revalidate: 300 },
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

async function frontmatterOf(branch: string, slug: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${encodeURIComponent(branch)}/content/articulos/es/${slug}.md`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const m = (await res.text()).match(/^---\n([\s\S]*?)\n---/);
    return m ? (parse(m[1]) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function validationOf(sha: string): Promise<ValidationState> {
  const data = await gh<{ check_runs: Array<{ name: string; status: string; conclusion: string | null }> }>(`/commits/${sha}/check-runs`);
  const run = data?.check_runs.find((c) => c.name === 'Validar artículos');
  if (!run) return 'unknown';
  if (run.status !== 'completed') return 'running';
  return run.conclusion === 'success' ? 'passed' : 'failed';
}

async function previewOf(number: number): Promise<string | null> {
  const comments = await gh<Array<{ body: string }>>(`/issues/${number}/comments?per_page=20`);
  const hit = comments?.map((c) => c.body.match(/Vista previa privada:\*\*\s*(https:\/\/\S+)/)?.[1]).find(Boolean);
  return hit ?? null;
}

export async function getProposals(): Promise<{ open: Proposal[]; history: Proposal[]; reachable: boolean }> {
  const [openPRs, closedPRs] = await Promise.all([
    gh<PR[]>('/pulls?state=open&per_page=50'),
    gh<PR[]>('/pulls?state=closed&per_page=50&sort=updated&direction=desc'),
  ]);
  if (!openPRs && !closedPRs) return { open: [], history: [], reachable: false };
  const isBot = (p: PR) => p.head.ref.startsWith('bot/');

  const open = await Promise.all(
    (openPRs ?? []).filter(isBot).map(async (p) => {
      const slug = p.head.ref.slice(4);
      const [fm, validation, preview] = await Promise.all([frontmatterOf(p.head.ref, slug), validationOf(p.head.sha), previewOf(p.number)]);
      return classifyProposal({ ...p, slug, frontmatter: fm, validation, preview });
    }),
  );

  const eightWeeks = Date.now() - 56 * 86_400_000;
  const history = (closedPRs ?? [])
    .filter((p) => isBot(p) && p.closed_at && new Date(p.closed_at).getTime() >= eightWeeks)
    .map((p) => classifyProposal({ ...p, slug: p.head.ref.slice(4), frontmatter: null, validation: 'unknown', preview: null }));

  return { open, history, reachable: true };
}
