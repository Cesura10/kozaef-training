import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getSessionProfile } from '@/lib/auth';

export const metadata: Metadata = { title: 'Panel' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { user, profile } = await getSessionProfile();
  const role = profile?.role ?? 'client';

  return (
    <div className="animate-[rise_0.45s_ease_both] space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hola{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {role === 'trainer'
            ? 'Resumen de tu actividad y la de tus clientes.'
            : 'Tu seguimiento de un vistazo.'}
        </p>
      </div>

      {role === 'trainer' ? (
        <TrainerHome />
      ) : (
        <ClientHome hasTrainer={Boolean(profile?.trainer_id)} />
      )}

      <p className="text-xs text-faint">
        Sesión: {user?.email} · rol <span className="text-muted">{role}</span>
      </p>
    </div>
  );
}

async function TrainerHome() {
  const supabase = await createClient();

  const counts = { clients: 0, pending: 0, exercises: 0 };
  try {
    const [clients, pending, exercises] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
      supabase
        .from('check_ins')
        .select('id', { count: 'exact', head: true })
        .eq('reviewed', false),
      supabase.from('exercise_library').select('id', { count: 'exact', head: true }),
    ]);
    counts.clients = clients.count ?? 0;
    counts.pending = pending.count ?? 0;
    counts.exercises = exercises.count ?? 0;
  } catch {
    // Migraciones aún sin aplicar: mostramos ceros.
  }

  const stats = [
    { label: 'Clientes', value: counts.clients },
    { label: 'Revisiones sin revisar', value: counts.pending },
    { label: 'Ejercicios en biblioteca', value: counts.exercises },
  ];

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>
      <NextSteps
        items={[
          'Crea tu biblioteca de ejercicios con vídeos (paso 3 del roadmap).',
          'Da de alta clientes y asígnalos a tu cuenta.',
          'Monta la primera rutina y dieta.',
        ]}
      />
    </>
  );
}

function ClientHome({ hasTrainer }: { hasTrainer: boolean }) {
  return (
    <>
      {!hasTrainer && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          Aún no tienes entrenador asignado. Manu te vinculará a tu cuenta en breve.
        </div>
      )}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Rutina activa" value="—" />
        <StatCard label="Dieta activa" value="—" />
        <StatCard label="Última revisión" value="—" />
      </section>
      <NextSteps
        items={[
          'Cuando tengas rutina asignada la verás aquí.',
          'Podrás registrar tus series y subir fotos de progreso.',
        ]}
      />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function NextSteps({ items }: { items: string[] }) {
  return (
    <section className="card p-5">
      <h2 className="text-sm font-semibold">Siguientes pasos</h2>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm text-muted">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}
