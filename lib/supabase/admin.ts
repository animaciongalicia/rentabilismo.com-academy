// SERVER ONLY — nunca importar desde Client Components.
// Usa SUPABASE_SERVICE_ROLE_KEY, que bypasea RLS completamente.
// Solo para contextos de servidor de confianza (webhooks, jobs).

import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
