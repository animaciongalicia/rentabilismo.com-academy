-- ── Actualizar módulo 0 ───────────────────────────────────────────────────
UPDATE public.modules
SET
  title         = 'Tu Cabeza Manda',
  description   = 'Para que tu empresa cambie, tú tienes que cambiar primero.',
  slug          = 'mentalidad',
  gpt_agent_url = null
WHERE id = 0;

-- ── Insertar 4 lecciones ──────────────────────────────────────────────────
INSERT INTO public.lessons (module_id, title, slug, order_number, frase_clave, vimeo_id, audio_url)
VALUES
  (0,
   'Estás en el sitio correcto, en el momento indicado',
   'estas-en-el-sitio-correcto',
   1,
   'Tú no eres de los que se rinden. Estás aquí porque quieres soluciones reales.',
   null, null),
  (0,
   'Así lo vamos a conseguir: un paso a la vez',
   'asi-lo-vamos-a-conseguir',
   2,
   'Cuando empieces a ordenar las cosas, vas a sentir que por fin tienes el control.',
   null, null),
  (0,
   'La solución que estabas buscando',
   'la-solucion-que-estabas-buscando',
   3,
   'No es un curso. Es un consultor privado experto en tu negocio.',
   null, null),
  (0,
   'Es el momento. Entramos juntos.',
   'es-el-momento-entramos-juntos',
   4,
   'No se trata de si vas a dar el paso. Se trata de cuándo: ¿ahora o cuando ya sea demasiado tarde?',
   null, null);

-- ── Insertar 8 ejercicios (2 por lección) ────────────────────────────────
-- Usamos un JOIN sobre el slug de lección para no depender de UUIDs fijos.
WITH lesson_ids AS (
  SELECT id, slug FROM public.lessons WHERE module_id = 0
)
INSERT INTO public.exercises (lesson_id, type, title, description, config, order_number, is_kaizen)
SELECT
  l.id,
  e.type,
  e.title,
  e.description,
  e.config,
  e.order_number,
  e.is_kaizen
FROM (
  VALUES
    -- Lección 1 — estas-en-el-sitio-correcto
    ('estas-en-el-sitio-correcto',
     'open_reflection',
     'Tu punto de partida',
     'No te pregunto por objetivos ni por problemas. Te pregunto por lo que sientes. ¿Qué es lo que ya no estás dispuesto a seguir igual?',
     '{"placeholder": "Lo que ya no quiero que siga igual es...", "min_chars": 40, "note": "No hay respuesta correcta. Solo la tuya."}'::jsonb,
     1, false),

    ('estas-en-el-sitio-correcto',
     'kaizen_step',
     'Reconoce dónde estás',
     'Esta semana, escribe en una frase el área de tu negocio o tu vida que más energía te está robando ahora mismo. Solo una.',
     '{"action_prompt": "Lo que más energía me roba ahora mismo es:", "deadline_label": "Esta semana: solo nómbralo"}'::jsonb,
     2, true),

    -- Lección 2 — asi-lo-vamos-a-conseguir
    ('asi-lo-vamos-a-conseguir',
     'text_input',
     'Un área, un paso',
     'Elige un área de tu negocio o tu vida que quieres que sea diferente. Una sola. ¿Cuál es el paso más pequeño posible que podrías dar esta semana?',
     '{"fields": [{"id": "area", "label": "El área que quiero que cambie", "placeholder": "Ej: cómo organizo mi tiempo / mis precios / mi equipo..."}, {"id": "paso", "label": "El paso más pequeño que puedo dar esta semana", "placeholder": "Algo concreto, en menos de 30 minutos..."}]}'::jsonb,
     1, false),

    ('asi-lo-vamos-a-conseguir',
     'kaizen_step',
     'Una cosa. Esta semana.',
     'Elige una cosa que llevas posponiendo. Solo una. Hazla esta semana en menos de 30 minutos.',
     '{"action_prompt": "Lo que voy a hacer esta semana es:", "deadline_label": "Menos de 30 minutos. Esta semana."}'::jsonb,
     2, true),

    -- Lección 3 — la-solucion-que-estabas-buscando
    ('la-solucion-que-estabas-buscando',
     'checklist',
     'Lo que has intentado hasta ahora',
     'Marca lo que has probado para mejorar tu negocio. Sin juicio — cada cosa que probaste te trajo hasta aquí.',
     '{"items": [{"id": "cursos", "label": "Cursos online"}, {"id": "libros", "label": "Libros de negocio"}, {"id": "consultores", "label": "Consultores externos"}, {"id": "coaches", "label": "Coaches o mentores"}, {"id": "conferencias", "label": "Conferencias y eventos"}, {"id": "herramientas", "label": "Herramientas digitales"}, {"id": "asesores", "label": "Asesores o gestores"}, {"id": "consejos", "label": "Consejos de amigos o conocidos"}], "follow_up": {"type": "open_reflection", "label": "¿Qué era lo que siempre faltaba?", "placeholder": "Lo que siempre echaba en falta era..."}}'::jsonb,
     1, false),

    ('la-solucion-que-estabas-buscando',
     'kaizen_step',
     'La diferencia que buscas',
     'Escribe en una frase qué necesitas que sea diferente esta vez para que funcione.',
     '{"action_prompt": "Lo que necesito que sea diferente esta vez es:", "deadline_label": "Esta semana: escríbelo"}'::jsonb,
     2, true),

    -- Lección 4 — es-el-momento-entramos-juntos
    ('es-el-momento-entramos-juntos',
     'open_reflection',
     '¿Cómo quieres que sea tu vida dentro de un año?',
     'No te pregunto por objetivos de negocio. Te pregunto por tu vida. ¿Cómo sería tu semana si tu empresa funcionara como quieres?',
     '{"placeholder": "Dentro de un año, me gustaría que...", "min_chars": 60, "note": "Guardamos esta respuesta. Al completar el programa, volvemos a ella contigo."}'::jsonb,
     1, false),

    ('es-el-momento-entramos-juntos',
     'kaizen_step',
     'Tu compromiso',
     'Escribe en una frase por qué ahora. No tus objetivos — por qué este momento es el indicado.',
     '{"action_prompt": "Este es el momento porque:", "deadline_label": "Antes de seguir"}'::jsonb,
     2, true)

) AS e(lesson_slug, type, title, description, config, order_number, is_kaizen)
JOIN lesson_ids l ON l.slug = e.lesson_slug;
