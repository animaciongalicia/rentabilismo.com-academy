'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { resetPasswordAction, type ResetPasswordState } from './actions'
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

const initialState: ResetPasswordState = { error: null, success: false }

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(resetPasswordAction, initialState)

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
          <CardDescription>
            Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
          </CardDescription>
        </CardHeader>

        {state.success ? (
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted px-4 py-3 text-sm text-foreground">
              Si ese email está registrado, recibirás un enlace en breve.
            </div>
            <Link
              href="/login"
              className="block text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              Volver al inicio de sesión
            </Link>
          </CardContent>
        ) : (
          <form action={formAction}>
            <CardContent className="space-y-4">
              {state.error && (
                <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <SubmitButton label="Enviar enlace de recuperación" pendingLabel="Enviando..." />

              <Link
                href="/login"
                className="text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                Volver al inicio de sesión
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </main>
  )
}
