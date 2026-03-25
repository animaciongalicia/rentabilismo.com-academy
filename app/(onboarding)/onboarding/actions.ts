'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'

export type OnboardingInput = {
  q1: string
  q2: string
  q3: string
  q4: string
}

export type OnboardingResult = { error: string } | { ok: true }

export async function saveOnboarding(
  data: OnboardingInput
): Promise<OnboardingResult> {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No hay sesión activa. Por favor, inicia sesión de nuevo.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      onboarding_q1: data.q1,
      onboarding_q2: data.q2,
      onboarding_q3: data.q3,
      onboarding_q4: data.q4,
      entrepreneur_pact: true,
      pact_signed_at: new Date().toISOString(),
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('saveOnboarding error | code:', error.code, '| message:', error.message, '| details:', error.details, '| hint:', error.hint)
    console.error('saveOnboarding user_id:', user.id)
    return { error: 'Error al guardar el perfil. Inténtalo de nuevo.' }
  }

  return { ok: true }
}
