import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import OnboardingWizard from './_components/onboarding-wizard'

export const metadata = {
  title: 'Bienvenido - Rentabilismo Academy',
}

export default async function OnboardingPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name ?? 'Empresario'

  return <OnboardingWizard fullName={fullName} />
}
