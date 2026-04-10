import { notFound, redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import ModuleTabs from '@/components/modules/module-tabs'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = await getSupabaseServerClient()
  const { data: mod } = await supabase
    .from('modules')
    .select('title, order_number')
    .eq('slug', params.slug)
    .single()
  return {
    title: mod
      ? `${mod.title} — Módulo ${String(mod.order_number).padStart(2, '0')} · Rentabilismo Academy`
      : 'Rentabilismo Academy',
  }
}

export default async function DashboardModulePage({ params }: Props) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verificar acceso de pago
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_paid, access_expires_at')
    .eq('id', user.id)
    .single()

  const accessExpired = profile?.access_expires_at
    ? new Date(profile.access_expires_at) < new Date()
    : false
  if (!profile?.has_paid || accessExpired) redirect('/precio')

  // Módulo por slug
  const { data: mod } = await supabase
    .from('modules')
    .select('id, order_number, slug, title, description, vimeo_id, video_intro_text')
    .eq('slug', params.slug)
    .single()

  if (!mod) notFound()

  // Lecciones del módulo
  const lessonsResult = await supabase
    .from('lessons')
    .select('id, title, slug, order_number')
    .eq('module_id', mod.id)
    .order('order_number')

  const lessons = lessonsResult.data ?? []

  const moduleLabel = `Módulo ${String(mod.order_number).padStart(2, '0')}`
  const lessonHrefPrefix = `/modulos/${mod.slug}`

  return (
    <div className="min-h-screen bg-background md:flex">
      <main className="flex-1 min-w-0">
        <div className="max-w-[1040px] px-8 py-6">
          <div className="space-y-3 mb-8">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              {moduleLabel}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{mod.title}</h1>
          </div>

          <ModuleTabs
            vimeoId={mod.vimeo_id ?? null}
            description={mod.description ?? null}
            videoIntroText={mod.video_intro_text ?? null}
            lessons={lessons}
            lessonHrefPrefix={lessonHrefPrefix}
          />
        </div>
      </main>
    </div>
  )
}
