'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { signPacto } from '../actions'

interface PactoEmpresarioProps {
  fullName: string
}

export default function PactoEmpresario({ fullName }: PactoEmpresarioProps) {
  const router = useRouter()
  const [startingPoint, setStartingPoint] = useState('')
  const [desiredDestination, setDesiredDestination] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = startingPoint.trim().length > 0 && desiredDestination.trim().length > 0 && accepted

  async function handleSign() {
    if (!canSubmit || isPending) return
    setIsPending(true)
    setError(null)

    const result = await signPacto({
      startingPoint: startingPoint.trim(),
      desiredDestination: desiredDestination.trim(),
    })

    if ('error' in result) {
      setError(result.error)
      setIsPending(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="w-full max-w-2xl py-16 px-4">
      {/* Etiqueta */}
      <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Módulo 1 · Diagnóstico Inicial
      </p>

      {/* Título */}
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        El Pacto del Empresario
      </h1>
      <p className="text-muted-foreground text-lg mb-10">
        Antes de empezar, un compromiso contigo mismo.
      </p>

      {/* Texto del pacto */}
      <blockquote className="rounded-lg border-l-4 border-primary bg-muted/50 px-6 py-5 text-sm leading-relaxed italic text-foreground mb-10">
        Yo, <strong>{fullName}</strong>, me comprometo a trabajar en mi negocio
        con honestidad, aplicar lo que aprendo y no rendirme cuando lleguen las
        excusas. Entiendo que si no hago nada diferente, en 6 meses estaré
        exactamente igual — o peor.
      </blockquote>

      {/* Preguntas */}
      <div className="space-y-6 mb-8">
        <div className="space-y-2">
          <Label htmlFor="starting-point" className="text-base font-medium">
            ¿Dónde estás ahora?
          </Label>
          <p className="text-sm text-muted-foreground">
            Describe brevemente la situación real de tu negocio hoy.
          </p>
          <Textarea
            id="starting-point"
            value={startingPoint}
            onChange={(e) => setStartingPoint(e.target.value)}
            placeholder="Mi negocio factura X, tengo Y clientes, el problema principal es..."
            rows={3}
            disabled={isPending}
            className="resize-none border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desired-destination" className="text-base font-medium">
            ¿Dónde quieres llegar en 6 meses?
          </Label>
          <p className="text-sm text-muted-foreground">
            Sé específico. Un objetivo concreto, no un deseo genérico.
          </p>
          <Textarea
            id="desired-destination"
            value={desiredDestination}
            onChange={(e) => setDesiredDestination(e.target.value)}
            placeholder="En 6 meses quiero facturar X, tener Y clientes, conseguir Z..."
            rows={3}
            disabled={isPending}
            className="resize-none border-border"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6">
          {error}
        </p>
      )}

      {/* Checkbox aceptación */}
      <div className="flex items-start gap-3 mb-8">
        <Checkbox
          id="accept-pact"
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked === true)}
          disabled={isPending}
        />
        <Label
          htmlFor="accept-pact"
          className="text-sm leading-relaxed cursor-pointer"
        >
          Acepto este pacto y estoy listo para empezar el Diagnóstico
        </Label>
      </div>

      {/* Botón */}
      <button
        onClick={handleSign}
        disabled={!canSubmit || isPending}
        className="w-full sm:w-auto px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
      >
        {isPending ? 'Firmando...' : 'Firmo y empiezo'}
      </button>
    </div>
  )
}
