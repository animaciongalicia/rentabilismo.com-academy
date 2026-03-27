import { getSupabaseServerClient } from '@/lib/supabase/server'
import MentalidadLayout, { type Exercise, type LessonData, type ModuleData } from './mentalidad-layout'

export const metadata = {
  title: 'Tu Cabeza Manda — Módulo 0 · Rentabilismo Academy',
  description: 'Para que tu empresa cambie, tú tienes que cambiar primero.',
}

export default async function MentalidadPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [moduleResult, lessonsResult, countResult] = await Promise.all([
    supabase
      .from('modules')
      .select('id, title, description, vimeo_id')
      .eq('id', 0)
      .single(),
    supabase
      .from('lessons')
      .select('id, title, slug, order_number, frase_clave, apertura, audio_url')
      .eq('module_id', 0)
      .order('order_number'),
    supabase.rpc('get_completed_payments_count'),
  ])

  const mod = moduleResult.data as ModuleData | null
  const lessons = (lessonsResult.data ?? []) as LessonData[]
  const paymentsCount = Number(countResult.data ?? 0)

  // Exercises for all lessons in one query
  const lessonIds = lessons.map((l) => l.id)
  const { data: exercisesData } =
    lessonIds.length > 0
      ? await supabase
          .from('exercises')
          .select('id, lesson_id, type, title, description, config, order_number, is_kaizen')
          .in('lesson_id', lessonIds)
          .order('order_number')
      : { data: [] as Exercise[] }

  // Group exercises by lesson_id
  const exercisesByLesson: Record<string, Exercise[]> = {}
  for (const ex of exercisesData ?? []) {
    if (!exercisesByLesson[ex.lesson_id]) exercisesByLesson[ex.lesson_id] = []
    exercisesByLesson[ex.lesson_id].push(ex as Exercise)
  }

  // User progress
  const completedIds: string[] = []
  if (user) {
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
    for (const row of progress ?? []) completedIds.push(row.lesson_id)
  }

  return (
    <MentalidadLayout
      mod={mod}
      lessons={lessons}
      exercisesByLesson={exercisesByLesson}
      completedIds={completedIds}
      isAuthenticated={!!user}
      paymentsCount={paymentsCount}
    />
  )
}
