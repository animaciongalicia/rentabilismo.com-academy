-- ═══════════════════════════════════════════════════════════════════════════
-- 20240016_fix_modules_uuid.sql
-- Migra modules.id de INTEGER a UUID y actualiza las FKs dependientes.
--
-- Tablas afectadas:   modules, lessons, user_progress
-- Tablas NO tocadas:  exercises, exercise_responses, lesson_progress,
--                     payments, profiles
-- Las tablas de 20240015 aún no existen en BD → no se tocan aquí.
-- ═══════════════════════════════════════════════════════════════════════════

-- PASO 1: Eliminar FKs existentes (IF EXISTS → idempotente)
ALTER TABLE public.lessons
  DROP CONSTRAINT IF EXISTS lessons_module_id_fkey;

ALTER TABLE public.user_progress
  DROP CONSTRAINT IF EXISTS user_progress_module_id_fkey;

-- PASO 2: Añadir columna UUID temporal en modules
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS new_id UUID DEFAULT gen_random_uuid();

-- PASO 3: Crear mapping INTEGER → UUID
CREATE TEMP TABLE modules_id_map AS
  SELECT id AS old_id, new_id FROM public.modules;

-- PASO 4: Migrar lessons.module_id
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS module_id_new UUID;

UPDATE public.lessons
  SET module_id_new = m.new_id
  FROM modules_id_map m
  WHERE public.lessons.module_id = m.old_id;

ALTER TABLE public.lessons DROP COLUMN module_id;
ALTER TABLE public.lessons RENAME COLUMN module_id_new TO module_id;

-- PASO 5: Migrar user_progress.module_id
ALTER TABLE public.user_progress
  ADD COLUMN IF NOT EXISTS module_id_new UUID;

UPDATE public.user_progress
  SET module_id_new = m.new_id
  FROM modules_id_map m
  WHERE public.user_progress.module_id = m.old_id;

ALTER TABLE public.user_progress DROP COLUMN module_id;
ALTER TABLE public.user_progress RENAME COLUMN module_id_new TO module_id;

-- PASO 6: Promover new_id a PK de modules
ALTER TABLE public.modules DROP CONSTRAINT modules_pkey;
ALTER TABLE public.modules DROP COLUMN id;
ALTER TABLE public.modules RENAME COLUMN new_id TO id;
ALTER TABLE public.modules ADD PRIMARY KEY (id);

-- PASO 7: Restaurar FKs con tipo UUID correcto
ALTER TABLE public.lessons
  ADD CONSTRAINT lessons_module_id_fkey
  FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;

ALTER TABLE public.user_progress
  ADD CONSTRAINT user_progress_module_id_fkey
  FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;

-- PASO 8: Verificación final
-- Ejecutar esta SELECT para confirmar que todo es UUID:
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN ('id', 'module_id')
  AND table_name IN ('modules', 'lessons', 'user_progress')
ORDER BY table_name, column_name;
-- Resultado esperado: data_type = 'uuid' en todas las filas.
