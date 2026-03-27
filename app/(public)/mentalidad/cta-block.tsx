'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  paymentsCount: number
}

export default function CtaBlock({ paymentsCount }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLifetimeFull = paymentsCount >= 50

  async function handleCheckout() {
    setIsPending(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json() as { url?: string; error?: string }

      if (res.status === 401) {
        window.location.href = '/register'
        return
      }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Error al iniciar el pago. Inténtalo de nuevo.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Error de conexión. Comprueba tu internet e inténtalo de nuevo.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="border-primary/40 bg-primary/5">
      <CardContent className="py-8 space-y-6">

        {/* Copy principal */}
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="text-base font-semibold">Ya tienes lo más importante.</p>
          <p>
            Sabes que algo tiene que cambiar. Sabes que hay una forma mejor. Y sabes que esta vez no
            quieres hacerlo solo.
          </p>
          <p>No se trata de si vas a aplicar el método, sino de cuándo.</p>
          <p>
            Puedes empezar hoy y construir claridad desde el primer módulo. O puedes esperar otro
            mes. Tú eliges.
          </p>
          <p>
            Por un pago único de 799 euros, tienes acceso completo durante 6 meses — 10 módulos de
            consultoría guiada, tu Ejército de 12 Consultores especializados con IA avanzada
            adaptada a tu negocio, y acompañamiento real en cada paso.
          </p>
          <p>No es un curso. Es tu consultor privado.</p>
          <p className="italic text-muted-foreground">
            No hay milagros. Hay método. Y ahora tienes los dos.
          </p>
        </div>

        <div className="border-t border-border/40" />

        {/* Copy plazas */}
        <div className="space-y-3 text-sm leading-relaxed">
          <p className="font-semibold">Una cosa más.</p>
          <p>
            Los primeros 50 empresarios que entran tienen acceso de por vida — sin fecha de
            caducidad, sin renovaciones.
          </p>
          <p>A partir del número 51, el acceso es de 6 meses.</p>
          <p>
            No es un truco de marketing. Es una decisión que tomé para recompensar a quienes deciden
            antes. Y las plazas se están ocupando.
          </p>
          <p>Si estás leyendo esto, todavía estás a tiempo.</p>
        </div>

        {/* Contador dinámico */}
        <div className="rounded-md border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary">
          {isLifetimeFull
            ? 'Las plazas lifetime están completas. El acceso ahora es de 6 meses.'
            : `${paymentsCount} de 50 plazas lifetime ocupadas`}
        </div>

        {/* Botón CTA */}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          size="lg"
          className="w-full"
          onClick={handleCheckout}
          disabled={isPending}
        >
          {isPending ? 'Redirigiendo a Stripe...' : 'Entrar en la consultoría — 799€'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Pago único · IVA incluido · Acceso inmediato
        </p>

      </CardContent>
    </Card>
  )
}
