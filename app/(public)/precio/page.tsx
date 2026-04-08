import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CheckoutButton from './_components/checkout-button'

export const metadata = {
  title: 'Acceso al programa — Rentabilismo Academy',
}

const BENEFITS = [
  '90 días para transformar tu negocio, con metodología y acompañamiento',
  '30 días trabajando el programa — mentalidad, números, procesos, ventas y estrategia',
  '60 días analizando y corrigiendo — aplicas, mides y ajustas',
  '90 días en mejora continua — construyes el sistema que sostiene el crecimiento',
  'Cuartel General — comunidad privada de empresarios reales',
  'El Muro — accountability diario para no perder el ritmo',
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 space-y-12">

        {/* Cabecera */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
            Acceso completo
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Un único pago.<br />90 días para transformar tu negocio.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Sin mensualidades. Sin sorpresas. Pagas una vez y empiezas hoy.
          </p>
        </div>

        {/* Card de precio */}
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader className="pb-4">
            <div className="flex items-end gap-3">
              <span className="text-muted-foreground line-through text-2xl">1.200€</span>
              <span className="text-5xl font-bold tracking-tight">799€</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Pago único · IVA incluido
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Beneficios */}
            <ul className="space-y-2.5">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 shrink-0 text-primary font-bold">—</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Divisor */}
            <div className="border-t border-border/50" />

            {/* Checkout */}
            <CheckoutButton />

            {/* Nota acceso limitado */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Primeros 50 accesos:</strong> precio garantizado para siempre.
              A partir del acceso 51, el precio pasa a ser anual. Reserva tu plaza ahora.
            </p>
          </CardContent>
        </Card>

        {/* Garantía */}
        <p className="text-center text-sm text-muted-foreground">
          Si en los primeros 7 días sientes que no es para ti, te devolvemos el dinero sin preguntas.
        </p>

      </div>
    </div>
  )
}
