import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import CuartelSidebar from './cuartel-sidebar'
import { AGENTES } from './agentes'

export default async function CuartelGeneralPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-background md:flex">
      <CuartelSidebar />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENTES.map((agente) => (
              <div
                key={agente.id}
                className="rounded-lg border border-border bg-card p-5 space-y-3 flex flex-col"
              >
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm leading-snug">{agente.nombre}</p>
                    {!agente.activo && (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border border-border rounded px-1.5 py-0.5">
                        Próximamente
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{agente.descripcion}</p>
                </div>

                {agente.activo && agente.href && (
                  <Link
                    href={agente.href}
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium h-8 px-3 hover:bg-primary/80 transition-colors"
                  >
                    Ver ficha
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
