# Rentabilismo Academy

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
- URLs de páginas en español
- Preparado para i18n futuro (textos en constantes, no hardcoded en JSX)
- Stripe se inicializa DENTRO de los POST handlers, nunca a nivel de módulo
- `Button asChild` causa errores en TypeScript — usar styled `<Link>` en su lugar
- `redirect()` dentro de `startTransition` no propaga en Next.js App Router — evitarlo

## Las 3 zonas de la plataforma

### Zona Pública (sin registro)
Layout: sin sidebar, estilo landing/web. Objetivo: convencer prescriptores y usuarios.

### Zona Auth
Layout: centrado, limpio, sin distracciones.

### Zona Privada (requiere auth + pago + onboarding)
Layout: sidebar izquierda fija + área de contenido principal.
Sidebar: Dashboard, Módulos, Cuartel General, Informes, Comunidad (oculto si <15 usuarios), Mi Perfil.

## Arquitectura de rutas

```
app/
├── (public)/
│   ├── page.tsx                          → /              Landing
│   ├── que-es/page.tsx                   → /que-es        Qué es Rentabilismo
│   ├── programa/page.tsx                 → /programa      Programa (módulos preview)
│   ├── mentalidad/
│   │   ├── page.tsx                      → /mentalidad    Módulo 00 (gratuito)
│   │   └── [lesson-slug]/page.tsx        → /mentalidad/X  Lección del módulo gratuito
│   ├── cuartel-general/page.tsx          → /cuartel-general  Preview agentes (bloqueado)
│   └── precio/page.tsx                   → /precio        Pricing + Stripe
│
├── (auth)/
│   ├── login/page.tsx                    → /login
│   ├── registro/page.tsx                 → /registro
│   └── callback/route.ts                → /auth/callback
│
├── (onboarding)/
│   └── page.tsx                          → /onboarding    Foto + 4 preguntas + Pacto
│
├── (dashboard)/                          ← Layout con sidebar
│   ├── page.tsx                          → /dashboard
│   ├── modulos/
│   │   ├── page.tsx                      → /modulos       Lista de módulos
│   │   └── [slug]/
│   │       ├── page.tsx                  → /modulos/X     Detalle módulo
│   │       └── [lesson-slug]/page.tsx    → /modulos/X/Y   Lección
│   ├── cuartel/
│   │   ├── page.tsx                      → /cuartel       Lista agentes completa
│   │   ├── guia/page.tsx                 → /cuartel/guia  Guía de uso
│   │   ├── crear/page.tsx                → /cuartel/crear Crea tu propio consultor
│   │   └── [agent-slug]/page.tsx         → /cuartel/X     Ficha de agente
│   ├── informes/page.tsx                 → /informes
│   ├── comunidad/page.tsx                → /comunidad
│   └── perfil/page.tsx                   → /perfil
│
├── api/
│   └── stripe/
│       ├── checkout/route.ts
│       └── webhook/route.ts
│
├── pago-completado/page.tsx              → /pago-completado
├── pago-error/page.tsx                   → /pago-error
└── layout.tsx                            → Root layout
```

IMPORTANTE: `(dashboard)` es un route group invisible en Next.js.
La URL real es `/modulos/diagnostico-inicial`, NO `/app/modules/` ni `/dashboard/modules/`.

## Módulos y agentes GPT

| # | Módulo | Slug | Agente GPT | Gratuito |
|---|--------|------|------------|----------|
| 00 | Tu Cabeza Manda (Mentalidad) | mentalidad | El Espejo | SÍ |
| 01 | Diagnóstico Inicial | diagnostico-inicial | El Forense | NO |
| 02 | Tus Números (Finanzas) | finanzas | El Contable que No Te Miente | NO |
| 03 | Tu Producto | producto | El que Te Hace Diferente | NO |
| 04 | Tu Precio | precios | El Auditor de Precios | NO |
| 05 | Tus Procesos | procesos | El Ladrón de Tiempo | NO |
| 06 | Tu Equipo | equipo | El Líder que Necesitas | NO |
| 07 | Tus Ventas | ventas | El Cazador | NO |
| 08 | Tu Marketing | marketing | El Altavoz | NO |
| 09 | Tu Estrategia | estrategia | El Estratega | NO |
| 10 | Tu Plan de Acción | plan-de-accion | El Planificador | NO |

## Base de datos (Supabase - 13 tablas)
- profiles (usuario + negocio + 4 preguntas onboarding + pacto + racha + acceso)
- modules (11: 1 mentalidad gratuito + 10 de pago)
- lessons (4-5 por módulo, con audio_url y vimeo_id)
- exercises (por lección, 9 tipos incluido calculator y kaizen_step)
- exercise_responses (respuestas versionadas del usuario)
- user_progress (progreso por módulo)
- gpt_agents (10 consultores IA con prompts y URLs de ChatGPT)
- community_wall (muro dinámico: nombre, sector, país, frase)
- payments (Stripe + referral_code de afiliados)
- evolution_reports (3 informes: motivational, midpoint, final)
- affiliates (código, comisión 150€, ventas, total ganado)
- business_thermometer (auto-evaluación 1-10 en 8-10 áreas, initial + final)
- case_library (casos reales anónimos por módulo)

RLS en TODAS las tablas: cada usuario solo ve/edita sus propios datos.
community_wall: lectura pública cuando se active (15-20 usuarios).

## Lógica de negocio clave
- Módulo Mentalidad: público, sin registro, ruta /mentalidad en zona pública
- Pago: 799€ único vía Stripe Checkout. Webhook marca has_paid=true
- Primeros 50 pagos: access_type='lifetime'. Resto: access_type='semestral' (6 meses)
- Acceso reducido post-caducidad: respuestas (solo lectura), informes generados, módulo mentalidad, El Espejo. NO accede a módulos de pago ni genera nuevos informes.
- Navegación semi-libre: todos los módulos accesibles, ruta recomendada visual
- Informes: se generan por número de módulos completados (no por cuáles)
  - Informe 1 (motivacional): al completar Módulo Mentalidad
  - Informe 2 (progreso): al completar 5 módulos
  - Informe 3 (final): al completar 10 módulos
- Racha de progreso: días consecutivos con actividad (tipo Duolingo)
- Paso Kaizen: cada lección termina con UNA sola acción concreta
- Cupones promocionales: via Stripe native coupons (beta testers, gestorías, afiliados)

## Flujos de navegación

### Visitante nuevo (viene de prescriptor)
Landing (/) → Qué es (/que-es) → Programa (/programa) → Mentalidad (/mentalidad)
→ Completa 4 lecciones → CTA → Registro (/registro) → Onboarding (/onboarding)
→ Pago (/precio → Stripe) → Dashboard (/dashboard)

### Usuario que vuelve
Login (/login) → Dashboard (/dashboard) → Continúa módulo → Lección → Ejercicios

### Prescriptor evaluando
Landing (/) → Qué es (/que-es) → Programa (/programa) → Cuartel General preview (/cuartel-general)
→ Precio (/precio) → Decide recomendar

## Sidebar de la zona privada

```
RENTABILISMO
─────────────
▸ Dashboard          → /dashboard
▸ Módulos            → /modulos
▸ Cuartel General    → /cuartel
▸ Informes           → /informes
▸ Comunidad          → /comunidad (oculto si <15 usuarios)
─────────────
▸ Mi Perfil          → /perfil
[nombre usuario]
[nombre negocio]
Racha: 🔥 X días
[Cerrar sesión]
```

## Estructura de componentes
- /components/ui/ → shadcn/ui base components
- /components/modules/ → componentes compartidos de módulos y lecciones
- /components/exercises/ → renderizado dinámico por tipo de ejercicio
- /components/layout/ → sidebar, header, footer, breadcrumbs

## Errores que NUNCA debes cometer
- No uses pages/ router → usa app/ router
- No uses 'use client' salvo que sea estrictamente necesario
- No uses localStorage para auth → usa cookies con @supabase/ssr
- No pongas Stripe Secret Key en el frontend (solo en API routes)
- No uses CommonJS (require) → usa ES Modules (import)
- No crees archivos fuera de la estructura de carpetas definida
- No hagas push directamente a main → siempre rama feature/*
- No mezcles varias tareas en una sesión → una tarea = una sesión = una rama
- No inventes contenido — usa exactamente los textos de los documentos aprobados
- No uses emojis decorativos en la interfaz — usa lucide-react para iconos
- No hardcodees contenido en JSX — los módulos y datos vienen de Supabase

## Skills disponibles (directorio .claude/skills/)
- `/crear-modulo` — implementa un módulo completo desde MÓDULO-X-COMPLETO-PARA-PROGRAMAR.md
- `/crear-leccion` — implementa una lección individual
- `/generar-informe` — crea informes HTML/PDF con CSS de impresión
- `/verificar-modulo` — checklist de calidad post-implementación
- `/seed-data` — inserta datos en Supabase desde documento aprobado
- `/tono-rentabilista` — guía de tono para cualquier texto visible al usuario

## Migraciones SQL
- Se ejecutan en Supabase SQL Editor (NO en terminal Mac)
- Para migraciones complejas que tocan PKs: drop FK → add UUID column → create temp mapping → update dependent columns → swap PKs → restore FKs
- Los informes se generan como HTML con Tailwind + CSS print rules (NUNCA bibliotecas de PDF)

## MCP y servicios externos
- `.mcp.json` debe estar en la raíz del proyecto con formato exacto de Bearer token
- Añadir `.mcp.json` a `.gitignore`
- Claude Code NO puede verificar configuraciones de Vercel, Supabase o Stripe dashboards — Pablo lo hace manualmente
