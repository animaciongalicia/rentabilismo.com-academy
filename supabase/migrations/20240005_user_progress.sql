-- Tabla de progreso del usuario por módulo
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id      UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  module_id    INTEGER     NOT NULL REFERENCES public.modules (id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, module_id)
);

-- RLS: cada usuario solo puede ver y gestionar su propio progreso
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_progress_select_own"
  ON public.user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_own"
  ON public.user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_delete_own"
  ON public.user_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
