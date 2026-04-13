import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Lock } from 'lucide-react'
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
      href={`/modulos/${module.slug}`}
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

// ── Tarjeta Diagnóstico (módulo 01 — siempre accesible) ───────────────────

function DiagnosticoCard({
  module,
  lc,
  isDiagCompletado,
}: {
  module: Module
  lc: LessonCount
  isDiagCompletado: boolean
}) {
  const isCompleted = getStatus(lc) === 'completado'
  return (
    <Link
      href={`/modulos/${module.slug}`}
      className={cn(
        'group flex flex-col gap-4 rounded-lg border p-5 transition-colors hover:border-foreground/30 col-span-1 sm:col-span-2',
        !isDiagCompletado && !isCompleted && 'border-primary/80 bg-primary/5',
        isCompleted && 'border-green-500/30 bg-green-500/5',
        isDiagCompletado && !isCompleted && 'border-border bg-card',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm text-muted-foreground font-semibold">
          {pad(module.order_number)}
        </span>
        <div className="flex items-center gap-2">
          {!isDiagCompletado && !isCompleted && (
            <Badge variant="outline" className="border-primary/50 text-primary text-xs">
              Empieza aquí
            </Badge>
          )}
          {isCompleted && (
            <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">
              ✓ Completado
            </Badge>
          )}
        </div>
      </div>
      <div className="space-y-1.5 flex-1">
        <h3 className="font-semibold text-base leading-snug group-hover:text-foreground/80 transition-colors">
          {module.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Lecciones</span>
          <span>{lc.completed}/{lc.total}</span>
        </div>
        <Progress value={lc.total > 0 ? Math.round((lc.completed / lc.total) * 100) : 0} className="h-1.5" />
      </div>
    </Link>
  )
}

// ── Tarjeta bloqueada (módulos 2-10 sin diagnóstico) ──────────────────────

function LockedModuleCard({ module }: { module: Module }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card/50 p-5 opacity-50 cursor-not-allowed">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm text-muted-foreground font-semibold">
          {pad(module.order_number)}
        </span>
        <Lock className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-1.5 flex-1">
        <h3 className="font-semibold text-base leading-snug">{module.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>
    </div>
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
  if (!profile?.has_paid || accessExpired) redirect('/precio')

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
  const diagModule = allModules.find((m) => m.order_number === 1) ?? null
  const otherPaidModules = allModules.filter((m) => m.order_number > 1)

  const allLessons = lessonsResult.data ?? []
  const completedLessonIds = new Set((progressResult.data ?? []).map((r) => r.lesson_id))

  // Todos los módulos de pago (diagnóstico + módulos 2-10)
  const allPaidModules = allModules.filter((m) => m.order_number > 0)

  // Calcular progreso por módulo (todos los de pago)
  const lessonCounts = new Map<string, LessonCount>()
  for (const mod of allPaidModules) {
    const moduleLessons = allLessons.filter((l) => l.module_id === mod.id)
    const completed = moduleLessons.filter((l) => completedLessonIds.has(l.id)).length
    lessonCounts.set(mod.id, { module_id: mod.id, total: moduleLessons.length, completed })
  }

  const nextRecommendedId = getNextRecommended(allPaidModules, lessonCounts)

  // Comprobar si el diagnóstico está completado
  const diagProgress = diagModule
    ? (await supabase
        .from('user_progress')
        .select('status')
        .eq('user_id', user.id)
        .eq('module_id', diagModule.id)
        .maybeSingle()
      ).data
    : null
  const isDiagCompletado = diagProgress?.status === 'completed'

  // Progreso total excluye lecciones del módulo 0 (zona pública)
  const paidLessons = mentalidadModule
    ? allLessons.filter((l) => l.module_id !== mentalidadModule.id)
    : allLessons
  const totalLessons = paidLessons.length
  const totalCompleted = paidLessons.filter((l) => completedLessonIds.has(l.id)).length
  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="px-8 py-10 space-y-10">

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

        {/* Banner de bloqueo */}
        {!isDiagCompletado && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4">
            <Lock className="h-4 w-4 text-primary shrink-0" />
            <p className="text-sm font-medium text-foreground">
              Completa el Diagnóstico Inicial para desbloquear todos los módulos
            </p>
          </div>
        )}

        {/* Módulo 00 — ancho completo */}
        {mentalidadModule && (
          <MentalidadCard module={mentalidadModule} />
        )}

        {/* Módulos 01-10 — grid 2 columnas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Módulo 01 — Diagnóstico (siempre accesible, destacado si no completado) */}
          {diagModule && (
            <DiagnosticoCard
              key={diagModule.id}
              module={diagModule}
              lc={lessonCounts.get(diagModule.id) ?? { module_id: diagModule.id, total: 0, completed: 0 }}
              isDiagCompletado={isDiagCompletado}
            />
          )}
          {/* Módulos 02-10 — bloqueados si diagnóstico no completado */}
          {otherPaidModules.map((module) => {
            const lc = lessonCounts.get(module.id) ?? { module_id: module.id, total: 0, completed: 0 }
            if (!isDiagCompletado) {
              return <LockedModuleCard key={module.id} module={module} />
            }
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
