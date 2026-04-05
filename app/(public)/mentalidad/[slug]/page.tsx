import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import ModuleSidebar from '@/components/modules/module-sidebar'
import LessonTabs, { type Exercise } from '@/components/modules/lesson-tabs'
import CtaBlock from '../cta-block'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = await getSupabaseServerClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title')
    .eq('slug', params.slug)
    .single()
  return {
    title: lesson
      ? `${lesson.title} — Tu Cabeza Manda · Rentabilismo Academy`
      : 'Rentabilismo Academy',
  }
}

export default async function LessonPage({ params }: Props) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, slug, order_number, frase_clave, apertura, audio_url, texto_audio, contexto_ejercicios, contexto_mejora, cierre_mejora, module_id')
    .eq('slug', params.slug)
    .single()

  if (!lesson) notFound()

  const [exercisesResult, allLessonsResult, progressResult, countResult, profileResult] = await Promise.all([
    supabase
      .from('exercises')
      .select('id, type, title, description, config, order_number, is_kaizen')
      .eq('lesson_id', lesson.id)
      .order('order_number'),
    supabase
      .from('lessons')
      .select('id, slug, order_number, title')
      .eq('module_id', lesson.module_id)
      .order('order_number'),
    user
      ? supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id)
      : Promise.resolve({ data: [] as { lesson_id: string }[] }),
    supabase.rpc('get_completed_payments_count'),
    user
      ? supabase.from('profiles').select('has_paid').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
  ])

  const exercises = (exercisesResult.data ?? []) as Exercise[]
  const allLessons = allLessonsResult.data ?? []
  const completedIds = (progressResult.data ?? []).map((r) => r.lesson_id)
  const isAlreadyCompleted = completedIds.includes(lesson.id)
  const paymentsCount = Number(countResult.data ?? 0)
  const hasPaid = (profileResult.data as { has_paid: boolean } | null)?.has_paid ?? false

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const completionRedirect = hasPaid ? '/dashboard' : '/pricing'
  const completionLabel = hasPaid ? 'Ir al dashboard →' : 'Ver acceso completo →'

  return (
    <div className="min-h-screen bg-background md:flex">
      <ModuleSidebar
        moduleLabel="Módulo 0"
        modTitle="Tu Cabeza Manda"
        moduleHref="/mentalidad"
        lessonHrefPrefix="/mentalidad"
        lessons={allLessons}
        completedIds={completedIds}
        activeSlug={lesson.slug}
        moduleSlug="mentalidad"
      />

      <main className="flex-1 min-w-0">
        {/* Mobile stepper */}
        <div className="md:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center justify-between">
          <Link
            href={prevLesson ? `/mentalidad/${prevLesson.slug}` : '/mentalidad'}
            className="flex items-center justify-center w-11 h-11 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Lección anterior"
          >
            <span className="text-lg">←</span>
          </Link>
          <span className="text-sm font-medium">
            Lección {lesson.order_number} de {allLessons.length}
          </span>
          {nextLesson ? (
            <Link
              href={`/mentalidad/${nextLesson.slug}`}
              className="flex items-center justify-center w-11 h-11 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Siguiente lección"
            >
              <span className="text-lg">→</span>
            </Link>
          ) : (
            <div className="w-11" aria-hidden="true" />
          )}
        </div>

        <div className="max-w-[1040px] px-8 py-6">
          <LessonTabs
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            lessonOrder={lesson.order_number}
            fraseClave={lesson.frase_clave}
            apertura={lesson.apertura ?? null}
            audioUrl={lesson.audio_url ?? null}
            textoAudio={lesson.texto_audio ?? null}
            contextoEjercicios={lesson.contexto_ejercicios ?? null}
            contextoMejora={lesson.contexto_mejora ?? null}
            cierreMejora={lesson.cierre_mejora ?? null}
            exercises={exercises}
            isAuthenticated={!!user}
            isAlreadyCompleted={isAlreadyCompleted}
            nextSlug={nextLesson?.slug ?? null}
            lessonHrefPrefix="/mentalidad"
            completionRedirect={completionRedirect}
            completionLabel={completionLabel}
            cta={<CtaBlock isAuthenticated={!!user} hasPaid={hasPaid} paymentsCount={paymentsCount} />}
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
              href="/cuartel-general/el-espejo"
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
