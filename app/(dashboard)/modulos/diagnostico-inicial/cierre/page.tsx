import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { checkDiagnosticoComplete } from '@/lib/reports/check-diagnostico-complete'
import { InformeButton } from './informe-button'

export const metadata = {
  title: 'Tu diagnóstico está listo — Rentabilismo Academy',
}

export default async function CierrePage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/modulos/diagnostico-inicial/cierre')

  const profileResult = await supabase
    .from('profiles')
    .select('has_paid')
    .eq('id', user.id)
    .single()

  if (!profileResult.data?.has_paid) redirect('/onboarding/mentalidad')

  // Verificar que las 4 lecciones están completadas
  const { isComplete, firstIncompleteLessonSlug } = await checkDiagnosticoComplete(
    supabase,
    user.id
  )

  if (!isComplete && firstIncompleteLessonSlug) {
    redirect(`/modulos/diagnostico-inicial/${firstIncompleteLessonSlug}`)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-[600px] w-full space-y-10 py-16">

        {/* Icono */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-4xl select-none">✓</span>
          </div>
        </div>

        {/* Título */}
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight leading-snug">
            Acabas de hacer lo que el 90% de los empresarios nunca hace.
          </h1>
        </div>

        {/* Texto */}
        <div className="space-y-5 text-base leading-relaxed text-foreground/90">
          <p>Mirar la verdad de frente.</p>
          <p>
            Las respuestas que acabas de dar son tu punto de partida real. No lo que crees, no lo
            que le cuentas a otros — lo que es. Con tus números, tus palabras, tu negocio.
          </p>
          <p>
            A partir de aquí, cada módulo que trabajes va a partir de esta fotografía. Vas a volver
            a mirarla. Y vas a ver cómo cambia.
          </p>
          <p className="font-semibold text-foreground">Tu informe de diagnóstico está listo.</p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <InformeButton userId={user.id} />
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Volver al dashboard
          </Link>
        </div>

      </div>
    </div>
  )
}
