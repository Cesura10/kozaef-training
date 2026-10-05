import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, ArrowSquareOut, CheckCircle, CircleNotch, MagnifyingGlass, PaperPlaneTilt, Robot, XCircle } from '@phosphor-icons/react/dist/ssr';
import { getSessionProfile } from '@/lib/auth';
import { getProposals } from '@/lib/bot-proposals';
import type { Proposal } from '@/lib/bot-proposals-core';
import { articlesFor, type Article } from '@/content/articles';
import { CATEGORIES, CATEGORY_IDS, LEVELS, PROFILES, PROFILE_IDS, type CategoryId, type LevelId, type ProfileId } from '@/content/taxonomy';
import { TOOL_CONTENT } from '@/content/tools';
import { PRODUCTS } from '@/content/products';
import reports from '@/content/generated/reports.json';
import { CandidatePicker } from '@/components/panel/candidate-picker';

export const metadata: Metadata = { title: 'Artículos' };
export const dynamic = 'force-dynamic';

type Report = { id: string; date: string; title: string; html: string };

const candidatePath = (a: Article) =>
  a.candidato === 'borradores-del-bot' ? `docs/privado/radar/borradores/${a.slug}.md` : `docs/privado/${a.candidato}/articulos/${a.slug}.md`;

export default async function ArticlesPanel() {
  const { profile } = await getSessionProfile();
  if (profile?.role !== 'trainer') redirect('/dashboard');

  const all = articlesFor('es');
  const published = all.filter((a) => !a.borrador && !a.candidato);
  const local = all.filter((a) => a.candidato);
  const { open, history, reachable } = await getProposals();
  const passed = open.filter((p) => p.validation === 'passed').length;
  const latestReport = (reports as Report[])[0];

  return (
    <div className="animate-[rise_0.45s_ease_both] space-y-10">
      <header>
        <h1 className="display text-3xl font-bold">Artículos</h1>
        <p className="mt-1 text-sm text-muted">Lo que propone el bot, cómo queda en la web y qué publicas tú.</p>
      </header>

      {/* Recorrido de un artículo */}
      <section aria-label="Cómo funciona" className="grid gap-3 sm:grid-cols-4">
        <Step icon={MagnifyingGlass} n={null} title="El bot investiga" body="Primer lunes de mes: temas, novedades y competencia." />
        <Step icon={Robot} n={local.length + open.length} title="Candidatos" body="Artículos escritos con el formato de la web." />
        <Step icon={CheckCircle} n={passed} title="Validados en GitHub" body="Datos, secciones y fuentes comprobados." />
        <Step icon={PaperPlaneTilt} n={published.length} title="Publicados" body="Solo los que apruebas con tu clic." last />
      </section>

      {/* Candidatos locales (simulacros y borradores del bot): solo existen en tu ordenador */}
      {local.length > 0 && (
        <section aria-labelledby="local-h" className="space-y-4">
          <div>
            <h2 id="local-h" className="text-lg font-semibold">
              Candidatos del bot ({local.length})
            </h2>
            <p className="mt-1 text-sm text-muted">
              Del simulacro o de borradores del bot. Solo se ven en tu ordenador: no están en GitHub ni en la web publicada.
            </p>
          </div>
          <ul className="grid gap-4 lg:grid-cols-2">
            {local.map((a) => (
              <li key={a.slug}>
                <CandidateCard a={a} />
              </li>
            ))}
          </ul>
          <CandidatePicker candidates={local.map((a) => ({ slug: a.slug, title: a.titulo, path: candidatePath(a) }))} />
        </section>
      )}

      {/* Propuestas abiertas en GitHub */}
      <section aria-labelledby="pr-h" className="space-y-4">
        <div>
          <h2 id="pr-h" className="text-lg font-semibold">
            Propuestas en GitHub ({open.length})
          </h2>
          <p className="mt-1 text-sm text-muted">Pulsa Publicar para hacer Merge en GitHub, o Descartar para cerrarla. La web no publica nada por sí sola.</p>
        </div>
        {!reachable ? (
          <p className="card p-5 text-sm text-warning">No se ha podido consultar GitHub ahora mismo. Vuelve a intentarlo en unos minutos.</p>
        ) : open.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-faint">
            No hay propuestas abiertas. El bot las abrirá el primer lunes de mes (o cuando le pidas proponer candidatos).
          </p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {open.map((p) => (
              <li key={p.number}>
                <ProposalCard p={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Mapa de la biblioteca */}
      <section aria-labelledby="map-h" className="card p-6">
        <h2 id="map-h" className="text-lg font-semibold">
          Cómo se reparte la biblioteca
        </h2>
        <p className="mt-1 text-sm text-muted">Artículos por objetivo (filas) y perfil (columnas). Los huecos vacíos son oportunidades para el bot.</p>
        <CoverageMatrix published={published} candidates={[...local.map(toCov), ...open.map(prToCov)]} />
      </section>

      {/* Informe del mes */}
      <section aria-labelledby="rep-h" className="card p-6">
        <h2 id="rep-h" className="text-lg font-semibold">
          Informe del bot
        </h2>
        {latestReport ? (
          <details className="mt-3 group">
            <summary className="cursor-pointer list-none text-sm text-primary hover:underline">
              {latestReport.title} <span className="text-faint">· pulsa para abrir</span>
            </summary>
            <div className="prose-kz mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: latestReport.html }} />
          </details>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Los informes viven en tu repositorio privado (kozaef-privado/radar/informes). En tu ordenador se ven aquí.
          </p>
        )}
      </section>

      {history.length > 0 && (
        <section aria-labelledby="hist-h" className="card p-6">
          <h2 id="hist-h" className="text-lg font-semibold">
            Historial (8 semanas)
          </h2>
          <ul className="mt-4 divide-y divide-border text-sm">
            {history.map((p) => (
              <li key={p.number} className="flex items-center justify-between gap-4 py-3">
                <a href={p.url} target="_blank" rel="noreferrer" className="text-fg hover:text-primary">
                  {p.title}
                </a>
                <span className={p.status === 'publicada' ? 'text-success' : 'text-faint'}>{p.status === 'publicada' ? 'Publicada' : 'Descartada'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Step({ icon: Icon, n, title, body, last }: { icon: typeof Robot; n: number | null; title: string; body: string; last?: boolean }) {
  return (
    <div className="relative rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <Icon size={22} weight="duotone" className="text-primary" aria-hidden />
        {n !== null && <span className="text-2xl font-semibold text-fg">{n}</span>}
      </div>
      <p className="mt-3 font-semibold text-fg">{title}</p>
      <p className="mt-1 text-xs text-muted">{body}</p>
      {!last && <ArrowRight size={16} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-faint sm:block" aria-hidden />}
    </div>
  );
}

function Chips({ categoria, perfiles, nivel }: { categoria: string | null; perfiles: string[]; nivel: string | null }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
      {categoria && categoria in CATEGORIES && (
        <span className="rounded-full bg-primary/15 px-2.5 py-1 text-primary">{CATEGORIES[categoria as CategoryId].label.es}</span>
      )}
      {perfiles
        .filter((p) => p in PROFILES)
        .map((p) => (
          <span key={p} className="rounded-full bg-surface-2 px-2.5 py-1 text-fg">
            {PROFILES[p as ProfileId].label.es}
          </span>
        ))}
      {nivel && nivel in LEVELS && <span className="rounded-full border border-border px-2.5 py-1 text-muted">{LEVELS[nivel as LevelId].es}</span>}
    </div>
  );
}

function CandidateCard({ a }: { a: Article }) {
  const tool = a.herramientaRelacionada ? TOOL_CONTENT.es[a.herramientaRelacionada].h1 : null;
  const product = a.productoRelacionado ? PRODUCTS.find((p) => p.id === a.productoRelacionado)?.nombre.es : null;
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-5">
      <p className="text-xs text-faint">{a.candidato}</p>
      <h3 className="mt-1 font-semibold text-fg">{a.titulo}</h3>
      <Chips categoria={a.categoria} perfiles={a.perfiles} nivel={a.nivel} />
      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="text-faint">Lectura</dt>
          <dd className="text-fg">{a.readingMinutes} min</dd>
        </div>
        <div>
          <dt className="text-faint">Fuentes</dt>
          <dd className="text-fg">{a.fuentes.length}</dd>
        </div>
        <div>
          <dt className="text-faint">Preguntas</dt>
          <dd className="text-fg">{a.faq.length}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted">
        {tool ? `Herramienta: ${tool}. ` : 'Sin herramienta relacionada. '}
        {product ? `Producto: ${product}.` : ''}
      </p>
      <Link
        href={a.url}
        target="_blank"
        className="mt-4 inline-flex h-10 w-fit items-center gap-2 rounded-full border border-border-strong px-4 text-sm text-fg hover:border-primary/60"
      >
        Ver cómo queda en la web <ArrowSquareOut size={14} aria-hidden />
      </Link>
    </article>
  );
}

function ProposalCard({ p }: { p: Proposal }) {
  const v = {
    passed: { Icon: CheckCircle, cls: 'text-success', label: 'Validación correcta' },
    failed: { Icon: XCircle, cls: 'text-danger', label: 'Validación con errores' },
    running: { Icon: CircleNotch, cls: 'text-warning', label: 'Validando…' },
    unknown: { Icon: CircleNotch, cls: 'text-faint', label: 'Sin validar todavía' },
  }[p.validation];
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-5">
      <p className="text-xs text-faint">
        #{p.number} · {p.kind === 'novedad' ? 'Novedad' : 'Artículo'} · {new Date(p.createdAt).toLocaleDateString('es-ES')}
      </p>
      <h3 className="mt-1 font-semibold text-fg">{p.title}</h3>
      <Chips categoria={p.categoria} perfiles={p.perfiles} nivel={p.nivel} />
      <p className={`mt-3 inline-flex items-center gap-1.5 text-sm ${v.cls}`}>
        <v.Icon size={16} weight="fill" aria-hidden /> {v.label} · {p.fuentes} fuente(s)
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.preview && (
          <a href={p.preview} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-full border border-border-strong px-4 text-sm text-fg hover:border-primary/60">
            Vista previa
          </a>
        )}
        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          aria-disabled={p.validation !== 'passed'}
          className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg hover:bg-primary-hover aria-disabled:opacity-50"
        >
          Publicar (Merge)
        </a>
        <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-full px-4 text-sm text-muted hover:text-fg">
          Descartar
        </a>
      </div>
    </article>
  );
}

type Cov = { categoria: string | null; perfiles: string[] };
const toCov = (a: Article): Cov => ({ categoria: a.categoria, perfiles: a.perfiles });
const prToCov = (p: Proposal): Cov => ({ categoria: p.categoria, perfiles: p.perfiles });

function CoverageMatrix({ published, candidates }: { published: Article[]; candidates: Cov[] }) {
  const count = (list: Cov[], c: CategoryId, p: ProfileId) => list.filter((x) => x.categoria === c && x.perfiles.includes(p)).length;
  const pub = published.map(toCov);
  const emptyProfiles = PROFILE_IDS.filter((p) => !pub.some((x) => x.perfiles.includes(p)));
  return (
    <>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-xs text-faint">
              <th className="pb-3 pr-3 font-medium">Objetivo</th>
              {PROFILE_IDS.map((p) => (
                <th key={p} className="pb-3 pr-3 text-center font-medium">
                  {PROFILES[p].label.es}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CATEGORY_IDS.map((c) => (
              <tr key={c}>
                <td className="py-3 pr-3 text-fg">{CATEGORIES[c].label.es}</td>
                {PROFILE_IDS.map((p) => {
                  const n = count(pub, c, p);
                  const k = count(candidates, c, p);
                  return (
                    <td key={p} className="py-3 pr-3 text-center tabular-nums" title={`${n} publicado(s), ${k} candidato(s)`}>
                      {n === 0 && k === 0 ? (
                        <span className="text-faint">·</span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {n > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-fg">{n}</span>}
                          {k > 0 && <span className="rounded-full border border-primary/60 px-2 py-0.5 text-xs text-primary">+{k}</span>}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-fg">n</span> publicados
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded-full border border-primary/60 px-2 py-0.5 text-xs text-primary">+n</span> candidatos
        </span>
        {emptyProfiles.length > 0 && <span>Perfiles sin artículos publicados: {emptyProfiles.map((p) => PROFILES[p].label.es).join(', ')}.</span>}
      </p>
    </>
  );
}
