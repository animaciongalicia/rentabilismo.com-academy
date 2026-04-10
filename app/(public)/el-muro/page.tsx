import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getAvatarColor, getInitials } from '@/lib/utils/avatar'

const TITULO = 'Rentabilismo lo construyen empresarios que hacen, no que miran.'
const SUBTITULO = 'Aquí verás quién está dentro y en qué están trabajando.'

type WallEntry = {
  id: string
  full_name: string
  motivation_phrase: string
}

export default async function ElMuroPage() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  let hasPaid = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_paid')
      .eq('id', user.id)
      .single()
    hasPaid = profile?.has_paid === true
  }

  const { data: entries } = await supabase
    .from('community_wall')
    .select('id, full_name, motivation_phrase')
    .order('created_at', { ascending: true })

  const wall: WallEntry[] = entries ?? []
  const isEmpty = wall.length === 0

  return (
    <main className="px-8 py-10">
      <div className="space-y-12">

        {/* Cabecera */}
        <section className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
            {TITULO}
          </h1>
          <p className="text-base text-muted-foreground">
            {SUBTITULO}
          </p>
        </section>

        {/* Botón post-pago */}
        {hasPaid && (
          <div className="flex justify-center">
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2.5 bg-[#1D9E75] text-white text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
            >
              Añadir mi frase
            </Link>
          </div>
        )}

        {/* Contenido: vacío o grid */}
        {isEmpty ? (
          <section className="flex flex-col items-center gap-6 py-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Sé el primero en estar aquí.
            </p>
            <Link
              href="/registro"
              className="inline-block px-8 py-3 bg-[#1D9E75] text-white text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
            >
              Unirse
            </Link>
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wall.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-col gap-3 rounded-sm border border-border bg-card p-5"
              >
                {/* Avatar */}
                <div className="flex items-center gap-3">
                  <div
                    className={`${getAvatarColor(entry.full_name)} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}
                  >
                    <span className="text-white text-sm font-bold">
                      {getInitials(entry.full_name)}
                    </span>
                  </div>
                  <span className="font-semibold text-sm leading-tight">
                    {entry.full_name}
                  </span>
                </div>

                {/* Frase */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Estoy trabajando en:</span>{' '}
                  {entry.motivation_phrase}
                </p>
              </article>
            ))}
          </section>
        )}

        {/* CTA fijo al final — siempre visible */}
        <section className="flex flex-col items-center gap-4 pt-8 border-t border-border text-center">
          <p className="text-base font-medium">¿Te ves aquí?</p>
          <Link
            href="/registro"
            className="inline-block px-8 py-3 bg-[#1D9E75] text-white text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity"
          >
            Unirse
          </Link>
        </section>

      </div>
    </main>
  )
}
