'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CheckoutButton() {
  const [promoCode, setPromoCode] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setIsPending(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoCode: promoCode.trim() || null }),
      })

      const data = await res.json() as { url?: string; error?: string }

      if (res.status === 401) {
        window.location.href = '/login?redirectTo=/precio'
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
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="promo-code" className="text-sm">
          Código promocional (opcional)
        </Label>
        <Input
          id="promo-code"
          placeholder="CODIGO2024"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          disabled={isPending}
          className="max-w-xs uppercase"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        onClick={handleCheckout}
        disabled={isPending}
        size="lg"
        className="w-full sm:w-auto"
      >
        {isPending ? 'Redirigiendo a Stripe...' : 'Acceder al programa completo'}
      </Button>
    </div>
  )
}
