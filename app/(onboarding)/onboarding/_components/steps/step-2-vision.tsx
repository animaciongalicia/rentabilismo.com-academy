'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface StepVisionProps {
  initial: string
  onNext: (q1: string) => void
  onBack: () => void
}

const MIN_CHARS = 50

export default function StepVision({ initial, onNext, onBack }: StepVisionProps) {
  const [value, setValue] = useState(initial)
  const remaining = MIN_CHARS - value.length
  const isValid = value.trim().length >= MIN_CHARS

  function handleSubmit() {
    if (isValid) onNext(value.trim())
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          ¿Cómo quieres que sea tu negocio en 6 meses?
        </CardTitle>
        <CardDescription>
          Descríbelo con detalle. Ingresos, clientes, equipo, libertad — lo que
          sea importante para ti.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <Label htmlFor="q1" className="sr-only">
          Tu visión
        </Label>
        <Textarea
          id="q1"
          placeholder="En 6 meses quiero que mi negocio..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={5}
          className="resize-none"
        />
        <p className={`text-xs ${remaining > 0 ? 'text-muted-foreground' : 'text-green-600'}`}>
          {remaining > 0
            ? `Mínimo ${remaining} caracteres más`
            : '✓ Suficiente detalle'}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid}>
          Continuar
        </Button>
      </CardFooter>
    </Card>
  )
}
