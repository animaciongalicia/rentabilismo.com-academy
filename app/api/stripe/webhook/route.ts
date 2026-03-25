import Stripe from 'stripe'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: Request): Promise<Response> {
  // Leer el body crudo ANTES de cualquier parseo — crítico para verificar la firma
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  // Verificar firma del webhook
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return new Response(`Webhook signature verification failed: ${message}`, {
      status: 400,
    })
  }

  // Solo procesar checkout.session.completed; el resto devuelve 200 inmediatamente
  if (event.type !== 'checkout.session.completed') {
    return new Response('Event received', { status: 200 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Recuperar user_id desde client_reference_id (puesto en el checkout route)
  const userId = session.client_reference_id
  if (!userId) {
    console.error('Webhook: checkout.session.completed sin client_reference_id', session.id)
    return new Response('Missing client_reference_id', { status: 400 })
  }

  const supabase = getSupabaseAdminClient()

  try {
    // Insertar el pago. payment_number es SERIAL — Postgres lo asigna atómicamente.
    // ON CONFLICT DO NOTHING garantiza idempotencia si Stripe reenvía el evento.
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
        amount: session.amount_total ?? 79900,
        currency: session.currency ?? 'eur',
        // access_type se actualiza después de conocer payment_number
        access_type: 'lifetime', // valor provisional; se sobrescribe a continuación
      })
      .select('payment_number')
      .single()

    if (insertError) {
      // Código 23505 = unique_violation (pago duplicado) — idempotente, devolver 200
      if (insertError.code === '23505') {
        return new Response('Duplicate event ignored', { status: 200 })
      }
      throw new Error(`payments insert failed: ${insertError.message}`)
    }

    // Determinar tipo de acceso según número de orden (atómico, sin race condition)
    const paymentNumber = payment.payment_number as number
    const isLifetime = paymentNumber <= 50
    const accessType = isLifetime ? 'lifetime' : 'yearly'
    const accessExpiresAt = isLifetime
      ? null
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

    // Actualizar access_type en payments ahora que lo conocemos
    await supabase
      .from('payments')
      .update({ access_type: accessType })
      .eq('stripe_session_id', session.id)

    // Actualizar perfil del usuario
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        has_paid: true,
        access_type: accessType,
        access_expires_at: accessExpiresAt,
        stripe_customer_id: typeof session.customer === 'string'
          ? session.customer
          : null,
        stripe_payment_id: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
      })
      .eq('id', userId)

    if (profileError) {
      throw new Error(`profiles update failed: ${profileError.message}`)
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    // Devolver 500 para que Stripe reintente
    return new Response('Internal server error', { status: 500 })
  }
}
