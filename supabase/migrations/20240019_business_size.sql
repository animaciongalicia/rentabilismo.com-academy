-- Añadir columna business_size a profiles si no existe
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_size TEXT;
