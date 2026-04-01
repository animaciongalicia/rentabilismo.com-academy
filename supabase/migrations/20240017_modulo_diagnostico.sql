-- ══════════════════════════════════════════════════════════════════════════
-- 20240017_modulo_diagnostico.sql
-- Módulo 1 — Diagnóstico Inicial: Punto de Partida
-- Contenido: módulo, 4 lecciones, 16 ejercicios
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Profiles: añadir business_sector ───────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS business_sector TEXT;

-- ── 2. Módulo 1 — actualizar el módulo existente (order_number = 1) ───────
UPDATE public.modules
SET
  slug             = 'diagnostico-inicial',
  title            = 'Diagnóstico Inicial: Punto de Partida',
  description      = 'Antes de mejorar nada, necesitas saber dónde estás de verdad. Sin filtros, sin maquillaje, con tus números reales.',
  is_free          = false,
  gpt_agent_url    = null,
  vimeo_id         = null,
  video_intro_text = $vit$Antes de mejorar nada, necesitas saber dónde estás.

Parece obvio, pero no lo es. La mayoría de empresarios que conozco — y llevo 25 años sentándome con ellos — creen que saben cómo está su negocio. Pero cuando les hago las preguntas correctas, descubren cosas que llevaban meses — o años — sin ver.

No porque sean malos empresarios. Sino porque cuando estás metido en el día a día, no paras a mirar. Apagar fuegos, atender clientes, cuadrar números, llegar a final de mes. No hay tiempo para pararse a pensar: ¿dónde estoy realmente?

Eso es lo que vamos a hacer en este módulo. Un diagnóstico real de tu negocio. Sin teoría. Sin ejercicios abstractos. Con tus números, tus clientes, tu tiempo y tu rumbo.

Te voy a hacer doce preguntas repartidas en cuatro bloques. Y te aviso: no son preguntas cómodas. Están diseñadas para que no puedas maquillarte. Para que no respondas lo que quieres que sea verdad, sino lo que es verdad.

¿Por qué? Porque un diagnóstico con datos falsos no sirve para nada. Y porque la honestidad contigo mismo es el primer paso para cambiar cualquier cosa.

Cuando termines las cuatro lecciones, vas a tener algo que la mayoría de empresarios no tienen: una fotografía real de dónde está su negocio. Un punto de partida honesto. Y con eso ya se puede trabajar.

Combinado con lo que trabajaste en el módulo de mentalidad, ese informe será tu "antes". El punto desde el que todo empieza a cambiar.

No te pido que arregles nada todavía. Solo te pido que mires. Con honestidad. El método viene después. Ahora, la verdad.$vit$
WHERE order_number = 1;

-- ── 3. Lecciones ──────────────────────────────────────────────────────────
INSERT INTO public.lessons (module_id, title, slug, order_number, frase_clave, audio_url, apertura)
VALUES

  -- Lección 1
  (
    (SELECT id FROM public.modules WHERE slug = 'diagnostico-inicial'),
    'Tu dinero: lo que entra, lo que sale y lo que desaparece',
    'tu-dinero',
    1,
    'No importa cuánto facturas. Importa cuánto te queda.',
    null,
    $ap1$Vamos a empezar por donde duele. Por el dinero.

No por cuánto facturas — eso lo sabe todo el mundo. Por cuánto te queda. Cuánto te llevas a casa después de pagar todo. Después del local, los proveedores, el autónomo, la luz, el seguro, lo que sea.

La mayoría de empresarios que conozco no saben esa cifra. Saben más o menos lo que entra. Pero lo que sale se les escapa entre los dedos. Y lo que queda... prefieren no mirarlo.

Eso no es un fallo tuyo. Es lo que pasa cuando estás tan metido en el día a día que no te paras a mirar. Pero te está costando dinero. Literal. Porque si no sabes cuánto ganas de verdad, no puedes saber qué está funcionando y qué no. Y acabas manteniendo cosas que te cuestan más de lo que te dan — por costumbre, por miedo, o porque siempre se ha hecho así.

Esta lección no te va a enseñar contabilidad. No voy a pedirte que hagas una hoja de Excel. Te voy a hacer tres preguntas. Las tres van a obligarte a mirar números reales de tu negocio. Y cuando los veas escritos, vas a entender cosas que llevas meses — o años — intuyendo pero sin confirmar.

No pasa nada si no tienes los números exactos. Pon lo que crees. Porque incluso lo que crees dice mucho de dónde estás.$ap1$
  ),

  -- Lección 2
  (
    (SELECT id FROM public.modules WHERE slug = 'diagnostico-inicial'),
    'Tus clientes: quién te paga, quién te agota y por qué te eligen',
    'tus-clientes',
    2,
    'Si no eliges a tus clientes, ellos te eligen a ti. Y no siempre eligen bien.',
    null,
    $ap2$Vamos a hablar de tus clientes. No del "cliente ideal" que ponen en los libros de marketing. De los que tienes hoy. Los reales. Los que entran por la puerta, te llaman, te escriben por WhatsApp.

Algunos son oro. Pagan, valoran lo que haces, vuelven, te recomiendan. Si tuvieras diez como ese, tu negocio sería otro.

Pero luego están los otros. Los que regatean, los que piden imposibles, los que desaparecen sin pagar, los que te agotan. Y la pregunta incómoda es: ¿por qué siguen llegando esos?

La mayoría de negocios pequeños no eligen a sus clientes. Los clientes les eligen a ellos. Y muchas veces, los que llegan no son los que quieres — son los que atraes sin saberlo. Por tu precio, por tu mensaje, por dónde estás, por lo que no estás diciendo.

Y hay otra cosa que casi nadie mira: ¿cómo te encuentran? Si mañana dejaras de hacer lo que haces para conseguir clientes — lo que sea: redes, estar en la puerta, hablar con vecinos — ¿cuánto tardarían en dejar de venir? Si la respuesta te da vértigo, es que no tienes un sistema. Tienes suerte. Y la suerte se acaba.

Esta lección va de tres cosas: quién te compra de verdad, cómo te encuentran, y qué te hace diferente al de al lado. Las tres respuestas juntas te van a dar una foto que probablemente no te guste — pero que necesitas ver.$ap2$
  ),

  -- Lección 3
  (
    (SELECT id FROM public.modules WHERE slug = 'diagnostico-inicial'),
    'Tu tiempo: dónde se te va el día y qué pasa si no estás',
    'tu-tiempo',
    3,
    'No es que trabajes mucho. Es que haces demasiado de lo que no te toca.',
    null,
    $ap3$Ahora vamos a hablar de algo que te frustra más que el dinero: el tiempo.

Trabajas más horas que nadie. Llegas antes, te vas después. Comes rápido o no comes. El fin de semana piensas en el lunes. Y aun así, sientes que no avanzas. Que estás siempre apagando fuegos. Que el negocio no camina si tú no empujas.

No es porque trabajes mal. Es porque probablemente estás haciendo cosas que no debería hacer el dueño del negocio. Estás contestando emails, haciendo presupuestos, atendiendo al proveedor, organizando turnos, comprando material, y además intentando vender, cobrar y pensar en el futuro. Todo tú. Solo tú.

Y si tienes gente contigo — empleados, un socio, un familiar — la pregunta es todavía más incómoda: ¿están haciendo lo que tienen que hacer? ¿Pueden funcionar sin ti? ¿O dependen de ti para cada decisión?

Y si estás solo — que es lo más normal y no tiene nada de malo — la pregunta es diferente: ¿por qué? ¿Es dinero, es confianza, o es que no sabes ni por dónde empezarías?

Esta lección va de ver con honestidad en qué se te va el día, qué parte de tu negocio depende solo de ti, y si la situación con tu equipo — o sin él — es la que necesitas para llegar donde quieres.$ap3$
  ),

  -- Lección 4
  (
    (SELECT id FROM public.modules WHERE slug = 'diagnostico-inicial'),
    'Tu rumbo: hacia dónde vas y qué te frena',
    'tu-rumbo',
    4,
    'Si no sabes a dónde vas, cualquier camino parece bueno. Y ninguno lo es.',
    null,
    $ap4$Ya has mirado tu dinero, tus clientes y tu tiempo. Ahora viene lo más importante: ¿para qué?

Puedes tener los números claros, los clientes correctos y el tiempo bien organizado. Pero si no sabes hacia dónde vas, todo eso da igual. Porque sin dirección, las decisiones del día a día no tienen criterio. Dices que sí a todo, porque cualquier oportunidad parece buena. Y al final del año, has trabajado como nunca y no has avanzado.

La mayoría de empresarios que conozco no tienen un plan. Tienen una rutina. Abren, trabajan, cierran, repiten. Y cuando les preguntas dónde quieren estar en dos años, dicen "crecer". Pero crecer no es un plan. Crecer es una palabra que usamos cuando no nos hemos parado a pensar qué queremos de verdad.

Esta última lección del diagnóstico va de tres cosas: qué quieres de verdad — con números y con vida —, qué llevas posponiendo y sabes que es importante, y cómo de lejos estás hoy de donde quieres estar.

Cuando respondas estas tres preguntas, vas a tener algo que la mayoría de empresarios no tienen: un punto de partida honesto. Y con un punto de partida honesto, ya puedes trabajar de verdad.$ap4$
  );

-- ── 4. Ejercicios ─────────────────────────────────────────────────────────
-- 4 ejercicios por lección (16 en total)
-- is_kaizen = true solo en los de type = kaizen_step (order_number 4)

-- ─── Lección 1: tu-dinero ─────────────────────────────────────────────────

INSERT INTO public.exercises (lesson_id, type, title, description, config, order_number, is_kaizen)
VALUES
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-dinero'),
    'number_input',
    'Tus números reales',
    '¿Cuánto facturas al mes de media? Y de eso, después de pagar todo — local, proveedores, seguros, autónomo, luz, lo que sea — ¿cuánto te llevas tú a casa? Si no lo sabes exacto, pon lo que crees.',
    '{
      "fields": [
        {
          "id": "facturacion_mensual",
          "label": "Facturación media mensual (€)",
          "placeholder": "Ej: 8000",
          "type": "number"
        },
        {
          "id": "beneficio_neto",
          "label": "Lo que te llevas a casa después de todo (€)",
          "placeholder": "Ej: 2200",
          "type": "number"
        },
        {
          "id": "certeza",
          "label": "¿Estás seguro de estos números o es una estimación?",
          "placeholder": "Ej: no lo calculo cada mes / mezclo gastos personales y del negocio...",
          "type": "text",
          "optional": true
        }
      ],
      "note": "No hay respuesta mala. Si no lo sabes exacto, la estimación ya dice mucho.",
      "save_for_report": true,
      "report_section": "dinero"
    }'::jsonb,
    1,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-dinero'),
    'open_reflection',
    'Lo que te deja vs lo que te quita',
    'De todo lo que haces en tu negocio — servicios, productos, lo que vendas — ¿qué es lo que más dinero te deja? ¿Y qué es lo que más tiempo te quita para lo poco que te da?',
    '{
      "placeholder": "Lo que más me deja es... / Lo que más tiempo me quita es...",
      "min_chars": 50,
      "save_for_report": true,
      "report_section": "dinero"
    }'::jsonb,
    2,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-dinero'),
    'open_reflection',
    'La prueba del 20%',
    'Si mañana subieras tus precios un 20%, ¿qué crees que pasaría? ¿Se irían clientes? ¿Cuáles? ¿Los que quieres o los que te sobran?',
    '{
      "placeholder": "Creo que pasaría...",
      "min_chars": 40,
      "save_for_report": true,
      "report_section": "dinero"
    }'::jsonb,
    3,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-dinero'),
    'kaizen_step',
    'Mira tus números',
    'Esta semana, haz una cosa: mira tu cuenta bancaria de los últimos 3 meses. Anota cuánto entró y cuánto salió de media cada mes. Solo los números. Sin juzgar. Sin arreglar nada. Solo mira.',
    '{
      "action_prompt": "Lo que he visto en mis números de los últimos 3 meses es:",
      "deadline_label": "Esta semana. 15 minutos con tu banco online.",
      "save_for_report": true,
      "report_section": "dinero"
    }'::jsonb,
    4,
    true
  );

-- ─── Lección 2: tus-clientes ──────────────────────────────────────────────

INSERT INTO public.exercises (lesson_id, type, title, description, config, order_number, is_kaizen)
VALUES
  (
    (SELECT id FROM public.lessons WHERE slug = 'tus-clientes'),
    'text_input',
    'Tu mejor cliente',
    'Piensa en tu mejor cliente. Ese que paga sin rechistar, no da problemas, vuelve y te recomienda. ¿Cómo es? Y ahora dime la verdad: de cada diez clientes que tienes, ¿cuántos son como ese?',
    '{
      "fields": [
        {
          "id": "mejor_cliente",
          "label": "Describe a tu mejor cliente",
          "placeholder": "Ej: empresario de 45 años, tiene una clínica, paga siempre a tiempo, viene cada mes...",
          "type": "text"
        },
        {
          "id": "proporcion",
          "label": "De cada 10 clientes, ¿cuántos son así?",
          "type": "scale",
          "min": 0,
          "max": 10
        }
      ],
      "save_for_report": true,
      "report_section": "clientes"
    }'::jsonb,
    1,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tus-clientes'),
    'open_reflection',
    'Cómo te encuentran',
    '¿Cómo te llegan los clientes hoy? Boca a boca, redes, que pasan por delante, Google, recomendaciones... Si mañana dejaras de hacer todo lo que haces para conseguir clientes, ¿cuánto tiempo aguantarías?',
    '{
      "placeholder": "Mis clientes me llegan por... / Si dejara de hacerlo, aguantaría...",
      "min_chars": 50,
      "save_for_report": true,
      "report_section": "clientes"
    }'::jsonb,
    2,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tus-clientes'),
    'open_reflection',
    'Qué te diferencia',
    '¿Qué haces tú que no haga el negocio de al lado, el de la esquina, o el que sale primero en Google? Si no se te ocurre nada, eso también es una respuesta.',
    '{
      "placeholder": "Lo que me diferencia es... / No se me ocurre nada",
      "min_chars": 30,
      "note": "Si la respuesta es ''nada'' o ''no sé'', no pasa nada. Eso ya es un diagnóstico.",
      "save_for_report": true,
      "report_section": "clientes"
    }'::jsonb,
    3,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tus-clientes'),
    'kaizen_step',
    'Pregúntale a un cliente',
    'Esta semana, hazle una pregunta a un cliente real. Uno solo. Cara a cara o por WhatsApp. Pregúntale: ¿por qué vienes aquí y no vas a otro sitio? Anota lo que te diga, tal cual. Sin editar.',
    '{
      "action_prompt": "Le pregunté a un cliente y me dijo:",
      "deadline_label": "Esta semana. Un cliente. Una pregunta.",
      "save_for_report": true,
      "report_section": "clientes"
    }'::jsonb,
    4,
    true
  );

-- ─── Lección 3: tu-tiempo ─────────────────────────────────────────────────

INSERT INTO public.exercises (lesson_id, type, title, description, config, order_number, is_kaizen)
VALUES
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-tiempo'),
    'open_reflection',
    'Tu día real',
    'Describe un día normal tuyo de trabajo. Desde que llegas hasta que te vas. ¿Qué haces tú personalmente?',
    '{
      "placeholder": "Mi día empieza a las... y normalmente hago...",
      "min_chars": 80,
      "note": "Cuanto más detalle, mejor. No es para juzgarte, es para ver dónde se va tu tiempo.",
      "save_for_report": true,
      "report_section": "tiempo"
    }'::jsonb,
    1,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-tiempo'),
    'open_reflection',
    'La prueba de las dos semanas',
    'Si te fueras dos semanas sin móvil, ¿qué sería lo primero que se rompería en tu negocio?',
    '{
      "placeholder": "Lo primero que se rompería sería...",
      "min_chars": 30,
      "save_for_report": true,
      "report_section": "tiempo"
    }'::jsonb,
    2,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-tiempo'),
    'multiple_choice',
    'Tu equipo (o la falta de él)',
    '¿Trabajas solo o tienes gente contigo?',
    '{
      "options": [
        {"id": "solo", "label": "Solo — soy yo y nadie más"},
        {"id": "micro", "label": "Con 1-3 personas"},
        {"id": "pequeño", "label": "Con 4-10 personas"},
        {"id": "mediano", "label": "Con más de 10 personas"}
      ],
      "follow_up": {
        "solo": {
          "type": "multiple_choice_plus_text",
          "question": "¿Qué es lo que te frena para tener ayuda?",
          "options": [
            {"id": "dinero", "label": "El dinero — no me da para contratar"},
            {"id": "confianza", "label": "La confianza — nadie lo hace como yo"},
            {"id": "no_se", "label": "No sé ni por dónde empezar"},
            {"id": "otra", "label": "Otra razón"}
          ],
          "text_field": {
            "id": "otra_razon",
            "label": "Si es otra razón, cuéntame cuál",
            "placeholder": "Mi razón es...",
            "show_if": "otra"
          }
        },
        "micro": {
          "type": "open_reflection",
          "question": "¿Pueden funcionar sin ti un día entero? ¿Quién toma decisiones cuando no estás?",
          "placeholder": "Sin mí, lo que pasa es..."
        },
        "pequeño": {
          "type": "open_reflection",
          "question": "¿Pueden funcionar sin ti un día entero? ¿Quién toma decisiones cuando no estás?",
          "placeholder": "Sin mí, lo que pasa es..."
        },
        "mediano": {
          "type": "open_reflection",
          "question": "¿Pueden funcionar sin ti un día entero? ¿Quién toma decisiones cuando no estás?",
          "placeholder": "Sin mí, lo que pasa es..."
        }
      },
      "save_for_report": true,
      "report_section": "tiempo"
    }'::jsonb,
    3,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-tiempo'),
    'kaizen_step',
    'Apunta tus horas',
    'Esta semana, apunta durante tres días cuántas horas dedicas a cada tarea. No cambies nada, solo apunta. Al tercer día, marca con un círculo las tareas donde tú eres prescindible — donde otro podría hacerlo igual o mejor.',
    '{
      "action_prompt": "Después de apuntar mis horas durante 3 días, las tareas donde soy prescindible son:",
      "deadline_label": "3 días apuntando. 5 minutos cada noche.",
      "save_for_report": true,
      "report_section": "tiempo"
    }'::jsonb,
    4,
    true
  );

-- ─── Lección 4: tu-rumbo ──────────────────────────────────────────────────

INSERT INTO public.exercises (lesson_id, type, title, description, config, order_number, is_kaizen)
VALUES
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-rumbo'),
    'open_reflection',
    'Tu visión a 2 años',
    '¿Cómo te imaginas tu negocio dentro de dos años si las cosas van bien? No me digas "crecer". Dime cuánto quieres ganar, cuántas horas quieres trabajar, qué tipo de clientes quieres tener.',
    '{
      "placeholder": "Dentro de dos años quiero...",
      "min_chars": 60,
      "save_for_report": true,
      "report_section": "rumbo"
    }'::jsonb,
    1,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-rumbo'),
    'open_reflection',
    'Lo que llevas posponiendo',
    '¿Qué llevas tiempo sabiendo que tienes que cambiar en tu negocio y no has cambiado? Esa cosa que te viene a la cabeza ahora mismo mientras lees esto.',
    '{
      "placeholder": "Lo que llevo posponiendo es...",
      "min_chars": 30,
      "save_for_report": true,
      "report_section": "rumbo"
    }'::jsonb,
    2,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-rumbo'),
    'scale',
    'Tu termómetro',
    'Del 1 al 10, ¿cómo de contento estás con tu negocio hoy? Y si no es un 10, ¿qué tendría que pasar para que lo fuera?',
    '{
      "min": 1,
      "max": 10,
      "min_label": "Nada contento",
      "max_label": "Completamente contento",
      "follow_up": {
        "id": "que_falta",
        "label": "¿Qué tendría que pasar para ser un 10?",
        "type": "open_reflection",
        "placeholder": "Para ser un 10, tendría que...",
        "min_chars": 30
      },
      "save_for_report": true,
      "report_section": "rumbo"
    }'::jsonb,
    3,
    false
  ),
  (
    (SELECT id FROM public.lessons WHERE slug = 'tu-rumbo'),
    'kaizen_step',
    'Tu prioridad número uno',
    'No te pido que hagas nada esta semana. Te pido que releas tus respuestas de las cuatro lecciones. Todas. De principio a fin. Y que te quedes con la que más te duele. Esa es tu prioridad número uno.',
    '{
      "action_prompt": "La respuesta que más me duele de todo el diagnóstico es:",
      "deadline_label": "Cuando termines las 4 lecciones. 10 minutos en silencio.",
      "save_for_report": true,
      "report_section": "prioridad"
    }'::jsonb,
    4,
    true
  );
