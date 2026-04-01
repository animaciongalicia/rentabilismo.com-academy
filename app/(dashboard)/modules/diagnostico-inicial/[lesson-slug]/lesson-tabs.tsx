'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { completeLesson, saveExerciseResponse } from './actions'

// ── Types ──────────────────────────────────────────────────────────────────

export type Exercise = {
  id: string
  type: string
  title: string
  description: string
  config: Record<string, unknown>
  order_number: number
  is_kaizen: boolean
}

type Responses = Record<string, Record<string, string | boolean>>
type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'no-session'

type Props = {
  lessonId: string
  lessonTitle: string
  lessonOrder: number
  fraseClave: string
  apertura: string | null
  audioUrl: string | null
  exercises: Exercise[]
  isAuthenticated: boolean
  nextSlug: string | null
  isAlreadyCompleted: boolean
  isLocked: boolean
}

// ── Config types ───────────────────────────────────────────────────────────

type OpenReflectionConfig = { placeholder: string; min_chars?: number; note?: string }
type NumberInputField = { id: string; label: string; placeholder: string; type: 'number' | 'text'; optional?: boolean }
type NumberInputConfig = { fields: NumberInputField[]; note?: string }
type ScaleField = { id: string; label: string; type: 'scale'; min: number; max: number }
type TextField = { id: string; label: string; placeholder: string; type: 'text' }
type TextInputConfig = { fields: (TextField | ScaleField)[] }
type MultipleChoiceOption = { id: string; label: string }
type MultipleChoiceFollowUpSolo = {
  type: 'multiple_choice_plus_text'
  question: string
  options: MultipleChoiceOption[]
  text_field: { id: string; label: string; placeholder: string; show_if: string }
}
type MultipleChoiceFollowUpTeam = { type: 'open_reflection'; question: string; placeholder: string }
type MultipleChoiceConfig = {
  options: MultipleChoiceOption[]
  follow_up: Record<string, MultipleChoiceFollowUpSolo | MultipleChoiceFollowUpTeam>
}
type ScaleFollowUp = { id: string; label: string; type: string; placeholder: string }
type ScaleConfig = { min: number; max: number; min_label: string; max_label: string; follow_up: ScaleFollowUp }
type MejoraConfig = { action_prompt: string; deadline_label: string }

// ── Bold parser ─────────────────────────────────────────────────────────────

function renderBold(text: string): React.ReactNode[] {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

// ── State init ─────────────────────────────────────────────────────────────

function initResponses(exercises: Exercise[]): Responses {
  const init: Responses = {}
  for (const ex of exercises) {
    if (ex.type === 'open_reflection' || ex.type === 'kaizen_step') {
      init[ex.id] = { value: '' }
    } else if (ex.type === 'number_input') {
      const cfg = ex.config as NumberInputConfig
      init[ex.id] = Object.fromEntries(cfg.fields.map((f) => [f.id, '']))
    } else if (ex.type === 'text_input') {
      const cfg = ex.config as TextInputConfig
      init[ex.id] = Object.fromEntries(cfg.fields.map((f) => [f.id, '']))
    } else if (ex.type === 'multiple_choice') {
      init[ex.id] = { selected_option: '', freno: '', otra_razon: '', follow_up_text: '' }
    } else if (ex.type === 'scale') {
      init[ex.id] = { value: '', que_falta: '' }
    }
  }
  return init
}

// ── Save button helper ─────────────────────────────────────────────────────

function SaveButton({
  isAuthenticated,
  saveState,
  onSave,
  label = 'Guardar',
}: {
  isAuthenticated: boolean
  saveState: SaveState
  onSave: () => void
  label?: string
}) {
  if (!isAuthenticated || saveState === 'no-session') {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="underline underline-offset-2 hover:text-foreground">
          Inicia sesión
        </Link>{' '}
        para guardar tus respuestas.
      </p>
    )
  }
  if (saveState === 'saved') {
    return <p className="text-sm font-medium text-green-600 dark:text-green-400">Guardado ✓</p>
  }
  if (saveState === 'error') {
    return <p className="text-sm text-destructive">Error al guardar. Inténtalo de nuevo.</p>
  }
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onSave}
      disabled={saveState === 'saving'}
      className="h-9"
    >
      {saveState === 'saving' ? 'Guardando...' : label}
    </Button>
  )
}

// ── Exercise renderers ─────────────────────────────────────────────────────

function OpenReflection({
  exercise, responses, onSet, isAuthenticated, saveState, onSave,
}: {
  exercise: Exercise; responses: Responses
  onSet: (id: string, key: string, val: string) => void
  isAuthenticated: boolean; saveState: SaveState; onSave: (id: string) => void
}) {
  const cfg = exercise.config as OpenReflectionConfig
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="font-semibold text-base">{exercise.title}</p>
        <p className="text-base text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      <Textarea
        placeholder={cfg.placeholder}
        value={(responses[exercise.id]?.value as string) ?? ''}
        onChange={(e) => onSet(exercise.id, 'value', e.target.value)}
        rows={4}
        className="resize-none bg-background"
      />
      {cfg.note && <p className="text-xs text-muted-foreground italic">{cfg.note}</p>}
      <SaveButton isAuthenticated={isAuthenticated} saveState={saveState} onSave={() => onSave(exercise.id)} />
    </div>
  )
}

function NumberInputExercise({
  exercise, responses, onSet, isAuthenticated, saveState, onSave,
}: {
  exercise: Exercise; responses: Responses
  onSet: (id: string, key: string, val: string) => void
  isAuthenticated: boolean; saveState: SaveState; onSave: (id: string) => void
}) {
  const cfg = exercise.config as NumberInputConfig
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-semibold text-base">{exercise.title}</p>
        <p className="text-base text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      {cfg.fields.map((field) => (
        <div key={field.id} className="space-y-1.5">
          <Label htmlFor={`${exercise.id}-${field.id}`}>
            {field.label}
            {field.optional && (
              <span className="ml-1 text-xs text-muted-foreground font-normal">(opcional)</span>
            )}
          </Label>
          <Input
            id={`${exercise.id}-${field.id}`}
            type={field.type}
            placeholder={field.placeholder}
            value={(responses[exercise.id]?.[field.id] as string) ?? ''}
            onChange={(e) => onSet(exercise.id, field.id, e.target.value)}
            className="bg-background max-w-xs"
          />
        </div>
      ))}
      {cfg.note && <p className="text-xs text-muted-foreground italic">{cfg.note}</p>}
      <SaveButton isAuthenticated={isAuthenticated} saveState={saveState} onSave={() => onSave(exercise.id)} />
    </div>
  )
}

function TextInputExercise({
  exercise, responses, onSet, isAuthenticated, saveState, onSave,
}: {
  exercise: Exercise; responses: Responses
  onSet: (id: string, key: string, val: string) => void
  isAuthenticated: boolean; saveState: SaveState; onSave: (id: string) => void
}) {
  const cfg = exercise.config as TextInputConfig
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-semibold text-base">{exercise.title}</p>
        <p className="text-base text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      {cfg.fields.map((field) => (
        <div key={field.id} className="space-y-1.5">
          <Label htmlFor={`${exercise.id}-${field.id}`}>{field.label}</Label>
          {field.type === 'scale' ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground tabular-nums w-4">{field.min}</span>
              <input
                id={`${exercise.id}-${field.id}`}
                type="range"
                min={field.min}
                max={field.max}
                step={1}
                value={(responses[exercise.id]?.[field.id] as string) || String(field.min)}
                onChange={(e) => onSet(exercise.id, field.id, e.target.value)}
                className="flex-1 accent-primary"
              />
              <span className="text-xs text-muted-foreground tabular-nums w-4">{field.max}</span>
              <span className="text-base font-semibold tabular-nums w-6 text-center">
                {(responses[exercise.id]?.[field.id] as string) || String(field.min)}
              </span>
            </div>
          ) : (
            <Textarea
              id={`${exercise.id}-${field.id}`}
              placeholder={(field as TextField).placeholder}
              value={(responses[exercise.id]?.[field.id] as string) ?? ''}
              onChange={(e) => onSet(exercise.id, field.id, e.target.value)}
              rows={3}
              className="resize-none bg-background"
            />
          )}
        </div>
      ))}
      <SaveButton isAuthenticated={isAuthenticated} saveState={saveState} onSave={() => onSave(exercise.id)} />
    </div>
  )
}

function MultipleChoiceExercise({
  exercise, responses, onSet, isAuthenticated, saveState, onSave,
}: {
  exercise: Exercise; responses: Responses
  onSet: (id: string, key: string, val: string) => void
  isAuthenticated: boolean; saveState: SaveState; onSave: (id: string) => void
}) {
  const cfg = exercise.config as MultipleChoiceConfig
  const selectedOption = (responses[exercise.id]?.selected_option as string) ?? ''
  const followUp = selectedOption ? cfg.follow_up?.[selectedOption] : null

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-semibold text-base">{exercise.title}</p>
        <p className="text-base text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>

      {/* Radio options */}
      <div className="space-y-2">
        {cfg.options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <input
              type="radio"
              name={`${exercise.id}-option`}
              value={opt.id}
              checked={selectedOption === opt.id}
              onChange={() => {
                onSet(exercise.id, 'selected_option', opt.id)
                // reset follow_up fields when option changes
                onSet(exercise.id, 'freno', '')
                onSet(exercise.id, 'otra_razon', '')
                onSet(exercise.id, 'follow_up_text', '')
              }}
              className="accent-primary"
            />
            <span className="text-sm leading-snug">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Conditional follow-up */}
      {followUp && followUp.type === 'multiple_choice_plus_text' && (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
          <p className="text-sm font-medium">{followUp.question}</p>
          <div className="space-y-2">
            {followUp.options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-background transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name={`${exercise.id}-freno`}
                  value={opt.id}
                  checked={(responses[exercise.id]?.freno as string) === opt.id}
                  onChange={() => onSet(exercise.id, 'freno', opt.id)}
                  className="accent-primary"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
          {(responses[exercise.id]?.freno as string) === followUp.text_field.show_if && (
            <div className="space-y-1.5 pt-1">
              <Label htmlFor={`${exercise.id}-otra`}>{followUp.text_field.label}</Label>
              <Textarea
                id={`${exercise.id}-otra`}
                placeholder={followUp.text_field.placeholder}
                value={(responses[exercise.id]?.otra_razon as string) ?? ''}
                onChange={(e) => onSet(exercise.id, 'otra_razon', e.target.value)}
                rows={2}
                className="resize-none bg-background"
              />
            </div>
          )}
        </div>
      )}

      {followUp && followUp.type === 'open_reflection' && (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2">
          <p className="text-sm font-medium">{followUp.question}</p>
          <Textarea
            placeholder={(followUp as MultipleChoiceFollowUpTeam).placeholder}
            value={(responses[exercise.id]?.follow_up_text as string) ?? ''}
            onChange={(e) => onSet(exercise.id, 'follow_up_text', e.target.value)}
            rows={3}
            className="resize-none bg-background"
          />
        </div>
      )}

      <SaveButton isAuthenticated={isAuthenticated} saveState={saveState} onSave={() => onSave(exercise.id)} />
    </div>
  )
}

function ScaleExercise({
  exercise, responses, onSet, isAuthenticated, saveState, onSave,
}: {
  exercise: Exercise; responses: Responses
  onSet: (id: string, key: string, val: string) => void
  isAuthenticated: boolean; saveState: SaveState; onSave: (id: string) => void
}) {
  const cfg = exercise.config as ScaleConfig
  const currentValue = (responses[exercise.id]?.value as string) || ''
  const numValue = currentValue ? parseInt(currentValue, 10) : null

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="font-semibold text-base">{exercise.title}</p>
        <p className="text-base text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>

      {/* Scale selector — buttons 1–10 */}
      <div className="space-y-2">
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: cfg.max - cfg.min + 1 }, (_, i) => cfg.min + i).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onSet(exercise.id, 'value', String(n))}
              className={`w-11 h-11 rounded-lg border text-sm font-semibold transition-colors ${
                numValue === n
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-primary/60 hover:bg-muted/40'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-0.5">
          <span>{cfg.min_label}</span>
          <span>{cfg.max_label}</span>
        </div>
      </div>

      {/* Follow-up — siempre visible */}
      <div className="space-y-1.5">
        <Label htmlFor={`${exercise.id}-followup`}>{cfg.follow_up.label}</Label>
        <Textarea
          id={`${exercise.id}-followup`}
          placeholder={cfg.follow_up.placeholder}
          value={(responses[exercise.id]?.que_falta as string) ?? ''}
          onChange={(e) => onSet(exercise.id, 'que_falta', e.target.value)}
          rows={3}
          className="resize-none bg-background"
        />
      </div>

      <SaveButton isAuthenticated={isAuthenticated} saveState={saveState} onSave={() => onSave(exercise.id)} />
    </div>
  )
}

function MejoraStep({
  exercise, responses, onSet, isAuthenticated, saveState, onSave,
}: {
  exercise: Exercise; responses: Responses
  onSet: (id: string, key: string, val: string) => void
  isAuthenticated: boolean; saveState: SaveState; onSave: (id: string) => void
}) {
  const cfg = exercise.config as MejoraConfig
  return (
    <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-5 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-base text-primary font-bold select-none">⚡</span>
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">
          Paso de Mejora
        </span>
        <Badge variant="outline" className="text-xs">
          {cfg.deadline_label}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-base">{exercise.title}</p>
        <p className="text-base text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${exercise.id}-mejora`}>{cfg.action_prompt}</Label>
        <Textarea
          id={`${exercise.id}-mejora`}
          placeholder="Escribe aquí..."
          value={(responses[exercise.id]?.value as string) ?? ''}
          onChange={(e) => onSet(exercise.id, 'value', e.target.value)}
          rows={3}
          className="resize-none bg-background"
        />
      </div>
      <SaveButton
        isAuthenticated={isAuthenticated}
        saveState={saveState}
        onSave={() => onSave(exercise.id)}
        label="Guardar y marcar como hecho"
      />
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function DiagnosticoLessonTabs({
  lessonId,
  lessonTitle,
  lessonOrder,
  fraseClave,
  apertura,
  audioUrl,
  exercises,
  isAuthenticated,
  nextSlug,
  isAlreadyCompleted,
  isLocked,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [responses, setResponses] = useState<Responses>(() => initResponses(exercises))
  const [completed, setCompleted] = useState(isAlreadyCompleted)
  const [navigateTo, setNavigateTo] = useState<string | null>(null)
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({})

  React.useEffect(() => {
    if (navigateTo) router.push(navigateTo)
  }, [navigateTo, router])

  const regularExercises = exercises.filter((e) => !e.is_kaizen)
  const mejoraExercise = exercises.find((e) => e.is_kaizen)

  function setResponse(id: string, key: string, value: string | boolean) {
    setResponses((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
  }

  async function handleSave(exerciseId: string) {
    if (!isAuthenticated) {
      setSaveStates((prev) => ({ ...prev, [exerciseId]: 'no-session' }))
      return
    }
    setSaveStates((prev) => ({ ...prev, [exerciseId]: 'saving' }))
    const result = await saveExerciseResponse(exerciseId, responses[exerciseId] ?? {})
    if ('error' in result) {
      const nextState: SaveState = result.error === 'no-session' ? 'no-session' : 'error'
      setSaveStates((prev) => ({ ...prev, [exerciseId]: nextState }))
      return
    }
    setSaveStates((prev) => ({ ...prev, [exerciseId]: 'saved' }))
    setTimeout(() => {
      setSaveStates((prev) => ({ ...prev, [exerciseId]: 'idle' }))
    }, 3000)
  }

  function handleComplete() {
    setError(null)
    startTransition(async () => {
      const result = await completeLesson(lessonId, responses)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setCompleted(true)
      if (nextSlug) {
        setNavigateTo(`/modules/diagnostico-inicial/${nextSlug}`)
      } else {
        // Última lección → pantalla de cierre
        setNavigateTo('/modules/diagnostico-inicial/cierre')
      }
    })
  }

  function CompleteButton() {
    if (isLocked) {
      return (
        <div className="flex items-center gap-2 pt-4 border-t border-border/50 text-sm text-muted-foreground">
          <span>🔒</span>
          <span>Completa la lección anterior para desbloquear esta.</span>
        </div>
      )
    }

    if (completed) {
      return (
        <div className="flex items-center gap-3 text-sm pt-4 border-t border-border/50">
          <span className="text-green-600 dark:text-green-400 font-medium">✓ Lección completada</span>
          {nextSlug ? (
            <Link
              href={`/modules/diagnostico-inicial/${nextSlug}`}
              className="text-primary underline underline-offset-4 hover:no-underline text-sm"
            >
              Siguiente lección →
            </Link>
          ) : (
            <Link
              href="/modules/diagnostico-inicial/cierre"
              className="text-primary underline underline-offset-4 hover:no-underline text-sm"
            >
              Ver mi Informe de Diagnóstico →
            </Link>
          )}
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="underline underline-offset-2 hover:text-foreground">
              Inicia sesión
            </Link>{' '}
            para guardar tu progreso.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-2 pt-4 border-t border-border/50">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleComplete} disabled={isPending} size="lg" className="h-12">
          {isPending ? 'Guardando...' : 'Completar lección'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
          Lección {lessonOrder}
        </p>
        <h1 className="text-3xl font-bold tracking-tight leading-snug">{lessonTitle}</h1>
      </div>

      {/* Locked notice */}
      {isLocked && (
        <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="text-base">🔒</span>
          <span>Esta lección se desbloquea al completar la lección anterior.</span>
        </div>
      )}

      <Tabs defaultValue="explicacion">
        <TabsList>
          <TabsTrigger value="explicacion">📄 Explicación</TabsTrigger>
          <TabsTrigger value="ejercicios">✏️ Ejercicios</TabsTrigger>
          <TabsTrigger value="mejora">⚡ Mejora</TabsTrigger>
        </TabsList>

        {/* Explicación */}
        <TabsContent value="explicacion" className="mt-6 space-y-6 max-w-[720px]">
          <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground leading-relaxed">
            {fraseClave}
          </blockquote>
          {apertura && (
            <div className="space-y-4">
              {apertura.split('\n\n').map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-foreground/90">
                  {renderBold(para)}
                </p>
              ))}
            </div>
          )}

          {/* Audio placeholder */}
          <div className="rounded-lg border border-border bg-muted/20 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base select-none">🎧</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Audio de la lección
              </span>
            </div>
            {audioUrl ? (
              <audio controls src={audioUrl} className="w-full mt-1" />
            ) : (
              <div className="flex items-center gap-3 py-2 text-muted-foreground/60">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                  />
                </svg>
                <p className="text-sm">Audio disponible próximamente</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Ejercicios */}
        <TabsContent value="ejercicios" className="mt-6 space-y-8 max-w-[720px]">
          {regularExercises.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay ejercicios para esta lección.</p>
          ) : (
            regularExercises.map((ex) => (
              <div key={ex.id}>
                {ex.type === 'open_reflection' && (
                  <OpenReflection exercise={ex} responses={responses} onSet={setResponse}
                    isAuthenticated={isAuthenticated} saveState={saveStates[ex.id] ?? 'idle'} onSave={handleSave} />
                )}
                {ex.type === 'number_input' && (
                  <NumberInputExercise exercise={ex} responses={responses} onSet={setResponse}
                    isAuthenticated={isAuthenticated} saveState={saveStates[ex.id] ?? 'idle'} onSave={handleSave} />
                )}
                {ex.type === 'text_input' && (
                  <TextInputExercise exercise={ex} responses={responses} onSet={setResponse}
                    isAuthenticated={isAuthenticated} saveState={saveStates[ex.id] ?? 'idle'} onSave={handleSave} />
                )}
                {ex.type === 'multiple_choice' && (
                  <MultipleChoiceExercise exercise={ex} responses={responses} onSet={setResponse}
                    isAuthenticated={isAuthenticated} saveState={saveStates[ex.id] ?? 'idle'} onSave={handleSave} />
                )}
                {ex.type === 'scale' && (
                  <ScaleExercise exercise={ex} responses={responses} onSet={setResponse}
                    isAuthenticated={isAuthenticated} saveState={saveStates[ex.id] ?? 'idle'} onSave={handleSave} />
                )}
              </div>
            ))
          )}
          {!mejoraExercise && <CompleteButton />}
        </TabsContent>

        {/* Mejora */}
        <TabsContent value="mejora" className="mt-6 space-y-8 max-w-[720px]">
          {mejoraExercise ? (
            <MejoraStep exercise={mejoraExercise} responses={responses} onSet={setResponse}
              isAuthenticated={isAuthenticated} saveState={saveStates[mejoraExercise.id] ?? 'idle'} onSave={handleSave} />
          ) : (
            <p className="text-sm text-muted-foreground">No hay paso de mejora para esta lección.</p>
          )}
          <CompleteButton />
        </TabsContent>
      </Tabs>
    </div>
  )
}
