import { getSupabaseServerClient } from '@/lib/supabase/server'
import { SidebarNavClient } from './sidebar-nav-client'

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function getAccessLabel(accessType: string | null | undefined): string | null {
  if (accessType === 'lifetime') return 'Lifetime'
  if (accessType === 'yearly') return '6 meses'
  return null
}

export default async function AppSidebar() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userInfo = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, access_type')
      .eq('id', user.id)
      .single()

    const fullName = profile?.full_name ?? user.email ?? 'Empresario'
    userInfo = {
      initials: getInitials(fullName),
      fullName,
      accessLabel: getAccessLabel(profile?.access_type),
    }
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-border bg-background">
      <SidebarNavClient userInfo={userInfo} />
    </aside>
  )
}
