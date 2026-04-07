import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function AppHeader() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [profileResult, progressResult] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('user_progress').select('module_id').eq('user_id', user.id),
  ])

  const displayName =
    profileResult.data?.full_name?.split(' ')[0] ?? user.email ?? 'Empresario'
  const completedCount = (progressResult.data ?? []).length
  const totalModules = 10

  async function handleSignOut() {
    'use server'
    const sb = await getSupabaseServerClient()
    await sb.auth.signOut()
    redirect('/login')
  }

  return (
    <header className="sticky top-0 z-50 h-14 bg-background border-b border-border">
      <div className="h-full max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Izquierda */}
        <Link
          href="/dashboard"
          className="text-base font-semibold tracking-tight hover:opacity-70 transition-opacity"
        >
          Rentabilismo
        </Link>

        {/* Derecha */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Progreso — solo desktop */}
          <span className="hidden md:block text-sm text-muted-foreground">
            {completedCount > 0
              ? `${completedCount} de ${totalModules} módulos completados`
              : 'Empieza tu primer módulo'}
          </span>

          {/* Nombre */}
          <span className="text-sm font-medium">{displayName}</span>

          {/* Botón Salir */}
          <form action={handleSignOut}>
            <button
              type="submit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
