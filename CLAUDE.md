# Rentabilismo Academy

> **Versión:** CLAUDE.md v3 — Abril 2026
> **Sustituye:** CLAUDE.md v2 y la sección de flujo de la Arquitectura v5
> **Fuente de verdad:** Este documento + MAPA-FLUJO-DEFINITIVO de abril 2026

## Proyecto
Plataforma de consultoría guiada online para empresarios de habla hispana.
NO es un curso. Es consultoría donde cada usuario trabaja sobre SU negocio real con datos reales.
Dominio: rentabilismo.com

## Stack
- Next.js 14+ App Router + TypeScript estricto
- Supabase (Auth + PostgreSQL + Storage para audios y PDFs)
- Tailwind CSS + shadcn/ui (TODOS los componentes de UI)
- Stripe (pago único 799€ + webhooks + afiliados)
- Vimeo (vídeos protegidos por dominio)
- ActiveCampaign (emails automáticos)
- Vercel (hosting + deploy desde GitHub)

## Comandos
- `npm run dev` → desarrollo local (http://localhost:3000)
- `npm run build` → compilar para producción
- `npm run lint` → verificar código

## Reglas de código
- TypeScript estricto (NUNCA usar 'any')
- Componentes funcionales con hooks
- Server Components por defecto. 'use client' SOLO cuando sea necesario
- Server Actions para mutaciones de datos
- ES Modules (NUNCA CommonJS)
- App Router (NUNCA pages/ router)
- shadcn/ui para TODOS los componentes de UI
- Siempre try/catch en llamadas a Supabase y Stripe
- Textos de la interfaz en español
- Preparado para i18n futuro (textos en constantes, no hardcoded en JSX)
- Stripe se inicializa DENTRO del handler POST, nunca a nivel de módulo
- `Button asChild` causa errores TypeScript → usar `<Link>` con estilos en su lugar
- `CREATE TABLE IF NOT EXISTS` en todas las migraciones para que sean idempotentes
- Informes se generan como HTML con Tailwind + CSS print, NUNCA con librerías de PDF

---

## Flujo de usuario completo

### FASE 1 — Zona pública (sin registro)

| Paso | Página | Ruta | Qué hace el usuario |
|------|--------|------|---------------------|
| 1 | Landing | `/` | Ve dolores, solución, CTA "prueba gratis" |
| 2 | Programa (venta) | `/programa` | Ve los 11 módulos + 10 agentes + informes como catálogo |
| 3 | Muro de empresarios | `/empresarios` | Ve tarjetas de empresarios (prueba social) |
| 4 | Registro | `/registro` | Se registra con email + nombre (mínimo) |
| 5 | Módulo Mentalidad | `/mentalidad` | Trabaja el módulo gratuito completo. SIN dashboard, SIN sidebar |
| 6 | Post-Mentalidad | (pantalla transición) | Ve programa completo + CTA pago. Solo al completar el módulo |

### FASE 2 — Pago y entrada

| Paso | Página | Ruta | Qué hace el usuario |
|------|--------|------|---------------------|
| 7 | Stripe Checkout | Stripe hosted | Paga 799€ |
| 8 | Perfil básico | `/perfil/completar` | Foto + sector + ubicación + tamaño empresa (2 min) |
| 9 | Módulo Diagnóstico | `/modules/diagnostico` | Paso 1: Pacto del Empresario. Luego: lecciones + ejercicios |

### FASE 3 — Zona de pago (plataforma de trabajo)

| Paso | Página | Ruta | Qué hace el usuario |
|------|--------|------|---------------------|
| 10 | Dashboard | `/dashboard` | Progreso, módulos con estado, informes, racha |
| 11 | Módulos 2-10 | `/modules/[slug]` | Trabaja módulos en orden libre (ruta recomendada visual) |
| 12 | El Ejército | `/ejercito` | Catálogo de 10 agentes + guía de uso |
| 13 | Perfil | `/perfil` | Editar datos, ver respuestas del Pacto |

---

## Arquitectura de rutas

```
/app/(public)/                          ← Zona pública
  page.tsx                              ← Landing (dolores + solución + CTA)
  programa/page.tsx                     ← Catálogo de venta (11 módulos + agentes)
  empresarios/page.tsx                  ← Muro público de empresarios
  mentalidad/                           ← Módulo Mentalidad (requiere registro)
    page.tsx                            ← Página del módulo
    [slug]/page.tsx                     ← Lecciones individuales

/app/(auth)/                            ← Autenticación
  login/page.tsx                        ← Login
  registro/page.tsx                     ← Registro (email + nombre)
  callback/page.tsx                     ← Callback de Supabase Auth

/app/(dashboard)/                       ← Zona pagada
  page.tsx                              ← Dashboard (progreso + informes + racha)
  perfil/
    page.tsx                            ← Perfil del usuario (editable)
    completar/page.tsx                  ← Perfil básico post-pago (una sola vez)
  modules/
    page.tsx                            ← Lista de módulos con estado
    [slug]/page.tsx                     ← Módulo individual (vídeo + lecciones + agente)
    [slug]/[lessonId]/page.tsx          ← Lección (audio + contenido + ejercicios + kaizen)
  ejercito/
    page.tsx                            ← Grid de 10 agentes
    [agentSlug]/page.tsx                ← Ficha individual del agente
    guia/page.tsx                       ← 6 lecciones sobre cómo usar agentes
    crea-tu-ejercito/page.tsx           ← Instrucciones para replicar

/app/api/                               ← API Routes
  stripe/checkout/                      ← Crear sesión de pago
  stripe/webhook/                       ← Webhook post-pago
  exercises/                            ← Guardar/leer respuestas
  reports/                              ← Generar informes
```

### Sidebar zona de pago (4 elementos)
1. **Dashboard** — página principal de trabajo
2. **Módulos** — lista con estado de cada módulo
3. **El Ejército** — catálogo de agentes + guía
4. **Perfil** — icono con foto del usuario (esquina)

NO hay en la sidebar: comunidad, informes (van dentro del dashboard), casos.

---

## Middleware de protección de rutas

```
Si NO autenticado → /dashboard/*           → Redirige a /login
Si autenticado + has_paid=false             → Redirige a /programa (venta)
Si pagado + perfil incompleto               → Redirige a /perfil/completar
Si pagado + diagnóstico NO completado
   + intenta acceder a /modules/[slug]
   (que NO sea diagnostico)                 → Redirige a /modules/diagnostico
Si pagado + diagnóstico completado          → Acceso total a /dashboard/*
Si registrado + NO pagado + /mentalidad     → Acceso (es gratuito con registro)
Si NO registrado + /mentalidad              → Redirige a /registro con return_to=/mentalidad
```

---

## Base de datos (Supabase — 13 tablas)

### profiles
id (UUID PK = auth.users.id), email, full_name, avatar_url, business_name,
business_type, business_location, business_size, starting_point, desired_destination,
biggest_problem, motivation_phrase, has_paid (BOOLEAN), access_type (TEXT: lifetime/180days/reduced),
access_expires_at (TIMESTAMPTZ, null si lifetime), stripe_customer_id,
entrepreneur_pact (BOOLEAN), pact_signed_at, current_streak, best_streak,
last_active_at, onboarding_completed (BOOLEAN), profile_completed (BOOLEAN),
created_at, updated_at

### modules
id (UUID PK), title, slug, description, video_url, video_intro_text,
video_duration_min, order_index (0=Mentalidad, 1=Diagnóstico, 2-10=resto),
is_free (BOOLEAN, true solo para Mentalidad), icon, is_published, created_at

### lessons
id (UUID PK), module_id (FK), title, slug, frase_clave, audio_url,
audio_duration_min, content (JSONB), order_index, vimeo_id, created_at

### exercises
id (UUID PK), lesson_id (FK), title, description, exercise_type (TEXT: text_input,
number_input, scale, multiple_choice, checklist, matrix, calculator,
open_reflection, kaizen_step), config (JSONB), order_number, is_kaizen (BOOLEAN),
created_at

### exercise_responses
id (UUID PK), user_id (FK), exercise_id (FK), response (JSONB),
version (INTEGER, auto-incrementa), created_at

### user_progress
id (UUID PK), user_id (FK), module_id (FK), status (TEXT: not_started/in_progress/completed),
started_at, completed_at, created_at

### lesson_progress
id (UUID PK), user_id (FK), lesson_id (FK), completed (BOOLEAN),
completed_at, created_at

### gpt_agents
id (UUID PK), name, slug, module_id (FK), description, prompt_public,
prompt_full, chatgpt_url, example_voice, how_to_use, expected_results,
who_is, what_does, when_to_use, dolor_ids (TEXT[]), order_index, created_at

### community_wall
id (UUID PK), user_id (FK), display_name, business_type, location,
motivation_phrase, has_paid (BOOLEAN), is_visible (BOOLEAN), created_at

### payments
id (UUID PK), user_id (FK), email, stripe_session_id, stripe_payment_intent,
amount, currency, status, referral_code, created_at

### evolution_reports
id (UUID PK), user_id (FK), type (TEXT: motivational/diagnostic/midpoint/final),
content (JSONB), generated_at, created_at

### affiliates
id (UUID PK), name, email, code (TEXT UNIQUE), commission (INTEGER default 150),
total_sales, total_earned, created_at

### business_thermometer
id (UUID PK), user_id (FK), type (TEXT: initial/final), scores (JSONB),
created_at

### case_library
id (UUID PK), module_id (FK), title, description, sector, lesson_learned,
is_published, created_at

**RLS en TODAS las tablas:** cada usuario solo ve/edita sus propios datos.
**community_wall:** lectura pública (para el muro de /empresarios).
**modules, lessons, exercises, gpt_agents, case_library:** lectura pública para contenido publicado.

---

## Lógica de negocio clave

### Registro y acceso
- Registro: solo email + nombre. Opción Google OAuth (un clic)
- Módulo Mentalidad: gratuito, requiere registro (email + nombre)
- Post-registro: directo a Mentalidad. SIN dashboard. SIN sidebar. Experiencia de túnel
- NO existe dashboard pre-pago. El usuario free solo ve Mentalidad

### Pago
- Precio: 799€ pago único vía Stripe Checkout (hosted)
- Stripe se inicializa DENTRO del handler POST (nunca a nivel de módulo — evita errores Vercel)
- Webhook: checkout.session.completed → marca has_paid=true
- Primeros 50 pagos: access_type='lifetime'
- Desde el pago 51: access_type='180days', access_expires_at = now() + 180 días
- Contador de plazas lifetime: COUNT payments WHERE status='completed'

### Acceso post-caducidad (180 días)
Cuando access_expires_at < now():
- access_type se actualiza a 'reduced'
- VE: sus respuestas guardadas, sus informes generados, módulo Mentalidad
- NO VE: módulos de pago, El Ejército, nuevos ejercicios
- Puede renovar pagando de nuevo (se reactiva access_type='180days')

### Perfil y onboarding
- Post-pago: rellena perfil básico (foto, sector, ubicación, tamaño) — 2 minutos
- Estos datos alimentan automáticamente la tarjeta del muro de empresarios
- Pacto del Empresario: dentro del módulo Diagnóstico como paso 1 (no en onboarding)
- Las respuestas del Pacto (dónde estás, dónde quieres llegar) se guardan en profiles

### Módulos y progreso
- 11 módulos: Mentalidad (gratuito) + Diagnóstico (obligatorio post-pago) + 9 módulos libres
- Diagnóstico es OBLIGATORIO. Hasta completarlo, los 9 módulos restantes están bloqueados
- Post-Diagnóstico: navegación libre. Ruta recomendada visual pero acceso total
- Cada módulo: vídeo (Vimeo) + 4-5 lecciones (audio + contenido + ejercicios + paso kaizen)
- Cada módulo tiene un agente GPT integrado al final de la página
- Racha de progreso: días consecutivos con actividad (tipo Duolingo)
- Paso Kaizen: cada lección termina con UNA sola acción concreta

### Informes (4 hitos)
- Informe 1 (motivacional): al completar Mentalidad — PRE-PAGO, empuje a la compra
- Informe 2 (diagnóstico): al completar Diagnóstico — foto del negocio
- Informe 3 (progreso): al completar 5 módulos
- Informe 4 (final): al completar 10 módulos — evolución + termómetro + plan 90 días + PDF
- Los informes aparecen dentro del dashboard, NO tienen sección separada
- Se generan como HTML con Tailwind + CSS print rules. NUNCA librerías de PDF directas

### Muro de empresarios
- Página PÚBLICA en `/empresarios` — es elemento de VENTA, no funcionalidad de trabajo
- Tarjetas con: nombre, sector, ubicación, frase de objetivo
- Dos estados visuales: usuarios gratuitos (un color) vs. usuarios de pago (otro color)
- Usuarios de pago pueden ver email de contacto de otros usuarios de pago
- Se alimenta automáticamente de profiles + community_wall

### El Ejército (10 agentes GPT)
- 10 agentes en el marketplace de ChatGPT. Cero tokens propios
- Cada agente integrado al final de su módulo (nombre + botón "Habla con este consultor")
- Página catálogo en `/ejercito` con grid de 10 agentes
- Ficha individual de cada agente: quién es, qué hace, prompt completo, ejemplo de voz, botón ChatGPT
- Guía de uso (6 lecciones sobre IA + voz)
- Sección "Crea tu propio ejército"
- Voz como método aspiracional, no forzado

### Tabla de agentes
| # | Módulo | Agente |
|---|--------|--------|
| 0 | Mentalidad | El Espejo |
| 1 | Diagnóstico | El Forense |
| 2 | Finanzas | El Contable que No Te Miente |
| 3 | Producto y Servicio | El que Te Hace Diferente |
| 4 | Precios | El Auditor de Precios |
| 5 | Procesos | El Ladrón de Tiempo |
| 6 | Equipo | El Líder que Necesitas |
| 7 | Ventas | El Cazador |
| 8 | Marketing | El Altavoz |
| 9 | Estrategia | El Estratega |
| 10 | Plan de Acción | El Planificador |

**Esta tabla NO se modifica sin aprobación de Pablo.**

---

## Errores que NUNCA debes cometer
- No uses pages/ router → usa app/ router
- No uses 'use client' salvo que sea estrictamente necesario
- No uses localStorage para auth → usa cookies con @supabase/ssr
- No pongas Stripe Secret Key en el frontend (solo en API routes)
- No uses CommonJS (require) → usa ES Modules (import)
- No crees archivos fuera de la estructura de carpetas definida
- No hagas push directamente a main → siempre rama feature/*
- No mezcles varias tareas en una sesión → una tarea = una sesión = una rama
- No inicialices Stripe a nivel de módulo → siempre dentro del handler POST
- No uses `Button asChild` → usa `<Link>` con estilos de shadcn
- No generes PDFs con librerías → usa HTML + Tailwind + CSS print
- No inventes contenido → todo contenido visible viene de Supabase, no hardcoded
- No crees dashboard ni sidebar para usuarios que no han pagado
- No desbloquees módulos 2-10 sin verificar que Diagnóstico está completado
- SQL debe ser idempotente → siempre `CREATE TABLE IF NOT EXISTS`
- SQL se ejecuta en Supabase SQL Editor, NO en terminal de Mac
