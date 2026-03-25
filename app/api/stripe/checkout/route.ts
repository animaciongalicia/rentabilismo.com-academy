import Stripe from 'stripe'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request): Promise<Response> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
  })
  console.log('STRIPE_KEY prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 7) ?? 'UNDEFINED')
  try {
    // Verificar sesión del usuario
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Leer código promo del body (opcional)
    let promoCode: string | null = null
    try {
      const body = await request.json() as { promoCode?: string }
      promoCode = body.promoCode?.trim() || null
    } catch {
      // body vacío o malformado — no es error
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    // Construir parámetros de la Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 79900, // 799,00 €
            product_data: {
              name: 'Rentabilismo Academy — Acceso completo',
              description: 'Acceso al programa completo de transformación empresarial.',
            },
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        supabase_user_id: user.id,
      },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing`,
    }

    // Código promo: si se aporta uno, usarlo directamente; si no, mostrar campo en Stripe
    if (promoCode) {
      sessionParams.discounts = [{ promotion_code: promoCode }]
    } else {
      sessionParams.allow_promotion_codes = true
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return Response.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
