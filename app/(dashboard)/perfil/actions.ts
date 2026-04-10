'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export type UpdateProfileState = {
  error: string | null
  success: boolean
}

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No hay sesión activa.', success: false }
  }

  const businessName = formData.get('business_name') as string
  const businessType = formData.get('business_type') as string
  const biggestProblem = formData.get('biggest_problem') as string

  if (!businessName?.trim()) {
    return { error: 'El nombre del negocio es obligatorio.', success: false }
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        business_name: businessName.trim(),
        business_type: businessType || null,
        biggest_problem: biggestProblem?.trim() || null,
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/perfil')
    return { error: null, success: true }
  } catch {
    return { error: 'Error al guardar los cambios. Inténtalo de nuevo.', success: false }
  }
}
