# MÓDULO 0 — COMPLETO PARA PROGRAMAR
## Tu Cabeza Manda · Módulo Gratuito · Rentabilismo Academy
### Versión 5.0 — Actualizada abril 2026 (registro obligatorio + flujo definitivo)

> Este documento es la fuente de verdad para programar el Módulo 0.
> Contiene: ficha de módulo, 4 fichas de lección completas, ejercicios con config técnica,
> datos exactos para Supabase y prompt listo para Claude Code.
> NO inventar contenido. NO cambiar textos. Programar exactamente lo que está aquí.

---

## 1. FICHA DE MÓDULO

| Campo | Valor |
|-------|-------|
| slug | `mentalidad` |
| title | `Tu Cabeza Manda` |
| description | `Para que tu empresa cambie, tú tienes que cambiar primero.` |
| order_number | `0` |
| is_free | `true` |
| gpt_agent_url | `null` (PENDIENTE) |

---

## 2. LECCIONES — FICHAS COMPLETAS

---

### LECCIÓN 1 — Estás en el sitio correcto, en el momento indicado

| Campo | Valor |
|-------|-------|
| order_number | `1` |
| title | `Estás en el sitio correcto, en el momento indicado` |
| slug | `estas-en-el-sitio-correcto` |
| frase_clave | `Tú no eres de los que se rinden. Estás aquí porque quieres soluciones reales.` |
| vimeo_id | `null` (PENDIENTE) |
| audio_url | `null` (PENDIENTE) |

**Apertura del vídeo (texto guía para grabación):**

Sé lo que es llegar al domingo por la noche con el móvil lleno de mensajes sin contestar.

Sé lo que es trabajar más horas que cualquier empleado tuyo y preguntarte por qué a fin de mes no sobra lo que debería.

Sé lo que es tener la sensación de que tu negocio te necesita para todo — y que si tú paras, para él también.

Y sé lo que es aguantar esa presión sin poder contársela a nadie, porque se supone que tú eres el que tiene las respuestas.

Si algo de eso te suena familiar, estás exactamente donde tienes que estar.

Si has llegado hasta aquí, es porque sabes que se puede hacer mejor.

No hace falta que tengas claro qué está fallando. No hace falta que sepas por dónde empezar. Solo hace falta lo que ya tienes: la convicción de que algo tiene que cambiar.

Eso es suficiente. Y es exactamente el punto de partida correcto.

Los empresarios rentables no trabajan más. Trabajan con método. Y ese método, hoy, lo construimos juntos.

**Puntos principales del vídeo (10-12 min):**
1. Por qué el hecho de estar aquí ya dice algo importante sobre ti
2. La diferencia entre un negocio que te consume y uno que trabaja para ti
3. Tu empresa refleja tus decisiones — y cuando tú cambias, ella cambia contigo
4. No se trata de trabajar más. Se trata de dirigir con claridad.
5. Esto no es un curso. Es un proceso diseñado para acompañarte en cada paso.

**Mensaje central del audio (5-6 min):**
Cuando empieces a ver resultados, lo primero que vas a notar es tranquilidad. No euforia, no magia — tranquilidad. La que da saber que las cosas avanzan. Este audio es sobre eso: lo que te espera cuando el método empieza a funcionar en tu negocio real.

#### EJERCICIO 1.1 — Tu punto de partida

```json
{
  "type": "open_reflection",
  "title": "Tu punto de partida",
  "order_number": 1,
  "is_kaizen": false,
  "description": "No te pregunto por objetivos ni por problemas. Te pregunto por lo que sientes. ¿Qué es lo que ya no estás dispuesto a seguir igual?",
  "config": {
    "placeholder": "Lo que ya no quiero que siga igual es...",
    "min_chars": 40,
    "note": "No hay respuesta correcta. Solo la tuya."
  }
}
```

#### EJERCICIO 1.2 — Paso Kaizen

```json
{
  "type": "kaizen_step",
  "title": "Reconoce dónde estás",
  "order_number": 2,
  "is_kaizen": true,
  "description": "Esta semana, escribe en una frase el área de tu negocio o tu vida que más energía te está robando ahora mismo. Solo una.",
  "config": {
    "action_prompt": "Lo que más energía me roba ahora mismo es:",
    "deadline_label": "Esta semana: solo nómbralo"
  }
}
```

---

### LECCIÓN 2 — Así lo vamos a conseguir: un paso a la vez

| Campo | Valor |
|-------|-------|
| order_number | `2` |
| title | `Así lo vamos a conseguir: un paso a la vez` |
| slug | `asi-lo-vamos-a-conseguir` |
| frase_clave | `Cuando empieces a ordenar las cosas, vas a sentir que por fin tienes el control.` |
| vimeo_id | `null` (PENDIENTE) |
| audio_url | `null` (PENDIENTE) |

**Apertura del vídeo (texto guía para grabación):**

Imagina que dentro de un año tu empresa no depende de ti para todo.

Que los lunes por la mañana llegas con energía porque el fin de semana fue tuyo de verdad.

Que cuando surge un problema, tienes un sistema para resolverlo — no tienes que inventar la solución desde cero cada vez.

Que sabes exactamente qué está funcionando en tu negocio y qué no, sin tener que adivinar.

Eso no es un sueño. Es lo que pasa cuando empiezas a cambiar una cosa pequeña a la semana durante un año.

No te estoy pidiendo que lo cambies todo. Te estoy pidiendo que empieces por una cosa. Esta semana.

Cuando sistematizas bien las cosas, te das cuenta de que no necesitas estar en todo. Eso es lo que vamos a construir juntos — un proceso pequeño a la vez, en lo empresarial y en lo personal.

**Puntos principales del vídeo (10-12 min):**
1. Por qué los cambios pequeños y consistentes ganan siempre a los grandes gestos aislados
2. El Kaizen aplicado al negocio y a la vida: hábitos, rutinas, claridad mental — todo suma
3. Acompañamiento real en cada paso — no teoría para aplicar solo
4. 30 pasos son un hábito. 60 pasos son una forma distinta de pensar.
5. Cómo funciona el paso Kaizen al final de cada lección: una acción, esta semana, tu negocio real

**Mensaje central del audio (5-6 min):**
Lo que más sorprende a los empresarios cuando empiezan no es el resultado económico — es cómo cambia su forma de pensar el negocio. Este audio es sobre ese cambio. Cómo empieza. Cómo se nota. Y por qué es irreversible cuando ocurre de verdad.

#### EJERCICIO 2.1 — Un área, un paso

```json
{
  "type": "text_input",
  "title": "Un área, un paso",
  "order_number": 1,
  "is_kaizen": false,
  "description": "Elige un área de tu negocio o tu vida que quieres que sea diferente. Una sola. ¿Cuál es el paso más pequeño posible que podrías dar esta semana?",
  "config": {
    "fields": [
      {
        "id": "area",
        "label": "El área que quiero que cambie",
        "placeholder": "Ej: cómo organizo mi tiempo / mis precios / mi equipo..."
      },
      {
        "id": "paso",
        "label": "El paso más pequeño que puedo dar esta semana",
        "placeholder": "Algo concreto, en menos de 30 minutos..."
      }
    ]
  }
}
```

#### EJERCICIO 2.2 — Paso Kaizen

```json
{
  "type": "kaizen_step",
  "title": "Una cosa. Esta semana.",
  "order_number": 2,
  "is_kaizen": true,
  "description": "Elige una cosa que llevas posponiendo. Solo una. Hazla esta semana en menos de 30 minutos.",
  "config": {
    "action_prompt": "Lo que voy a hacer esta semana es:",
    "deadline_label": "Menos de 30 minutos. Esta semana."
  }
}
```

---

### LECCIÓN 3 — La solución que estabas buscando

| Campo | Valor |
|-------|-------|
| order_number | `3` |
| title | `La solución que estabas buscando` |
| slug | `la-solucion-que-estabas-buscando` |
| frase_clave | `No es un curso. Es un consultor privado experto en tu negocio.` |
| vimeo_id | `null` (PENDIENTE) |
| audio_url | `null` (PENDIENTE) |

**Apertura del vídeo (texto guía para grabación):**
Has buscado en internet. Has probado métodos. Te han vendido formaciones que prometían el cambio.

Y siempre faltaba algo.

No porque tú hayas fallado. Sino porque ninguno estaba adaptado para ti — para tu negocio concreto, tu sector, tu realidad.

Lo que necesitabas no era más información genérica. Era un sistema que se adaptara a ti. Que aprendiera de tu negocio. Que te acompañara en tus decisiones reales.

Eso es exactamente lo que tienes aquí.

**Puntos principales del vídeo (10-12 min):**
1. Por qué los métodos genéricos no encajan en negocios reales con historias reales
2. La diferencia entre un curso y una consultoría guiada adaptada a ti
3. Cómo la IA avanzada integrada en el proceso aprende de tu negocio y se adapta a tu caso
4. Tu Ejército de 12 Consultores especializados — uno para cada área, disponibles cuando los necesitas
5. Solo cuando ves tu negocio desde fuera entiendes lo que está pasando dentro. Eso es lo que hacemos aquí.

**Mensaje central del audio (5-6 min):**
La mayoría de los que entran dicen lo mismo cuando llevan un mes: "¿Por qué no hice esto antes?" Este audio es sobre esa pregunta. Y sobre lo que cambia cuando por fin tienes el acompañamiento adecuado para tu caso concreto.

#### EJERCICIO 3.1 — Lo que has probado

```json
{
  "type": "checklist",
  "title": "Lo que has intentado hasta ahora",
  "order_number": 1,
  "is_kaizen": false,
  "description": "Marca lo que has probado para mejorar tu negocio. Sin juicio — cada cosa que probaste te trajo hasta aquí.",
  "config": {
    "items": [
      { "id": "cursos", "label": "Cursos online" },
      { "id": "libros", "label": "Libros de negocio" },
      { "id": "consultores", "label": "Consultores externos" },
      { "id": "coaches", "label": "Coaches o mentores" },
      { "id": "conferencias", "label": "Conferencias y eventos" },
      { "id": "herramientas", "label": "Herramientas digitales" },
      { "id": "asesores", "label": "Asesores o gestores" },
      { "id": "consejos", "label": "Consejos de amigos o conocidos" }
    ],
    "follow_up": {
      "type": "open_reflection",
      "label": "¿Qué era lo que siempre faltaba?",
      "placeholder": "Lo que siempre echaba en falta era..."
    }
  }
}
```

#### EJERCICIO 3.2 — Paso Kaizen

```json
{
  "type": "kaizen_step",
  "title": "La diferencia que buscas",
  "order_number": 2,
  "is_kaizen": true,
  "description": "Escribe en una frase qué necesitas que sea diferente esta vez para que funcione.",
  "config": {
    "action_prompt": "Lo que necesito que sea diferente esta vez es:",
    "deadline_label": "Esta semana: escríbelo"
  }
}
```

---

### LECCIÓN 4 — Es el momento. Entramos juntos.

| Campo | Valor |
|-------|-------|
| order_number | `4` |
| title | `Es el momento. Entramos juntos.` |
| slug | `es-el-momento-entramos-juntos` |
| frase_clave | `No se trata de si vas a dar el paso. Se trata de cuándo: ¿ahora o cuando ya sea demasiado tarde?` |
| vimeo_id | `null` (PENDIENTE) |
| audio_url | `null` (PENDIENTE) |

**Apertura del vídeo (texto guía para grabación):**
No tienes que tener todo claro.

No tienes que saber exactamente qué está fallando. No tienes que llegar con las respuestas.

Solo tienes que tener la convicción de que algo tiene que cambiar — y la disposición de trabajarlo. El resto lo ponemos nosotros.

Otros empresarios como tú ya han salido del bucle. Pasar de sobrevivir a tener control no requiere magia. Requiere método. Y ahora tienes los dos.

**Puntos principales del vídeo (10-12 min):**
1. Por qué este es el momento — no porque sea urgente, sino porque ya estás listo
2. Cuanto más claridad tengas, más fácil será avanzar — y la claridad empieza aquí
3. Lo que vas a tener desde el primer día: diagnóstico, método, acompañamiento
4. Cómo funciona el proceso: módulo a módulo, a tu ritmo, con tus números reales
5. No es si lo vas a hacer — es si prefieres hacerlo solo o con ayuda

**Texto proyección final (mostrar en pantalla durante el vídeo):**
> Cuando empieces a ver resultados, lo primero que vas a notar es tranquilidad.
>
> Cuando tengas claridad, tomarás decisiones con seguridad.
>
> Cuando tu negocio no dependa de ti para todo, recuperarás tu tiempo. Y con el tiempo, tu vida.

**Mensaje central del audio (5-6 min):**
"No puedo ayudarte a cambiar tu negocio si tú no quieres cambiarlo. Pero si quieres, puedo acompañarte en cada paso." Qué significa eso en la práctica. Qué puedes esperar. Y por qué no vas a estar solo en ningún momento del proceso.

#### EJERCICIO 4.1 — Tu imagen de destino

```json
{
  "type": "open_reflection",
  "title": "¿Cómo quieres que sea tu vida dentro de un año?",
  "order_number": 1,
  "is_kaizen": false,
  "description": "No te pregunto por objetivos de negocio. Te pregunto por tu vida. ¿Cómo sería tu semana si tu empresa funcionara como quieres?",
  "config": {
    "placeholder": "Dentro de un año, me gustaría que...",
    "min_chars": 60,
    "note": "Guardamos esta respuesta. Al completar el programa, volvemos a ella contigo."
  }
}
```

#### EJERCICIO 4.2 — Paso Kaizen

```json
{
  "type": "kaizen_step",
  "title": "Tu compromiso",
  "order_number": 2,
  "is_kaizen": true,
  "description": "Escribe en una frase por qué ahora. No tus objetivos — por qué este momento es el indicado.",
  "config": {
    "action_prompt": "Este es el momento porque:",
    "deadline_label": "Antes de seguir"
  }
}
```

---

## 3. CIERRE DEL MÓDULO — CTA DE VENTA

> Aparece en pantalla cuando el usuario completa las 4 lecciones.
> Es el elemento de conversión principal del módulo gratuito.
> NO modificar el copy. Programarlo exactamente así.
> Visible SOLO cuando user_progress = 100% (4/4 lecciones completadas).

---

Ya tienes lo más importante.

Sabes que algo tiene que cambiar. Sabes que hay una forma mejor. Y sabes que esta vez no quieres hacerlo solo.

No se trata de si vas a aplicar el método, sino de cuándo.

Puedes empezar hoy y construir claridad desde el primer módulo. O puedes esperar otro mes. Tú eliges.

Por un pago único de 799 euros, tienes acceso completo durante 6 meses — 10 módulos de consultoría guiada, tu Ejército de 12 Consultores especializados con IA avanzada adaptada a tu negocio, y acompañamiento real en cada paso.

No es un curso. Es tu consultor privado.

*No hay milagros. Hay método. Y ahora tienes los dos.*

---

Una cosa más.

Los primeros 50 empresarios que entran tienen acceso de por vida — sin fecha de caducidad, sin renovaciones.

A partir del número 51, el acceso es de 6 meses.

No es un truco de marketing. Es una decisión que tomé para recompensar a quienes deciden antes. Y las plazas se están ocupando.

Si estás leyendo esto, todavía estás a tiempo.

**[Entrar en la consultoría — 799€]**

---

LÓGICA DEL BOTÓN CTA:
- Usuario registrado → directo a Stripe Checkout (/api/stripe/checkout)
- Usuario registrado sin pago → al completar Mentalidad, ve programa completo + CTA a Stripe Checkout
- Bloque CTA: visible SOLO cuando user_progress del módulo mentalidad = 100%
- Contador dinámico: COUNT payments WHERE status='completed'
- Si count < 50 → mostrar "X de 50 plazas lifetime ocupadas"
- Si count >= 50 → mostrar "Las plazas lifetime están completas. El acceso ahora es de 6 meses."

---

## 4. DATOS PARA SUPABASE

### Tabla: modules

```sql
INSERT INTO modules (slug, title, description, order_number, is_free, gpt_agent_url)
VALUES (
  'mentalidad',
  'Tu Cabeza Manda',
  'Para que tu empresa cambie, tú tienes que cambiar primero.',
  0,
  true,
  null
);
```

### Tabla: lessons

```sql
-- Sustituir [module_id] por el ID del módulo insertado arriba

INSERT INTO lessons (module_id, title, slug, order_number, frase_clave, vimeo_id, audio_url)
VALUES
  ([module_id],
   'Estás en el sitio correcto, en el momento indicado',
   'estas-en-el-sitio-correcto',
   1,
   'Tú no eres de los que se rinden. Estás aquí porque quieres soluciones reales.',
   null, null),

  ([module_id],
   'Así lo vamos a conseguir: un paso a la vez',
   'asi-lo-vamos-a-conseguir',
   2,
   'Cuando empieces a ordenar las cosas, vas a sentir que por fin tienes el control.',
   null, null),

  ([module_id],
   'La solución que estabas buscando',
   'la-solucion-que-estabas-buscando',
   3,
   'No es un curso. Es un consultor privado experto en tu negocio.',
   null, null),

  ([module_id],
   'Es el momento. Entramos juntos.',
   'es-el-momento-entramos-juntos',
   4,
   'No se trata de si vas a dar el paso. Se trata de cuándo: ¿ahora o cuando ya sea demasiado tarde?',
   null, null);
```

### Tabla: exercises

```sql
-- Insertar 2 ejercicios por lección (8 en total)
-- Usar el JSON exacto de la sección 2 para el campo config
-- is_kaizen = true solo para los de type = kaizen_step

INSERT INTO exercises (lesson_id, type, title, description, config, order_number, is_kaizen)
VALUES ([lesson_id], '[type]', '[title]', '[description]', '[config]'::jsonb, [order], [is_kaizen]);
```

---

## 5. LÓGICA DE NEGOCIO

| Regla | Detalle |
|-------|---------|
| Acceso | Público con registro obligatorio (email + nombre). Ruta: `/mentalidad` en `/app/(public)/` |
| Progreso | Se guarda siempre (registro obligatorio = siempre hay sesión). |
| CTA | Visible SOLO con 4/4 lecciones completadas |
| Contador plazas | COUNT payments WHERE status='completed' — mostrar dinámicamente en CTA |
| Acceso post-caducidad | Ver CLAUDE.md — lógica de access_type='reduced' |
| Informe 1 | Al completar → generar evolution_report type='motivational' |
| Vídeos null | Mostrar placeholder elegante, nunca error |
| Audios null | Mostrar placeholder elegante, nunca error |
| Termómetro | Hook preparado — INACTIVO por defecto, Pablo lo activa |
| Calculadora ROI | En página de pricing, no en este módulo |

---

## 6. PROMPT PARA CLAUDE CODE

> Activa Plan Mode (Shift+Tab) antes de pegar esto.

```
Lee el archivo MODULO-0-COMPLETO-PARA-PROGRAMAR-v5.md antes de hacer nada.

Cuando lo hayas leído, quiero que hagas esto en 3 sesiones:

SESIÓN 1 — Base de datos:
- Migración SQL: insertar módulo, 4 lecciones y 8 ejercicios en Supabase
- Usar los textos exactos del documento, sin cambiar nada
- vimeo_id y audio_url van a null
- Confirmar que los datos están insertados antes de continuar

SESIÓN 2 — Página del módulo:
- Página pública en /app/(public)/mentalidad/ con:
  · Header: título + frase del módulo
  · Lista de 4 lecciones con estado completada/pendiente (si hay sesión)
  · Navegación entre lecciones
  · Bloque CTA visible SOLO cuando 4/4 lecciones completadas
  · Copy del CTA: exactamente el texto del documento, sin cambiar nada
  · Contador dinámico: COUNT payments WHERE status='completed'
    - Si count < 50 → "X de 50 plazas lifetime ocupadas"
    - Si count >= 50 → "Las plazas lifetime están completas. El acceso ahora es de 6 meses."

SESIÓN 3 — Páginas de lección:
- Página en /app/(public)/mentalidad/[lesson-slug]/ con:
  · Título y frase clave
  · Placeholder elegante para vídeo (vimeo_id null)
  · Placeholder elegante para audio (audio_url null)
  · Renderizado dinámico de ejercicios por type:
    - open_reflection → textarea con description como label
    - text_input → campos según array "fields" del config
    - checklist → checkboxes con items + follow_up si existe
    - kaizen_step → bloque visualmente destacado con action_prompt y deadline_label
  · Botón "Completar lección":
    - Con sesión → guarda progreso + redirige a siguiente lección
    - Sin sesión → muestra CTA de registro

Reglas inamovibles:
- NO inventar contenido — usar exactamente los textos del documento
- Server Components por defecto. 'use client' solo si es estrictamente necesario.
- shadcn/ui para todos los componentes
- Textos de interfaz en español
- Rama: feature/modulo-0-mentalidad
- Un commit por sesión

Empieza por el plan de las 3 sesiones. No escribas código hasta que yo apruebe el plan.
```

---

Estado: APROBADO — LISTO PARA CLAUDE CODE
Versión: 4.0 — Marzo 2026
Cambios v4: acceso de 6 meses (no 12) en todo el copy del CTA + contador actualizado
Cambios v5: registro obligatorio (email+nombre) antes de acceder al módulo. Progreso siempre se guarda. CTA solo al completar 4/4 lecciones, muestra programa completo.
"No hay milagros. Hay método. Y ahora tienes los dos."
