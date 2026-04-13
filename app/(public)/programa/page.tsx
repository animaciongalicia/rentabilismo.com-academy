import Link from 'next/link'

export const metadata = {
  title: 'El Programa — Rentabilismo Academy',
  description: 'Los 11 módulos, los 10 agentes consultores y todo lo que incluye Rentabilismo.',
}

export default function ProgramaPage() {
  return (
    <div className="px-8 py-16 max-w-2xl">
      <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-4">
        El programa completo
      </p>
      <h1 className="text-3xl font-bold text-white mb-4">
        Próximamente
      </h1>
      <p className="text-zinc-400 leading-relaxed mb-8">
        Aquí verás los 11 módulos, los 10 agentes consultores especializados y todo lo que incluye
        Rentabilismo. Estamos preparando esta página.
      </p>
      <Link
        href="/precio"
        className="inline-flex items-center justify-center rounded-md bg-white text-zinc-950 text-sm font-medium h-11 px-6 hover:bg-zinc-200 transition-colors"
      >
        Ver precio →
      </Link>
    </div>
  )
}
