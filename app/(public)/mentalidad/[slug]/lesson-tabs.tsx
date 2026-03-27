'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { completeLesson } from './actions'

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

type Props = {
  lessonId: string
  lessonTitle: string
  lessonOrder: number
  fraseClave: string
  apertura: string | null
  vimeoId: string | null
  audioUrl: string | null
  exercises: Exercise[]
  isAuthenticated: boolean
  isAlreadyCompleted: boolean
  nextSlug: string | null
}

// ── Config types ───────────────────────────────────────────────────────────

type OpenReflectionConfig = { placeholder: string; min_chars?: number; note?: string }
type TextInputConfig = { fields: { id: string; label: string; placeholder: string }[] }
type ChecklistConfig = {
  items: { id: string; label: string }[]
  follow_up?: { type: string; label: string; placeholder: string }
}
type MejoraConfig = { action_prompt: string; deadline_label: string }

// ── Bold parser — renderiza **texto** como <strong> ───────────────────────

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

// ── Exercise renderers ─────────────────────────────────────────────────────

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
      {cfg.note && <p className="text-xs text-muted-foreground italic">{cfg.note}</p>}
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

function MejoraStep({
  exercise,
  responses,
  onSet,
}: {
  exercise: Exercise
  responses: Responses
  onSet: (id: string, key: string, val: string) => void
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
        <p className="font-semibold text-sm">{exercise.title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${exercise.id}-mejora`}>{cfg.action_prompt}</Label>
        <Textarea
          id={`${exercise.id}-mejora`}
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

// ── Placeholders ───────────────────────────────────────────────────────────

function VideoPlaceholder() {
  return (
    <div className="aspect-video w-full rounded-xl border border-border bg-muted/30 flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <div className="w-14 h-14 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-sm font-medium">Vídeo disponible próximamente</p>
    </div>
  )
}

function AudioPlaceholder() {
  return (
    <div className="w-full rounded-lg border border-border bg-muted/20 px-5 py-4 flex items-center gap-4">
      <div className="w-9 h-9 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0 text-muted-foreground">
        <svg
          className="w-4 h-4"
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
      </div>
      <div>
        <p className="text-sm font-medium">Audio — mensaje central</p>
        <p className="text-xs text-muted-foreground mt-0.5">Disponible próximamente</p>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function LessonTabs({
  lessonId,
  lessonTitle,
  lessonOrder,
  fraseClave,
  apertura,
  vimeoId,
  audioUrl,
  exercises,
  isAuthenticated,
  isAlreadyCompleted,
  nextSlug,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [responses, setResponses] = useState<Responses>(() => initResponses(exercises))
  const [completed, setCompleted] = useState(isAlreadyCompleted)

  const regularExercises = exercises.filter((e) => !e.is_kaizen)
  const mejoraExercise = exercises.find((e) => e.is_kaizen)

  function setResponse(id: string, key: string, value: string | boolean) {
    setResponses((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
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
      router.push(nextSlug ? `/mentalidad/${nextSlug}` : '/mentalidad')
    })
  }

  function CompleteButton() {
    if (completed) {
      return (
        <div className="flex items-center gap-3 text-sm pt-4 border-t border-border/50">
          <span className="text-green-600 dark:text-green-400 font-medium">✓ Lección completada</span>
          {nextSlug && (
            <Link
              href={`/mentalidad/${nextSlug}`}
              className="text-primary underline underline-offset-4 hover:no-underline text-sm"
            >
              Siguiente lección →
            </Link>
          )}
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
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
      )
    }

    return (
      <div className="space-y-2 pt-4 border-t border-border/50">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleComplete} disabled={isPending} size="lg">
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

      {/* Tabs */}
      <Tabs defaultValue="explicacion">
          <TabsList>
            <TabsTrigger value="explicacion">📄 Explicación</TabsTrigger>
            <TabsTrigger value="video">🎬 Vídeo</TabsTrigger>
            <TabsTrigger value="audio">🎧 Audio</TabsTrigger>
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
            <div className="border-t border-border/40 pt-2">
              <p className="text-xs text-muted-foreground">
                Continúa con las pestañas Vídeo, Audio y Ejercicios.
              </p>
            </div>
          </TabsContent>

          {/* Vídeo */}
          <TabsContent value="video" className="mt-6">
            <div className="max-w-[720px]">
              {vimeoId ? (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={lessonTitle}
                  />
                </div>
              ) : (
                <VideoPlaceholder />
              )}
            </div>
          </TabsContent>

          {/* Audio */}
          <TabsContent value="audio" className="mt-6 max-w-[720px]">
            {audioUrl ? (
              <audio controls src={audioUrl} className="w-full" />
            ) : (
              <AudioPlaceholder />
            )}
          </TabsContent>

          {/* Ejercicios */}
          <TabsContent value="ejercicios" className="mt-6 space-y-8 max-w-[720px]">
            {regularExercises.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay ejercicios para esta lección.</p>
            ) : (
              regularExercises.map((ex) => (
                <div key={ex.id}>
                  {ex.type === 'open_reflection' && (
                    <OpenReflection exercise={ex} responses={responses} onSet={setResponse} />
                  )}
                  {ex.type === 'text_input' && (
                    <TextInputExercise exercise={ex} responses={responses} onSet={setResponse} />
                  )}
                  {ex.type === 'checklist' && (
                    <ChecklistExercise exercise={ex} responses={responses} onSet={setResponse} />
                  )}
                </div>
              ))
            )}
            {!mejoraExercise && <CompleteButton />}
          </TabsContent>

          {/* Mejora */}
          <TabsContent value="mejora" className="mt-6 space-y-8 max-w-[720px]">
            {mejoraExercise ? (
              <MejoraStep exercise={mejoraExercise} responses={responses} onSet={setResponse} />
            ) : (
              <p className="text-sm text-muted-foreground">No hay paso de mejora para esta lección.</p>
            )}
            <CompleteButton />
          </TabsContent>
      </Tabs>
    </div>
  )
}
