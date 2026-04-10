import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import ModuleTabs from '@/components/modules/module-tabs'
import CtaBlock from './cta-block'

export const metadata = {
  title: 'Tu Cabeza Manda — Módulo 0 · Rentabilismo Academy',
  description: 'Para que tu empresa cambie, tú tienes que cambiar primero.',
}

export default async function MentalidadPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const moduleResult = await supabase
    .from('modules')
    .select('id, title, description, vimeo_id, video_intro_text')
    .eq('slug', 'mentalidad')
    .single()

  const mod = moduleResult.data

  const [lessonsResult, countResult] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, title, slug, order_number')
      .eq('module_id', mod?.id ?? '')
      .order('order_number'),
    supabase.rpc('get_completed_payments_count'),
  ])

  const lessons = lessonsResult.data ?? []
  const paymentsCount = Number(countResult.data ?? 0)

  const completedIds: string[] = []
  let hasPaid = false
  if (user) {
    const [progressResult, profileResult] = await Promise.all([
      supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id),
      supabase.from('profiles').select('has_paid').eq('id', user.id).single(),
    ])
    for (const row of progressResult.data ?? []) completedIds.push(row.lesson_id)
    hasPaid = profileResult.data?.has_paid ?? false
  }

  const showCta = completedIds.length >= lessons.length && lessons.length > 0

  return (
    <div className="min-h-screen bg-background md:flex">
      <main className="flex-1 min-w-0">
        <div className="max-w-[1040px] px-8 py-6">
          <div className="space-y-3 mb-8">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Módulo 0
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{mod?.title}</h1>
          </div>

          <ModuleTabs
            vimeoId={mod?.vimeo_id ?? null}
            description={mod?.description ?? null}
            videoIntroText={mod?.video_intro_text ?? null}
            lessons={lessons}
            lessonHrefPrefix="/mentalidad"
            cta={showCta ? (
              <CtaBlock isAuthenticated={!!user} hasPaid={hasPaid} paymentsCount={paymentsCount} />
            ) : undefined}
          />

          {/* CTA El Espejo — solo visible en móvil (en desktop lo muestra el sidebar) */}
          <div className="md:hidden mt-10 pt-6 border-t border-border space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Tu consultor
            </p>
            <p className="text-sm font-semibold text-foreground">El Espejo</p>
            <p className="text-sm text-muted-foreground leading-snug">
              El consultor que coge tus respuestas y te las devuelve ordenadas. Sin filtro.
            </p>
            <Link
              href="/cuartel/el-espejo"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium h-12 px-5 hover:bg-primary/80 transition-colors"
            >
              Conoce a El Espejo
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
