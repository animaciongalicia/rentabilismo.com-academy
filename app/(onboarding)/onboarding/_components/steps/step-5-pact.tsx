'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface StepPactProps {
  fullName: string
  onSign: () => Promise<void>
  onBack: () => void
  isPending: boolean
  error: string | null
}

export default function StepPact({
  fullName,
  onSign,
  onBack,
  isPending,
  error,
}: StepPactProps) {
  const [accepted, setAccepted] = useState(false)

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">El Pacto del Empresario</CardTitle>
        <CardDescription>
          Lee con atención y fírmalo si estás de acuerdo.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <blockquote className="rounded-lg border-l-4 border-primary bg-muted/50 px-5 py-4 text-sm leading-relaxed italic text-foreground">
          Yo, <strong>{fullName}</strong>, me comprometo a trabajar en mi
          negocio con honestidad, aplicar lo que aprendo y no rendirme cuando
          lleguen las excusas. Entiendo que si no hago nada diferente, en 6
          meses estaré exactamente igual — o peor.
        </blockquote>

        {error && (
          <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex items-start gap-3">
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
            Acepto este pacto y estoy listo para empezar
          </Label>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onBack} disabled={isPending}>
          Atrás
        </Button>
        <Button
          onClick={onSign}
          disabled={!accepted || isPending}
          className="min-w-48"
        >
          {isPending ? 'Firmando...' : 'Firmar el Pacto y Entrar'}
        </Button>
      </CardFooter>
    </Card>
  )
}
