import Link from 'next/link'

export default function MentalidadGate({ redirectTo }: { redirectTo: string }) {
  const registroHref = `/registro?redirectTo=${encodeURIComponent(redirectTo)}`
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Módulo 0 — Gratuito
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Regístrate gratis para acceder al módulo
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Tu Cabeza Manda es el punto de partida de todo. En este módulo trabajarás las creencias
            que frenan tu negocio y las sustituirás por un sistema mental de empresario rentable.
            Sin coste, sin tarjeta.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href={registroHref}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium h-12 px-6 hover:bg-primary/80 transition-colors"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href={loginHref}
            className="inline-flex items-center justify-center rounded-md border border-border text-sm font-medium h-12 px-6 hover:bg-muted transition-colors"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  )
}
