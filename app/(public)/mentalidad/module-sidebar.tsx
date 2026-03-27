import Link from 'next/link'
import { cn } from '@/lib/utils'

type Lesson = { id: string; slug: string; order_number: number; title: string }

type Props = {
  modTitle: string
  lessons: Lesson[]
  completedIds: string[]
  activeSlug?: string | null
}

export default function ModuleSidebar({ modTitle, lessons, completedIds, activeSlug }: Props) {
  const completed = new Set(completedIds)

  return (
    <aside className="hidden md:flex flex-col sticky top-0 h-screen w-[300px] shrink-0 border-r border-border bg-muted/40 overflow-y-auto">
      <div className="p-5 space-y-6">

        {/* Módulo header */}
        <Link
          href="/mentalidad"
          className={cn(
            'block rounded-md px-2 py-1 -mx-2 transition-colors',
            !activeSlug
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Módulo 0
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
                href={`/mentalidad/${lesson.slug}`}
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
      </div>
    </aside>
  )
}
