'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'

export type CompleteLessonResult = { error: string } | { ok: true }

export async function completeLesson(
  lessonId: string,
  responses: Record<string, Record<string, string | boolean>>
): Promise<CompleteLessonResult> {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'No hay sesión activa. Por favor, inicia sesión de nuevo.' }

    const { error } = await supabase
      .from('lesson_progress')
      .insert({ user_id: user.id, lesson_id: lessonId, responses })

    if (error) {
      // 23505 = unique_violation → lección ya marcada como completada (idempotente)
      if (error.code === '23505') return { ok: true }
      console.error('completeLesson error:', error.code, error.message)
      return { error: 'Error al guardar el progreso. Inténtalo de nuevo.' }
    }

    return { ok: true }
  } catch (e) {
    console.error('completeLesson CATCH:', e)
    return { error: 'Error al guardar el progreso. Inténtalo de nuevo.' }
  }
}
