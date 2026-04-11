'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export type CompletarPerfilState = {
  error: string | null
}

export async function completarPerfilAction(
  _prevState: CompletarPerfilState,
  formData: FormData
): Promise<CompletarPerfilState> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No hay sesión activa.' }
  }

  const businessType = formData.get('business_type') as string
  const businessLocation = formData.get('business_location') as string
  const businessSize = formData.get('business_size') as string
  const avatarFile = formData.get('avatar') as File | null

  let avatarUrl: string | undefined

  // Subir avatar si se proporcionó uno
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true })

    if (uploadError) {
      return { error: 'Error al subir la foto. Inténtalo de nuevo.' }
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    avatarUrl = urlData.publicUrl
  }

  try {
    const updates: Record<string, unknown> = {
      business_type: businessType || null,
      business_location: businessLocation?.trim() || null,
      business_size: businessSize || null,
      profile_completed: true,
    }

    if (avatarUrl) {
      updates.avatar_url = avatarUrl
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error
  } catch {
    return { error: 'Error al guardar los datos. Inténtalo de nuevo.' }
  }

  redirect('/modulos/diagnostico-inicial')
}
