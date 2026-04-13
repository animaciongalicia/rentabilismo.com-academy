'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export type SignPactoInput = {
  startingPoint: string
  desiredDestination: string
}

export type SignPactoResult = { ok: true } | { error: string }

export async function signPacto(data: SignPactoInput): Promise<SignPactoResult> {
  if (!data.startingPoint?.trim() || !data.desiredDestination?.trim()) {
    return { error: 'Por favor, responde a las dos preguntas antes de firmar.' }
  }

  try {
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
        entrepreneur_pact: true,
        pact_signed_at: new Date().toISOString(),
        starting_point: data.startingPoint,
        desired_destination: data.desiredDestination,
      })
      .eq('id', user.id)

    if (error) {
      console.error('signPacto error:', error.code, error.message)
      return { error: 'Error al guardar el pacto. Inténtalo de nuevo.' }
    }

    revalidatePath('/modulos/diagnostico-inicial')
    return { ok: true }
  } catch (e) {
    console.error('signPacto CATCH:', e)
    return { error: 'Error al guardar el pacto. Inténtalo de nuevo.' }
  }
}
