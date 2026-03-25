'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StepCommitmentProps {
  initialQ3: string
  initialQ4: string
  onNext: (q3: string, q4: string) => void
  onBack: () => void
}

const TIME_OPTIONS = [
  'Menos de 6 meses',
  'Entre 6 meses y 1 año',
  'Entre 1 y 3 años',
  'Más de 3 años',
] as const

const COMMITMENT_OPTIONS = [
  'Sí, estoy listo',
  'Necesito pensarlo más',
] as const

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors',
        selected
          ? 'border-primary bg-primary/10 font-medium text-primary'
          : 'border-border bg-background hover:bg-muted'
      )}
    >
      {label}
    </button>
  )
}

export default function StepCommitment({
  initialQ3,
  initialQ4,
  onNext,
  onBack,
}: StepCommitmentProps) {
  const [q3, setQ3] = useState(initialQ3)
  const [q4, setQ4] = useState(initialQ4)

  const isValid = q3 !== '' && q4 !== ''

  function handleSubmit() {
    if (isValid) onNext(q3, q4)
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Un poco más sobre ti</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="font-medium text-sm">
            ¿Cuánto tiempo llevas con este problema?
          </p>
          <div className="space-y-2">
            {TIME_OPTIONS.map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={q3 === opt}
                onClick={() => setQ3(opt)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-sm">
            ¿Estás dispuesto a dedicar 2 horas semanales a transformar tu negocio?
          </p>
          <div className="space-y-2">
            {COMMITMENT_OPTIONS.map((opt) => (
              <OptionButton
                key={opt}
                label={opt}
                selected={q4 === opt}
                onClick={() => setQ4(opt)}
              />
            ))}
          </div>
        </div>
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
