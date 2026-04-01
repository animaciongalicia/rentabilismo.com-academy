import Stripe from 'stripe'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
  })
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
        access_type: 'lifetime', // valor provisional; se sobrescribe a continuación
      })
      .select('payment_number')
      .single()

    let paymentNumber: number

    if (insertError) {
      if (insertError.code === '23505') {
        // Pago duplicado — recuperar el payment_number existente para poder
        // actualizar el perfil si el primer intento falló antes de llegar aquí
        const { data: existing } = await supabase
          .from('payments')
          .select('payment_number')
          .eq('stripe_session_id', session.id)
          .single()
        if (!existing) {
          return new Response('Duplicate event ignored', { status: 200 })
        }
        paymentNumber = existing.payment_number as number
      } else {
        throw new Error(`payments insert failed: ${insertError.message}`)
      }
    } else {
      if (!payment) throw new Error('payments insert returned no data')
      paymentNumber = payment.payment_number as number
    }

    // Determinar tipo de acceso según número de orden (atómico, sin race condition)
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
    console.log('[webhook] PRE-UPDATE userId:', userId, '| paymentNumber:', paymentNumber, '| accessType:', accessType, '| session.id:', session.id)

    const { data: updatedProfiles, error: profileError } = await supabase
      .from('profiles')
      .update({
        has_paid: true,
        access_type: accessType,
        access_expires_at: accessExpiresAt,
        paid_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('id, has_paid, access_type')

    console.log('[webhook] POST-UPDATE result:', JSON.stringify({ updatedProfiles, profileError }))

    if (profileError) {
      console.error('[webhook] profileError full:', JSON.stringify(profileError))
      throw new Error(`profiles update failed: ${profileError.message} (code: ${profileError.code}, details: ${profileError.details})`)
    }

    if (!updatedProfiles || updatedProfiles.length === 0) {
      console.error('[webhook] ZERO ROWS UPDATED — profiles.id no coincide con userId:', userId)
      console.error('[webhook] Verificar que existe profiles row para este user_id en Supabase')
      // Devolver 500 para que Stripe reintente y quede registrado
      return new Response('Profile not found', { status: 500 })
    }

    console.log('[webhook] SUCCESS — perfil actualizado:', JSON.stringify(updatedProfiles[0]))
    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    // Devolver 500 para que Stripe reintente
    return new Response('Internal server error', { status: 500 })
  }
}
