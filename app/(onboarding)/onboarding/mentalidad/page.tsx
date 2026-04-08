import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Brain, BarChart2, Settings, TrendingUp, type LucideIcon } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export const metadata = {
  title: 'Tu próximo paso - Rentabilismo Academy',
}

type Pillar = {
  icon: LucideIcon
  title: string
  description: string
}

const PILLARS: Pillar[] = [
  {
    icon: Brain,
    title: 'Mentalidad de empresario',
    description:
      'Aprende a tomar decisiones con claridad, sin dejarte llevar por el estrés del día a día.',
  },
  {
    icon: BarChart2,
    title: 'Números que importan',
    description:
      'Entiende los 5 indicadores que determinan si tu negocio crece o se estanca.',
  },
  {
    icon: Settings,
    title: 'Sistemas y procesos',
    description:
      'Construye un negocio que funcione sin que tú estés presente en cada decisión.',
  },
  {
    icon: TrendingUp,
    title: 'Escala sin caos',
    description:
      'Metodología paso a paso para crecer de forma ordenada y predecible.',
  },
]

export default async function MentalidadPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const firstName = (profile?.full_name ?? 'Empresario').split(' ')[0]

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Cabecera */}
      <div className="text-center space-y-3">
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
          Onboarding completado
        </p>
        <h1 className="text-3xl font-bold leading-tight">
          {firstName}, estás a un paso de entrar
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Has dado el primer paso — ya sabes dónde estás y hacia dónde vas.
          Ahora necesitas las herramientas para llegar.
        </p>
      </div>

      {/* Lo que vas a aprender */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <Card key={pillar.title} className="border bg-muted/30">
            <CardHeader className="pb-2">
              <pillar.icon className="size-6 text-primary mb-1" />
              <CardTitle className="text-base">{pillar.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA principal */}
      <Card className="border-primary/40 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Accede al programa completo</CardTitle>
          <CardDescription>
            Un único pago. Acceso de por vida. Sin mensualidades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>✓ Módulos semanales con metodología probada</li>
            <li>✓ Cuartel General — comunidad privada de empresarios</li>
            <li>✓ El Muro — accountability diario</li>
            <li>✓ Acceso directo al mentor</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Link
            href="/precio"
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-11 px-8 text-sm font-medium hover:bg-primary/90"
          >
            Ver planes y precios
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
