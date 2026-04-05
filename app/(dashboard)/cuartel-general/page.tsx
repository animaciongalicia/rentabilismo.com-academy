import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const AGENTES = [
  {
    id: 0,
    nombre: 'El Espejo',
    descripcion: 'Tu consultor de mentalidad empresarial',
    activo: true,
    href: '/cuartel-general/el-espejo',
  },
  {
    id: 1,
    nombre: 'El Forense',
    descripcion: 'Diagnóstico de rentabilidad',
    activo: false,
  },
  {
    id: 2,
    nombre: 'El Contable que No Te Miente',
    descripcion: 'Finanzas',
    activo: false,
  },
  {
    id: 3,
    nombre: 'El que Te Hace Diferente',
    descripcion: 'Producto y servicio',
    activo: false,
  },
  {
    id: 4,
    nombre: 'El Auditor de Precios',
    descripcion: 'Estrategia de precios',
    activo: false,
  },
  {
    id: 5,
    nombre: 'El Ladrón de Tiempo',
    descripcion: 'Operaciones y procesos',
    activo: false,
  },
  {
    id: 6,
    nombre: 'El Líder que Necesitas',
    descripcion: 'Equipo y liderazgo',
    activo: false,
  },
  {
    id: 7,
    nombre: 'El Cazador',
    descripcion: 'Ventas y captación',
    activo: false,
  },
  {
    id: 8,
    nombre: 'El Altavoz',
    descripcion: 'Marketing y posicionamiento',
    activo: false,
  },
  {
    id: 9,
    nombre: 'El Estratega',
    descripcion: 'Estrategia y crecimiento',
    activo: false,
  },
  {
    id: 10,
    nombre: 'El Planificador',
    descripcion: 'Tu plan de acción',
    activo: false,
  },
]

export default async function CuartelGeneralPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1040px] px-8 py-10 space-y-8">
        <nav>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Dashboard
          </Link>
        </nav>

        <div className="space-y-2">
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
      </main>
    </div>
  )
}
