import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import SuccessPoller from './success-poller'

export const dynamic = 'force-dynamic'

type Props = { searchParams: { session_id?: string } }

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id

  if (!sessionId) redirect('/pricing')

  // Verificar con Stripe server-side que el pago es real
  let paymentOk = false
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
    })
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    paymentOk = session.payment_status === 'paid'
  } catch {
    paymentOk = false
  }

  if (!paymentOk) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="text-4xl">⚠️</div>
          <h1 className="text-2xl font-bold">No pudimos confirmar tu pago</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Si realizaste un pago, puede que tarde unos minutos en procesarse.
            Si el problema persiste, contáctanos.
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-10 px-5 text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            Volver a precios
          </a>
        </div>
      </div>
    )
  }

  // Stripe confirmó el pago — renderizar cliente que espera al webhook
  return <SuccessPoller />
}
