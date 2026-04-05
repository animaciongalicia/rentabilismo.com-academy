'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'

export type ResetPasswordState = {
  error: string | null
  success: boolean
}

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const email = (formData.get('email') as string).trim()

  if (!email) {
    return { error: 'Introduce tu dirección de email.', success: false }
  }

  const supabase = await getSupabaseServerClient()
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/update-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) {
    return { error: 'No se pudo enviar el enlace. Inténtalo de nuevo.', success: false }
  }

  return { error: null, success: true }
}
