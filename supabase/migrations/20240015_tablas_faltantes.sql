-- ═══════════════════════════════════════════════════════════════════════════
-- 20240015_tablas_faltantes.sql
-- Crea las 6 tablas pendientes del roadmap
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. gpt_agents ─────────────────────────────────────────────────────────
-- Agentes GPT vinculados a módulos. Solo accesible para usuarios con pago.
CREATE TABLE IF NOT EXISTS public.gpt_agents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID        REFERENCES public.modules(id) ON DELETE SET NULL,
  name        TEXT        NOT NULL,
  agent_url   TEXT        NOT NULL,
  description TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gpt_agents ENABLE ROW LEVEL SECURITY;

-- Solo usuarios que han pagado pueden consultar los agentes
CREATE POLICY "gpt_agents_select_paid"
  ON public.gpt_agents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND has_paid = true
    )
  );


-- ── 2. community_wall ─────────────────────────────────────────────────────
-- Muro de motivación: una entrada por usuario, visible para todos.
CREATE TABLE IF NOT EXISTS public.community_wall (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT        NOT NULL,
  motivation_phrase TEXT        NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT community_wall_user_unique UNIQUE (user_id)
);

ALTER TABLE public.community_wall ENABLE ROW LEVEL SECURITY;

-- Lectura pública (anon y authenticated)
CREATE POLICY "community_wall_select_public"
  ON public.community_wall
  FOR SELECT
  USING (true);

-- Cada usuario gestiona su propia entrada
CREATE POLICY "community_wall_insert_own"
  ON public.community_wall
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_wall_update_own"
  ON public.community_wall
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_wall_delete_own"
  ON public.community_wall
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER community_wall_updated_at
  BEFORE UPDATE ON public.community_wall
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 3. evolution_reports ──────────────────────────────────────────────────
-- Informes de evolución por tipo (motivational, midpoint, final) para cada usuario.
CREATE TABLE IF NOT EXISTS public.evolution_reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT        NOT NULL,
  report_data JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT evolution_reports_user_type_unique UNIQUE (user_id, report_type)
);

ALTER TABLE public.evolution_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "evolution_reports_select_own"
  ON public.evolution_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "evolution_reports_insert_own"
  ON public.evolution_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "evolution_reports_update_own"
  ON public.evolution_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "evolution_reports_delete_own"
  ON public.evolution_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER evolution_reports_updated_at
  BEFORE UPDATE ON public.evolution_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 4. affiliates ─────────────────────────────────────────────────────────
-- Tabla de afiliados. Gestionada exclusivamente por service_role (back-office).
CREATE TABLE IF NOT EXISTS public.affiliates (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code    TEXT        NOT NULL UNIQUE,
  referred_count   INTEGER     NOT NULL DEFAULT 0,
  commission_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  paid_out_total   NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  is_active        BOOLEAN     NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Sin políticas para authenticated/anon → solo service_role puede acceder
-- (RLS habilitado + sin políticas = tabla opaca para usuarios normales)

CREATE TRIGGER affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 5. business_thermometer ───────────────────────────────────────────────
-- Termómetro de negocio: una fila por usuario con las puntuaciones por área.
CREATE TABLE IF NOT EXISTS public.business_thermometer (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scores     JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT business_thermometer_user_unique UNIQUE (user_id)
);

ALTER TABLE public.business_thermometer ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business_thermometer_all_own"
  ON public.business_thermometer
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER business_thermometer_updated_at
  BEFORE UPDATE ON public.business_thermometer
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 6. case_library ───────────────────────────────────────────────────────
-- Biblioteca de casos de negocio. Solo usuarios con pago ven casos publicados.
CREATE TABLE IF NOT EXISTS public.case_library (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id    INTEGER     REFERENCES public.modules(id) ON DELETE SET NULL,
  title        TEXT        NOT NULL,
  description  TEXT,
  content      JSONB       NOT NULL DEFAULT '{}'::jsonb,
  industry     TEXT,
  is_published BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.case_library ENABLE ROW LEVEL SECURITY;

-- Usuarios con pago pueden leer casos publicados
CREATE POLICY "case_library_select_paid"
  ON public.case_library
  FOR SELECT
  TO authenticated
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND has_paid = true
    )
  );

CREATE TRIGGER case_library_updated_at
  BEFORE UPDATE ON public.case_library
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
