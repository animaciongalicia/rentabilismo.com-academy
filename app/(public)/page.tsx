import Link from 'next/link'

export default function PublicHomePage() {
  return (
    <main className="px-8 py-10">
      <div className="space-y-16">

        {/* BLOQUE 1 — Headline */}
        <section className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            Trabajas más que nadie y a fin de mes el número no cuadra.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            No es tu culpa. Es que nadie te enseñó a dirigir un negocio. Aquí sí.
          </p>
        </section>

        {/* BLOQUE 2 — ¿Es para ti? */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold">
            Si has llegado hasta aquí, es por algo.
          </h2>
          <ul className="space-y-3">
            {[
              'Tu asesor lleva los números pero no te entiende',
              'Trabajas más horas que nadie y ganas menos de lo que mereces',
              'Has probado métodos y ninguno encajó en tu realidad',
              'Tienes claro que algo hay que cambiar pero no sabes por dónde empezar',
              'Has pagado cursos que prometían el cambio y todo volvió a ser igual',
            ].map((dolor) => (
              <li key={dolor} className="flex items-start gap-3 text-sm md:text-base">
                <span className="mt-0.5 text-[#1D9E75] font-bold shrink-0">—</span>
                <span>{dolor}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm md:text-base text-muted-foreground pt-1">
            Si te reconoces en algo de esto, estás en el sitio correcto.
          </p>
        </section>

        {/* BLOQUE 3 — Qué es esto */}
        <section className="space-y-2 border-l-2 border-[#1D9E75] pl-4">
          <p className="text-sm md:text-base font-medium">Rentabilismo no es un curso.</p>
          <p className="text-sm md:text-base">
            Es consultoría guiada. Trabajas sobre tu negocio real, con tus números reales.
          </p>
          <p className="text-sm md:text-base">
            Yo pongo el método. Tú pones el trabajo. Los dos ponemos la honestidad.
          </p>
        </section>

        {/* BLOQUE 4 — CTA */}
        <section className="space-y-4">
          <Link
            href="/mentalidad"
            className="inline-block w-full md:w-auto px-8 py-3 bg-[#1D9E75] text-white text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            Empieza gratis con Mentalidad →
          </Link>
          <p className="text-xs text-muted-foreground">
            Sin tarjeta. Sin compromiso. Si convence, das el siguiente paso.
          </p>
          <Link
            href="/programa"
            className="block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Ver el programa completo
          </Link>
        </section>

      </div>
    </main>
  )
}
