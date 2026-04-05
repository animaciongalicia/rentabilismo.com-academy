'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const CHATGPT_URL =
  'https://chatgpt.com/g/g-69d163b95fbc819199d66e5a349a4164-agente-mentalidad-el-espejo'

const PROMPT_COMPLETO = `Eres El Espejo, el consultor de mentalidad empresarial de Rentabilismo Academy.
No eres un coach, no eres un motivador. Eres el consultor que le dice al empresario lo que lleva tiempo sabiendo pero no quiere ver. Hablas con respeto y sin anestesia. No atacas — muestras. Y lo que muestras siempre son sus propias respuestas convertidas en espejo.

El empresario que te consulta acaba de completar el módulo gratuito de Rentabilismo Academy — "Tu Cabeza Manda". Ha respondido 4 lecciones sobre su mentalidad empresarial, sus bloqueos y sus patrones. Recibirás esas respuestas al inicio del chat. Úsalas desde el primer mensaje. Son tu munición. No las ignores.

Lo que más te importa de esas respuestas:
- Qué le pesa más de su negocio ahora mismo
- Qué parte de él está frenando su propio negocio
- Qué ha estado evitando decidir
- Por qué cree que este momento podría ser el indicado para cambiar

Reglas inamovibles:
- Habla siempre en segunda persona: tú, tu negocio, te pasa, llevas
- Haz UNA pregunta por turno, nunca varias
- No valides excusas — nómbralas y córtalas usando sus propios datos
- No des listas — da UNA cosa clara que resuene
- No uses más de 150 palabras por respuesta
- Nada de "¡Excelente!", "Gran reflexión" ni peloteo de ningún tipo
- Conecta siempre tus respuestas con algo concreto que él escribió
- Si detectas la excusa del dinero: calcula con sus propios datos cuánto le ha costado el problema hasta hoy
- Si detectas "no es el momento": pregúntale cuándo dijo eso la última vez y qué cambió mientras esperaba
- Si detectas "no sé si funcionará": recuérdale que llevar tiempo haciendo lo mismo da los mismos resultados

Cuando el empresario pegue su contexto, responde exactamente así:
"Llevo unos segundos leyendo lo que has escrito. Y hay algo que se repite.
Antes de seguir — ¿cuánto tiempo llevas sabiendo que algo en tu negocio tiene que cambiar?"

Después de cada respuesta:
1. Usa algo concreto que escribió — una frase, un dato, una contradicción
2. Muéstrale el coste real de seguir igual — en tiempo, en dinero, en energía
3. Una sola pregunta que profundice en lo que está evitando

Cuando la conversación llegue a su punto de claridad máxima:
"Ya sabes lo que está pasando. Ya sabes lo que te cuesta cada mes que pasa.
Solo te queda decidir si esto lo resuelves solo — como hasta ahora — o con método y acompañamiento.
Vuelve a la plataforma. El siguiente paso está ahí esperándote."`

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

      {/* Botón principal */}
      <div className="mb-8">
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

      {/* Pestañas */}
      <Tabs defaultValue="consultor">
        <TabsList>
          <TabsTrigger value="consultor">El Consultor</TabsTrigger>
          <TabsTrigger value="como-usarlo">Como usarlo</TabsTrigger>
          <TabsTrigger value="crealo">Crealo tu mismo</TabsTrigger>
        </TabsList>

        {/* Pestaña 1 — El Consultor */}
        <TabsContent value="consultor" className="mt-6 space-y-8 max-w-[720px]">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">El Espejo</h1>
            <p className="mt-1 text-base text-muted-foreground">
              Tu consultor de mentalidad empresarial
            </p>
          </div>

          <div className="space-y-6">
            <Section titulo="Quien es">
              El Espejo no te dice lo que quieres oír. Te muestra lo que ya sabes pero llevas
              tiempo mirando para otro lado. Es el consultor que coge tus propias palabras y te las
              devuelve ordenadas — para que veas con claridad lo que está frenando tu negocio y lo
              que te está costando cada mes que pasa.
            </Section>

            <Section titulo="Que hace">
              Cruza tus respuestas del módulo, detecta el patrón de bloqueo y arranca directo. Sin
              calentamiento. Sin teoría. Solo tus datos y las preguntas que nadie más te hace.
            </Section>

            <Section titulo="Para que momento">
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
        </TabsContent>

        {/* Pestaña 2 — Cómo usarlo */}
        <TabsContent value="como-usarlo" className="mt-6 space-y-6 max-w-[720px]">
          <h2 className="text-xl font-bold">Como usarlo</h2>

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
        </TabsContent>

        {/* Pestaña 3 — Créalo tú mismo */}
        <TabsContent value="crealo" className="mt-6 space-y-6 max-w-[720px]">
          <h2 className="text-xl font-bold">Crealo tu mismo</h2>
          <p className="text-base text-foreground/90 leading-relaxed">
            Si quieres tener El Espejo en tu propia cuenta de ChatGPT como GPT personalizado, aquí
            tienes el prompt completo para configurarlo.
          </p>

          <ol className="space-y-2">
            {[
              'Ve a chatgpt.com → Explorar GPTs → Crear',
              'En Instrucciones, pega el prompt completo de abajo',
              'Nombre: El Espejo | Rentabilismo',
              'Descripción: El consultor que te dice lo que llevas tiempo sabiendo pero no quieres ver',
              'Guárdalo como privado',
            ].map((paso, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/90">
                <span className="shrink-0 font-mono text-muted-foreground">{i + 1}.</span>
                <span>{paso}</span>
              </li>
            ))}
          </ol>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Prompt completo
              </p>
              <button
                onClick={handleCopiarPrompt}
                className="text-xs font-medium text-primary hover:text-primary/70 transition-colors underline underline-offset-2"
              >
                Copiar prompt
              </button>
            </div>
            <pre className="rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap overflow-x-auto">
              {PROMPT_COMPLETO}
            </pre>
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
