import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import DiagnosticoSidebar from './module-sidebar'
import DiagnosticoModuleTabs from './module-tabs'

export const metadata = {
  title: 'Diagnóstico Inicial — Módulo 1 · Rentabilismo Academy',
  description: 'Antes de mejorar nada, necesitas saber dónde estás de verdad.',
}

export default async function DiagnosticoModulePage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/modules/diagnostico-inicial')

  const [moduleResult, profileResult] = await Promise.all([
    supabase
      .from('modules')
      .select('id, title, description, vimeo_id, video_intro_text')
      .eq('slug', 'diagnostico-inicial')
      .single(),
    supabase.from('profiles').select('has_paid').eq('id', user.id).single(),
  ])

  const mod = moduleResult.data
  const hasPaid = profileResult.data?.has_paid ?? false

  if (!hasPaid) redirect('/onboarding/mentalidad')

  const lessonsResult = await supabase
    .from('lessons')
    .select('id, title, slug, order_number')
    .eq('module_id', mod?.id ?? '')
    .order('order_number')

  const lessons = lessonsResult.data ?? []

  const progressResult = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .in('lesson_id', lessons.map((l) => l.id))

  const completedIds = (progressResult.data ?? []).map((r) => r.lesson_id)

  return (
    <div className="min-h-screen bg-background md:flex">
      <DiagnosticoSidebar
        lessons={lessons}
        completedIds={completedIds}
        activeSlug={null}
      />

      <main className="flex-1 min-w-0">
        <div className="max-w-[1040px] px-8 py-6">
          {/* Header */}
          <div className="space-y-3 mb-8">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Módulo 1
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {mod?.title ?? 'Diagnóstico Inicial: Punto de Partida'}
            </h1>
          </div>

          <DiagnosticoModuleTabs
            vimeoId={mod?.vimeo_id ?? null}
            description={mod?.description ?? null}
            videoIntroText={mod?.video_intro_text ?? null}
            lessons={lessons}
            completedIds={completedIds}
          />
        </div>
      </main>
    </div>
  )
}
