-- =============================================================================
-- 07 · Comunidad (Fase 3) — esquema listo, sin frontend todavía
-- =============================================================================
-- Feed por entrenador: los miembros de la comunidad de un mismo trainer ven
-- y publican posts/comentarios. Cada quien edita/borra lo suyo.
-- =============================================================================

create table public.community_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid references public.profiles (id) on delete set null,
  trainer_id  uuid references public.profiles (id) on delete cascade,  -- comunidad
  body        text,
  media_url   text,
  created_at  timestamptz not null default now()
);
create index community_posts_trainer_id_idx on public.community_posts (trainer_id, created_at desc);

create table public.community_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.community_posts (id) on delete cascade,
  author_id  uuid references public.profiles (id) on delete set null,
  body       text,
  created_at timestamptz not null default now()
);
create index community_comments_post_id_idx on public.community_comments (post_id, created_at);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.community_posts    enable row level security;
alter table public.community_comments enable row level security;

create policy "community_posts_select"
  on public.community_posts for select
  using (trainer_id = auth.uid() or trainer_id = public.my_trainer_id());

create policy "community_posts_author_write"
  on public.community_posts for all
  using (author_id = auth.uid())
  with check (
    author_id = auth.uid()
    and (trainer_id = auth.uid() or trainer_id = public.my_trainer_id())
  );

create policy "community_comments_select"
  on public.community_comments for select
  using (exists (
    select 1 from public.community_posts p
    where p.id = post_id
      and (p.trainer_id = auth.uid() or p.trainer_id = public.my_trainer_id())
  ));

create policy "community_comments_author_write"
  on public.community_comments for all
  using (author_id = auth.uid())
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.community_posts p
      where p.id = post_id
        and (p.trainer_id = auth.uid() or p.trainer_id = public.my_trainer_id())
    )
  );
