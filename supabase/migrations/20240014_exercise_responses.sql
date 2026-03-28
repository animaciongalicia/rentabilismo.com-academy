-- Tabla para guardar respuestas individuales de ejercicios (persistencia incremental)
-- Separada de lesson_progress (que registra la completación de la lección)

CREATE TABLE IF NOT EXISTS exercise_responses (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  response   JSONB NOT NULL DEFAULT '{}',
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, exercise_id)
);

ALTER TABLE exercise_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own exercise responses"
  ON exercise_responses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
