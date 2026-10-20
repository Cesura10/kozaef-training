-- Supabase, desde el 30-oct-2026: las tablas NUEVAS de "public" ya no reciben permisos de la Data API
-- automáticamente (https://github.com/orgs/supabase/discussions/45329). Las existentes conservan los
-- suyos, pero si se recrea la base desde las migraciones (proyecto nuevo, rama de pruebas,
-- supabase db reset) quedarían sin acceso. Aquí se dejan por escrito los permisos que ya tienen hoy
-- (los de siempre de Supabase): en producción no cambia nada. La seguridad sigue en RLS.
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;
