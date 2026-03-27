import { getSupabaseServerClient } from '@/lib/supabase/server'
import ModuleSidebar from './module-sidebar'
import ModuleTabs from './module-tabs'

export const metadata = {
  title: 'Tu Cabeza Manda — Módulo 0 · Rentabilismo Academy',
  description: 'Para que tu empresa cambie, tú tienes que cambiar primero.',
}

export default async function MentalidadPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [moduleResult, lessonsResult, countResult] = await Promise.all([
    supabase.from('modules').select('id, title, description, vimeo_id').eq('id', 0).single(),
    supabase
      .from('lessons')
      .select('id, title, slug, order_number')
      .eq('module_id', 0)
      .order('order_number'),
    supabase.rpc('get_completed_payments_count'),
  ])

  const mod = moduleResult.data
  const lessons = lessonsResult.data ?? []
  const paymentsCount = Number(countResult.data ?? 0)

  const completedIds: string[] = []
  if (user) {
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
    for (const row of progress ?? []) completedIds.push(row.lesson_id)
  }

  const showCta = !!user && completedIds.length >= lessons.length && lessons.length > 0

  return (
    <div className="min-h-screen bg-background md:flex">
      <ModuleSidebar
        modTitle={mod?.title ?? 'Tu Cabeza Manda'}
        lessons={lessons}
        completedIds={completedIds}
        activeSlug={null}
      />

      <main className="flex-1 min-w-0">
        <div className="max-w-[1040px] px-8 py-10">
          {/* Header */}
          <div className="space-y-3 mb-8">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Módulo 0
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{mod?.title}</h1>
          </div>

          <ModuleTabs
            vimeoId={mod?.vimeo_id ?? null}
            description={mod?.description ?? null}
            lessons={lessons}
            showCta={showCta}
            paymentsCount={paymentsCount}
          />
        </div>
      </main>
    </div>
  )
}
