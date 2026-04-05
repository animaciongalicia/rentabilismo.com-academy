import Link from 'next/link'
import { cn } from '@/lib/utils'

type Lesson = { id: string; slug: string; order_number: number; title: string }

type Props = {
  moduleLabel: string
  modTitle: string
  moduleHref: string
  lessonHrefPrefix: string
  lessons: Lesson[]
  completedIds: string[]
  activeSlug?: string | null
  moduleSlug?: string
}

export default function ModuleSidebar({
  moduleLabel,
  modTitle,
  moduleHref,
  lessonHrefPrefix,
  lessons,
  completedIds,
  activeSlug,
  moduleSlug,
}: Props) {
  const completed = new Set(completedIds)

  return (
    <aside className="hidden md:flex flex-col sticky top-0 h-screen w-[320px] shrink-0 border-r border-border bg-muted/40 overflow-y-auto">
      <div className="p-5 space-y-6">

        {/* Módulo header */}
        <Link
          href={moduleHref}
          className={cn(
            'block rounded-md px-2 py-1 -mx-2 transition-colors',
            !activeSlug
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            {moduleLabel}
          </p>
          <p className={cn('font-semibold text-sm mt-1 leading-snug', !activeSlug && 'text-foreground')}>
            {modTitle}
          </p>
        </Link>

        {/* Lista de lecciones */}
        <nav className="space-y-0.5">
          {lessons.map((lesson) => {
            const isActive = lesson.slug === activeSlug
            const isCompleted = completed.has(lesson.id)
            return (
              <Link
                key={lesson.id}
                href={`${lessonHrefPrefix}/${lesson.slug}`}
                className={cn(
                  'flex items-start gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-background text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                )}
              >
                <span className="font-mono text-xs shrink-0 mt-0.5 tabular-nums w-5 text-right">
                  {String(lesson.order_number).padStart(2, '0')}
                </span>
                <span className="leading-snug flex-1 min-w-0 line-clamp-2">{lesson.title}</span>
                {isCompleted && (
                  <span className="shrink-0 mt-0.5 text-xs text-green-600 dark:text-green-400 font-bold">
                    ✓
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        {moduleSlug === 'mentalidad' && (
          <div className="pt-4 border-t border-border space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Tu consultor
            </p>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">El Espejo</p>
              <p className="text-xs text-muted-foreground leading-snug">
                El consultor que coge tus respuestas y te las devuelve ordenadas. Sin filtro.
              </p>
            </div>
            <Link
              href="/cuartel-general/el-espejo"
              className="block w-full text-center rounded-md bg-primary text-primary-foreground text-xs font-medium py-2 hover:bg-primary/80 transition-colors"
            >
              Conoce a El Espejo
            </Link>
            <Link
              href="/cuartel-general"
              className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver todos los consultores
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
