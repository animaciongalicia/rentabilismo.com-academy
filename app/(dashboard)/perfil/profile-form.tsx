'use client'

import { useFormState } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfileAction, type UpdateProfileState } from './actions'

const SECTORES = [
  'Restauración',
  'Clínica / Salud',
  'Gimnasio / Deporte',
  'Comercio local',
  'Servicios profesionales',
  'Construcción',
  'Educación',
  'Tecnología',
  'Otros',
]

interface ProfileFormProps {
  businessName: string | null
  businessType: string | null
  biggestProblem: string | null
}

const initialState: UpdateProfileState = { error: null, success: false }

export default function ProfileForm({
  businessName,
  businessType,
  biggestProblem,
}: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfileAction, initialState)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mi negocio</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <p className="text-sm text-destructive rounded-sm bg-destructive/10 px-3 py-2">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="text-sm text-emerald-700 dark:text-emerald-400 rounded-sm bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2">
              Cambios guardados correctamente.
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="business_name">Nombre del negocio</Label>
            <Input
              id="business_name"
              name="business_name"
              defaultValue={businessName ?? ''}
              placeholder="Tu negocio"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="business_type">Sector</Label>
            <select
              id="business_type"
              name="business_type"
              defaultValue={businessType ?? ''}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecciona tu sector</option>
              {SECTORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="biggest_problem">Principal problema</Label>
            <Textarea
              id="biggest_problem"
              name="biggest_problem"
              defaultValue={biggestProblem ?? ''}
              placeholder="¿Cuál es el mayor problema de tu negocio ahora mismo?"
              rows={3}
            />
          </div>

          <Button type="submit">
            Guardar cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
