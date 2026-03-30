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

export const metadata = {
  title: 'Dashboard - Rentabilismo Academy',
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

type ModuleStatus = 'free' | 'locked' | 'available' | 'completed'

// ── Helpers ────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function getModuleStatus(
  module: Module,
  completedIds: Set<string>,
  hasActiveAccess: boolean
): ModuleStatus {
  if (completedIds.has(module.id)) return 'completed'
  if (module.is_free) return 'free'
  if (hasActiveAccess) return 'available'
  return 'locked'
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
  const isClickable = (status === 'available' || status === 'completed') && !!module.slug
  const href = `/dashboard/modules/${module.slug}`

  const card = (
    <Card
      className={cn(
        'flex flex-col transition-colors h-full',
        isClickable && 'group-hover:border-foreground/30',
        status === 'completed' && 'border-green-500/30 bg-green-500/5',
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

  // Tres queries en paralelo
  const [profileResult, modulesResult, progressResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, current_streak, has_paid, access_expires_at')
      .eq('id', user.id)
      .single(),
    supabase
      .from('modules')
      .select('id, order_number, slug, title, description, is_free, is_active')
      .eq('is_active', true)
      .order('order_number'),
    supabase
      .from('user_progress')
      .select('module_id')
      .eq('user_id', user.id),
  ])

  const profile = profileResult.data
  const modules: Module[] = modulesResult.data ?? []
  const completedIds = new Set<string>(
    (progressResult.data ?? []).map((r) => r.module_id as string)
  )

  const firstName = (profile?.full_name ?? 'Empresario').split(' ')[0]
  const streak = profile?.current_streak ?? 0
  const accessExpired = profile?.access_expires_at
    ? new Date(profile.access_expires_at) < new Date()
    : false
  const hasActiveAccess = !!profile?.has_paid && !accessExpired

  const paidModules = modules.filter((m) => !m.is_free)
  const totalModules = paidModules.length || 10
  const completedCount = paidModules.filter((m) => completedIds.has(m.id)).length
  const progressPercent = Math.round((completedCount / totalModules) * 100)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">

        {/* ── Cabecera ── */}
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">
              Hola, {firstName}
            </h1>
            {streak > 0 && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {streak} {streak === 1 ? 'día' : 'días'} seguidos
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Tu programa de transformación empresarial
          </p>
        </div>

        {/* ── Progreso general ── */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progreso del programa</span>
            <span className="text-muted-foreground">
              {completedCount} de {totalModules} módulos
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
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
                  Accede a los 11 módulos, la comunidad y el seguimiento diario.
                </p>
              </div>
              <Link
                href="/pricing"
                className="shrink-0 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-8 px-4 text-sm font-medium hover:bg-primary/80 transition-colors"
              >
                Ver planes
              </Link>
            </CardContent>
          </Card>
        )}

        {/* ── Grid de módulos ── */}
        <div className="space-y-4">
          {/* Módulo 00 — héroe, ancho completo */}
          {modules[0] && (
            <HeroModuleCard
              module={modules[0]}
            />
          )}

          {/* Módulos 01-10 — grid 2 columnas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {modules.slice(1).map((module) => {
              const status = getModuleStatus(module, completedIds, hasActiveAccess)
              return (
                <ModuleCard key={module.id} module={module} status={status} />
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
