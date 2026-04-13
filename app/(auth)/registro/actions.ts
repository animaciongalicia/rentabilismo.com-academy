'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { translateRegisterError } from '@/lib/utils/auth-errors'

export type RegisterState = {
  error: string | null
  success: boolean
  email: string
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rawRedirect = (formData.get('redirectTo') as string) || '/mentalidad'
  const redirectTo = rawRedirect.startsWith('/') ? rawRedirect : '/mentalidad'
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.', success: false, email }
  }

  const headersList = await headers()
  const origin = headersList.get('origin') ?? ''

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: translateRegisterError(error.message), success: false, email }
  }

  // Email confirm desactivado → sesión activa inmediata
  if (data.session) {
    redirect(redirectTo)
  }

  // Email de confirmación enviado
  return { error: null, success: true, email }
}
