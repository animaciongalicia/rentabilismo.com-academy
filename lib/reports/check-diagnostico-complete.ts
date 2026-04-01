import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Devuelve true si el usuario ha completado las 4 lecciones del módulo diagnostico-inicial.
 * firstIncompleteLessonSlug: slug de la primera lección incompleta (para redirect en cierre).
 */
export async function checkDiagnosticoComplete(
  supabase: SupabaseClient,
  userId: string
): Promise<{ isComplete: boolean; firstIncompleteLessonSlug: string | null }> {
  const { data: mod } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', 'diagnostico-inicial')
    .single()

  if (!mod) return { isComplete: false, firstIncompleteLessonSlug: null }

  const { data: lessonList } = await supabase
    .from('lessons')
    .select('id, slug, order_number')
    .eq('module_id', mod.id)
    .order('order_number')

  if (!lessonList || lessonList.length === 0) {
    return { isComplete: false, firstIncompleteLessonSlug: null }
  }

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .in('lesson_id', lessonList.map((l) => l.id))

  const completedIds = new Set((progress ?? []).map((r) => r.lesson_id))
  const firstIncomplete = lessonList.find((l) => !completedIds.has(l.id))

  return {
    isComplete: firstIncomplete === undefined,
    firstIncompleteLessonSlug: firstIncomplete?.slug ?? null,
  }
}
