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

interface StepObstacleProps {
  initial: string
  onNext: (q2: string) => void
  onBack: () => void
}

const MIN_CHARS = 30

export default function StepObstacle({ initial, onNext, onBack }: StepObstacleProps) {
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
          ¿Qué es lo que más te impide llegar ahí?
        </CardTitle>
        <CardDescription>
          Sé honesto. El obstáculo real suele ser diferente al que aparenta ser.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <Label htmlFor="q2" className="sr-only">
          Tu mayor obstáculo
        </Label>
        <Textarea
          id="q2"
          placeholder="Lo que más me frena es..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
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
