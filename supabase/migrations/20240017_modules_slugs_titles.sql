-- ═══════════════════════════════════════════════════════════════════════════
-- 20240017_modules_slugs_titles.sql
-- Añade slugs y corrige títulos/descripciones de los módulos 1-10
-- El módulo 0 (mentalidad) ya tiene slug y título correcto — no se toca.
-- ═══════════════════════════════════════════════════════════════════════════

UPDATE public.modules SET
  slug        = 'diagnostico-rentabilidad',
  title       = 'Diagnóstico de Rentabilidad',
  description = 'Qué está funcionando, qué no y por qué. La radiografía honesta de tu negocio.'
WHERE order_number = 1;

UPDATE public.modules SET
  slug        = 'finanzas',
  title       = 'Finanzas',
  description = 'Números que importan: márgenes, costes, flujo de caja y dónde se va el dinero realmente.'
WHERE order_number = 2;

UPDATE public.modules SET
  slug        = 'producto-servicio',
  title       = 'Producto y Servicio',
  description = 'Qué vendes exactamente, a quién y si lo estás posicionando y enfocando bien.'
WHERE order_number = 3;

UPDATE public.modules SET
  slug        = 'estrategia-precios',
  title       = 'Estrategia de Precios',
  description = 'Si estás cobrando lo que vale lo que haces y cómo corregirlo sin perder clientes.'
WHERE order_number = 4;

UPDATE public.modules SET
  slug        = 'operaciones-procesos',
  title       = 'Operaciones y Procesos',
  description = 'Cómo dejar de ser imprescindible para todo y construir una empresa que funcione sin ti.'
WHERE order_number = 5;

UPDATE public.modules SET
  slug        = 'equipo-liderazgo',
  title       = 'Equipo y Liderazgo',
  description = 'Si tienes las personas correctas en los puestos correctos y cómo gestionarlo bien.'
WHERE order_number = 6;

UPDATE public.modules SET
  slug        = 'ventas-captacion',
  title       = 'Ventas y Captación',
  description = 'Cómo convertir interés en clientes que pagan, con un proceso claro y sin presión.'
WHERE order_number = 7;

UPDATE public.modules SET
  slug        = 'marketing-posicionamiento',
  title       = 'Marketing y Posicionamiento',
  description = 'Cómo te percibe el mercado, qué mensaje transmites y por qué te eligen a ti.'
WHERE order_number = 8;

UPDATE public.modules SET
  slug        = 'estrategia-crecimiento',
  title       = 'Estrategia y Crecimiento',
  description = 'Hacia dónde vas, si el camino tiene sentido y cómo priorizar lo que de verdad importa.'
WHERE order_number = 9;

UPDATE public.modules SET
  slug        = 'plan-accion',
  title       = 'Tu Plan de Acción',
  description = 'Qué vas a cambiar, en qué orden, con qué recursos y con qué métricas lo medirás.'
WHERE order_number = 10;
