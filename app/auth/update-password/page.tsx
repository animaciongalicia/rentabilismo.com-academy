'use client'

import { useFormState } from 'react-dom'
import { updatePasswordAction, type UpdatePasswordState } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import SubmitButton from '@/app/(auth)/_components/submit-button'

const initialState: UpdatePasswordState = { error: null }

export default function UpdatePasswordPage() {
  const [state, formAction] = useFormState(updatePasswordAction, initialState)

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Nueva contraseña</CardTitle>
          <CardDescription>Elige una contraseña segura para tu cuenta.</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-4">
            {state.error && (
              <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>
          </CardContent>

          <CardFooter>
            <SubmitButton label="Guardar nueva contraseña" pendingLabel="Guardando..." />
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
