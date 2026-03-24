'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { loginAction, type LoginState } from '../actions'
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

const initialState: LoginState = { error: null }

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useFormState(loginAction, initialState)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Acceder</CardTitle>
        <CardDescription>
          Introduce tu email y contraseña para continuar
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <input type="hidden" name="redirectTo" value={redirectTo} />

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

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <SubmitButton label="Entrar" pendingLabel="Accediendo..." />

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
