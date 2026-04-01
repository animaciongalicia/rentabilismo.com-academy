import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getDiagnosticoReportData } from '@/lib/reports/get-diagnostico-report-data'
import type { DiagnosticoReportData } from '@/lib/reports/get-diagnostico-report-data'

type Props = { params: { userId: string } }

// ── Helpers de formato ─────────────────────────────────────────────────────

function formatEuros(value: string): string {
  const n = parseFloat(value.replace(',', '.'))
  if (isNaN(n)) return value || '—'
  return `${n.toLocaleString('es-ES')} €`
}

function calcMargen(facturacion: string, beneficio: string): string {
  const f = parseFloat(facturacion.replace(',', '.'))
  const b = parseFloat(beneficio.replace(',', '.'))
  if (isNaN(f) || isNaN(b) || f === 0) return '—'
  return `${Math.round((b / f) * 100)} %`
}

function val(text: string, fallback = 'No respondido'): string {
  const t = text?.trim()
  return t ? escHtml(t) : `<span style="color:#9ca3af;font-style:italic">${fallback}</span>`
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
}

// ── Generación del HTML ────────────────────────────────────────────────────

function buildHtml(
  data: DiagnosticoReportData,
  fullName: string,
  businessName: string,
  businessSector: string,
  fecha: string
): string {
  const margen = calcMargen(data.dinero.facturacion_mensual, data.dinero.beneficio_neto)

  const headerHtml = `
    <div class="report-header">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-size:18px;font-weight:800;letter-spacing:-0.5px;color:#111">Rentabilismo</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px">Academy</div>
        </div>
        <div style="text-align:right;font-size:11px;color:#6b7280;line-height:1.6">
          <div style="font-weight:600;color:#374151">${escHtml(fullName)}</div>
          ${businessName ? `<div>${escHtml(businessName)}</div>` : ''}
          ${businessSector ? `<div>${escHtml(businessSector)}</div>` : ''}
          <div>${fecha}</div>
        </div>
      </div>
      <div style="margin-top:16px;padding-top:16px;border-top:2px solid #111">
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#111">
          Informe de Diagnóstico Inicial — Punto de Partida
        </div>
        <div style="font-size:11px;color:#6b7280;margin-top:4px;font-style:italic">
          Este informe es tu fotografía de partida. Guárdalo. Vas a volver a mirarlo.
        </div>
      </div>
    </div>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Informe de Diagnóstico — ${escHtml(fullName)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #111827; background: #fff; }
    .report-header { margin-bottom: 32px; }
    .section-label { font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1.5px; color: #6b7280; margin-bottom: 6px; }
    .response-block { border-left: 3px solid #e5e7eb; padding: 10px 14px;
      margin: 10px 0; background: #f9fafb; }
    .big-number { font-size: 28px; font-weight: 800; color: #111; line-height: 1; }
    .margen-bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin: 6px 0; }
    .margen-fill { height: 8px; background: #111; border-radius: 4px; }
    .scale-circle { width: 56px; height: 56px; border-radius: 50%; border: 3px solid #111;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; }
    .proporcion-bar { height: 10px; background: #e5e7eb; border-radius: 5px; margin: 8px 0; }
    .proporcion-fill { height: 10px; background: #111; border-radius: 5px; }
    .cita { font-size: 20px; font-weight: 700; line-height: 1.4; color: #111;
      padding: 20px 24px; border: 2px solid #111; border-radius: 8px;
      background: #f9fafb; }
    .diferencia-critica { background: #fff7ed; border-color: #fb923c; }
    @media print {
      body { font-size: 11pt; }
      .page-break { page-break-before: always; }
      .no-break { page-break-inside: avoid; }
      .print-hide { display: none !important; }
      .report-header { page-break-inside: avoid; }
    }
  </style>
</head>
<body style="max-width:760px;margin:0 auto;padding:40px 32px">

  ${headerHtml}

  <!-- ── Botones de acción (se ocultan al imprimir) ── -->
  <div class="print-hide" style="margin-bottom:32px;display:flex;gap:12px;flex-wrap:wrap">
    <button onclick="window.print()"
      style="background:#111;color:#fff;border:none;padding:10px 20px;border-radius:6px;
             font-size:13px;font-weight:600;cursor:pointer">
      🖨️ Descargar / Imprimir PDF
    </button>
    <a href="/dashboard"
      style="background:#f3f4f6;color:#374151;padding:10px 20px;border-radius:6px;
             font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center">
      ← Volver al dashboard
    </a>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 1: Tu mentalidad de partida
  ══════════════════════════════════════════════════════════════════ -->
  <div class="no-break" style="margin-bottom:48px">
    <div class="section-label">Sección 1 de 6</div>
    <h2 style="font-size:20px;font-weight:800;margin:0 0 20px">Tu mentalidad de partida</h2>

    <div class="no-break" style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
        ¿Qué ya no estás dispuesto a seguir igual?
      </div>
      <div class="response-block">${val(data.mentalidad.punto_de_partida)}</div>
    </div>

    <div class="no-break" style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
        Lo que más energía te roba
      </div>
      <div class="response-block">${val(data.mentalidad.que_roba_energia)}</div>
    </div>

    <div class="no-break" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Área que quieres cambiar
        </div>
        <div class="response-block">${val(data.mentalidad.area_que_quiere_cambiar)}</div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Tu primer paso
        </div>
        <div class="response-block">${val(data.mentalidad.paso_mas_pequeno)}</div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 2: Tu dinero
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 2 de 6</div>
      <h2 style="font-size:20px;font-weight:800;margin:0 0 20px">Tu dinero</h2>

      <div class="no-break" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px">
        <div style="padding:20px;border:2px solid #111;border-radius:8px">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:6px">
            Facturación mensual
          </div>
          <div class="big-number">${formatEuros(data.dinero.facturacion_mensual)}</div>
        </div>
        <div style="padding:20px;border:2px solid #111;border-radius:8px">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:6px">
            Lo que te llevas a casa
          </div>
          <div class="big-number">${formatEuros(data.dinero.beneficio_neto)}</div>
        </div>
      </div>

      <div class="no-break" style="padding:16px;background:#f9fafb;border-radius:8px;margin-bottom:20px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:8px">
          Margen neto estimado: <strong style="font-size:16px;color:#111">${margen}</strong>
        </div>
        <div class="margen-bar">
          <div class="margen-fill" style="width:${
            (() => {
              const f = parseFloat(data.dinero.facturacion_mensual)
              const b = parseFloat(data.dinero.beneficio_neto)
              if (isNaN(f) || isNaN(b) || f === 0) return '0'
              return Math.min(100, Math.round((b / f) * 100)).toString()
            })()
          }%"></div>
        </div>
        ${data.dinero.certeza ? `<div style="font-size:11px;color:#6b7280;margin-top:6px;font-style:italic">${escHtml(data.dinero.certeza)}</div>` : ''}
      </div>

      <div class="no-break" style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Lo que más te deja / lo que más tiempo te quita
        </div>
        <div class="response-block">${val(data.dinero.lo_que_deja_vs_quita)}</div>
      </div>

      <div class="no-break" style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Si subieras precios un 20%…
        </div>
        <div class="response-block">${val(data.dinero.prueba_20_pct)}</div>
      </div>

      ${data.dinero.mira_numeros_kaizen ? `
      <div class="no-break" style="padding:14px 16px;border:1px solid #d1fae5;background:#f0fdf4;border-radius:8px">
        <div style="font-size:11px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">⚡ Paso de mejora</div>
        <div style="font-size:13px;color:#111">${escHtml(data.dinero.mira_numeros_kaizen)}</div>
      </div>` : ''}
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 3: Tus clientes
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 3 de 6</div>
      <h2 style="font-size:20px;font-weight:800;margin:0 0 20px">Tus clientes</h2>

      <div class="no-break" style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Tu mejor cliente
        </div>
        <div class="response-block">${val(data.clientes.mejor_cliente)}</div>
      </div>

      ${data.clientes.proporcion ? `
      <div class="no-break" style="padding:16px;background:#f9fafb;border-radius:8px;margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:8px">
          Clientes así: <strong style="font-size:18px;color:#111">${escHtml(data.clientes.proporcion)} de cada 10</strong>
        </div>
        <div class="proporcion-bar">
          <div class="proporcion-fill" style="width:${Math.min(100, parseInt(data.clientes.proporcion || '0', 10) * 10)}%"></div>
        </div>
      </div>` : ''}

      <div class="no-break" style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Cómo te encuentran los clientes
        </div>
        <div class="response-block">${val(data.clientes.como_encuentran)}</div>
      </div>

      <div class="no-break" style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Qué te diferencia
        </div>
        <div class="response-block ${!data.clientes.diferenciacion?.trim() ? 'diferencia-critica' : ''}"
          ${!data.clientes.diferenciacion?.trim() ? 'style="border-left-color:#fb923c;background:#fff7ed"' : ''}>
          ${val(data.clientes.diferenciacion, '⚠ Área crítica: sin diferenciación clara identificada')}
        </div>
        ${!data.clientes.diferenciacion?.trim() ? `<div style="font-size:11px;color:#c2410c;margin-top:4px;font-style:italic">La diferenciación es uno de los mayores palancas de margen y atracción de clientes.</div>` : ''}
      </div>

      ${data.clientes.kaizen_pregunta_cliente ? `
      <div class="no-break" style="padding:14px 16px;border:1px solid #d1fae5;background:#f0fdf4;border-radius:8px">
        <div style="font-size:11px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">⚡ Lo que te dijo un cliente</div>
        <div style="font-size:13px;color:#111">${escHtml(data.clientes.kaizen_pregunta_cliente)}</div>
      </div>` : ''}
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 4: Tu tiempo
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 4 de 6</div>
      <h2 style="font-size:20px;font-weight:800;margin:0 0 20px">Tu tiempo</h2>

      <div class="no-break" style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Tu día típico de trabajo
        </div>
        <div class="response-block">${val(data.tiempo.dia_real)}</div>
      </div>

      <div class="no-break" style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Si desaparecieras dos semanas…
        </div>
        <div class="response-block">${val(data.tiempo.prueba_dos_semanas)}</div>
      </div>

      ${data.tiempo.team_size ? `
      <div class="no-break" style="padding:16px;background:#f9fafb;border-radius:8px;margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">Estructura del equipo</div>
        <div style="font-size:15px;font-weight:700;color:#111;margin-bottom:8px">${escHtml(data.tiempo.team_size)}</div>
        ${data.tiempo.freno ? `<div style="font-size:12px;color:#374151"><strong>Freno para contratar:</strong> ${escHtml(data.tiempo.freno)}</div>` : ''}
        ${data.tiempo.otra_razon ? `<div style="font-size:12px;color:#374151;margin-top:4px;font-style:italic">${escHtml(data.tiempo.otra_razon)}</div>` : ''}
        ${data.tiempo.follow_up_equipo ? `<div style="font-size:12px;color:#374151;margin-top:8px">${escHtml(data.tiempo.follow_up_equipo)}</div>` : ''}
      </div>` : ''}

      ${data.tiempo.apunta_horas_kaizen ? `
      <div class="no-break" style="padding:14px 16px;border:1px solid #d1fae5;background:#f0fdf4;border-radius:8px">
        <div style="font-size:11px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">⚡ Tareas donde eres prescindible</div>
        <div style="font-size:13px;color:#111">${escHtml(data.tiempo.apunta_horas_kaizen)}</div>
      </div>` : ''}
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 5: Tu rumbo
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 5 de 6</div>
      <h2 style="font-size:20px;font-weight:800;margin:0 0 20px">Tu rumbo</h2>

      <div class="no-break" style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Tu visión a 2 años
        </div>
        <div class="response-block">${val(data.rumbo.vision_2_anos)}</div>
      </div>

      <div class="no-break" style="margin-bottom:20px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">
          Lo que llevas posponiendo
        </div>
        <div class="response-block" style="border-left-color:#f59e0b;background:#fffbeb">${val(data.rumbo.posponiendo)}</div>
        <div style="font-size:11px;color:#92400e;margin-top:4px;font-style:italic">Esta es tu prioridad más urgente.</div>
      </div>

      ${data.rumbo.termometro ? `
      <div class="no-break" style="display:flex;align-items:flex-start;gap:24px;padding:20px;background:#f9fafb;border-radius:8px;margin-bottom:16px">
        <div class="scale-circle">${escHtml(data.rumbo.termometro)}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:4px">
            Nivel de satisfacción con tu negocio hoy
          </div>
          <div style="font-size:12px;color:#6b7280">1 = Nada contento → 10 = Completamente contento</div>
          ${data.rumbo.que_falta_para_10 ? `
          <div style="margin-top:12px">
            <div style="font-size:11px;font-weight:600;color:#374151;margin-bottom:4px">Para llegar al 10:</div>
            <div style="font-size:13px;color:#111">${escHtml(data.rumbo.que_falta_para_10)}</div>
          </div>` : ''}
        </div>
      </div>` : ''}
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 6: Tu prioridad
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 6 de 6</div>
      <h2 style="font-size:20px;font-weight:800;margin:0 0 20px">Tu prioridad</h2>

      <div class="no-break" style="margin-bottom:32px">
        <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:12px">
          La respuesta que más te duele de todo el diagnóstico
        </div>
        <div class="cita">${val(data.prioridad.respuesta_que_duele, 'Pendiente de completar el paso de mejora de la lección 4.')}</div>
      </div>

      <div class="no-break" style="padding:20px;border:2px solid #111;border-radius:8px;margin-bottom:32px">
        <p style="font-size:16px;font-weight:700;margin:0 0 8px;color:#111">
          Este es tu punto de partida. Ahora vamos a trabajar sobre él.
        </p>
        <p style="font-size:13px;color:#374151;margin:0;line-height:1.6">
          Cada módulo que completes va a atacar uno de los puntos que acabas de identificar.
          Con método. Sin humo.
        </p>
      </div>
    </div>

    <!-- Pie del informe -->
    <div style="padding-top:24px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;line-height:1.8">
      <div style="font-weight:600;color:#374151">Rentabilismo Academy — Consultoría Guiada para Empresarios</div>
      <div style="font-style:italic">No hay milagros. Hay método.</div>
      <div style="margin-top:4px">Generado el ${fecha} · rentabilismo-com-academy.vercel.app</div>
    </div>
  </div>

</body>
</html>`
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET(_req: Request, { params }: Props) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Solo el propio usuario puede ver su informe
  if (!user || user.id !== params.userId) {
    return new NextResponse('No autorizado', { status: 401 })
  }

  // Perfil del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, business_name, business_sector')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name ?? user.email ?? 'Usuario'
  const businessName = profile?.business_name ?? ''
  const businessSector = profile?.business_sector ?? ''
  const fecha = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Obtener datos de todas las respuestas
  const reportData = await getDiagnosticoReportData(supabase, user.id)

  if (!reportData) {
    return new NextResponse('No hay respuestas guardadas todavía.', { status: 404 })
  }

  // Guardar / actualizar en evolution_reports (idempotente)
  await supabase.from('evolution_reports').upsert(
    {
      user_id: user.id,
      report_type: 'diagnostico_inicial',
      report_data: reportData as unknown as Record<string, unknown>,
    },
    { onConflict: 'user_id,report_type' }
  )

  const html = buildHtml(reportData, fullName, businessName, businessSector, fecha)

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
