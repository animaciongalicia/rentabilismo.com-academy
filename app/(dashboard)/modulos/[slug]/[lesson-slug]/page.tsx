import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import ModuleSidebar from '@/components/modules/module-sidebar'
import LessonTabs, { type Exercise } from '@/components/modules/lesson-tabs'

type Props = { params: { slug: string; 'lesson-slug': string } }

export async function generateMetadata({ params }: Props) {
  const supabase = await getSupabaseServerClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title')
    .eq('slug', params['lesson-slug'])
    .single()
  return {
    title: lesson
      ? `${lesson.title} · Rentabilismo Academy`
      : 'Rentabilismo Academy',
  }
}

export default async function DashboardLessonPage({ params }: Props) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verificar acceso de pago
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_paid, access_expires_at')
    .eq('id', user.id)
    .single()

  const accessExpired = profile?.access_expires_at
    ? new Date(profile.access_expires_at) < new Date()
    : false
  if (!profile?.has_paid || accessExpired) redirect('/precio')

  // Módulo por slug (para validar que la lección pertenece a este módulo)
  const { data: mod } = await supabase
    .from('modules')
    .select('id, order_number, slug, title')
    .eq('slug', params.slug)
    .single()

  if (!mod) notFound()

  // Lección por slug
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, slug, order_number, frase_clave, apertura, audio_url, texto_audio, contexto_ejercicios, contexto_mejora, cierre_mejora, module_id')
    .eq('slug', params['lesson-slug'])
    .eq('module_id', mod.id)
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
      .eq('module_id', mod.id)
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

  const moduleHref = `/dashboard/modulos/${mod.slug}`
  const lessonHrefPrefix = `/dashboard/modulos/${mod.slug}`
  const moduleLabel = `Módulo ${String(mod.order_number).padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-background md:flex">
      <ModuleSidebar
        moduleLabel={moduleLabel}
        modTitle={mod.title}
        moduleHref={moduleHref}
        lessonHrefPrefix={lessonHrefPrefix}
        lessons={allLessons}
        completedIds={completedIds}
        activeSlug={lesson.slug}
      />

      <main className="flex-1 min-w-0">
        {/* Mobile stepper */}
        <div className="md:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center justify-between">
          <Link
            href={prevLesson ? `${lessonHrefPrefix}/${prevLesson.slug}` : moduleHref}
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
              href={`${lessonHrefPrefix}/${nextLesson.slug}`}
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
            isAuthenticated={true}
            isAlreadyCompleted={isAlreadyCompleted}
            nextSlug={nextLesson?.slug ?? null}
            lessonHrefPrefix={lessonHrefPrefix}
            completionRedirect={moduleHref}
            completionLabel="Volver al módulo →"
            moduleId={mod.id}
          />
        </div>
      </main>
    </div>
  )
}
