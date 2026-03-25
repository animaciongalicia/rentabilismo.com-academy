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
  try {
    console.log('saveOnboarding: iniciando')
    const supabase = await getSupabaseServerClient()
    console.log('saveOnboarding: cliente creado')

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('saveOnboarding: user:', user?.id, 'authError:', authError)

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

    console.log('saveOnboarding: update error:', error)

    if (error) {
      return { error: 'Error al guardar el perfil. Inténtalo de nuevo.' }
    }

    return { ok: true }
  } catch (e) {
    console.error('saveOnboarding CATCH:', e)
    return { error: 'Error al guardar el perfil. Inténtalo de nuevo.' }
  }
}
