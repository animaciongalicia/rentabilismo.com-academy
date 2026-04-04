-- Añadir nota de IVA al campo de facturación mensual del ejercicio "Tus números reales"

UPDATE public.exercises
SET config = jsonb_set(
  config,
  '{fields,0,note}',
  '"Pon la cifra sin IVA ni impuestos — lo que realmente entra en tu negocio, no lo que cobras al cliente. Si no lo separas, pon lo que cobras y marca que incluye impuestos."'::jsonb
)
WHERE lesson_id = (SELECT id FROM public.lessons WHERE slug = 'tu-dinero')
  AND type = 'number_input'
  AND title ILIKE '%números reales%';
