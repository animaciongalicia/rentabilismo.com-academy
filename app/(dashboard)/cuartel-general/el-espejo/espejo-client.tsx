'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const CHATGPT_URL =
  'https://chatgpt.com/g/g-69d163b95fbc819199d66e5a349a4164-agente-mentalidad-el-espejo'

const PROMPT_COMPLETO = `Eres El Espejo, un consultor de mentalidad empresarial.
No eres un coach ni un motivador. Eres el consultor que le dice al empresario lo que lleva tiempo sabiendo pero no quiere ver. Hablas con respeto y sin anestesia. No atacas — muestras.

Reglas inamovibles:
- Habla siempre en segunda persona: tú, tu negocio, te pasa
- Haz UNA pregunta por turno, nunca varias
- No valides excusas — nómbralas y córtalas con sus propios datos
- No des listas — da UNA cosa clara que resuene
- No uses más de 150 palabras por respuesta
- Nada de "¡Excelente!", "Gran reflexión" ni peloteo
- Conecta siempre tus respuestas con algo concreto que el empresario escribió

Cuando arranques la conversación, responde así:
"No has venido a preguntarme qué puedo hacer por ti.
Has venido porque algo en tu negocio no está donde debería.
Llevo unos segundos leyendo lo que has escrito. Y hay algo que se repite.
Antes de seguir — ¿cuánto tiempo llevas sabiendo que algo en tu negocio tiene que cambiar?"

Después de cada respuesta:
1. Usa algo concreto que el empresario escribió
2. Muéstrale el coste real de seguir igual
3. Una sola pregunta que profundice en lo que está evitando

Cierra siempre con una acción concreta. Pequeña. Ejecutable hoy.`

type Props = {
  formattedResponses: string | null
}

export default function EspejoClient({ formattedResponses }: Props) {
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  async function handleAbrirEspejo() {
    if (formattedResponses) {
      try {
        await navigator.clipboard.writeText(formattedResponses)
        showToast('Tus respuestas se han copiado. Pégalas en el chat cuando abra El Espejo.')
      } catch {
        showToast('No se pudo copiar automáticamente. Copia tus respuestas manualmente.')
      }
    } else {
      showToast(
        'Completa primero las lecciones de Tu Cabeza Manda para obtener el máximo del agente.'
      )
    }
    window.open(CHATGPT_URL, '_blank')
  }

  async function handleCopiarPrompt() {
    try {
      await navigator.clipboard.writeText(PROMPT_COMPLETO)
      showToast('Prompt copiado. Pégalo en las instrucciones del GPT personalizado.')
    } catch {
      showToast('No se pudo copiar. Selecciona el texto manualmente.')
    }
  }

  return (
    <div className="relative">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-5 py-3 rounded-lg shadow-lg max-w-sm text-center">
          {toastMsg}
        </div>
      )}

      {/* Pestañas */}
      <Tabs defaultValue="consultor">
        <TabsList>
          <TabsTrigger value="consultor">El Consultor</TabsTrigger>
          <TabsTrigger value="como-usarlo">Cómo usarlo</TabsTrigger>
          <TabsTrigger value="crealo">Créalo tú mismo</TabsTrigger>
        </TabsList>

        {/* Pestaña 1 — El Consultor */}
        <TabsContent value="consultor" className="mt-6 space-y-8 max-w-[720px]">
          <div className="space-y-6">
            <Section titulo="Quién es">
              El Espejo no te dice lo que quieres oír. Te muestra lo que ya sabes pero llevas
              tiempo mirando para otro lado. Es el consultor que coge tus propias palabras y te las
              devuelve ordenadas — para que veas con claridad lo que está frenando tu negocio y lo
              que te está costando cada mes que pasa.
            </Section>

            <Section titulo="Qué hace">
              Cruza tus respuestas del módulo, detecta el patrón de bloqueo y arranca directo. Sin
              calentamiento. Sin teoría. Solo tus datos y las preguntas que nadie más te hace.
            </Section>

            <Section titulo="Para qué momento">
              Acabas de terminar las 4 lecciones de Tu Cabeza Manda. Estás pensando. Algo se ha
              movido por dentro. Ese es el momento — cuando estás caliente y todavía no has
              racionalizado el cambio.
            </Section>

            <Section titulo="Resultados esperados">
              Sales de la conversación sabiendo exactamente qué parte de ti está frenando tu
              negocio, cuánto te está costando eso cada mes, y cuál es el siguiente paso real. No
              una lista de reflexiones — una decisión.
            </Section>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAbrirEspejo}
              className="h-12 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition-colors"
            >
              Abrir El Espejo en ChatGPT
            </button>
            {!formattedResponses && (
              <p className="mt-2 text-xs text-muted-foreground">
                Completa las lecciones de Tu Cabeza Manda para que El Espejo use tus respuestas reales.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Pestaña 2 — Cómo usarlo */}
        <TabsContent value="como-usarlo" className="mt-6 space-y-6 max-w-[720px]">
          <h2 className="text-xl font-bold">Cómo usarlo</h2>

          <ol className="space-y-5">
            {[
              {
                n: 1,
                texto:
                  'Copia tu contexto — Al abrir El Espejo en ChatGPT, tus respuestas del módulo se copian automáticamente. Pégalas al inicio del chat. Son la base de todo.',
              },
              {
                n: 2,
                texto:
                  'Deja que arranque él — El Espejo hace la primera pregunta. No tienes que preparar nada. Solo responde con honestidad.',
              },
              {
                n: 3,
                texto:
                  'Responde sin filtro — Cuanto más honesto seas con lo que está pasando en tu negocio, más útil será la conversación.',
              },
              {
                n: 4,
                texto:
                  'Escucha el cierre — Cuando El Espejo cierre la sesión, te dará un pasito concreto. Uno solo. Hazlo antes de 24 horas.',
              },
            ].map(({ n, texto }) => (
              <li key={n} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {n}
                </span>
                <p className="text-base leading-relaxed text-foreground/90 pt-0.5">{texto}</p>
              </li>
            ))}
          </ol>

          <div className="rounded-lg border border-border bg-muted/30 px-5 py-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              No es un chatbot que te da consejos genéricos. Si le dices vaguedades, te devuelve
              preguntas. Para que funcione, necesita verdad.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAbrirEspejo}
              className="h-12 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition-colors"
            >
              Abrir El Espejo en ChatGPT
            </button>
            {!formattedResponses && (
              <p className="mt-2 text-xs text-muted-foreground">
                Completa las lecciones de Tu Cabeza Manda para que El Espejo use tus respuestas reales.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Pestaña 3 — Créalo tú mismo */}
        <TabsContent value="crealo" className="mt-6 space-y-6 max-w-[720px]">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Crea tu propio Espejo en ChatGPT</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Copia el prompt de abajo y sigue los pasos. En 2 minutos lo tienes listo.
            </p>
          </div>

          <ol className="space-y-3">
            {[
              'Ve a chatgpt.com → tu nombre → "Mis GPTs" → "Crear GPT"',
              'En la pestaña "Configurar", pega el prompt en el campo "Instrucciones"',
              'Nombre: El Espejo | Consultor de Mentalidad',
              'Guárdalo como privado → "Solo yo"',
            ].map((paso, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-muted text-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90 pt-0.5">{paso}</p>
              </li>
            ))}
          </ol>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                PROMPT COMPLETO — cópialo todo
              </p>
              <button
                onClick={handleCopiarPrompt}
                className="shrink-0 h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/80 transition-colors"
              >
                Copiar prompt
              </button>
            </div>
            <pre className="rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {PROMPT_COMPLETO}
            </pre>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Este es el prompt base público. El Espejo completo, con acceso a tus respuestas del
              módulo, está disponible en la plataforma.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAbrirEspejo}
              className="h-12 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition-colors"
            >
              Abrir El Espejo en ChatGPT
            </button>
            {!formattedResponses && (
              <p className="mt-2 text-xs text-muted-foreground">
                Completa las lecciones de Tu Cabeza Manda para que El Espejo use tus respuestas reales.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {titulo}
      </p>
      <p className="text-base leading-relaxed text-foreground/90">{children}</p>
    </div>
  )
}
