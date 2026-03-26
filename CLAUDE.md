# Rentabilismo Academy — Contexto para Claude Code

## Proyecto
SaaS de formación empresarial en español. Embudo: registro → onboarding (5 pasos) → pre-pago → checkout Stripe → dashboard con módulos.

**URL Producción:** https://rentabilismo-com-academy.vercel.app
**Supabase proyecto activo:** `rkhqopgsscevpfvyrgza` (https://rkhqopgsscevpfvyrgza.supabase.co)
**Vercel proyecto:** `rentabilismo-com-academy` (prj_95mH4Uta1IIW5gCn1uWwjX9OJVZN)
**GitHub repo:** `animaciongalicia/rentabilismo.com-academy`

---

## Stack técnico

- **Next.js 14** App Router (no Pages Router)
- **Supabase** con `@supabase/ssr` — cliente SSR con cookies
- **TypeScript** estricto
- **shadcn/ui** pero con `@base-ui/react` como primitiva (NO Radix UI)
- **Stripe** — Checkout Sessions + Webhooks
- **Tailwind CSS**
- **Vercel** — deploys automáticos desde `main`

---

## Reglas críticas — LEER ANTES DE TOCAR NADA

### @base-ui/react NO soporta `asChild`
```tsx
// ❌ ROMPE EL BUILD
<Button asChild><Link href="/dashboard">Entrar</Link></Button>

// ✅ CORRECTO
<Link href="/dashboard" className="inline-flex items-center...">Entrar</Link>
```

### `redirect()` dentro de `startTransition` NO funciona
```tsx
// ❌ La redirección se traga silenciosamente
startTransition(async () => {
  await saveOnboarding(data) // redirect() dentro de aquí no propaga
})

// ✅ CORRECTO — devolver { ok: true } y navegar en el cliente
startTransition(async () => {
  const result = await saveOnboarding(data)
  if ('ok' in result) router.push('/onboarding/mentalidad')
})
```

### Stripe NO puede inicializarse a nivel de módulo
```tsx
// ❌ Rompe el build en Vercel (STRIPE_SECRET_KEY es undefined en build time)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { ... })
export async function POST() { ... }

// ✅ CORRECTO — inicializar dentro del handler
export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { ... })
  ...
}
```

---

## Base de datos — Schema `profiles`

Columnas clave (tabla `public.profiles`):

| Columna | Tipo | Notas |
|---|---|---|
| `id` | UUID | FK → auth.users |
| `email` | TEXT | |
| `full_name` | TEXT | |
| `onboarding_q1..q4` | TEXT | Añadidas en migración 20240003 |
| `onboarding_completed_at` | TIMESTAMPTZ | **Campo correcto** — NO `onboarding_completed` |
| `entrepreneur_pact` | BOOLEAN | |
| `pact_signed_at` | TIMESTAMPTZ | |
| `has_paid` | BOOLEAN | |
| `access_type` | TEXT | `'lifetime'` o `'yearly'` |
| `access_expires_at` | TIMESTAMPTZ | NULL si lifetime |
| `stripe_customer_id` | TEXT | |
| `stripe_payment_id` | TEXT | |

> ⚠️ La columna `onboarding_completed` (BOOLEAN) existe en el schema base (20240002) pero NO se usa. Siempre usar `onboarding_completed_at`.

### Migraciones aplicadas en BD
- `20240002_profiles.sql` — tabla base + triggers + RLS
- `20240003_onboarding_fields.sql` — columnas q1..q4 + onboarding_completed_at
- `20240004_modules.sql` — tabla modules + 11 seeds
- `20240005_user_progress.sql` — tabla user_progress
- `20240006_payments.sql` — tabla payments con payment_number SERIAL

---

## Clientes Supabase — cuándo usar cuál

```typescript
// Para Server Components, Server Actions, Route Handlers con usuario autenticado
import { getSupabaseServerClient } from '@/lib/supabase/server'
// → usa ANON KEY + cookies → respeta RLS

// Solo para webhook de Stripe (sin sesión de usuario)
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
// → usa SERVICE_ROLE_KEY → bypasa RLS
// ⚠️ NUNCA importar en archivos 'use client'
```

---

## Variables de entorno necesarias

```
NEXT_PUBLIC_SUPABASE_URL=https://rkhqopgsscevpfvyrgza.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...       ← nunca NEXT_PUBLIC_
STRIPE_SECRET_KEY=sk_live_...          ← nunca pk_, nunca NEXT_PUBLIC_
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://rentabilismo-com-academy.vercel.app
```

---

## Rutas y estado actual

| Ruta | Tipo | Estado | Protección |
|---|---|---|---|
| `/` | Pública estática | ✅ | Ninguna |
| `/login` | Pública dinámica | ✅ | Ninguna |
| `/register` | Pública estática | ✅ | Ninguna |
| `/onboarding` | Protegida dinámica | ✅ | Auth requerida |
| `/onboarding/mentalidad` | Protegida dinámica | ✅ | Auth + onboarding completo |
| `/pricing` | Pública estática | ✅ | Ninguna |
| `/dashboard` | Protegida dinámica | ✅ | Auth + onboarding + pago |
| `/api/stripe/checkout` | API Route | ✅ | Auth via Supabase |
| `/api/stripe/webhook` | API Route | ✅ | Firma Stripe |
| `/auth/callback` | API Route | ✅ | |

---

## Flujo de rutas (middleware.ts)

```
Sin sesión + ruta protegida     → /login?redirectTo=...
Con sesión + sin onboarding     → /onboarding
Con sesión + onboarding + sin pago → /onboarding/mentalidad
Con sesión + onboarding + pago activo → /dashboard
```

Campos que lee el middleware: `onboarding_completed_at`, `has_paid`, `access_expires_at`

---

## Lógica de pagos Stripe

- **Primeros 50 pagos** → `access_type: 'lifetime'`, `access_expires_at: null`
- **A partir del pago 51** → `access_type: 'yearly'`, `access_expires_at: +365 días`
- Sin race condition: `payment_number` es `SERIAL` asignado atómicamente por Postgres
- Idempotencia: `stripe_session_id UNIQUE` + `ON CONFLICT DO NOTHING`
- Webhook usa raw body (`await request.text()`) — crítico para verificar firma

---

## Pendiente / Próximos pasos

- [ ] Contenido real de los módulos (actualmente solo metadata en BD)
- [ ] Página individual de módulo `/dashboard/modulos/[slug]`
- [ ] Tracking de progreso (`user_progress` tabla creada, lógica pendiente)
- [ ] Email de bienvenida tras onboarding (Make.com disponible)
- [ ] Email de confirmación de pago
- [ ] Racha de actividad (`current_streak`, `best_streak` en profiles)
- [ ] Muro de motivación (campo `motivation_phrase` en profiles)

---

## MCPs conectados

| MCP | Para qué sirve |
|---|---|
| Supabase | Ejecutar SQL, aplicar migraciones, verificar schema |
| Vercel | Ver logs de runtime, estado de deployments |
| GitHub | PRs, branches, archivos del repo |
| Make.com | Automatizaciones (emails, notificaciones) |
| Gmail | Enviar/leer emails |

> El MCP de Supabase necesita token actualizado para acceder a `rkhqopgsscevpfvyrgza`.
> Token PAT: actualizar en Claude Code → Settings → MCP → Supabase.
