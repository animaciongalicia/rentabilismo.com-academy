import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { getAvatarColor, getInitials } from '@/lib/utils/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import ProfileForm from './profile-form'
import CopyButton from './copy-button'

const DIAS_ACCESO_YEARLY = 180

function formatDateSpanish(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default async function PerfilPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'full_name, business_name, business_type, biggest_problem, has_paid, access_type, access_expires_at, created_at'
    )
    .eq('id', user.id)
    .single()

  if (!profile?.has_paid) redirect('/registro')

  // Afiliados: tabla sin RLS para authenticated → admin client
  const admin = getSupabaseAdminClient()
  const { data: affiliate } = await admin
    .from('affiliates')
    .select('referral_code, referred_count, commission_total, is_active')
    .eq('user_id', user.id)
    .maybeSingle()

  const fullName = profile.full_name ?? user.email ?? 'Empresario'
  const avatarColor = getAvatarColor(fullName)
  const initials = getInitials(fullName)
  const activeSince = formatDateSpanish(new Date(profile.created_at))

  // Calcular progreso para acceso yearly
  let daysRemaining = 0
  let daysElapsed = 0
  let progressPercent = 0

  if (profile.access_type === 'yearly' && profile.access_expires_at) {
    const expiresAt = new Date(profile.access_expires_at).getTime()
    const now = Date.now()
    daysRemaining = Math.max(0, Math.floor((expiresAt - now) / (1000 * 60 * 60 * 24)))
    daysElapsed = Math.max(0, DIAS_ACCESO_YEARLY - daysRemaining)
    progressPercent = Math.min(100, Math.round((daysElapsed / DIAS_ACCESO_YEARLY) * 100))
  }

  return (
    <div className="px-8 py-10">
      <div className="space-y-6">

        {/* ── SECCIÓN 1: CABECERA ── */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div
                className={`${avatarColor} w-20 h-20 rounded-full flex items-center justify-center shrink-0`}
              >
                <span className="text-white text-2xl font-bold leading-none">
                  {initials}
                </span>
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold leading-tight">{fullName}</h1>
                {profile.access_type === 'lifetime' && (
                  <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">
                    Acceso permanente
                  </Badge>
                )}
                {profile.access_type === 'yearly' && (
                  <Badge className="bg-blue-600 hover:bg-blue-600 text-white">
                    Acceso 6 meses
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground">
                  Activo desde el {activeSince}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── SECCIÓN 2: MI NEGOCIO ── */}
        <ProfileForm
          businessName={profile.business_name}
          businessType={profile.business_type}
          biggestProblem={profile.biggest_problem}
        />

        {/* ── SECCIÓN 3: MI ACCESO ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mi acceso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.access_type === 'lifetime' ? (
              <p className="text-sm text-muted-foreground">
                Tienes acceso permanente. Sin fecha de caducidad.
              </p>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {daysElapsed} de {DIAS_ACCESO_YEARLY} días utilizados
                  </span>
                  {daysRemaining <= 30 ? (
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      Quedan {daysRemaining} días
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Quedan {daysRemaining} días
                    </span>
                  )}
                </div>
                <Progress value={progressPercent} className="h-2" />
                {daysRemaining <= 30 && (
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Tu acceso caduca pronto. Contacta con soporte para renovar.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* ── SECCIÓN 4: CÓDIGO DE REFERIDO (solo si existe registro en affiliates) ── */}
        {affiliate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Código de referido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <code className="flex-1 rounded-sm bg-muted px-3 py-2 text-sm font-mono font-semibold tracking-wider">
                  {affiliate.referral_code}
                </code>
                <CopyButton text={affiliate.referral_code} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-sm bg-muted/50 p-3 space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Ventas generadas
                  </p>
                  <p className="text-lg font-bold">{affiliate.referred_count}</p>
                </div>
                <div className="rounded-sm bg-muted/50 p-3 space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Comisiones ganadas
                  </p>
                  <p className="text-lg font-bold">
                    {Number(affiliate.commission_total).toFixed(2)} €
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
