-- Añadir vimeo_id a módulos (el vídeo de bienvenida es de módulo, no de lección)
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS vimeo_id TEXT;
