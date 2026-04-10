import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { AGENTES } from './agentes'

export default async function CuartelGeneralPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-background md:flex">
      <main className="flex-1 min-w-0">
        <div className="max-w-[1040px] px-8 py-6">
          <nav className="mb-6">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Dashboard
            </Link>
          </nav>

          <div className="space-y-2 mb-8">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Cuartel General
            </p>
            <h1 className="text-3xl font-bold tracking-tight">El Ejército de Consultores</h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              11 consultores especializados. Cada uno para un momento concreto de tu negocio.
            </p>
          </div>

          {/* El Espejo — tarjeta destacada ancho completo */}
          <div className="rounded-lg border border-border bg-card p-7 flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
            <div className="flex-1 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Agente 00
              </p>
              <h2 className="text-2xl font-bold">{AGENTES[0].nombre}</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {AGENTES[0].descripcion}
              </p>
            </div>
            <Link
              href={AGENTES[0].href!}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold h-12 px-8 hover:bg-primary/80 transition-colors shrink-0"
            >
              Ver ficha
            </Link>
          </div>

          {/* Resto de agentes — grid secundario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGENTES.slice(1).map((agente) => (
              <div
                key={agente.id}
                className="rounded-lg border border-border bg-card p-5 space-y-3 flex flex-col"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm leading-snug">{agente.nombre}</p>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 border border-border/50 rounded px-1.5 py-0.5">
                      Próximamente
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{agente.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
