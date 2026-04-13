import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Flame, FileText } from 'lucide-react'

export const metadata = {
  title: 'Dashboard - Rentabilismo Academy',
}

// ── Constantes ─────────────────────────────────────────────────────────────

const FRASE_MOTIVACIONAL = 'Cada día que trabajas en tu negocio es un día que te acerca a donde quieres llegar.'

const REPORT_LABELS: Record<string, string> = {
  diagnostico_inicial: 'Diagnóstico de tu negocio',
  motivacional: 'Informe motivacional',
  progreso_50: 'Informe de progreso',
  final: 'Informe final',
}

const REPORT_HREFS: Record<string, string> = {
  diagnostico_inicial: '/api/informe/diagnostico',
}

// ── Tipos ──────────────────────────────────────────────────────────────────

type Module = {
  id: string
  order_number: number
  slug: string | null
  title: string
  description: string
  is_free: boolean
  is_active: boolean
}

type ModuleStatus = 'free' | 'locked' | 'available' | 'in_progress' | 'completed'

type EvolutionReport = {
  id: string
  report_type: string
  generated_at: string | null
}

// ── Helpers ────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function getModuleStatus(
  module: Module,
  progressMap: Map<string, string>,
  hasActiveAccess: boolean
): ModuleStatus {
  const status = progressMap.get(module.id)
  if (status === 'completed') return 'completed'
  if (status === 'in_progress') return 'in_progress'
  if (module.is_free) return 'free'
  if (hasActiveAccess) return 'available'
  return 'locked'
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ── Tarjeta héroe — módulo 00 (ancho completo) ────────────────────────────

function HeroModuleCard({ module }: { module: Module }) {
  return (
    <Link href="/mentalidad" className="block group">
      <Card className="border-primary/60 bg-primary/5 transition-colors group-hover:border-primary">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm text-primary/70 font-semibold">
              {pad(module.order_number)}
            </span>
            <Badge variant="secondary" className="text-sm px-3 py-0.5">
              Gratis — empieza aquí
            </Badge>
          </div>
          <CardTitle className="text-2xl leading-snug">{module.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base leading-relaxed">
            {module.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}

// ── Tarjeta estándar — módulos 01-10 ──────────────────────────────────────

function ModuleCard({ module, status }: { module: Module; status: ModuleStatus }) {
  const isClickable = (status === 'available' || status === 'completed' || status === 'in_progress') && !!module.slug
  const href = `/modulos/${module.slug}`

  const card = (
    <Card
      className={cn(
        'flex flex-col transition-colors h-full',
        isClickable && 'group-hover:border-foreground/30',
        status === 'completed' && 'border-green-500/30 bg-green-500/5',
        status === 'in_progress' && 'border-primary/60 bg-primary/5',
        status === 'locked' && 'bg-muted/20 border-border/40',
      )}
    >
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'font-mono text-xs',
              status === 'locked' ? 'text-muted-foreground/50' : 'text-muted-foreground',
            )}
          >
            {pad(module.order_number)}
          </span>
          {status === 'completed' && (
            <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">✓ Completado</Badge>
          )}
          {status === 'in_progress' && (
            <Badge className="text-xs bg-primary/10 text-primary border-primary/30 border">En progreso</Badge>
          )}
          {status === 'locked' && (
            <Badge variant="secondary" className="text-xs">Acceso completo</Badge>
          )}
          {status === 'available' && (
            <Badge variant="outline" className="text-xs">Disponible</Badge>
          )}
        </div>
        <CardTitle
          className={cn(
            'text-base leading-snug',
            status === 'locked' && 'text-muted-foreground',
          )}
        >
          {module.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription
          className={cn(
            'line-clamp-2 text-sm leading-relaxed',
            status === 'locked' && 'opacity-50',
          )}
        >
          {module.description}
        </CardDescription>
      </CardContent>
    </Card>
  )

  if (isClickable) {
    return (
      <Link href={href} className="block group h-full">
        {card}
      </Link>
    )
  }
  return card
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Queries en paralelo
  const [profileResult, modulesResult, progressResult, reportsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, current_streak, last_active_at, has_paid, access_expires_at')
      .eq('id', user.id)
      .single(),
    supabase
      .from('modules')
      .select('id, order_number, slug, title, description, is_free, is_active')
      .eq('is_active', true)
      .order('order_number'),
    supabase
      .from('user_progress')
      .select('module_id, status')
      .eq('user_id', user.id),
    supabase
      .from('evolution_reports')
      .select('id, report_type, generated_at')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false }),
  ])

  const profile = profileResult.data
  const modules: Module[] = modulesResult.data ?? []
  const reports: EvolutionReport[] = reportsResult.data ?? []

  // Mapa module_id → status
  const progressMap = new Map<string, string>(
    (progressResult.data ?? []).map((r) => [r.module_id as string, r.status as string])
  )

  const firstName = (profile?.full_name ?? 'Empresario').split(' ')[0]
  const streak = profile?.current_streak ?? 0
  const accessExpired = profile?.access_expires_at
    ? new Date(profile.access_expires_at) < new Date()
    : false
  const hasActiveAccess = !!profile?.has_paid && !accessExpired

  const paidModules = modules.filter((m) => !m.is_free)
  const totalModules = paidModules.length || 10
  const completedCount = paidModules.filter((m) => progressMap.get(m.id) === 'completed').length
  const progressPercent = Math.round((completedCount / totalModules) * 100)

  // Módulo de continuación: primero in_progress, luego primer available sin empezar
  const continueModule =
    paidModules.find((m) => progressMap.get(m.id) === 'in_progress') ??
    (hasActiveAccess ? paidModules.find((m) => !progressMap.has(m.id) || progressMap.get(m.id) === 'not_started') : null)

  return (
    <div className="min-h-screen bg-background">
      <div className="px-8 py-10 space-y-10">

        {/* ── Bienvenida ── */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hola, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            {FRASE_MOTIVACIONAL}
          </p>
        </div>

        {/* ── Progreso global ── */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progreso del programa</span>
            <span className="text-muted-foreground">
              {completedCount} de {totalModules} módulos completados
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          {continueModule && continueModule.slug && (
            <Link
              href={`/modulos/${continueModule.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Continúa donde lo dejaste: {continueModule.title} →
            </Link>
          )}
        </div>

        {/* ── Racha ── */}
        <div className="flex items-center gap-3">
          <Flame className={cn('h-5 w-5', streak > 0 ? 'text-orange-500' : 'text-muted-foreground/40')} />
          {streak > 0 ? (
            <span className="text-sm font-medium">
              Racha actual: {streak} {streak === 1 ? 'día' : 'días'} seguidos
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Empieza tu racha trabajando hoy
            </span>
          )}
        </div>

        {/* ── CTA si no tiene acceso activo ── */}
        {!hasActiveAccess && (
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">
                  {accessExpired
                    ? 'Tu acceso ha expirado'
                    : 'Desbloquea el programa completo'}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Accede a los 11 módulos, los consultores y el seguimiento diario.
                </p>
              </div>
              <Link
                href="/precio"
                className="shrink-0 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-8 px-4 text-sm font-medium hover:bg-primary/80 transition-colors"
              >
                Ver planes
              </Link>
            </CardContent>
          </Card>
        )}

        {/* ── Grid de módulos ── */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Módulos</h2>

          {/* Módulo 00 — héroe, ancho completo */}
          {modules[0] && (
            <HeroModuleCard module={modules[0]} />
          )}

          {/* Módulos 01-10 — grid 2 columnas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {modules.slice(1).map((module) => {
              const status = getModuleStatus(module, progressMap, hasActiveAccess)
              return (
                <ModuleCard key={module.id} module={module} status={status} />
              )
            })}
          </div>
        </div>

        {/* ── Informes ── */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Tus informes</h2>
          {reports.length === 0 ? (
            <div className="flex items-start gap-3 rounded-lg border border-dashed p-5 text-muted-foreground">
              <FileText className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">
                Tu primer informe se generará al completar el módulo Mentalidad.
                Cada hito importante del programa genera un informe personalizado con tus datos reales.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {reports.map((report) => {
                const label = REPORT_LABELS[report.report_type] ?? report.report_type
                const href = REPORT_HREFS[report.report_type]
                  ? `${REPORT_HREFS[report.report_type]}/${user.id}`
                  : null

                const card = (
                  <Card
                    className={cn(
                      'transition-colors',
                      href && 'group-hover:border-foreground/30',
                    )}
                  >
                    <CardContent className="flex items-center justify-between gap-3 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{label}</p>
                          {report.generated_at && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(report.generated_at)}
                            </p>
                          )}
                        </div>
                      </div>
                      {href && (
                        <span className="text-xs text-primary shrink-0">Ver →</span>
                      )}
                    </CardContent>
                  </Card>
                )

                return href ? (
                  <Link
                    key={report.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    {card}
                  </Link>
                ) : (
                  <div key={report.id}>{card}</div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
