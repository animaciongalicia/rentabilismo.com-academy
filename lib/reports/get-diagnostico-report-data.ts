import type { SupabaseClient } from '@supabase/supabase-js'

// ── Tipos del informe ────────────────────────────────────────────────────────

export type DiagnosticoReportData = {
  mentalidad: {
    punto_de_partida: string       // "Tu punto de partida" → value
    que_roba_energia: string       // "Reconoce dónde estás" (kaizen) → value
    area_que_quiere_cambiar: string // "Un área, un paso" → area
    paso_mas_pequeno: string       // "Un área, un paso" → paso
  }
  dinero: {
    facturacion_mensual: string
    beneficio_neto: string
    certeza: string
    lo_que_deja_vs_quita: string   // "Lo que te deja vs lo que te quita" → value
    prueba_20_pct: string          // "La prueba del 20%" → value
    mira_numeros_kaizen: string    // "Mira tus números" → value
  }
  clientes: {
    mejor_cliente: string
    proporcion: string             // 0–10
    como_encuentran: string
    diferenciacion: string
    kaizen_pregunta_cliente: string
  }
  tiempo: {
    dia_real: string
    prueba_dos_semanas: string
    team_size: string              // "solo" | "micro" | "pequeño" | "mediano"
    freno: string                  // para opción "solo"
    otra_razon: string             // para opción "solo" + "otra"
    follow_up_equipo: string       // para opciones con equipo
    apunta_horas_kaizen: string
  }
  rumbo: {
    vision_2_anos: string
    posponiendo: string
    termometro: string             // 1–10 como string
    que_falta_para_10: string
  }
  prioridad: {
    respuesta_que_duele: string    // "Tu prioridad número uno" → value
  }
}

// ── Tipo raw de la query ─────────────────────────────────────────────────────

type RawRow = {
  module_slug: string
  lesson_slug: string
  exercise_title: string
  exercise_type: string
  response: Record<string, string>
}

// ── Lookup helper ────────────────────────────────────────────────────────────

function find(
  rows: RawRow[],
  moduleSlug: string,
  lessonSlug: string,
  exerciseTitle: string
): Record<string, string> {
  return (
    rows.find(
      (r) =>
        r.module_slug === moduleSlug &&
        r.lesson_slug === lessonSlug &&
        r.exercise_title === exerciseTitle
    )?.response ?? {}
  )
}

function str(obj: Record<string, string>, key: string): string {
  return (obj[key] as string) ?? ''
}

// ── Main function ────────────────────────────────────────────────────────────

export async function getDiagnosticoReportData(
  supabase: SupabaseClient,
  userId: string
): Promise<DiagnosticoReportData | null> {
  // Una sola query con JOINs para obtener todas las respuestas de los dos módulos
  const { data, error } = await supabase
    .from('exercise_responses')
    .select(`
      response,
      exercises (
        title,
        type,
        lessons (
          slug,
          modules ( slug )
        )
      )
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('getDiagnosticoReportData error:', error.message)
    return null
  }

  if (!data || data.length === 0) return null

  // Aplanar a filas tipadas, filtrando solo los módulos relevantes
  const rows: RawRow[] = []
  for (const row of data) {
    const ex = row.exercises as unknown as {
      title: string
      type: string
      lessons: { slug: string; modules: { slug: string } }
    }
    if (!ex?.lessons?.modules) continue
    const modSlug = ex.lessons.modules.slug
    if (modSlug !== 'mentalidad' && modSlug !== 'diagnostico-inicial') continue
    rows.push({
      module_slug: modSlug,
      lesson_slug: ex.lessons.slug,
      exercise_title: ex.title,
      exercise_type: ex.type,
      response: (row.response ?? {}) as Record<string, string>,
    })
  }

  // ── Módulo 0: mentalidad ──────────────────────────────────────────────────
  const puntoPartida = find(rows, 'mentalidad', 'estas-en-el-sitio-correcto', 'Tu punto de partida')
  const reconoce = find(rows, 'mentalidad', 'estas-en-el-sitio-correcto', 'Reconoce dónde estás')
  const unAreaUnPaso = find(rows, 'mentalidad', 'asi-lo-vamos-a-conseguir', 'Un área, un paso')

  // ── Módulo 1: diagnóstico-inicial ─────────────────────────────────────────
  const tusNumeros = find(rows, 'diagnostico-inicial', 'tu-dinero', 'Tus números reales')
  const loQueDeja = find(rows, 'diagnostico-inicial', 'tu-dinero', 'Lo que te deja vs lo que te quita')
  const prueba20 = find(rows, 'diagnostico-inicial', 'tu-dinero', 'La prueba del 20%')
  const miraNumeros = find(rows, 'diagnostico-inicial', 'tu-dinero', 'Mira tus números')

  const mejorCliente = find(rows, 'diagnostico-inicial', 'tus-clientes', 'Tu mejor cliente')
  const comoEncuentran = find(rows, 'diagnostico-inicial', 'tus-clientes', 'Cómo te encuentran')
  const queDiferencia = find(rows, 'diagnostico-inicial', 'tus-clientes', 'Qué te diferencia')
  const kaizenCliente = find(rows, 'diagnostico-inicial', 'tus-clientes', 'Pregúntale a un cliente')

  const diaReal = find(rows, 'diagnostico-inicial', 'tu-tiempo', 'Tu día real')
  const pruebaDos = find(rows, 'diagnostico-inicial', 'tu-tiempo', 'La prueba de las dos semanas')
  const tuEquipo = find(rows, 'diagnostico-inicial', 'tu-tiempo', 'Tu equipo (o la falta de él)')
  const apuntaHoras = find(rows, 'diagnostico-inicial', 'tu-tiempo', 'Apunta tus horas')

  const vision2 = find(rows, 'diagnostico-inicial', 'tu-rumbo', 'Tu visión a 2 años')
  const posponiendo = find(rows, 'diagnostico-inicial', 'tu-rumbo', 'Lo que llevas posponiendo')
  const termometro = find(rows, 'diagnostico-inicial', 'tu-rumbo', 'Tu termómetro')
  const prioridad = find(rows, 'diagnostico-inicial', 'tu-rumbo', 'Tu prioridad número uno')

  // ── Construir etiqueta legible para el tipo de equipo ────────────────────
  const teamLabels: Record<string, string> = {
    solo: 'Solo — soy yo y nadie más',
    micro: 'Con 1-3 personas',
    'pequeño': 'Con 4-10 personas',
    mediano: 'Con más de 10 personas',
  }
  const frenoLabels: Record<string, string> = {
    dinero: 'El dinero — no me da para contratar',
    confianza: 'La confianza — nadie lo hace como yo',
    no_se: 'No sé ni por dónde empezar',
    otra: str(tuEquipo, 'otra_razon') || 'Otra razón',
  }

  const teamSizeId = str(tuEquipo, 'selected_option')
  const frenoId = str(tuEquipo, 'freno')

  return {
    mentalidad: {
      punto_de_partida: str(puntoPartida, 'value'),
      que_roba_energia: str(reconoce, 'value'),
      area_que_quiere_cambiar: str(unAreaUnPaso, 'area'),
      paso_mas_pequeno: str(unAreaUnPaso, 'paso'),
    },
    dinero: {
      facturacion_mensual: str(tusNumeros, 'facturacion_mensual'),
      beneficio_neto: str(tusNumeros, 'beneficio_neto'),
      certeza: str(tusNumeros, 'certeza'),
      lo_que_deja_vs_quita: str(loQueDeja, 'value'),
      prueba_20_pct: str(prueba20, 'value'),
      mira_numeros_kaizen: str(miraNumeros, 'value'),
    },
    clientes: {
      mejor_cliente: str(mejorCliente, 'mejor_cliente'),
      proporcion: str(mejorCliente, 'proporcion'),
      como_encuentran: str(comoEncuentran, 'value'),
      diferenciacion: str(queDiferencia, 'value'),
      kaizen_pregunta_cliente: str(kaizenCliente, 'value'),
    },
    tiempo: {
      dia_real: str(diaReal, 'value'),
      prueba_dos_semanas: str(pruebaDos, 'value'),
      team_size: teamLabels[teamSizeId] ?? teamSizeId,
      freno: frenoLabels[frenoId] ?? frenoId,
      otra_razon: str(tuEquipo, 'otra_razon'),
      follow_up_equipo: str(tuEquipo, 'follow_up_text'),
      apunta_horas_kaizen: str(apuntaHoras, 'value'),
    },
    rumbo: {
      vision_2_anos: str(vision2, 'value'),
      posponiendo: str(posponiendo, 'value'),
      termometro: str(termometro, 'value'),
      que_falta_para_10: str(termometro, 'que_falta'),
    },
    prioridad: {
      respuesta_que_duele: str(prioridad, 'value'),
    },
  }
}
