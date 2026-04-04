import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getDiagnosticoReportData } from '@/lib/reports/get-diagnostico-report-data'
import type { DiagnosticoReportData } from '@/lib/reports/get-diagnostico-report-data'

type Props = { params: { userId: string } }

// ── Tipos análisis IA ─────────────────────────────────────────────────────

type AiSection = {
  resumen: string
  interpretacion: string
  alerta: string | null
  recomendacion: string
}

type AiAnalysis = {
  resumen_ejecutivo: string
  mentalidad: AiSection
  dinero: AiSection & { margen_porcentaje: number }
  clientes: AiSection
  tiempo: AiSection
  rumbo: AiSection
  prioridad: {
    resumen: string
    interpretacion: string
    modulo_recomendado: string
    siguiente_paso: string
  }
}

// ── Análisis de IA ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres un consultor de negocio con 25 años de experiencia trabajando con autónomos y pymes de 1 a 20 empleados. Negocios locales, físicos, híbridos y online: restaurantes, clínicas, gimnasios, empresas de limpieza, tiendas, talleres, consultoras, negocios digitales.

Recibes los datos de un diagnóstico inicial de un empresario. Tu trabajo es analizar sus respuestas y generar un informe personalizado con estas 6 secciones. Para cada sección:

1. Resume lo que el empresario dijo (en 1-2 frases)
2. Interpreta qué significa eso para su negocio (lo que un consultor vería)
3. Identifica la señal de alerta principal si la hay
4. Da una recomendación concreta de un solo paso

Tono: directo, cercano, sin humo. Como un consultor que se sienta enfrente con un café. Usa "tú" siempre. No uses palabras como estrategia, metodología, empoderamiento, mindset.

SECCIONES:

SECCIÓN 1 — TU MENTALIDAD DE PARTIDA
Datos: lo que ya no quiere que siga igual, el área que quiere cambiar, qué le roba energía.
Analiza: su nivel de conciencia sobre sus problemas y su disposición al cambio.

SECCIÓN 2 — TU DINERO
Datos: facturación mensual, beneficio neto, qué le deja más, qué le quita más, qué pasaría si sube precios.
Analiza: calcula el % de margen (beneficio/facturación × 100). Si es menor del 30%, señálalo como crítico. Interpreta si sabe realmente cuánto gana o está navegando a ciegas. Analiza su relación con el precio.

SECCIÓN 3 — TUS CLIENTES
Datos: descripción de su mejor cliente, proporción (X de 10), cómo le llegan, qué le diferencia.
Analiza: si tiene menos de 4/10 clientes ideales, tiene un problema de captación. Si no sabe qué le diferencia, tiene un problema de posicionamiento. Si depende del boca a boca, no tiene sistema.

SECCIÓN 4 — TU TIEMPO
Datos: su día típico, qué se rompe sin él, situación de equipo (solo/con gente) y qué le frena.
Analiza: identifica qué porcentaje de su día son tareas que no generan dinero. Si todo se rompe sin él, es un autoempleo, no un negocio. Si está solo por falta de confianza, ese es su freno real.

SECCIÓN 5 — TU RUMBO
Datos: visión a 2 años, lo que lleva posponiendo, satisfacción 1-10, qué falta para ser un 10.
Analiza: si la visión es vaga, no tiene dirección. Lo que lleva posponiendo es su prioridad real. La puntuación dice todo.

SECCIÓN 6 — TU PRIORIDAD NÚMERO UNO
Datos: la respuesta que más le duele.
Analiza: conecta esa respuesta con el área que más le conviene trabajar primero. Recomienda el siguiente paso concreto.

IMPORTANTE: Cada interpretación debe ser de 4-6 frases, no 2-3. Profundiza. Conecta lo que ves con las consecuencias reales para el negocio. Las recomendaciones deben ser de 2-3 frases con un paso concreto y por qué importa.
Añade un campo extra en el JSON: resumen_ejecutivo (string de 4-5 frases que resuman el estado general del negocio y la prioridad principal).

FORMATO DE LAS INTERPRETACIONES: Escribe cada interpretación con estructura clara. Usa ** ** para poner en negrita las frases más importantes (2-3 por interpretación). Separa las ideas en párrafos cortos de 2-3 frases separados con una línea en blanco (\\n\\n). La primera frase de cada interpretación debe ser un golpe directo que resuma lo que ves. Ejemplo de formato:

**Tu margen está en zona de riesgo.** De cada 100€ que entra, solo te quedan 19€. Eso no es un negocio rentable, es una rueda que gira sin avanzar.

El problema no es que vendas poco. **Es que lo que vendes no te deja lo suficiente.** Y mientras sigas asumiendo que subir precios te sacaría del mercado, seguirás trabajando mucho para quedarte con poco.

FORMATO DE LAS RECOMENDACIONES: También usa ** ** para destacar la acción principal. Ejemplo:
**Haz una lista de todos tus servicios y calcula cuánto te cuesta realmente cada uno.** Probablemente hay uno o dos que casi no dejan nada y están distorsionando todo el resultado.

FORMATO DE RESPUESTA:
Responde SOLO en JSON válido, sin markdown, sin backticks, sin texto adicional:
{"resumen_ejecutivo":"...","mentalidad":{"resumen":"...","interpretacion":"...","alerta":"..." o null,"recomendacion":"..."},"dinero":{"resumen":"...","interpretacion":"...","margen_porcentaje":X,"alerta":"..." o null,"recomendacion":"..."},"clientes":{"resumen":"...","interpretacion":"...","alerta":"..." o null,"recomendacion":"..."},"tiempo":{"resumen":"...","interpretacion":"...","alerta":"..." o null,"recomendacion":"..."},"rumbo":{"resumen":"...","interpretacion":"...","alerta":"..." o null,"recomendacion":"..."},"prioridad":{"resumen":"...","interpretacion":"...","modulo_recomendado":"...","siguiente_paso":"..."}}`

async function callAnthropicAnalysis(reportData: DiagnosticoReportData): Promise<AiAnalysis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(reportData) }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    return JSON.parse(clean) as AiAnalysis
  } catch (err) {
    console.error('ANTHROPIC ERROR:', err)
    return null
  }
}

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

function renderBoldHtml(text: string): string {
  const paragraphs = text.split(/\n\n+/)
  return paragraphs
    .map(p => {
      const withBold = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return `<p style="margin:0 0 12px;line-height:1.8">${withBold}</p>`
    })
    .join('')
}

// ── Generación del HTML ────────────────────────────────────────────────────

const SANS = `-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`

function execSummaryBlock(resumen: string): string {
  return `
    <div class="no-break" style="margin-bottom:40px;border-left:4px solid #D4A574;padding:20px 24px;background:#fff">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#D4A574;margin-bottom:10px;font-family:${SANS}">
        Resumen del diagnóstico
      </div>
      <p style="font-size:1.05rem;color:#1a1a1a;line-height:1.8;margin:0;font-family:${SANS}">${escHtml(resumen)}</p>
    </div>`
}

function aiSectionBlock(section: AiSection): string {
  return `
    <div style="margin-top:24px">
      <div style="font-size:1rem;font-weight:700;color:#FF4D6A;margin-bottom:10px;font-family:${SANS}">
        Lo que ve el consultor
      </div>
      <div style="font-size:1rem;color:#1a1a1a;font-family:${SANS};margin-bottom:16px">${renderBoldHtml(section.interpretacion)}</div>
      ${section.alerta ? `
      <div style="border-left:4px solid #F59E0B;padding:12px 16px;margin-bottom:16px;background:#fff">
        <div style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;font-family:${SANS}">⚠ Atención</div>
        <div style="font-size:0.9rem;color:#92400e;line-height:1.6;font-family:${SANS}">${escHtml(section.alerta)}</div>
      </div>` : ''}
      <div style="border-left:4px solid #FF4D6A;padding:12px 16px;background:#fff">
        <div style="font-size:10px;font-weight:700;color:#FF4D6A;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;font-family:${SANS}">Siguiente paso</div>
        <div style="font-size:0.95rem;color:#1a1a1a;line-height:1.6;font-family:${SANS}">${renderBoldHtml(section.recomendacion)}</div>
      </div>
    </div>`
}

function closingBlock(): string {
  const text = [
    'Acabas de hacer lo más difícil — mirarte con honestidad. La mayoría nunca llega hasta aquí.',
    'Ahora tienes algo que no tenías: **claridad.** Sabes dónde estás, dónde sangra tu negocio, qué te frena y hacia dónde quieres ir.',
    'A partir de aquí, cada módulo que trabajes va a partir de esta fotografía. **No vas a mejorar todo a la vez.** Vas a mejorar una cosa cada vez. Un paso, una semana, un cambio.',
    'Y cuando mires atrás dentro de tres meses, no vas a reconocer cómo gestionabas tu negocio antes.',
    '**No hay milagros. Hay método. Y ahora tienes los dos.**',
  ].join('\n\n')
  return `
    <div class="no-break" style="margin-top:40px;margin-bottom:32px;border-left:4px solid #D4A574;padding:20px 24px;background:#fff">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#D4A574;margin-bottom:14px;font-family:${SANS}">
        Lo que viene ahora
      </div>
      <div style="font-size:1.05rem;color:#1a1a1a;line-height:1.8;font-family:${SANS}">
        ${renderBoldHtml(text)}
      </div>
    </div>`
}

function buildHtml(
  data: DiagnosticoReportData,
  fullName: string,
  businessName: string,
  businessSector: string,
  fecha: string,
  aiAnalysis: AiAnalysis | null
): string {
  const margen = aiAnalysis
    ? `${aiAnalysis.dinero.margen_porcentaje} %`
    : calcMargen(data.dinero.facturacion_mensual, data.dinero.beneficio_neto)

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
    body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color: #1a1a1a; background: #fff; }
    .report-header { margin-bottom: 32px; }
    .section-label { font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1.5px; color: #9ca3af; margin-bottom: 6px;
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
    h2.section-title { font-family: Georgia,'Times New Roman',serif; font-size: 22px;
      font-weight: 800; color: #1a1a1a; margin: 0 0 20px; }
    .response-label { font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; color: #999; margin-bottom: 6px; }
    .response-block { border-left: 3px solid #d1d5db; padding: 8px 14px;
      margin: 8px 0; background: #f9f9f9; font-size: 0.85rem; color: #666; line-height: 1.6; }
    .big-number { font-size: 28px; font-weight: 800; color: #1a1a1a; line-height: 1; }
    .margen-bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin: 6px 0; }
    .margen-fill { height: 8px; background: #1a1a1a; border-radius: 4px; }
    .scale-circle { width: 56px; height: 56px; border-radius: 50%; border: 3px solid #1a1a1a;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; }
    .proporcion-bar { height: 10px; background: #e5e7eb; border-radius: 5px; margin: 8px 0; }
    .proporcion-fill { height: 10px; background: #1a1a1a; border-radius: 5px; }
    .cita { font-family: Georgia,'Times New Roman',serif; font-size: 20px; font-weight: 700;
      line-height: 1.5; color: #1a1a1a; padding: 20px 24px;
      border-left: 4px solid #D4A574; background: #fafafa; }
    .diferencia-critica { border-left-color: #F59E0B !important; background: #fff; }
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

  ${!aiAnalysis ? `
  <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:12px 16px;margin-bottom:24px;font-size:12px;color:#92400e">
    El análisis personalizado no pudo generarse. Contacta con soporte.
  </div>` : execSummaryBlock(aiAnalysis.resumen_ejecutivo)}

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 1: Tu mentalidad de partida
  ══════════════════════════════════════════════════════════════════ -->
  <div class="no-break" style="margin-bottom:48px">
    <div class="section-label">Sección 1 de 6</div>
    <h2 class="section-title">Tu mentalidad de partida</h2>

    <div class="no-break" style="margin-bottom:14px">
      <div class="response-label">¿Qué ya no estás dispuesto a seguir igual?</div>
      <div class="response-block">${val(data.mentalidad.punto_de_partida)}</div>
    </div>

    <div class="no-break" style="margin-bottom:14px">
      <div class="response-label">Lo que más energía te roba</div>
      <div class="response-block">${val(data.mentalidad.que_roba_energia)}</div>
    </div>

    <div class="no-break" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div class="response-label">Área que quieres cambiar</div>
        <div class="response-block">${val(data.mentalidad.area_que_quiere_cambiar)}</div>
      </div>
      <div>
        <div class="response-label">Tu primer paso</div>
        <div class="response-block">${val(data.mentalidad.paso_mas_pequeno)}</div>
      </div>
    </div>
    ${aiAnalysis ? aiSectionBlock(aiAnalysis.mentalidad) : ''}
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 2: Tu dinero
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 2 de 6</div>
      <h2 class="section-title">Tu dinero</h2>

      <div class="no-break" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px">
        <div style="padding:20px;border:1.5px solid #e5e7eb;border-radius:8px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:6px">
            Facturación mensual
          </div>
          <div class="big-number">${formatEuros(data.dinero.facturacion_mensual)}</div>
        </div>
        <div style="padding:20px;border:1.5px solid #e5e7eb;border-radius:8px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:6px">
            Lo que te llevas a casa
          </div>
          <div class="big-number">${formatEuros(data.dinero.beneficio_neto)}</div>
        </div>
      </div>

      <div class="no-break" style="padding:16px;background:#f9f9f9;border-radius:8px;margin-bottom:20px;border-left:3px solid #d1d5db">
        <div style="font-size:11px;font-weight:600;color:#666;margin-bottom:8px">
          Margen neto estimado: <strong style="font-size:16px;color:#1a1a1a">${margen}</strong>
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

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Lo que más te deja / lo que más tiempo te quita</div>
        <div class="response-block">${val(data.dinero.lo_que_deja_vs_quita)}</div>
      </div>

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Si subieras precios un 20%…</div>
        <div class="response-block">${val(data.dinero.prueba_20_pct)}</div>
      </div>

      ${data.dinero.mira_numeros_kaizen ? `
      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Paso de mejora</div>
        <div class="response-block">${escHtml(data.dinero.mira_numeros_kaizen)}</div>
      </div>` : ''}
    ${aiAnalysis ? aiSectionBlock(aiAnalysis.dinero) : ''}
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 3: Tus clientes
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 3 de 6</div>
      <h2 class="section-title">Tus clientes</h2>

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Tu mejor cliente</div>
        <div class="response-block">${val(data.clientes.mejor_cliente)}</div>
      </div>

      ${data.clientes.proporcion ? `
      <div class="no-break" style="padding:14px 16px;background:#f9f9f9;border-left:3px solid #d1d5db;margin-bottom:14px">
        <div style="font-size:0.85rem;color:#666;margin-bottom:8px">
          Clientes así: <strong style="font-size:1rem;color:#1a1a1a">${escHtml(data.clientes.proporcion)} de cada 10</strong>
        </div>
        <div class="proporcion-bar">
          <div class="proporcion-fill" style="width:${Math.min(100, parseInt(data.clientes.proporcion || '0', 10) * 10)}%"></div>
        </div>
      </div>` : ''}

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Cómo te encuentran los clientes</div>
        <div class="response-block">${val(data.clientes.como_encuentran)}</div>
      </div>

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Qué te diferencia</div>
        <div class="response-block ${!data.clientes.diferenciacion?.trim() ? 'diferencia-critica' : ''}">
          ${val(data.clientes.diferenciacion, '⚠ Sin diferenciación clara identificada')}
        </div>
      </div>

      ${data.clientes.kaizen_pregunta_cliente ? `
      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Lo que te dijo un cliente</div>
        <div class="response-block">${escHtml(data.clientes.kaizen_pregunta_cliente)}</div>
      </div>` : ''}
    ${aiAnalysis ? aiSectionBlock(aiAnalysis.clientes) : ''}
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 4: Tu tiempo
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 4 de 6</div>
      <h2 class="section-title">Tu tiempo</h2>

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Tu día típico de trabajo</div>
        <div class="response-block">${val(data.tiempo.dia_real)}</div>
      </div>

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Si desaparecieras dos semanas…</div>
        <div class="response-block">${val(data.tiempo.prueba_dos_semanas)}</div>
      </div>

      ${data.tiempo.team_size ? `
      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Estructura del equipo</div>
        <div class="response-block">
          <strong style="color:#1a1a1a">${escHtml(data.tiempo.team_size)}</strong>
          ${data.tiempo.freno ? `<br>Freno: ${escHtml(data.tiempo.freno)}` : ''}
          ${data.tiempo.otra_razon ? `<br><em>${escHtml(data.tiempo.otra_razon)}</em>` : ''}
          ${data.tiempo.follow_up_equipo ? `<br>${escHtml(data.tiempo.follow_up_equipo)}` : ''}
        </div>
      </div>` : ''}

      ${data.tiempo.apunta_horas_kaizen ? `
      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Tareas donde eres prescindible</div>
        <div class="response-block">${escHtml(data.tiempo.apunta_horas_kaizen)}</div>
      </div>` : ''}
    ${aiAnalysis ? aiSectionBlock(aiAnalysis.tiempo) : ''}
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 5: Tu rumbo
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 5 de 6</div>
      <h2 class="section-title">Tu rumbo</h2>

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Tu visión a 2 años</div>
        <div class="response-block">${val(data.rumbo.vision_2_anos)}</div>
      </div>

      <div class="no-break" style="margin-bottom:14px">
        <div class="response-label">Lo que llevas posponiendo</div>
        <div class="response-block" style="border-left-color:#F59E0B">${val(data.rumbo.posponiendo)}</div>
      </div>

      ${data.rumbo.termometro ? `
      <div class="no-break" style="display:flex;align-items:flex-start;gap:24px;padding:16px;background:#f9f9f9;border-left:3px solid #d1d5db;margin-bottom:14px">
        <div class="scale-circle">${escHtml(data.rumbo.termometro)}</div>
        <div style="flex:1">
          <div class="response-label">Nivel de satisfacción con tu negocio hoy</div>
          <div style="font-size:0.8rem;color:#999">1 = Nada contento → 10 = Completamente contento</div>
          ${data.rumbo.que_falta_para_10 ? `
          <div style="margin-top:10px">
            <div class="response-label">Para llegar al 10</div>
            <div style="font-size:0.85rem;color:#666">${escHtml(data.rumbo.que_falta_para_10)}</div>
          </div>` : ''}
        </div>
      </div>` : ''}
    ${aiAnalysis ? aiSectionBlock(aiAnalysis.rumbo) : ''}
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════
       SECCIÓN 6: Tu prioridad
  ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break">
    ${headerHtml}
    <div class="no-break" style="margin-bottom:48px">
      <div class="section-label">Sección 6 de 6</div>
      <h2 class="section-title">Tu prioridad</h2>

      <div class="no-break" style="margin-bottom:32px">
        <div class="response-label" style="margin-bottom:12px">La respuesta que más te duele de todo el diagnóstico</div>
        <div class="cita">${val(data.prioridad.respuesta_que_duele, 'Pendiente de completar el paso de mejora de la lección 4.')}</div>
      </div>

      ${aiAnalysis ? `
      <div class="no-break" style="margin-bottom:24px">
        <div style="font-size:1rem;font-weight:700;color:#FF4D6A;margin-bottom:10px;font-family:${SANS}">Lo que ve el consultor</div>
        <div style="font-size:1rem;color:#1a1a1a;font-family:${SANS};margin-bottom:20px">${renderBoldHtml(aiAnalysis.prioridad.interpretacion)}</div>
        <div style="padding:24px;border:1.5px solid #e5e7eb;border-radius:8px;background:#fff">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#FF4D6A;margin-bottom:10px;font-family:${SANS}">Tu próximo módulo</div>
          <div style="font-size:20px;font-weight:800;color:#1a1a1a;margin-bottom:10px;font-family:Georgia,'Times New Roman',serif">${escHtml(aiAnalysis.prioridad.modulo_recomendado)}</div>
          <div style="font-size:0.9rem;color:#374151;line-height:1.6;font-family:${SANS}">${renderBoldHtml(aiAnalysis.prioridad.siguiente_paso)}</div>
        </div>
      </div>` : `
      <div class="no-break" style="padding:20px;border:1.5px solid #e5e7eb;border-radius:8px;margin-bottom:32px">
        <p style="font-size:16px;font-weight:700;margin:0 0 8px;color:#1a1a1a;font-family:Georgia,'Times New Roman',serif">
          Este es tu punto de partida. Ahora vamos a trabajar sobre él.
        </p>
        <p style="font-size:0.9rem;color:#374151;margin:0;line-height:1.6;font-family:${SANS}">
          Cada módulo que completes va a atacar uno de los puntos que acabas de identificar.
          Con método. Sin humo.
        </p>
      </div>`}
    </div>

    ${closingBlock()}

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

  // Comprobar si ya existe un informe generado con análisis de IA
  const { data: existingReport } = await supabase
    .from('evolution_reports')
    .select('report_data')
    .eq('user_id', user.id)
    .eq('report_type', 'diagnostico_inicial')
    .single()

  const cachedAnalysis = (existingReport?.report_data as Record<string, unknown> | null)
    ?.aiAnalysis as AiAnalysis | null | undefined

  let aiAnalysis: AiAnalysis | null

  if (cachedAnalysis) {
    // Servir desde caché — no llamar a la IA
    aiAnalysis = cachedAnalysis
  } else {
    // Primera vez: llamar a la IA y guardar resultado
    aiAnalysis = await callAnthropicAnalysis(reportData)
    await supabase.from('evolution_reports').upsert(
      {
        user_id: user.id,
        report_type: 'diagnostico_inicial',
        report_data: { rawData: reportData, aiAnalysis } as unknown as Record<string, unknown>,
      },
      { onConflict: 'user_id,report_type' }
    )
  }

  const html = buildHtml(reportData, fullName, businessName, businessSector, fecha, aiAnalysis)

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
