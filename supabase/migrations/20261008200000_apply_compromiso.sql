-- Pregunta "Del 1 al 10, ¿cuál es tu compromiso?" (decisión de Manu, 2026-10-08).
-- 9-10: 20 puntos; 7-8: 10; 1-6: 0. Máximo total 60; umbral 40 (dos tercios).
insert into public.scoring_rules (question, answer, points) values
  ('commitment', '1', 0), ('commitment', '2', 0), ('commitment', '3', 0), ('commitment', '4', 0),
  ('commitment', '5', 0), ('commitment', '6', 0), ('commitment', '7', 10), ('commitment', '8', 10),
  ('commitment', '9', 20), ('commitment', '10', 20)
on conflict (question, answer) do update set points = excluded.points;
update public.feature_flags set value = '{"score": 40}'::jsonb where key = 'application_threshold';
