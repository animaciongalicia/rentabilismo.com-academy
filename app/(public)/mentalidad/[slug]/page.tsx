import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import ExerciseForm, { type Exercise } from './exercise-form'

type Props = { params: { slug: string } }

type LessonSummary = {
  id: string
  slug: string
  order_number: number
  title: string
}

// ── Metadata ───────────────────────────────────────────────────────────────

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

// ── Placeholders ───────────────────────────────────────────────────────────

function VideoPlaceholder() {
  return (
    <div className="aspect-video w-full rounded-xl border border-border bg-muted/30 flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <div className="w-14 h-14 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-sm font-medium">Vídeo disponible próximamente</p>
    </div>
  )
}

function AudioPlaceholder() {
  return (
    <div className="w-full rounded-lg border border-border bg-muted/20 px-5 py-4 flex items-center gap-4">
      <div className="w-9 h-9 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0 text-muted-foreground">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium">Audio — mensaje central</p>
        <p className="text-xs text-muted-foreground mt-0.5">Disponible próximamente</p>
      </div>
    </div>
  )
}

// ── Sidebar (desktop) ──────────────────────────────────────────────────────

function Sidebar({
  lessons,
  currentSlug,
  completedIds,
  isAuthenticated,
}: {
  lessons: LessonSummary[]
  currentSlug: string
  completedIds: Set<string>
  isAuthenticated: boolean
}) {
  return (
    <aside className="hidden md:flex flex-col sticky top-0 h-screen w-64 shrink-0 border-r border-border bg-background overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Módulo */}
        <Link href="/mentalidad" className="block group">
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
            Módulo 0
          </p>
          <p className="font-semibold text-sm mt-1 leading-snug group-hover:text-primary transition-colors">
            Tu Cabeza Manda
          </p>
        </Link>

        {/* Lista de lecciones */}
        <nav className="space-y-0.5">
          {lessons.map((lesson) => {
            const isActive = lesson.slug === currentSlug
            const isCompleted = completedIds.has(lesson.id)
            return (
              <Link
                key={lesson.id}
                href={`/mentalidad/${lesson.slug}`}
                className={cn(
                  'flex items-start gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <span className="font-mono text-xs shrink-0 mt-0.5 tabular-nums w-5 text-right">
                  {String(lesson.order_number).padStart(2, '0')}
                </span>
                <span className="leading-snug flex-1 min-w-0">{lesson.title}</span>
                {isAuthenticated && isCompleted && (
                  <span
                    className="shrink-0 mt-0.5 text-xs text-green-600 dark:text-green-400 font-bold"
                    aria-label="Completada"
                  >
                    ✓
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

// ── Mobile stepper (fijo arriba en móvil) ─────────────────────────────────

function MobileStepper({
  currentOrder,
  total,
  prevSlug,
  nextSlug,
}: {
  currentOrder: number
  total: number
  prevSlug: string | null
  nextSlug: string | null
}) {
  const prevHref = prevSlug ? `/mentalidad/${prevSlug}` : '/mentalidad'
  const nextHref = nextSlug ? `/mentalidad/${nextSlug}` : null

  return (
    <div className="md:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center justify-between">
      <Link
        href={prevHref}
        className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Lección anterior"
      >
        ←
      </Link>
      <span className="text-sm font-medium">
        Lección {currentOrder} de {total}
      </span>
      {nextHref ? (
        <Link
          href={nextHref}
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Siguiente lección"
        >
          →
        </Link>
      ) : (
        <div className="w-8" aria-hidden="true" />
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function LessonPage({ params }: Props) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, slug, order_number, frase_clave, apertura, vimeo_id, audio_url, module_id')
    .eq('slug', params.slug)
    .single()

  if (!lesson) notFound()

  // Tres queries en paralelo
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
    // Obtenemos todo el progreso del usuario para mostrar estado en el sidebar
    user
      ? supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
      : Promise.resolve({ data: [] as { lesson_id: string }[] }),
  ])

  const exercises = (exercisesResult.data ?? []) as Exercise[]
  const allLessons = (allLessonsResult.data ?? []) as LessonSummary[]
  const completedIds = new Set((progressResult.data ?? []).map((r) => r.lesson_id))
  const isAlreadyCompleted = completedIds.has(lesson.id)

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-background">

      {/* ── Stepper móvil (oculto en md+) ── */}
      <MobileStepper
        currentOrder={lesson.order_number}
        total={allLessons.length}
        prevSlug={prevLesson?.slug ?? null}
        nextSlug={nextLesson?.slug ?? null}
      />

      <div className="md:flex">

        {/* ── Sidebar desktop (oculto en móvil) ── */}
        <Sidebar
          lessons={allLessons}
          currentSlug={lesson.slug}
          completedIds={completedIds}
          isAuthenticated={!!user}
        />

        {/* ── Contenido principal ── */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-[680px] px-4 py-10 md:py-12 space-y-10">

            {/* Breadcrumb — solo desktop (el sidebar ya orienta) */}
            <nav className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/mentalidad" className="hover:text-foreground transition-colors">
                Tu Cabeza Manda
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground truncate">{lesson.title}</span>
            </nav>

            {/* ── Header ── */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                Lección {lesson.order_number}
              </p>
              <h1 className="text-3xl font-bold tracking-tight leading-snug">
                {lesson.title}
              </h1>
              <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground leading-relaxed">
                {lesson.frase_clave}
              </blockquote>
            </div>

            {/* ── Apertura ── */}
            {lesson.apertura && (
              <div className="space-y-4">
                {lesson.apertura.split('\n\n').map((paragraph: string, i: number) => (
                  <p key={i} className="text-base leading-relaxed text-foreground/90">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* ── Vídeo ── */}
            {lesson.vimeo_id ? null /* TODO: embed Vimeo */ : <VideoPlaceholder />}

            {/* ── Audio ── */}
            {lesson.audio_url ? null /* TODO: embed audio */ : <AudioPlaceholder />}

            <div className="border-t border-border/50" />

            {/* ── Ejercicios + botón completar ── */}
            <ExerciseForm
              lessonId={lesson.id}
              exercises={exercises}
              isAuthenticated={!!user}
              isAlreadyCompleted={isAlreadyCompleted}
              nextSlug={nextLesson?.slug ?? null}
            />

            {/* ── Navegación inferior (solo desktop) ── */}
            <div className="hidden md:flex justify-between gap-4 pt-4 border-t border-border">
              {prevLesson ? (
                <Link
                  href={`/mentalidad/${prevLesson.slug}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors max-w-[45%]"
                >
                  <span aria-hidden="true">←</span>
                  <span className="truncate">{prevLesson.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link
                  href={`/mentalidad/${nextLesson.slug}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors max-w-[45%] text-right"
                >
                  <span className="truncate">{nextLesson.title}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <Link
                  href="/mentalidad"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Volver al módulo
                </Link>
              )}
            </div>

          </div>
        </main>

      </div>
    </div>
  )
}
