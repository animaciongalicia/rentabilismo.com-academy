import Link from 'next/link'

export const metadata = {
  title: 'Rentabilismo Academy — Consultoría guiada para empresarios',
  description:
    'No necesitas más información. Necesitas un sistema que te obligue a mirar los números, tomar decisiones y dejar de improvisar.',
}

const DOLORES = [
  {
    titulo: 'Tu dinero',
    texto:
      'Facturas, pero no sabes cuánto te queda. Confundes lo que cobras con lo que ganas. Y tus precios llevan dos años sin moverse.',
  },
  {
    titulo: 'Tu tiempo',
    texto:
      'Eres el primero en llegar y el último en irte. Si te vas una semana, el negocio se para. Apagar fuegos es tu trabajo real.',
  },
  {
    titulo: 'Tus clientes',
    texto:
      'No sabes cuáles te dejan dinero y cuáles te lo quitan. Atraes a los que buscan precio, no a los que buscan valor.',
  },
  {
    titulo: 'Tu rumbo',
    texto:
      'Intuyes que podrías ganar más pero no sabes por dónde empezar. Llevas tiempo posponiendo decisiones que sabes que tienes que tomar.',
  },
]

export default function PublicHomePage() {
  return (
    <div className="bg-zinc-950">

      {/* SECCIÓN 1 — HERO */}
      <section className="px-8 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
          Cambia tu forma de pensar la empresa. Lo demás vendrá detrás.
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
          No necesitas más información. Necesitas un sistema que te obligue a mirar los números,
          tomar decisiones y dejar de improvisar. Un consultor que trabaja contigo, no para ti.
          Con tus datos reales, no con teoría.
        </p>
        <Link
          href="/programa"
          className="inline-flex items-center justify-center rounded-md bg-white text-zinc-950 text-sm font-semibold h-12 px-8 hover:bg-zinc-200 transition-colors"
        >
          Descubre cómo funciona
        </Link>
      </section>

      {/* SECCIÓN 2 — DOLORES */}
      <section className="px-8 py-16 border-t border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-10">¿Te suena esto?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {DOLORES.map((d) => (
            <div
              key={d.titulo}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-2"
            >
              <p className="text-sm font-bold text-white">{d.titulo}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{d.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3 — DIFERENCIACIÓN + CTA */}
      <section className="px-8 py-16 border-t border-zinc-800 max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-white">Esto no es un curso más.</h2>
        <p className="text-zinc-400 leading-relaxed">
          Has probado formaciones, vídeos, libros, mentorías. Y siempre faltaba algo: que alguien
          trabajara contigo sobre TU negocio, con TUS números, sin teoría genérica.
        </p>
        <p className="text-zinc-400 leading-relaxed">
          Rentabilismo es consultoría guiada. Tú trabajas sobre tu negocio real. Un sistema con
          método, ejercicios con tus datos, y un ejército de consultores que no te hacen la pelota.
        </p>
        <Link
          href="/programa"
          className="inline-flex items-center justify-center rounded-md bg-white text-zinc-950 text-sm font-semibold h-12 px-8 hover:bg-zinc-200 transition-colors"
        >
          Descubre cómo funciona
        </Link>
      </section>

    </div>
  )
}
