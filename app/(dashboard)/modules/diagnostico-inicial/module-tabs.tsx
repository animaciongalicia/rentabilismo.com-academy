'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type Lesson = { id: string; slug: string; order_number: number; title: string }

type Props = {
  vimeoId: string | null
  description: string | null
  videoIntroText: string | null
  lessons: Lesson[]
  completedIds: string[]
}

function isLocked(lesson: Lesson, lessons: Lesson[], completed: Set<string>): boolean {
  if (lesson.order_number === 1) return false
  const prev = lessons.find((l) => l.order_number === lesson.order_number - 1)
  return prev ? !completed.has(prev.id) : false
}

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

function VideoPlaceholder() {
  return (
    <div className="aspect-video w-full max-w-[720px] rounded-xl border border-border bg-muted/30 flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <div className="w-14 h-14 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-sm font-medium">Vídeo introductorio disponible próximamente</p>
    </div>
  )
}

function LessonList({ lessons, completedIds }: { lessons: Lesson[]; completedIds: string[] }) {
  const completed = new Set(completedIds)
  return (
    <div className="space-y-2 max-w-[720px]">
      <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
        Lecciones del módulo
      </p>
      <div className="space-y-1.5">
        {lessons.map((lesson) => {
          const isCompleted = completed.has(lesson.id)
          const locked = isLocked(lesson, lessons, completed)

          if (locked) {
            return (
              <div
                key={lesson.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3 text-sm text-muted-foreground/50 cursor-not-allowed select-none"
              >
                <span className="font-mono text-xs tabular-nums shrink-0 w-5 text-right">
                  {String(lesson.order_number).padStart(2, '0')}
                </span>
                <span className="flex-1 line-clamp-1">{lesson.title}</span>
                <span className="shrink-0 text-xs" aria-label="Bloqueada">🔒</span>
              </div>
            )
          }

          return (
            <Link
              key={lesson.id}
              href={`/modules/diagnostico-inicial/${lesson.slug}`}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors',
                isCompleted
                  ? 'border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/30 text-foreground hover:bg-green-50 dark:hover:bg-green-950/50'
                  : 'border-border bg-background hover:bg-muted/40 text-foreground'
              )}
            >
              <span className="font-mono text-xs tabular-nums shrink-0 w-5 text-right text-muted-foreground">
                {String(lesson.order_number).padStart(2, '0')}
              </span>
              <span className="flex-1 line-clamp-1 font-medium">{lesson.title}</span>
              {isCompleted ? (
                <span className="shrink-0 text-xs text-green-600 dark:text-green-400 font-bold">✓</span>
              ) : (
                <span className="shrink-0 text-xs text-primary font-medium">→</span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function DiagnosticoModuleTabs({
  vimeoId,
  videoIntroText,
  lessons,
  completedIds,
}: Props) {
  return (
    <Tabs defaultValue="explicacion">
      <TabsList>
        <TabsTrigger value="explicacion">📄 Explicación del módulo</TabsTrigger>
        <TabsTrigger value="video">🎬 Vídeo</TabsTrigger>
      </TabsList>

      {/* Explicación del módulo */}
      <TabsContent value="explicacion" className="mt-6 space-y-8">
        {videoIntroText ? (
          <div className="space-y-4 max-w-[720px]">
            {videoIntroText.split('\n\n').map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-foreground/90">
                {renderBold(para)}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Descripción no disponible.</p>
        )}

        {/* Lista de lecciones — solo visible en móvil (sidebar oculto en desktop) */}
        <div className="md:hidden">
          <LessonList lessons={lessons} completedIds={completedIds} />
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
                title="Diagnóstico Inicial — introducción"
              />
            </div>
          ) : (
            <VideoPlaceholder />
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
