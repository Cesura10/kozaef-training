-- =============================================================================
-- 06 · Chat 1:1 (trainer <-> cliente) con soporte de Realtime
-- =============================================================================

create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.profiles (id) on delete cascade,
  trainer_id  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (client_id, trainer_id)
);

create table public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations (id) on delete cascade,
  sender_id        uuid not null references public.profiles (id) on delete cascade,
  body             text,
  read_at          timestamptz,
  created_at       timestamptz not null default now()
);
create index messages_conversation_id_idx on public.messages (conversation_id, created_at);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

create policy "conversations_participants_select"
  on public.conversations for select
  using (client_id = auth.uid() or trainer_id = auth.uid());

create policy "conversations_trainer_insert"
  on public.conversations for insert
  with check (trainer_id = auth.uid() and public.owns_client(client_id));

create policy "conversations_client_insert"
  on public.conversations for insert
  with check (client_id = auth.uid() and trainer_id = public.my_trainer_id());

create policy "messages_select"
  on public.messages for select
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.client_id = auth.uid() or c.trainer_id = auth.uid())
  ));

create policy "messages_insert"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.client_id = auth.uid() or c.trainer_id = auth.uid())
    )
  );

-- Marcar como leído (read_at) por cualquiera de los dos participantes.
create policy "messages_update_read"
  on public.messages for update
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.client_id = auth.uid() or c.trainer_id = auth.uid())
  ))
  with check (exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.client_id = auth.uid() or c.trainer_id = auth.uid())
  ));

-- -----------------------------------------------------------------------------
-- Realtime: exponer la tabla messages en la publicación de Supabase.
-- -----------------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
