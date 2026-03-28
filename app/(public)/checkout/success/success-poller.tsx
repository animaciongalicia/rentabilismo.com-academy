'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const MAX_ATTEMPTS = 5   // 5 × 2s = 10s máximo
const POLL_INTERVAL = 2000

export default function SuccessPoller() {
  const router = useRouter()
  const [timedOut, setTimedOut] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    async function checkPayment() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Sin sesión: Stripe confirmó el pago pero la sesión no está restaurada aún.
        // Redirigir al dashboard — el middleware gestionará el estado.
        router.replace('/dashboard')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('has_paid')
        .eq('id', user.id)
        .single()

      if (profile?.has_paid) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        router.replace('/dashboard')
      }
    }

    let attempts = 0

    checkPayment()
    intervalRef.current = setInterval(() => {
      attempts++
      if (attempts >= MAX_ATTEMPTS) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setTimedOut(true)
        return
      }
      checkPayment()
    }, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [router])

  if (timedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="text-4xl">✅</div>
          <h1 className="text-2xl font-bold">Tu pago fue procesado</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Tu acceso se activará en unos minutos. Puedes entrar al dashboard
            ahora — si aún no aparece tu acceso, refresca la página en 1 minuto.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-10 px-5 text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            Ir al dashboard →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <h1 className="text-2xl font-bold">¡Pago confirmado!</h1>
        <p className="text-muted-foreground text-sm">
          Activando tu acceso. Esto solo tarda unos segundos.
        </p>
      </div>
    </div>
  )
}
