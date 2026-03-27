'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { completeLesson } from './actions'

// ── Types ─────────────────────────────────────────────────────────────────

type OpenReflectionConfig = {
  placeholder: string
  min_chars?: number
  note?: string
}

type TextInputConfig = {
  fields: { id: string; label: string; placeholder: string }[]
}

type ChecklistConfig = {
  items: { id: string; label: string }[]
  follow_up?: { type: string; label: string; placeholder: string }
}

type KaizenConfig = {
  action_prompt: string
  deadline_label: string
}

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

type Props = {
  lessonId: string
  exercises: Exercise[]
  isAuthenticated: boolean
  isAlreadyCompleted: boolean
  nextSlug: string | null
}

// ── State initializer ─────────────────────────────────────────────────────

function initResponses(exercises: Exercise[]): Responses {
  const init: Responses = {}
  for (const ex of exercises) {
    if (ex.type === 'open_reflection' || ex.type === 'kaizen_step') {
      init[ex.id] = { value: '' }
    } else if (ex.type === 'text_input') {
      const cfg = ex.config as TextInputConfig
      init[ex.id] = Object.fromEntries(cfg.fields.map((f) => [f.id, '']))
    } else if (ex.type === 'checklist') {
      const cfg = ex.config as ChecklistConfig
      init[ex.id] = {
        ...Object.fromEntries(cfg.items.map((item) => [item.id, false])),
        ...(cfg.follow_up ? { follow_up: '' } : {}),
      }
    }
  }
  return init
}

// ── Exercise renderers ────────────────────────────────────────────────────

function OpenReflection({
  exercise,
  responses,
  onSet,
}: {
  exercise: Exercise
  responses: Responses
  onSet: (id: string, key: string, val: string) => void
}) {
  const cfg = exercise.config as OpenReflectionConfig
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="font-semibold text-sm">{exercise.title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      <Textarea
        placeholder={cfg.placeholder}
        value={(responses[exercise.id]?.value as string) ?? ''}
        onChange={(e) => onSet(exercise.id, 'value', e.target.value)}
        rows={4}
        className="resize-none"
      />
      {cfg.note && (
        <p className="text-xs text-muted-foreground italic">{cfg.note}</p>
      )}
    </div>
  )
}

function TextInputExercise({
  exercise,
  responses,
  onSet,
}: {
  exercise: Exercise
  responses: Responses
  onSet: (id: string, key: string, val: string) => void
}) {
  const cfg = exercise.config as TextInputConfig
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-semibold text-sm">{exercise.title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      {cfg.fields.map((field) => (
        <div key={field.id} className="space-y-1.5">
          <Label htmlFor={`${exercise.id}-${field.id}`}>{field.label}</Label>
          <Input
            id={`${exercise.id}-${field.id}`}
            placeholder={field.placeholder}
            value={(responses[exercise.id]?.[field.id] as string) ?? ''}
            onChange={(e) => onSet(exercise.id, field.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}

function ChecklistExercise({
  exercise,
  responses,
  onSet,
}: {
  exercise: Exercise
  responses: Responses
  onSet: (id: string, key: string, val: string | boolean) => void
}) {
  const cfg = exercise.config as ChecklistConfig
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-semibold text-sm">{exercise.title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      <div className="space-y-2.5">
        {cfg.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5">
            <Checkbox
              id={`${exercise.id}-${item.id}`}
              checked={(responses[exercise.id]?.[item.id] as boolean) ?? false}
              onCheckedChange={(checked) => onSet(exercise.id, item.id, checked === true)}
            />
            <label
              htmlFor={`${exercise.id}-${item.id}`}
              className="text-sm leading-none cursor-pointer"
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
      {cfg.follow_up && (
        <div className="space-y-1.5 pt-1">
          <Label htmlFor={`${exercise.id}-follow-up`}>{cfg.follow_up.label}</Label>
          <Textarea
            id={`${exercise.id}-follow-up`}
            placeholder={cfg.follow_up.placeholder}
            value={(responses[exercise.id]?.follow_up as string) ?? ''}
            onChange={(e) => onSet(exercise.id, 'follow_up', e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
      )}
    </div>
  )
}

function KaizenStep({
  exercise,
  responses,
  onSet,
}: {
  exercise: Exercise
  responses: Responses
  onSet: (id: string, key: string, val: string) => void
}) {
  const cfg = exercise.config as KaizenConfig
  return (
    <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-5 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-base text-primary font-bold select-none">⚡</span>
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">
          Paso Kaizen
        </span>
        <Badge variant="outline" className="text-xs">
          {cfg.deadline_label}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-sm">{exercise.title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${exercise.id}-kaizen`}>{cfg.action_prompt}</Label>
        <Textarea
          id={`${exercise.id}-kaizen`}
          placeholder="Escribe aquí..."
          value={(responses[exercise.id]?.value as string) ?? ''}
          onChange={(e) => onSet(exercise.id, 'value', e.target.value)}
          rows={3}
          className="resize-none bg-background/60"
        />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export default function ExerciseForm({
  lessonId,
  exercises,
  isAuthenticated,
  isAlreadyCompleted,
  nextSlug,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [responses, setResponses] = useState<Responses>(() => initResponses(exercises))

  function set(exerciseId: string, key: string, value: string | boolean) {
    setResponses((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [key]: value },
    }))
  }

  function handleComplete() {
    setError(null)
    startTransition(async () => {
      const result = await completeLesson(lessonId, responses)
      if ('error' in result) {
        setError(result.error)
        return
      }
      router.push(nextSlug ? `/mentalidad/${nextSlug}` : '/mentalidad')
    })
  }

  return (
    <div className="space-y-8">

      {/* Ejercicios */}
      {exercises.map((exercise) => (
        <div key={exercise.id}>
          {exercise.type === 'open_reflection' && (
            <OpenReflection exercise={exercise} responses={responses} onSet={set} />
          )}
          {exercise.type === 'text_input' && (
            <TextInputExercise exercise={exercise} responses={responses} onSet={set} />
          )}
          {exercise.type === 'checklist' && (
            <ChecklistExercise exercise={exercise} responses={responses} onSet={set} />
          )}
          {exercise.type === 'kaizen_step' && (
            <KaizenStep exercise={exercise} responses={responses} onSet={set} />
          )}
        </div>
      ))}

      {/* Botón completar / estado / CTA */}
      {isAlreadyCompleted ? (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-600 dark:text-green-400 font-medium">
            ✓ Lección completada
          </span>
          {nextSlug && (
            <button
              onClick={() => router.push(`/mentalidad/${nextSlug}`)}
              className="text-primary underline underline-offset-4 hover:no-underline text-sm"
            >
              Siguiente lección →
            </button>
          )}
        </div>
      ) : isAuthenticated ? (
        <div className="space-y-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleComplete} disabled={isPending} size="lg">
            {isPending ? 'Guardando...' : 'Completar lección'}
          </Button>
        </div>
      ) : (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-5 space-y-3">
            <p className="font-semibold text-sm">Guarda tu progreso</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crea una cuenta gratuita para guardar tus respuestas y seguir desde donde lo dejaste.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              Crear cuenta gratis
            </Link>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
