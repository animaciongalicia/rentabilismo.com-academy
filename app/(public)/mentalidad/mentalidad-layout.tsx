'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { completeLesson } from './actions'
import CtaBlock from './cta-block'

// ── Types ──────────────────────────────────────────────────────────────────

export type Exercise = {
  id: string
  lesson_id: string
  type: string
  title: string
  description: string
  config: Record<string, unknown>
  order_number: number
  is_kaizen: boolean
}

export type LessonData = {
  id: string
  title: string
  slug: string
  order_number: number
  frase_clave: string
  apertura: string | null
  audio_url: string | null
}

export type ModuleData = {
  id: number
  title: string
  description: string | null
  vimeo_id: string | null
}

type ActiveSection =
  | { type: 'module'; tab: 'video' | 'explicacion' }
  | { type: 'lesson'; lessonId: string; tab: 'audio' | 'explicacion' | 'ejercicios' | 'kaizen' }

type Responses = Record<string, Record<string, string | boolean>>

type Props = {
  mod: ModuleData | null
  lessons: LessonData[]
  exercisesByLesson: Record<string, Exercise[]>
  completedIds: string[]
  isAuthenticated: boolean
  paymentsCount: number
}

// ── Exercise config types ──────────────────────────────────────────────────

type OpenReflectionConfig = { placeholder: string; min_chars?: number; note?: string }
type TextInputConfig = { fields: { id: string; label: string; placeholder: string }[] }
type ChecklistConfig = {
  items: { id: string; label: string }[]
  follow_up?: { type: string; label: string; placeholder: string }
}
type KaizenConfig = { action_prompt: string; deadline_label: string }

// ── State initializer ──────────────────────────────────────────────────────

function initResponses(exercisesByLesson: Record<string, Exercise[]>): Responses {
  const init: Responses = {}
  for (const exercises of Object.values(exercisesByLesson)) {
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

// ── Sidebar ────────────────────────────────────────────────────────────────

const MODULE_TABS = [
  { id: 'video' as const, label: '🎬 Vídeo' },
  { id: 'explicacion' as const, label: '📄 Explicación' },
]

const LESSON_TABS = [
  { id: 'audio' as const, label: '🎧 Audio' },
  { id: 'explicacion' as const, label: '📄 Explicación' },
  { id: 'ejercicios' as const, label: '✏️ Ejercicios' },
  { id: 'kaizen' as const, label: '⚡ Kaizen' },
]

function Sidebar({
  mod,
  lessons,
  activeSection,
  expandedId,
  completedIds,
  onNavigate,
  onToggle,
}: {
  mod: ModuleData | null
  lessons: LessonData[]
  activeSection: ActiveSection
  expandedId: string
  completedIds: Set<string>
  onNavigate: (section: ActiveSection) => void
  onToggle: (id: string) => void
}) {
  return (
    <aside className="hidden md:flex flex-col sticky top-0 h-screen w-[280px] shrink-0 border-r border-border bg-muted/30 overflow-y-auto">
      <div className="p-4 space-y-1">

        {/* Module row */}
        <div>
          <button
            onClick={() => onToggle('module')}
            className={cn(
              'w-full flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors text-left',
              activeSection.type === 'module'
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
            )}
          >
            <span className="truncate">{mod?.title ?? 'Módulo 0'}</span>
            <span
              className={cn(
                'text-xs transition-transform shrink-0',
                expandedId === 'module' ? 'rotate-90' : ''
              )}
            >
              ›
            </span>
          </button>
          {expandedId === 'module' && (
            <div className="mt-0.5 ml-3 space-y-0.5">
              {MODULE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onNavigate({ type: 'module', tab: tab.id })}
                  className={cn(
                    'w-full text-left rounded-md px-3 py-2 text-xs transition-colors',
                    activeSection.type === 'module' && activeSection.tab === tab.id
                      ? 'bg-background text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border/50 my-2" />

        {/* Lesson rows */}
        {lessons.map((lesson) => {
          const isExpanded = expandedId === lesson.id
          const isActive = activeSection.type === 'lesson' && activeSection.lessonId === lesson.id
          const isCompleted = completedIds.has(lesson.id)

          return (
            <div key={lesson.id}>
              <button
                onClick={() => onToggle(lesson.id)}
                className={cn(
                  'w-full flex items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors text-left',
                  isActive
                    ? 'bg-background text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                )}
              >
                <span className="font-mono text-xs shrink-0 tabular-nums w-5 text-right">
                  {String(lesson.order_number).padStart(2, '0')}
                </span>
                <span className="leading-snug flex-1 min-w-0 truncate">{lesson.title}</span>
                {isCompleted && (
                  <span className="shrink-0 text-xs text-green-600 dark:text-green-400 font-bold">
                    ✓
                  </span>
                )}
                <span
                  className={cn(
                    'text-xs transition-transform shrink-0',
                    isExpanded ? 'rotate-90' : ''
                  )}
                >
                  ›
                </span>
              </button>
              {isExpanded && (
                <div className="mt-0.5 ml-6 space-y-0.5">
                  {LESSON_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        onNavigate({ type: 'lesson', lessonId: lesson.id, tab: tab.id })
                      }
                      className={cn(
                        'w-full text-left rounded-md px-3 py-2 text-xs transition-colors',
                        activeSection.type === 'lesson' &&
                          activeSection.lessonId === lesson.id &&
                          activeSection.tab === tab.id
                          ? 'bg-background text-foreground font-medium'
                          : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

// ── Mobile nav ─────────────────────────────────────────────────────────────

function MobileNav({
  mod,
  lessons,
  activeSection,
  onNavigate,
}: {
  mod: ModuleData | null
  lessons: LessonData[]
  activeSection: ActiveSection
  onNavigate: (section: ActiveSection) => void
}) {
  const sections = [
    { id: 'module', label: mod?.title ?? 'Módulo' },
    ...lessons.map((l) => ({ id: l.id, label: `L${l.order_number}` })),
  ]

  const currentTabs =
    activeSection.type === 'module'
      ? MODULE_TABS
      : LESSON_TABS

  const currentTab =
    activeSection.type === 'module' ? activeSection.tab : activeSection.tab

  function handleSectionClick(sectionId: string) {
    if (sectionId === 'module') {
      onNavigate({ type: 'module', tab: 'explicacion' })
    } else {
      onNavigate({ type: 'lesson', lessonId: sectionId, tab: 'explicacion' })
    }
  }

  function handleTabClick(tabId: string) {
    if (activeSection.type === 'module') {
      onNavigate({ type: 'module', tab: tabId as 'video' | 'explicacion' })
    } else {
      onNavigate({
        type: 'lesson',
        lessonId: activeSection.lessonId,
        tab: tabId as 'audio' | 'explicacion' | 'ejercicios' | 'kaizen',
      })
    }
  }

  const activeSectionId =
    activeSection.type === 'module' ? 'module' : activeSection.lessonId

  return (
    <div className="md:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Row 1 — section selector */}
      <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-none">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSectionClick(s.id)}
            className={cn(
              'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
              activeSectionId === s.id
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      {/* Row 2 — tab selector */}
      <div className="flex items-center gap-1 px-3 pb-2 overflow-x-auto scrollbar-none">
        {currentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors whitespace-nowrap',
              currentTab === tab.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function MentalidadLayout({
  mod,
  lessons,
  exercisesByLesson,
  completedIds: initialCompletedIds,
  isAuthenticated,
  paymentsCount,
}: Props) {
  const [activeSection, setActiveSection] = useState<ActiveSection>(
    lessons[0]
      ? { type: 'lesson', lessonId: lessons[0].id, tab: 'explicacion' }
      : { type: 'module', tab: 'explicacion' }
  )

  const [expandedId, setExpandedId] = useState<string>(lessons[0]?.id ?? 'module')

  const [responses, setResponses] = useState<Responses>(() => initResponses(exercisesByLesson))

  const [completedIdsState, setCompletedIdsState] = useState<Set<string>>(
    () => new Set(initialCompletedIds)
  )

  const [completedError, setCompletedError] = useState<string | null>(null)
  const [pendingLessonId, setPendingLessonId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const showCta = isAuthenticated && completedIdsState.size >= lessons.length && lessons.length > 0

  function setResponse(exerciseId: string, key: string, value: string | boolean) {
    setResponses((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [key]: value },
    }))
  }

  function navigateTo(section: ActiveSection) {
    setActiveSection(section)
    setExpandedId(section.type === 'module' ? 'module' : section.lessonId)
  }

  function toggleExpanded(id: string) {
    if (expandedId === id) {
      // Collapse: keep active section but collapse sidebar item
      setExpandedId('')
    } else {
      setExpandedId(id)
      // Also navigate to default tab for this section
      if (id === 'module') {
        setActiveSection({ type: 'module', tab: 'explicacion' })
      } else {
        setActiveSection({ type: 'lesson', lessonId: id, tab: 'explicacion' })
      }
    }
  }

  function handleCompleteLesson(lessonId: string) {
    setCompletedError(null)
    setPendingLessonId(lessonId)

    const lessonExercises = exercisesByLesson[lessonId] ?? []
    const lessonResponses: Responses = {}
    for (const ex of lessonExercises) {
      lessonResponses[ex.id] = responses[ex.id] ?? {}
    }

    startTransition(async () => {
      const result = await completeLesson(lessonId, lessonResponses)
      setPendingLessonId(null)
      if ('error' in result) {
        setCompletedError(result.error)
        return
      }
      setCompletedIdsState((prev) => { const next = new Set(prev); next.add(lessonId); return next })
      // Navigate to next lesson
      const idx = lessons.findIndex((l) => l.id === lessonId)
      const nextLesson = idx < lessons.length - 1 ? lessons[idx + 1] : null
      if (nextLesson) {
        navigateTo({ type: 'lesson', lessonId: nextLesson.id, tab: 'explicacion' })
      }
    })
  }

  // ── Complete button ───────────────────────────────────────────────────────

  function CompleteButton({ lessonId }: { lessonId: string }) {
    const isCompleted = completedIdsState.has(lessonId)
    const isPendingThis = pendingLessonId === lessonId

    if (isCompleted) {
      const idx = lessons.findIndex((l) => l.id === lessonId)
      const nextLesson = idx < lessons.length - 1 ? lessons[idx + 1] : null
      return (
        <div className="flex items-center gap-3 text-sm pt-4 border-t border-border/50">
          <span className="text-green-600 dark:text-green-400 font-medium">✓ Lección completada</span>
          {nextLesson && (
            <button
              onClick={() => navigateTo({ type: 'lesson', lessonId: nextLesson.id, tab: 'explicacion' })}
              className="text-primary underline underline-offset-4 hover:no-underline text-sm"
            >
              Siguiente lección →
            </button>
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
        {completedError && <p className="text-sm text-destructive">{completedError}</p>}
        <Button
          onClick={() => handleCompleteLesson(lessonId)}
          disabled={isPendingThis}
          size="lg"
        >
          {isPendingThis ? 'Guardando...' : 'Completar lección'}
        </Button>
      </div>
    )
  }

  // ── Content renderer ──────────────────────────────────────────────────────

  function renderContent() {
    if (activeSection.type === 'module') {
      if (activeSection.tab === 'video') {
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                Módulo 0
              </p>
              <h1 className="text-3xl font-bold tracking-tight">{mod?.title}</h1>
            </div>
            <div className="max-w-[720px]">
              {mod?.vimeo_id ? (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://player.vimeo.com/video/${mod.vimeo_id}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={mod.title ?? 'Módulo 0'}
                  />
                </div>
              ) : (
                <VideoPlaceholder />
              )}
            </div>
          </div>
        )
      }

      // module > explicacion
      return (
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Módulo 0
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{mod?.title}</h1>
          </div>
          {mod?.description && (
            <p className="text-base leading-relaxed text-foreground/90">{mod.description}</p>
          )}
        </div>
      )
    }

    // Lesson content
    const lesson = lessons.find((l) => l.id === activeSection.lessonId)
    if (!lesson) return null

    const exercises = exercisesByLesson[lesson.id] ?? []
    const regularExercises = exercises.filter((e) => !e.is_kaizen)
    const kaizenExercise = exercises.find((e) => e.is_kaizen)

    const lessonHeader = (
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
          Lección {lesson.order_number}
        </p>
        <h1 className="text-3xl font-bold tracking-tight leading-snug">{lesson.title}</h1>
        {completedIdsState.has(lesson.id) && (
          <span className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
            ✓ Lección completada
          </span>
        )}
      </div>
    )

    if (activeSection.tab === 'audio') {
      return (
        <div className="space-y-8">
          {lessonHeader}
          {lesson.audio_url ? (
            <audio controls src={lesson.audio_url} className="w-full" />
          ) : (
            <AudioPlaceholder />
          )}
        </div>
      )
    }

    if (activeSection.tab === 'explicacion') {
      return (
        <div className="space-y-8">
          {lessonHeader}
          <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground leading-relaxed">
            {lesson.frase_clave}
          </blockquote>
          {lesson.apertura && (
            <div className="space-y-4">
              {lesson.apertura.split('\n\n').map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-foreground/90">
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (activeSection.tab === 'ejercicios') {
      return (
        <div className="space-y-8">
          {lessonHeader}
          {regularExercises.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay ejercicios para esta lección.</p>
          ) : (
            <div className="space-y-8">
              {regularExercises.map((ex) => (
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
              ))}
            </div>
          )}
          <CompleteButton lessonId={lesson.id} />
        </div>
      )
    }

    // kaizen tab
    return (
      <div className="space-y-8">
        {lessonHeader}
        {kaizenExercise ? (
          <KaizenStep exercise={kaizenExercise} responses={responses} onSet={setResponse} />
        ) : (
          <p className="text-sm text-muted-foreground">No hay paso Kaizen para esta lección.</p>
        )}
        <CompleteButton lessonId={lesson.id} />
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <MobileNav
        mod={mod}
        lessons={lessons}
        activeSection={activeSection}
        onNavigate={navigateTo}
      />

      <div className="md:flex">
        <Sidebar
          mod={mod}
          lessons={lessons}
          activeSection={activeSection}
          expandedId={expandedId}
          completedIds={completedIdsState}
          onNavigate={navigateTo}
          onToggle={toggleExpanded}
        />

        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-[1040px] px-4 py-10 md:py-12 space-y-12">
            {renderContent()}

            {/* CTA — shown when all lessons are completed */}
            {showCta && (
              <div className="border-t border-border pt-10">
                <CtaBlock paymentsCount={paymentsCount} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
