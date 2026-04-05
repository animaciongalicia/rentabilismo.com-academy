import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import EspejoClient from './espejo-client'

type RawRow = {
  response: Record<string, unknown>
  exercises: {
    title: string
    type: string
    order_number: number
    lessons: {
      order_number: number
      modules: { slug: string }[]
    }[]
  }[]
}

function formatResponse(type: string, response: Record<string, unknown>): string {
  if (type === 'open_reflection' || type === 'kaizen_step') {
    return String(response.value ?? '').trim()
  }
  if (type === 'checklist') {
    const checked = Object.entries(response)
      .filter(([key, val]) => key !== 'follow_up' && val === true)
      .map(([key]) => key)
    const followUp = response.follow_up ? `\nAdemás: ${String(response.follow_up).trim()}` : ''
    return checked.join(', ') + followUp
  }
  if (type === 'text_input') {
    return Object.values(response)
      .map((v) => String(v).trim())
      .filter(Boolean)
      .join(' / ')
  }
  return JSON.stringify(response)
}

export default async function EspejoPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('exercise_responses')
    .select(
      'response, exercises ( title, type, order_number, lessons ( order_number, modules ( slug ) ) )'
    )
    .eq('user_id', user.id)

  const rows = ((data ?? []) as unknown as RawRow[])
    .filter((row) => {
      const ex = row.exercises?.[0]
      const lesson = ex?.lessons?.[0]
      const mod = lesson?.modules?.[0]
      return mod?.slug === 'mentalidad'
    })
    .sort((a, b) => {
      const lessonA = a.exercises?.[0]?.lessons?.[0]?.order_number ?? 0
      const lessonB = b.exercises?.[0]?.lessons?.[0]?.order_number ?? 0
      if (lessonA !== lessonB) return lessonA - lessonB
      return (a.exercises?.[0]?.order_number ?? 0) - (b.exercises?.[0]?.order_number ?? 0)
    })

  let formattedResponses: string | null = null
  if (rows.length > 0) {
    const lines = rows
      .map((row) => {
        const ex = row.exercises?.[0]
        const title = ex?.title ?? ''
        const type = ex?.type ?? ''
        const value = formatResponse(type, row.response)
        if (!value) return null
        return `${title}:\n${value}`
      })
      .filter(Boolean)

    if (lines.length > 0) {
      formattedResponses = `Mis respuestas del módulo Tu Cabeza Manda:\n\n${lines.join('\n\n')}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1040px] px-8 py-10 space-y-8">
        <nav>
          <Link
            href="/cuartel-general"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← El Ejército de Consultores
          </Link>
        </nav>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">El Espejo</h1>
          <p className="text-base text-muted-foreground">
            Tu consultor de mentalidad empresarial
          </p>
        </div>

        <EspejoClient formattedResponses={formattedResponses} />
      </main>
    </div>
  )
}
