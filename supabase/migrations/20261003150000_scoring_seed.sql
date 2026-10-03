-- Reglas de puntuación iniciales de la solicitud de coaching (editables desde el panel).
-- Máximo posible: 90. Umbral por defecto: feature_flags.application_threshold = 60.
insert into public.scoring_rules (question, answer, points) values
  ('experience', 'none', 0),
  ('experience', 'under1', 5),
  ('experience', '1to3', 10),
  ('experience', 'over3', 10),
  ('stuck', 'starting', 0),
  ('stuck', 'under3m', 5),
  ('stuck', '3to12m', 15),
  ('stuck', 'over1y', 15),
  ('days', '1to2', 0),
  ('days', '3to4', 15),
  ('days', '5plus', 15),
  ('budget', 'under50', 0),
  ('budget', '50to100', 15),
  ('budget', '100to200', 25),
  ('budget', 'over200', 30),
  ('start', 'now', 20),
  ('start', 'month', 10),
  ('start', 'looking', 0)
on conflict (question, answer) do nothing;
