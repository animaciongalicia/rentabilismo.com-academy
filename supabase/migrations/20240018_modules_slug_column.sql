-- Añade slug y video_intro_text a modules (columnas ya existentes en BD,
-- migración formal para mantener historial completo).
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS video_intro_text TEXT;

-- Índice para búsquedas por slug
CREATE UNIQUE INDEX IF NOT EXISTS modules_slug_unique
  ON public.modules (slug)
  WHERE slug IS NOT NULL;
