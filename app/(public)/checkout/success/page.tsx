'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const MAX_ATTEMPTS = 15  // 15 × 2s = 30s máximo
const POLL_INTERVAL = 2000

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [attempt, setAttempt] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    async function checkPayment() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
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
        return
      }

      setAttempt((prev) => {
        const next = prev + 1
        if (next >= MAX_ATTEMPTS) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          // Timeout — redirigir igualmente, el dashboard mostrará el estado real
          router.replace('/dashboard')
        }
        return next
      })
    }

    // Primer check inmediato
    checkPayment()
    intervalRef.current = setInterval(checkPayment, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <h1 className="text-2xl font-bold">Confirmando tu pago…</h1>
        <p className="text-muted-foreground text-sm">
          Estamos activando tu acceso. Esto solo tarda unos segundos.
        </p>
      </div>
    </div>
  )
}
