-- ══════════════════════════════════════════════════════════════════════════
-- Migración: contenido final módulo mentalidad
-- Añade columnas si no existen + inserta textos exactos en todas las tablas
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Schema: columnas nuevas ─────────────────────────────────────────────

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS texto_audio          TEXT,
  ADD COLUMN IF NOT EXISTS contexto_ejercicios  TEXT,
  ADD COLUMN IF NOT EXISTS contexto_mejora      TEXT,
  ADD COLUMN IF NOT EXISTS cierre_mejora        TEXT;

ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS video_intro_text TEXT;

-- ── 2. Módulo mentalidad (id = 0) ──────────────────────────────────────────

UPDATE public.modules
SET
  description = $desc$Hay un momento en la vida de todo empresario en el que algo hace clic.
No es una epifanía. No es un curso. No es una frase motivacional.
Es una pregunta que aparece un día, casi sin avisar:
¿Para qué monté todo esto?

Porque tenías una imagen en la cabeza cuando empezaste. Libertad. Control. Tiempo para lo que importa. Una vida que valiera la pena. Un negocio que trabajara para ti — no tú para él.

Y en algún momento del camino, **esa imagen se fue diluyendo**.

No pasó de golpe. Fue poco a poco.
Un día empezaste a quedarte más tarde. Luego empezaste a llevarte trabajo a casa. Luego los fines de semana dejaron de ser tuyos. Luego las vacaciones se convirtieron en algo que otros hacen.

Y ahora estás aquí. Cansado no de trabajar — sino de no ver hacia dónde.

Eso tiene solución. Pero **la solución no es trabajar más**.

Este módulo existe para una sola cosa: ayudarte a recordar por qué empezaste. Y mostrarte el camino de vuelta — no a donde estabas, sino a donde siempre quisiste llegar.

No te vamos a pedir que lo cambies todo de golpe. Te vamos a pedir una sola cosa pequeña esta semana. Y luego otra la siguiente. Y así, sin que casi te des cuenta, tu negocio va a empezar a parecerse a la vida que tenías en mente cuando decidiste montar todo esto.

Un negocio que genera dinero de verdad. Que no depende de ti para respirar. Que te da tiempo — para tu familia, para ti, para lo que te importa.

**Eso no es un sueño. Es el resultado de hacer las cosas con método.**

Y el método empieza aquí.$desc$,

  video_intro_text = $vit$Antes de entrar a las lecciones, mira este vídeo.
No te va a decir lo que quieres oír. Te va a decir lo que necesitas escuchar.

En 10 minutos vas a entender qué es exactamente lo que hace que un negocio deje de depender de su dueño — y cuál es el primer paso para que el tuyo empiece a caminar solo.

Sin humo. Sin promesas vacías. Con método.$vit$

WHERE id = 0;

-- ── 3. Lección 1 — estas-en-el-sitio-correcto ─────────────────────────────

UPDATE public.lessons
SET
  apertura = $ap1$Si has llegado hasta aquí, ya tomaste la decisión más difícil.
No la de pagar. La de admitir que algo tiene que cambiar.

La mayoría de los empresarios no llegan nunca a este punto. Siguen adelante, aguantan, improvisan, esperan que el mes que viene sea diferente. Y el mes que viene es exactamente igual. Porque el problema no es el mes. **Eres tú y lo que toleras cada día.**

Sé exactamente dónde estás ahora mismo.

Llegas antes que nadie y te vas el último. Tu negocio depende de ti para todo — si tú paras, para él también. A fin de mes miras la cuenta y el número no refleja el esfuerzo que metiste. Y cuando alguien te pregunta cómo estás, dices bien porque explicar la verdad llevaría demasiado tiempo.

Eso no es mala suerte. Es el resultado directo de un negocio que no está bien dirigido.

Y dirigirlo mejor empieza aquí. No mañana. No cuando tengas más tiempo. Ahora.

Lo que vas a entender en esta lección:

Tu empresa es el reflejo exacto de tus decisiones. Ni más ni menos. Cuando tú cambias cómo piensas y cómo diriges, ella cambia.

**El esfuerzo sin método es el negocio más caro que existe.** Trabajar 60 horas a la semana sin claridad sobre qué mueve el negocio es como correr muy rápido en la dirección equivocada.

No tienes que tenerlo todo claro para empezar. Solo necesitas una cosa: **la convicción de que algo tiene que cambiar**.$ap1$,

  texto_audio = $ta1$Ponlo mientras conduces, desayunas o caminas.

En este audio vas a entender por qué llevas tiempo sintiendo que el negocio te consume en lugar de liberarte — y qué es lo primero que cambia cuando empiezas a dirigir con método en lugar de sobrevivir con esfuerzo.$ta1$,

  contexto_ejercicios = $ce1$Este ejercicio no es para reflexionar en abstracto. Es para que te enfrentes a algo que llevas tiempo evitando mirar. Escríbelo aunque incomode. Nadie más lo va a leer — pero tú sí lo vas a ver. Y verlo ya es el primer paso.$ce1$,

  contexto_mejora = $cm1$No hace falta que lo cambies todo hoy. Solo una cosa. La más pequeña posible. Pero real. Pero esta semana.$cm1$,

  cierre_mejora = $ci1$Cada área que nombras es una cadena que puedes soltar. Empieza por una. El resto viene solo.$ci1$

WHERE slug = 'estas-en-el-sitio-correcto';

-- ── 4. Lección 2 — asi-lo-vamos-a-conseguir ───────────────────────────────

UPDATE public.lessons
SET
  apertura = $ap2$¿Cuántas veces has empezado algo con energía y lo has abandonado al mes?

No es debilidad. No es falta de voluntad. Es que nadie te explicó cómo funciona el cambio real en un negocio.

Los cambios grandes no se hacen con revoluciones de un día. Se construyen con un proceso pequeño arreglado cada semana. Sin drama, sin heroicidades, sin esperar a tener tiempo — porque el tiempo nunca llega solo.

El método que usamos aquí se llama Kaizen.

No es un concepto japonés complicado. Es sentido común aplicado con disciplina:

**Un solo cambio. Esta semana. En tu negocio real.**

Nada más. Sin lista de 47 tareas pendientes. Sin plan de transformación de 90 páginas. Una cosa. La más pequeña posible.

**30 cambios pequeños son un hábito nuevo.**
60 cambios son una forma distinta de pensar.
Un año de cambios es una empresa diferente.

Al final de cada lección vas a encontrar un Paso de Mejora. Una sola acción. Concreta, pequeña, innegociable.

El empresario que ve los contenidos pero no ejecuta el paso no avanza. El que ejecuta aunque sea el paso más ridículo de todos, sí. Porque cada paso es un ladrillo. Y los ladrillos se acumulan.

No te pedimos que cambies tu empresa esta semana. **Te pedimos que cambies una sola cosa. Y que vuelvas a decir: hecho.**$ap2$,

  texto_audio = $ta2$Escúchalo tranquilo. En el coche, paseando, donde puedas.

En este audio entenderás por qué los cambios grandes fracasan casi siempre — y por qué un pasito ridículamente pequeño ejecutado hoy vale más que diez horas de formación sin acción.$ta2$,

  contexto_ejercicios = $ce2$Ahora toca aterrizar. No en teoría — en tu negocio real. Elige un área. Una sola. Y decide el paso más pequeño posible que puedes dar esta semana. Tan pequeño que no puedas decir que no tienes tiempo.$ce2$,

  contexto_mejora = $cm2$Este es tu primer pasito oficial. El primero de muchos. No lo saltes — es el más importante precisamente porque parece el más tonto.$cm2$,

  cierre_mejora = $ci2$Este pasito de hoy es el primero de los 30 que construyen un hábito. Cuando lo hagas, vuelve y marca: hecho. Eso es todo lo que se te pide.$ci2$

WHERE slug = 'asi-lo-vamos-a-conseguir';

-- ── 5. Lección 3 — la-solucion-que-estabas-buscando ──────────────────────

UPDATE public.lessons
SET
  apertura = $ap3$Has buscado. Has probado. Has invertido tiempo y dinero en encontrar la solución.

Cursos que prometían el cambio. Consultores que te dieron un informe de 40 páginas y desaparecieron. Libros que subrayaste y nunca aplicaste. Métodos que funcionaban para otro tipo de negocio pero no para el tuyo.

Y siempre faltaba algo.

No porque tú hayas fallado. Sino porque ninguna de esas soluciones estaba diseñada para tu negocio concreto, con tu realidad, tu equipo y tus números.

La diferencia de lo que hacemos aquí es una sola cosa: **no trabajamos sobre teoría. Trabajamos sobre tu empresa real.**

No hay fórmulas universales. No hay recetas mágicas que funcionen igual para una clínica dental, una ferretería y una agencia de marketing. **Cada negocio tiene su propio 20% que está causando el 80% del problema.** Y encontrarlo requiere mirar tus números, tus procesos y tus decisiones — no los de otro.

Por eso esto no es un curso. Es una consultoría guiada.

La diferencia es enorme: un curso te da información para que la apliques solo. Una consultoría guiada te acompaña a aplicarla en tu caso concreto, con preguntas incómodas, con auditorías reales y con un equipo que no te compra excusas.

Tu Ejército de Consultores.

Cuando entres al programa vas a tener acceso a un equipo de 12 consultores especializados — uno para cada área clave de tu negocio. Precios, equipo, procesos, marketing, ventas, números. Disponibles cuando los necesites. Sin horarios. Sin factura por hora.

**No duermen. No se cansan.** Y no te van a decir lo que quieres oír — te van a decir lo que necesitas escuchar.

Solo cuando ves tu negocio desde fuera entiendes lo que está pasando dentro. Eso es exactamente lo que hacemos aquí.$ap3$,

  texto_audio = $ta3$Ponlo cuando tengas 6 minutos de tranquilidad.

En este audio vas a entender por qué la información sola no cambia nada — y qué es lo que realmente mueve la aguja en un negocio cuando tienes el acompañamiento adecuado.$ta3$,

  contexto_ejercicios = $ce3$Llevas tiempo buscando algo que encaje. Este ejercicio te ayuda a ver exactamente qué es lo que siempre faltaba — para que esta vez sea diferente.$ce3$,

  contexto_mejora = $cm3$¿Qué necesitas que sea diferente esta vez? No en general — en concreto. Escríbelo. Es el compromiso más importante que puedes hacer ahora mismo.$cm3$,

  cierre_mejora = $ci3$Cuando sepas qué necesitas que cambie, ya tienes el primer dato real de tu consultoría. El resto lo construimos sobre eso.$ci3$

WHERE slug = 'la-solucion-que-estabas-buscando';

-- ── 6. Lección 4 — es-el-momento-entramos-juntos ─────────────────────────

UPDATE public.lessons
SET
  apertura = $ap4$No tienes que tener todo claro para empezar.

No tienes que saber exactamente qué está fallando. No tienes que llegar con las respuestas. No tienes que esperar a que las cosas estén más tranquilas — porque las cosas nunca están más tranquilas.

**Si esperas el momento perfecto, no entras nunca.**

Lo que sí necesitas es una sola cosa: querer que esto sea diferente.

No mañana. Ahora.

Cada mes que pasa sin claridad sobre qué está fallando en tu negocio es un mes de esfuerzo sin retorno. Ya lo sabes. Por eso estás aquí.

Otros empresarios como tú ya tomaron esta decisión. No eran más listos ni tenían más tiempo. Tenían lo mismo que tú tienes ahora: la convicción de que seguir igual no era una opción.

Lo que pasa cuando entras:

Primero — haces tu diagnóstico de punto de partida. Sabes exactamente dónde estás y por qué.

Segundo — fijas tu compromiso. A tu ritmo, pero siempre hacia adelante. Sin excusas, sin victimismo.

Tercero — accedes a tu Ejército de 12 Consultores y al método completo. Módulo a módulo, con tus números reales, con acompañamiento en cada paso.

Cuarto — ejecutas. Un pasito a la semana. Y vuelves a decir: hecho.

**Esto no es motivación. Es un sistema.**

Y los sistemas funcionan cuando se aplican — no cuando se contemplan.

**No hay milagros. Hay método. Y ahora tienes los dos.**$ap4$,

  texto_audio = $ta4$Este es el audio más importante del módulo. Escúchalo antes de decidir.

En este audio Pablo te explica qué significa exactamente entrar en la consultoría guiada, qué va a cambiar en tu negocio y en tu vida — y por qué este es el momento, no después.$ta4$,

  contexto_ejercicios = $ce4$Última lección. Última reflexión antes de decidir. Esta pregunta no tiene trampa — solo tiene tu verdad. Escríbela.$ce4$,

  contexto_mejora = $cm4$El compromiso más pequeño que puedes hacer ahora mismo es escribir por qué este momento es el indicado. Solo eso. Una frase. La más honesta que puedas escribir.$cm4$,

  cierre_mejora = $ci4$Cuando lo escribas, ya habrás dado el primer paso. El siguiente es entrar. Y nosotros estaremos ahí.$ci4$

WHERE slug = 'es-el-momento-entramos-juntos';
