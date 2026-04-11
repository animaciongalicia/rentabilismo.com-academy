'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { registerAction, type RegisterState } from '../actions'
import SubmitButton from '../../_components/submit-button'
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

const initialState: RegisterState = { error: null, success: false, email: '' }

export default function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialState)

  if (state.success) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Revisa tu email</CardTitle>
          <CardDescription>
            Te hemos enviado un enlace de confirmación a{' '}
            <strong>{state.email}</strong>. Haz clic en él para activar tu
            cuenta.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="text-sm underline underline-offset-4 hover:text-primary"
          >
            Volver al acceso
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Empieza tu camino hacia la rentabilidad
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Tu nombre"
              required
              autoComplete="name"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />
          </div>

        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <SubmitButton label="Crear cuenta" pendingLabel="Creando cuenta..." />

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Acceder
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
