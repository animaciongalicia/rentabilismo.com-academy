'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'

export type CompleteLessonResult = { error: string } | { ok: true }
export type SaveResponseResult = { error: string } | { ok: true }

export async function completeLesson(
  lessonId: string,
  responses: Record<string, Record<string, string | boolean>>,
  moduleId?: string
): Promise<CompleteLessonResult> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'No hay sesión activa. Por favor, inicia sesión de nuevo.' }

    const { error } = await supabase
      .from('lesson_progress')
      .insert({ user_id: user.id, lesson_id: lessonId, responses })

    if (error) {
      if (error.code === '23505') return { ok: true }
      console.error('completeLesson error:', error.code, error.message)
      return { error: 'Error al guardar el progreso. Inténtalo de nuevo.' }
    }

    // Si se pasa moduleId, comprobar si todas las lecciones del módulo están completadas
    if (moduleId) {
      const [{ count: totalLessons }, { data: completedRows }] = await Promise.all([
        supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('module_id', moduleId),
        supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .in(
            'lesson_id',
            (await supabase.from('lessons').select('id').eq('module_id', moduleId)).data?.map((l) => l.id) ?? []
          ),
      ])

      if (totalLessons && completedRows && completedRows.length >= totalLessons) {
        await supabase
          .from('user_progress')
          .upsert({ user_id: user.id, module_id: moduleId }, { onConflict: 'user_id,module_id' })
      }
    }

    return { ok: true }
  } catch (e) {
    console.error('completeLesson CATCH:', e)
    return { error: 'Error al guardar el progreso. Inténtalo de nuevo.' }
  }
}

export async function saveExerciseResponse(
  exerciseId: string,
  response: Record<string, string | boolean>
): Promise<SaveResponseResult> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'no-session' }

    const { error } = await supabase
      .from('exercise_responses')
      .upsert(
        { user_id: user.id, exercise_id: exerciseId, response, saved_at: new Date().toISOString() },
        { onConflict: 'user_id,exercise_id' }
      )

    if (error) {
      console.error('saveExerciseResponse error:', error.code, error.message)
      return { error: 'Error al guardar. Inténtalo de nuevo.' }
    }

    return { ok: true }
  } catch (e) {
    console.error('saveExerciseResponse CATCH:', e)
    return { error: 'Error al guardar. Inténtalo de nuevo.' }
  }
}
