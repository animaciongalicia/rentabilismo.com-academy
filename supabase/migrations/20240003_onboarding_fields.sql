-- Campos de onboarding detallado
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_q1            TEXT,          -- ¿Cómo quieres que sea tu negocio en 6 meses?
  ADD COLUMN IF NOT EXISTS onboarding_q2            TEXT,          -- ¿Qué es lo que más te impide llegar ahí?
  ADD COLUMN IF NOT EXISTS onboarding_q3            TEXT,          -- ¿Cuánto tiempo llevas con este problema?
  ADD COLUMN IF NOT EXISTS onboarding_q4            TEXT,          -- ¿Estás dispuesto a dedicar 2 horas semanales?
  ADD COLUMN IF NOT EXISTS onboarding_completed_at  TIMESTAMPTZ;   -- Timestamp de finalización del onboarding
