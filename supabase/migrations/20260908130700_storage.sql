-- =============================================================================
-- 08 · Storage: bucket privado para fotos de progreso de check-ins
-- =============================================================================
-- Convención de ruta:  <client_id>/<check_in_id>/<archivo>
-- El primer segmento de la ruta identifica al dueño (el cliente).
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('check-in-photos', 'check-in-photos', false)
on conflict (id) do nothing;

-- El cliente sube / lee / borra únicamente sus propias fotos.
create policy "check_in_photos_client_rw"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'check-in-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'check-in-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- El trainer puede leer (no escribir) las fotos de sus clientes.
create policy "check_in_photos_trainer_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'check-in-photos'
    and (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
    and public.owns_client(((storage.foldername(name))[1])::uuid)
  );
