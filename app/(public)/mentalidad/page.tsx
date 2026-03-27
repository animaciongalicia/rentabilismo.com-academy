import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
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

  // Lecciones del módulo 0, ordenadas
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, slug, order_number')
    .eq('module_id', 0)
    .order('order_number')

  // Progreso del usuario (solo si hay sesión)
  const completedIds = new Set<string>()
  if (user) {
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
    for (const row of progress ?? []) completedIds.add(row.lesson_id)
  }

  // Contador de pagos completados (función SECURITY DEFINER accesible por anon)
  const { data: countData } = await supabase.rpc('get_completed_payments_count')
  const paymentsCount = Number(countData ?? 0)

  const lessonList = lessons ?? []
  const completedCount = lessonList.filter((l) => completedIds.has(l.id)).length
  const showCta = user !== null && completedCount === 4

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 space-y-12">

        {/* ── Header ── */}
        <div className="space-y-4">
          <Badge variant="free">Módulo gratuito</Badge>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Tu Cabeza Manda
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Para que tu empresa cambie, tú tienes que cambiar primero.
          </p>
        </div>

        {/* ── Lista de lecciones ── */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            4 lecciones
          </p>
          <div className="space-y-2">
            {lessonList.map((lesson) => {
              const isCompleted = completedIds.has(lesson.id)
              return (
                <Link
                  key={lesson.id}
                  href={`/mentalidad/${lesson.slug}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3.5 transition-colors hover:border-foreground/30 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-sm text-muted-foreground shrink-0">
                      {String(lesson.order_number).padStart(2, '0')}
                    </span>
                    <span className="font-medium text-sm group-hover:text-foreground truncate">
                      {lesson.title}
                    </span>
                  </div>
                  {user && (
                    isCompleted
                      ? <Badge variant="completed" className="shrink-0">Completada</Badge>
                      : <Badge variant="locked" className="shrink-0">Pendiente</Badge>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Indicador de progreso (solo con sesión) */}
          {user && (
            <p className="text-xs text-muted-foreground text-right">
              {completedCount} de 4 lecciones completadas
            </p>
          )}
        </div>

        {/* ── CTA — visible SOLO cuando 4/4 completadas ── */}
        {showCta && (
          <CtaBlock paymentsCount={paymentsCount} />
        )}

      </div>
    </div>
  )
}
