import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AGENTES } from './agentes'

type Props = {
  activeHref?: string
}

export default function CuartelSidebar({ activeHref }: Props) {
  return (
    <aside className="hidden md:flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] w-[320px] shrink-0 border-r border-border bg-muted/40 overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Header */}
        <Link
          href="/cuartel"
          className={cn(
            'block rounded-md px-2 py-1 -mx-2 transition-colors',
            !activeHref
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Cuartel General
          </p>
          <p className={cn('font-semibold text-sm mt-1 leading-snug', !activeHref && 'text-foreground')}>
            El Ejército de Consultores
          </p>
        </Link>

        {/* Lista de agentes */}
        <nav className="space-y-0.5">
          {AGENTES.map((agente) => {
            const isActive = agente.href === activeHref

            if (!agente.activo || !agente.href) {
              return (
                <div
                  key={agente.id}
                  className="flex items-start gap-2.5 rounded-md px-3 py-2.5 text-sm text-muted-foreground/50 cursor-not-allowed select-none"
                >
                  <span className="leading-snug flex-1 min-w-0 line-clamp-2">{agente.nombre}</span>
                </div>
              )
            }

            return (
              <Link
                key={agente.id}
                href={agente.href}
                className={cn(
                  'flex items-start gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-background text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                )}
              >
                <span className="leading-snug flex-1 min-w-0 line-clamp-2">{agente.nombre}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
