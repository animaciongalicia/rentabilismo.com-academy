import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import DiagnosticoSidebar from '../module-sidebar'
import DiagnosticoLessonTabs, { type Exercise } from './lesson-tabs'

type Props = { params: { 'lesson-slug': string } }

export async function generateMetadata({ params }: Props) {
  const supabase = await getSupabaseServerClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title')
    .eq('slug', params['lesson-slug'])
    .single()
  return {
    title: lesson
      ? `${lesson.title} — Diagnóstico Inicial · Rentabilismo Academy`
      : 'Rentabilismo Academy',
  }
}

export default async function DiagnosticoLessonPage({ params }: Props) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?redirectTo=/modules/diagnostico-inicial/${params['lesson-slug']}`)

  const profileResult = await supabase
    .from('profiles')
    .select('has_paid')
    .eq('id', user.id)
    .single()

  if (!profileResult.data?.has_paid) redirect('/onboarding/mentalidad')

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, slug, order_number, frase_clave, apertura, audio_url, module_id')
    .eq('slug', params['lesson-slug'])
    .single()

  if (!lesson) notFound()

  const [exercisesResult, allLessonsResult, progressResult] = await Promise.all([
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
    supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id),
  ])

  const exercises = (exercisesResult.data ?? []) as Exercise[]
  const allLessons = allLessonsResult.data ?? []
  const completedIds = (progressResult.data ?? []).map((r) => r.lesson_id)
  const isAlreadyCompleted = completedIds.includes(lesson.id)

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Lección bloqueada si la anterior no está completada
  const isLocked = prevLesson ? !completedIds.includes(prevLesson.id) : false

  return (
    <div className="min-h-screen bg-background md:flex">
      <DiagnosticoSidebar
        lessons={allLessons}
        completedIds={completedIds}
        activeSlug={lesson.slug}
      />

      <main className="flex-1 min-w-0">
        {/* Mobile stepper */}
        <div className="md:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center justify-between">
          <Link
            href={prevLesson ? `/modules/diagnostico-inicial/${prevLesson.slug}` : '/modules/diagnostico-inicial'}
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
              href={`/modules/diagnostico-inicial/${nextLesson.slug}`}
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
          <DiagnosticoLessonTabs
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            lessonOrder={lesson.order_number}
            fraseClave={lesson.frase_clave ?? ''}
            apertura={lesson.apertura ?? null}
            audioUrl={lesson.audio_url ?? null}
            exercises={exercises}
            isAuthenticated={true}
            nextSlug={nextLesson?.slug ?? null}
            isAlreadyCompleted={isAlreadyCompleted}
            isLocked={isLocked}
          />
        </div>
      </main>
    </div>
  )
}
