-- Añadir campo apertura a lessons
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS apertura TEXT;

-- Actualizar apertura de cada lección con el texto exacto del documento v4

UPDATE public.lessons SET apertura = $$Sé lo que es llegar al domingo por la noche con el móvil lleno de mensajes sin contestar.

Sé lo que es trabajar más horas que cualquier empleado tuyo y preguntarte por qué a fin de mes no sobra lo que debería.

Sé lo que es tener la sensación de que tu negocio te necesita para todo — y que si tú paras, para él también.

Y sé lo que es aguantar esa presión sin poder contársela a nadie, porque se supone que tú eres el que tiene las respuestas.

Si algo de eso te suena familiar, estás exactamente donde tienes que estar.

Si has llegado hasta aquí, es porque sabes que se puede hacer mejor.

No hace falta que tengas claro qué está fallando. No hace falta que sepas por dónde empezar. Solo hace falta lo que ya tienes: la convicción de que algo tiene que cambiar.

Eso es suficiente. Y es exactamente el punto de partida correcto.

Los empresarios rentables no trabajan más. Trabajan con método. Y ese método, hoy, lo construimos juntos.$$
WHERE slug = 'estas-en-el-sitio-correcto';

UPDATE public.lessons SET apertura = $$Imagina que dentro de un año tu empresa no depende de ti para todo.

Que los lunes por la mañana llegas con energía porque el fin de semana fue tuyo de verdad.

Que cuando surge un problema, tienes un sistema para resolverlo — no tienes que inventar la solución desde cero cada vez.

Que sabes exactamente qué está funcionando en tu negocio y qué no, sin tener que adivinar.

Eso no es un sueño. Es lo que pasa cuando empiezas a cambiar una cosa pequeña a la semana durante un año.

No te estoy pidiendo que lo cambies todo. Te estoy pidiendo que empieces por una cosa. Esta semana.

Cuando sistematizas bien las cosas, te das cuenta de que no necesitas estar en todo. Eso es lo que vamos a construir juntos — un proceso pequeño a la vez, en lo empresarial y en lo personal.$$
WHERE slug = 'asi-lo-vamos-a-conseguir';

UPDATE public.lessons SET apertura = $$Has buscado en internet. Has probado métodos. Te han vendido formaciones que prometían el cambio.

Y siempre faltaba algo.

No porque tú hayas fallado. Sino porque ninguno estaba adaptado para ti — para tu negocio concreto, tu sector, tu realidad.

Lo que necesitabas no era más información genérica. Era un sistema que se adaptara a ti. Que aprendiera de tu negocio. Que te acompañara en tus decisiones reales.

Eso es exactamente lo que tienes aquí.$$
WHERE slug = 'la-solucion-que-estabas-buscando';

UPDATE public.lessons SET apertura = $$No tienes que tener todo claro.

No tienes que saber exactamente qué está fallando. No tienes que llegar con las respuestas.

Solo tienes que tener la convicción de que algo tiene que cambiar — y la disposición de trabajarlo. El resto lo ponemos nosotros.

Otros empresarios como tú ya han salido del bucle. Pasar de sobrevivir a tener control no requiere magia. Requiere método. Y ahora tienes los dos.$$
WHERE slug = 'es-el-momento-entramos-juntos';
