import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import EspejoClient from './espejo-client'
import CuartelSidebar from '../cuartel-sidebar'

type RawRow = {
  response: Record<string, unknown>
  exercises: {
    title: string
    type: string
    order_number: number
    lessons: {
      order_number: number
      modules: { slug: string }
    }
  }
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
      const ex = row.exercises
      const lesson = ex?.lessons
      const mod = lesson?.modules
      return mod?.slug === 'mentalidad'
    })
    .sort((a, b) => {
      const lessonA = a.exercises?.lessons?.order_number ?? 0
      const lessonB = b.exercises?.lessons?.order_number ?? 0
      if (lessonA !== lessonB) return lessonA - lessonB
      return (a.exercises?.order_number ?? 0) - (b.exercises?.order_number ?? 0)
    })

  let formattedResponses: string | null = null
  if (rows.length > 0) {
    const lines = rows
      .map((row) => {
        const ex = row.exercises
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
    <div className="min-h-screen bg-background md:flex">
      <CuartelSidebar activeHref="/cuartel/el-espejo" />

      <main className="flex-1 min-w-0">
        <div className="max-w-[1040px] px-8 py-6">
          <nav className="mb-6 md:hidden">
            <Link
              href="/cuartel"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← El Ejército de Consultores
            </Link>
          </nav>

          <div className="space-y-1 mb-8">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Agente 00
            </p>
            <h1 className="text-3xl font-bold tracking-tight">El Espejo</h1>
            <p className="text-base text-muted-foreground">
              Tu consultor de mentalidad empresarial
            </p>
          </div>

          <EspejoClient formattedResponses={formattedResponses} />
        </div>
      </main>
    </div>
  )
}
