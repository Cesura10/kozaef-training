-- Solicitud de coaching sin las preguntas de presupuesto y de cuándo empezar (decisión de Manu, 2026-10-08).
-- Puntuación máxima: 40 (experiencia 10 + estancamiento 15 + días 15). Umbral: 25 (dos tercios, como antes 60/90).
delete from public.scoring_rules where question in ('budget', 'start');
update public.feature_flags set value = '{"score": 25}'::jsonb where key = 'application_threshold';
