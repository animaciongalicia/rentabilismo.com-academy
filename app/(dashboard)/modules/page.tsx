import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Módulos — Rentabilismo Academy',
}

// ── Tipos ──────────────────────────────────────────────────────────────────

type Module = {
  id: string
  order_number: number
  slug: string
  title: string
  description: string
}

type LessonCount = {
  module_id: string
  total: number
  completed: number
}

type ModuleStatus = 'no-empezado' | 'en-progreso' | 'completado'

// ── Helpers ────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function getStatus(lc: LessonCount): ModuleStatus {
  if (lc.completed === 0) return 'no-empezado'
  if (lc.completed >= lc.total) return 'completado'
  return 'en-progreso'
}

function getNextRecommended(modules: Module[], lessonCounts: Map<string, LessonCount>): string | null {
  // Primer módulo en progreso
  const inProgress = modules.find((m) => {
    const lc = lessonCounts.get(m.id)
    return lc && getStatus(lc) === 'en-progreso'
  })
  if (inProgress) return inProgress.id

  // Si no hay ninguno en progreso, el primero no empezado
  const notStarted = modules.find((m) => {
    const lc = lessonCounts.get(m.id)
    return !lc || getStatus(lc) === 'no-empezado'
  })
  return notStarted?.id ?? null
}

// ── Tarjeta Mentalidad (módulo 00 — zona pública) ─────────────────────────

function MentalidadCard({ module }: { module: Module }) {
  return (
    <Link
      href="/mentalidad"
      className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm text-muted-foreground font-semibold">
          {pad(module.order_number)}
        </span>
        <Badge variant="secondary" className="text-xs">
          Gratis — empieza aquí
        </Badge>
      </div>

      <div className="space-y-1.5 flex-1">
        <h3 className="font-semibold text-base leading-snug group-hover:text-foreground/80 transition-colors">
          {module.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>
    </Link>
  )
}

// ── Componente de tarjeta ──────────────────────────────────────────────────

function ModuleCard({
  module,
  lc,
  isRecommended,
}: {
  module: Module
  lc: LessonCount
  isRecommended: boolean
}) {
  const status = getStatus(lc)
  const progressPercent = lc.total > 0 ? Math.round((lc.completed / lc.total) * 100) : 0

  return (
    <Link
      href={`/dashboard/modules/${module.slug}`}
      className={cn(
        'group flex flex-col gap-4 rounded-lg border p-5 transition-colors hover:border-foreground/30',
        isRecommended && 'border-primary/60 bg-primary/5',
        status === 'completado' && 'border-green-500/30 bg-green-500/5',
        !isRecommended && status !== 'completado' && 'border-border bg-card',
      )}
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm text-muted-foreground font-semibold">
          {pad(module.order_number)}
        </span>
        <div className="flex items-center gap-2">
          {isRecommended && (
            <Badge variant="outline" className="border-primary/50 text-primary text-xs">
              Siguiente
            </Badge>
          )}
          {status === 'completado' && (
            <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">
              ✓ Completado
            </Badge>
          )}
          {status === 'en-progreso' && !isRecommended && (
            <Badge variant="secondary" className="text-xs">
              En progreso
            </Badge>
          )}
        </div>
      </div>

      {/* Título y descripción */}
      <div className="space-y-1.5 flex-1">
        <h3 className="font-semibold text-base leading-snug group-hover:text-foreground/80 transition-colors">
          {module.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Lecciones</span>
          <span>{lc.completed}/{lc.total}</span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>
    </Link>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function ModulesPage() {
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
  if (!profile?.has_paid || accessExpired) redirect('/pricing')

  // Módulos 0-10 (el 0 es mentalidad, zona pública)
  const [modulesResult, lessonsResult, progressResult] = await Promise.all([
    supabase
      .from('modules')
      .select('id, order_number, slug, title, description')
      .gte('order_number', 0)
      .order('order_number'),
    supabase
      .from('lessons')
      .select('id, module_id'),
    supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id),
  ])

  const allModules: Module[] = (modulesResult.data ?? []).filter((m) => m.slug)
  const mentalidadModule = allModules.find((m) => m.order_number === 0) ?? null
  const paidModules = allModules.filter((m) => m.order_number > 0)

  const allLessons = lessonsResult.data ?? []
  const completedLessonIds = new Set((progressResult.data ?? []).map((r) => r.lesson_id))

  // Calcular progreso por módulo (solo módulos de pago)
  const lessonCounts = new Map<string, LessonCount>()
  for (const mod of paidModules) {
    const moduleLessons = allLessons.filter((l) => l.module_id === mod.id)
    const completed = moduleLessons.filter((l) => completedLessonIds.has(l.id)).length
    lessonCounts.set(mod.id, { module_id: mod.id, total: moduleLessons.length, completed })
  }

  const nextRecommendedId = getNextRecommended(paidModules, lessonCounts)

  // Progreso total excluye lecciones del módulo 0 (zona pública)
  const paidLessons = mentalidadModule
    ? allLessons.filter((l) => l.module_id !== mentalidadModule.id)
    : allLessons
  const totalLessons = paidLessons.length
  const totalCompleted = paidLessons.filter((l) => completedLessonIds.has(l.id)).length
  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">

        {/* Cabecera */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">El Programa</h1>
          <p className="text-muted-foreground">
            10 módulos. Cada uno opera un área concreta de tu negocio.
          </p>
        </div>

        {/* Progreso general */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progreso total</span>
            <span className="text-muted-foreground">{totalCompleted} de {totalLessons} lecciones</span>
          </div>
          <Progress value={overallPercent} className="h-2" />
        </div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mentalidadModule && (
            <MentalidadCard key={mentalidadModule.id} module={mentalidadModule} />
          )}
          {paidModules.map((module) => {
            const lc = lessonCounts.get(module.id) ?? { module_id: module.id, total: 0, completed: 0 }
            return (
              <ModuleCard
                key={module.id}
                module={module}
                lc={lc}
                isRecommended={module.id === nextRecommendedId}
              />
            )
          })}
        </div>

      </div>
    </div>
  )
}
