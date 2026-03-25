-- Tabla de pagos completados via Stripe
CREATE TABLE IF NOT EXISTS public.payments (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number          SERIAL      UNIQUE NOT NULL, -- número de orden atómico (para lógica de primeros 50)
  user_id                 UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  stripe_session_id       TEXT        UNIQUE NOT NULL,
  stripe_payment_intent   TEXT        UNIQUE,
  amount                  INTEGER     NOT NULL,        -- en céntimos (ej. 79900 = 799€)
  currency                TEXT        NOT NULL DEFAULT 'eur',
  access_type             TEXT        NOT NULL CHECK (access_type IN ('lifetime', 'yearly')),
  referral_code           TEXT,                        -- para afiliados, nullable
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: los usuarios solo pueden leer sus propios pagos.
-- Los inserts los hace el webhook con el cliente Service Role (bypasea RLS).
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
