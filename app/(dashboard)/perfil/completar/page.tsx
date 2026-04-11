import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getAvatarColor, getInitials } from '@/lib/utils/avatar'
import CompletarForm from './completar-form'

export default async function CompletarPerfilPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, has_paid, profile_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.has_paid) redirect('/precio')
  if (profile.profile_completed) redirect('/dashboard')

  const fullName = profile.full_name ?? user.email ?? 'Empresario'
  const initials = getInitials(fullName)
  const avatarColor = getAvatarColor(fullName)

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Antes de empezar, cuéntanos un poco sobre tu negocio
          </h1>
          <p className="text-muted-foreground">
            Solo tardas 2 minutos. Esta información personaliza tu experiencia.
          </p>
        </div>

        <CompletarForm
          fullName={fullName}
          initials={initials}
          avatarColor={avatarColor}
        />
      </div>
    </div>
  )
}
