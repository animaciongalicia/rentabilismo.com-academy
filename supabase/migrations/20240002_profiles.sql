-- ============================================================
-- Tabla: profiles
-- Vinculada 1:1 con auth.users
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  -- Identidad
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT,
  full_name             TEXT,
  avatar_url            TEXT,

  -- Datos del negocio
  business_name         TEXT,
  business_type         TEXT,
  business_location     TEXT,

  -- Onboarding
  starting_point        TEXT,          -- "¿Dónde estás ahora?"
  desired_destination   TEXT,          -- "¿Dónde quieres llegar?"
  biggest_problem       TEXT,          -- "¿Mayor problema?"
  motivation_phrase     TEXT,          -- "¿Qué quieres mejorar?" (para el muro)

  -- Acceso y pagos
  has_paid              BOOLEAN        DEFAULT false,
  access_type           TEXT           CHECK (access_type IN ('lifetime', 'yearly')),
  access_expires_at     TIMESTAMPTZ,

  -- Stripe
  stripe_customer_id    TEXT,
  stripe_payment_id     TEXT,

  -- Pacto del empresario
  entrepreneur_pact     BOOLEAN        DEFAULT false,
  pact_signed_at        TIMESTAMPTZ,

  -- Actividad y racha
  current_streak        INTEGER        DEFAULT 0,
  best_streak           INTEGER        DEFAULT 0,
  last_active_at        TIMESTAMPTZ,

  -- Estado general
  onboarding_completed  BOOLEAN        DEFAULT false,
  created_at            TIMESTAMPTZ    DEFAULT now(),
  updated_at            TIMESTAMPTZ    DEFAULT now()
);

-- ============================================================
-- Trigger: actualizar updated_at automáticamente
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Trigger: crear perfil al registrar un usuario nuevo
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- El usuario solo puede leer su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- El usuario solo puede actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
