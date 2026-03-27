'use client'

import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import CtaBlock from './cta-block'

type Lesson = { id: string; slug: string; order_number: number; title: string }

type Props = {
  vimeoId: string | null
  description: string | null
  lessons: Lesson[]
  showCta: boolean
  paymentsCount: number
}

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

export default function ModuleTabs({ vimeoId, description, lessons, showCta, paymentsCount }: Props) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-0.5">
        <Tabs defaultValue="video">
          <TabsList>
            <TabsTrigger value="video">🎬 Vídeo intro</TabsTrigger>
            <TabsTrigger value="explicacion">📄 Explicación del módulo</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="mt-6">
            <div className="max-w-[720px]">
              {vimeoId ? (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title="Tu Cabeza Manda — introducción"
                  />
                </div>
              ) : (
                <VideoPlaceholder />
              )}
            </div>
          </TabsContent>

          <TabsContent value="explicacion" className="mt-6 space-y-8">
            {description ? (
              <p className="text-base leading-relaxed text-foreground/90 max-w-[720px]">
                {description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Descripción no disponible.</p>
            )}

            {/* Lista de lecciones — visible en móvil donde no hay sidebar */}
            <div className="md:hidden space-y-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                Lecciones del módulo
              </p>
              <div className="space-y-1">
                {lessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/mentalidad/${l.slug}`}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <span className="font-mono text-xs w-5 text-right tabular-nums">
                      {String(l.order_number).padStart(2, '0')}
                    </span>
                    <span>{l.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showCta && (
        <div className="border-t border-border pt-8">
          <CtaBlock paymentsCount={paymentsCount} />
        </div>
      )}
    </div>
  )
}
