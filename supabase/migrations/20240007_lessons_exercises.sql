-- ── Módulos: añadir slug y gpt_agent_url ─────────────────────────────────
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS slug         TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS gpt_agent_url TEXT;

-- Permitir lectura pública (anon) del catálogo de módulos
CREATE POLICY "modules_select_anon"
  ON public.modules
  FOR SELECT
  TO anon
  USING (true);

-- ── Tabla lessons ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lessons (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id    INTEGER     NOT NULL REFERENCES public.modules (id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  slug         TEXT        UNIQUE NOT NULL,
  order_number INTEGER     NOT NULL,
  frase_clave  TEXT,
  vimeo_id     TEXT,
  audio_url    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lessons_select_anon"
  ON public.lessons FOR SELECT TO anon USING (true);

CREATE POLICY "lessons_select_authenticated"
  ON public.lessons FOR SELECT TO authenticated USING (true);

-- ── Tabla exercises ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.exercises (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID        NOT NULL REFERENCES public.lessons (id) ON DELETE CASCADE,
  type         TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  description  TEXT,
  config       JSONB       NOT NULL DEFAULT '{}'::jsonb,
  order_number INTEGER     NOT NULL,
  is_kaizen    BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercises_select_anon"
  ON public.exercises FOR SELECT TO anon USING (true);

CREATE POLICY "exercises_select_authenticated"
  ON public.exercises FOR SELECT TO authenticated USING (true);

-- ── Tabla lesson_progress ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  user_id      UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id    UUID        NOT NULL REFERENCES public.lessons (id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responses    JSONB,
  PRIMARY KEY (user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_progress_select_own"
  ON public.lesson_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "lesson_progress_insert_own"
  ON public.lesson_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_progress_delete_own"
  ON public.lesson_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ── Función pública: contar pagos completados ────────────────────────────
-- SECURITY DEFINER permite que anon llame a esta función aunque payments
-- tenga RLS que bloquea acceso anon directo.
CREATE OR REPLACE FUNCTION public.get_completed_payments_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.payments;
$$;

GRANT EXECUTE ON FUNCTION public.get_completed_payments_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_completed_payments_count() TO authenticated;
