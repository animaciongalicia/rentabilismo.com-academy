# RENTABILISMO MASTER
## Documento de referencia unificado — Rentabilismo Academy
### Autor: Pablo García Dacosta | rentabilismo.com

> Este documento es la fuente de verdad para cualquier IA (Claude Chat, Claude Code)
> que trabaje en el proyecto. Contiene el tono, la metodología pedagógica y el mapa
> de dolores del cliente. Se lee ANTES de generar cualquier contenido de la plataforma.
>
> **Versión:** v2 — Abril 2026.
> **Flujo de usuario y arquitectura técnica:** ver CLAUDE.md v3 (fuente de verdad para código).
> **Este documento:** fuente de verdad para CONTENIDO y TONO.

---

## 1. QUÉ ES RENTABILISMO ACADEMY

Consultoría guiada online para empresarios de habla hispana.
**NO es un curso.** Cada usuario trabaja sobre SU negocio real con datos reales.

- 11 módulos (1 Mentalidad gratuito con registro + 10 de pago)
- Diagnóstico (módulo 1) es obligatorio post-pago — desbloquea los 9 restantes
- 4-5 lecciones por módulo
- Cada lección: vídeo 10-12 min + audio 5-6 min + 1-2 ejercicios + paso kaizen
- Agente GPT por módulo (marketplace de ChatGPT) — integrado al final de cada módulo
- Precio: 799€ pago único vía Stripe
- Primeros 50: acceso lifetime. Desde el 51: acceso 180 días (luego acceso reducido)

**Stack técnico:** Next.js 14 + Supabase + Tailwind + shadcn/ui + Stripe + Vimeo + Vercel

---

## 2. TONO Y ESTILO RENTABILISTA

### La voz de Rentabilismo
Fusión entre dos mundos:
- **Raimon Samsó:** reflexivo, persuasivo, conecta con el "por qué" del empresario
- **Marina Miller:** disrupción directa, cuchilla, sin pedir permiso
- **Voz oficial (Pablo):** equilibrio entre reflexión y acción — cercanía, inteligencia práctica

### Los 5 pilares inamovibles

1. **Verdad sin anestesia** — No se vende ilusión, se vende claridad. Si algo no funciona, se dice.
2. **Cercanía absoluta** — Como alguien que se sienta enfrente con un café. Empatía sin disfraz.
3. **Emoción con propósito** — No lástima ni drama, sino reacción. Cada palabra mueve algo.
4. **Acción constante** — Cada párrafo empuja a decidir algo: cambiar, medir, cortar, empezar.
5. **Claridad brutal** — No adornar. No explicar de más. Las cosas como son.

### Cómo se escribe

**SÍ:**
- Segunda persona siempre: tú, tu negocio, te pasa, te frustra, lo que haces
- Frases cortas, respirables, sin relleno
- Verbos que mueven: consigue, aclara, aplica, corta, mejora, mide, define, ajusta
- Ritmo emocional: una frase que golpea, otra que calma
- "Cuando" en lugar de "si" (da certeza, no condición)
- "Porque" y "por qué" (la gente quiere razones)

**NUNCA:**
- "nosotros", "nuestro equipo"
- Verbos débiles: aprende, compra, preocúpate
- Palabras de humo: estrategia, plataforma, metodología, propuesta de valor,
  innovación, empoderamiento, motivación, mindset, crecimiento exponencial,
  éxito, aprendizaje, aprenderás, descubrirás
- Frases largas o neutras
- Empezar con contexto — empieza siempre con verdad

### Estructura de un texto Rentabilista
```
1. Golpe inicial (emoción) — La frase que agarra del cuello
2. Reconocimiento (empatía) — "Te entiendo. A mí también me pasó."
3. Cambio de enfoque (claridad) — "El problema no es lo que crees."
4. Solución o método (acción) — Paso concreto con ejemplo real
5. Cierre (impacto) — Frase que retumba
```

### Frases gancho de la marca
- "No hay milagros, hay método."
- "Hazlo rentable o déjalo tranquilo."
- "No necesitas suerte, necesitas claridad."
- "Tu negocio te está hablando. Escúchalo antes de que te grite."
- "Lo que no mides, lo pierdes."
- "Cuando entiendas esto, dejarás de sobrevivir para empezar a dirigir."

### Checklist rápido antes de publicar cualquier texto
- [ ] ¿Está en segunda persona?
- [ ] ¿Dice la verdad sin rodeos?
- [ ] ¿Provoca acción o reflexión real?
- [ ] ¿Sin palabras de humo?
- [ ] ¿Suena a humano, no a PowerPoint?

---

## 3. LOS 8 DOLORES DEL CLIENTE

Estos son los frenos reales del empresario que llega a Rentabilismo.
Cada módulo resuelve uno o varios de estos dolores.
Todo ejercicio, instrucción y texto debe conectar con al menos uno.

### Dolor 1 — Trabaja más pero gana igual o menos
**Síntoma:** Rueda de hámster. Más horas, mismos resultados.
**Causa real:** El negocio depende enteramente del dueño. Sin sistemas, sin delegación.
**Señales de alerta:** +10 horas diarias, no puede tomarse vacaciones, ingresos no crecen en proporción a las ventas.

### Dolor 2 — No sabe cuánto gana de verdad
**Síntoma:** Confunde facturación con beneficio. "Algo queda" al final del mes.
**Causa real:** No separa gastos personales y profesionales. No calcula el coste de su tiempo.
**Señales de alerta:** Celebra la facturación sin mirar el margen. Navega a ciegas.

### Dolor 3 — No le da la vida
**Síntoma:** Urgencias constantes, multitarea permanente, agotamiento crónico.
**Causa real:** Está tan metido en la operativa que no puede dirigir. No tiene tiempo para pensar.
**Señales de alerta:** No recuerda cuándo terminó el día con energía o sensación de avance.

### Dolor 4 — Sus precios son a ojo
**Síntoma:** Miedo a subir precios. Compite por precio, no por valor.
**Causa real:** No calcula costes reales. Fija precio mirando a la competencia o "por sensación".
**Señales de alerta:** Mantiene precios de hace 2 años, pierde margen cada mes.

### Dolor 5 — Sin método
**Síntoma:** Hace las cosas "porque siempre se han hecho así."
**Causa real:** Costumbre sin análisis. Nunca cuestiona si lo que hace funciona.
**Señales de alerta:** Decisiones improvisadas, reinventa la rueda cada día.

### Dolor 6 — Sin datos
**Síntoma:** Decide improvisando y espera que salga bien.
**Causa real:** No mide nada. Confía en la intuición o en la suerte.
**Señales de alerta:** No sabe qué canal le trae más clientes, qué producto es más rentable.

### Dolor 7 — No sabe comunicar su valor
**Síntoma:** Habla de características, no de beneficios. Le da vergüenza "vender".
**Causa real:** No conecta con el dolor del cliente. Describe lo que hace, no lo que resuelve.
**Señales de alerta:** Pierde oportunidades porque el cliente no entiende por qué elegirle a él.

### Dolor 8 — Siente que podría ganar más
**Síntoma:** Intuye el potencial pero no sabe cómo activarlo.
**Causa real:** Ve oportunidades que no aprovecha. La intuición sin acción se convierte en frustración.
**Señales de alerta:** Pospone decisiones que sabe que debe tomar.

---

## 4. ESTRUCTURA NARRATIVA DE MÓDULOS Y LECCIONES

### La columna vertebral de cada módulo
Todo módulo sigue esta secuencia narrativa:
```
Síntoma → Creencia errónea → Problema invisible → Explicación → Consecuencia → Promesa de solución
```

### Estructura estándar de lecciones (4-5 por módulo)

| Lección | Fase narrativa | Objetivo del empresario | Transformación |
|---------|---------------|------------------------|----------------|
| 1 | Síntoma + Creencia errónea | Ver su problema y romper el autoengaño | Emocional |
| 2 | Problema invisible | Descubrir lo que realmente le frena | Cognitiva |
| 3 | Explicación (claridad del método) | Entender con lógica y ejemplos | Mental |
| 4 | Consecuencia de no resolver | Sentir la urgencia real del cambio | Motivacional |
| 5 | Promesa de solución + Primer paso | Aplicar una acción concreta con foco | Transformadora |

### Coherencia narrativa entre módulos (embudo global)

| Etapa | Módulos | Objetivo del empresario |
|-------|---------|------------------------|
| Despertar | Mentalidad / Diagnóstico | Entiende su caos |
| Claridad | Pricing / Control / Márgenes | Aprende a medir y decidir |
| Aplicación | Marketing / Ventas / Gestión | Mejora resultados reales |
| Escalado | Equipo / Procesos / Estrategia | Gana tiempo y control |
| Integración | Visión / Mentalidad final | Reafirma la transformación |

---

## 5. METODOLOGÍA DE EJERCICIOS

### El embudo emocional-cognitivo de 6 fases

Cada ejercicio arranca desde el dolor, nunca desde la teoría.

| Fase | Propósito | Tipo de pregunta | Tipo de ejercicio |
|------|-----------|-----------------|-------------------|
| 1. Síntoma | Hacer visible el dolor real | Pregunta emocional directa | open_reflection, scale |
| 2. Creencia errónea | Romper la explicación equivocada | Pregunta que desafía su lógica | open_reflection, multiple_choice |
| 3. Problema invisible | Mostrar la raíz oculta | Prompt de análisis de comportamientos | checklist, matrix, text_input |
| 4. Claridad | Guiar la comprensión del mecanismo | Ejercicio de observación o cálculo | calculator, number_input, matrix |
| 5. Consecuencia | Hacerle ver el coste de no cambiar | Pregunta de impacto | open_reflection, scale |
| 6. Acción | Dar un paso real aplicable hoy | Tarea concreta y medible | kaizen_step |

### Los 9 tipos de ejercicio técnicos

| Tipo técnico | Qué hace | Fase ideal | Cuándo usarlo |
|-------------|----------|-----------|---------------|
| text_input | Campo de texto libre corto | Problema invisible | Cuando la respuesta es corta y específica |
| number_input | El usuario mete un número de su negocio | Claridad | Para datos reales: precios, costes, horas |
| scale | Valoración de 1 a X | Síntoma / Consecuencia | Para medir percepción o intensidad |
| multiple_choice | Elige una opción entre varias | Creencia errónea | Para identificar en qué patrón está |
| checklist | Marca las que apliquen | Problema invisible | Para diagnósticos con varios ítems |
| matrix | Tabla con filas y columnas a rellenar | Claridad / Diagnóstico | Para cruzar datos (ej: servicio × coste × margen) |
| calculator | Campos numéricos + fórmula automática | Claridad | Para cálculos de margen, precio, rentabilidad |
| open_reflection | Texto largo, reflexión profunda | Síntoma / Integración | Para reflexiones que necesitan espacio |
| kaizen_step | El paso de bebé final — SIEMPRE el último | Acción | Una microacción concreta por lección, sin excepción |

### Los 4 tipos de ejercicio según función

**Diagnóstico** — Hacer consciente lo inconsciente
- El empresario ve su caos con nombres y números
- Formato: pregunta + acción + mini-reflexión
- Ejemplo: "Calcula el margen real de tu servicio más vendido. ¿Te sigue saliendo a cuenta?"

**Reenfoque mental** — Romper creencias erróneas
- Desmonta la vieja forma de pensar
- Formato: pregunta provocadora o comparación entre escenarios
- Ejemplo: "¿Qué parte de tu negocio mantienes solo por miedo a soltarla?"

**Acción práctica** — Método en marcha
- Convierte la comprensión en movimiento visible y medible
- Formato: pasos cortos, tareas claras, resultados visibles
- Ejemplo: "Define tus tres servicios más rentables. Solo tres."

**Integración** — Fijar el cambio
- Consolida lo aprendido y conecta con el siguiente módulo
- Formato: reflexión + visión + compromiso breve
- Ejemplo: "¿Qué decisión llevas tiempo evitando y ya sabes que tienes que tomar?"

### Cómo redactar instrucciones de ejercicio (Tono Rentabilista)

```
Estructura estándar:
[Frase de síntoma o contexto — conecta con el dolor del empresario]
[Instrucción clara de qué hacer — UNA sola acción]
[Frase de cierre — el "para qué", el valor de hacerlo]
```

Ejemplo bien redactado:
```
"Llevas tiempo sintiendo que trabajas para cubrir gastos, no para ganar.
Ahora vamos a ponerle número a eso.
Anota tus 3 servicios principales con su precio y coste real. Solo los datos, sin filtros.
Cuando lo veas escrito, sabrás exactamente dónde está el problema."
```

### Checklist de calidad de un ejercicio
- [ ] ¿Provoca reflexión real, no una lista de tareas?
- [ ] ¿Empieza desde el dolor y termina en acción?
- [ ] ¿Puede hacerse en menos de 15 minutos?
- [ ] ¿Lo que anota el empresario se aplica directamente a su negocio?
- [ ] ¿Encaja con la fase del embudo de esa lección?
- [ ] ¿Está escrito en tono humano, no académico?
- [ ] ¿Puede repetirse cada trimestre como autoevaluación?

### El Paso Kaizen — Reglas de oro

El paso kaizen es la microacción concreta con la que termina cada lección.
Es UNA SOLA COSA. Pequeña. Concreta. Medible. Con el negocio real del empresario. Esta semana.

**Buenos ejemplos:**
- "Calcula el margen real de tus 3 productos más vendidos"
- "Habla con tu empleado más antiguo y pregúntale qué cambiaría"
- "Sube tu precio un 5% en un servicio esta semana y mide la reacción"
- "Anota cuántas horas reales dedicas esta semana a tareas que generan dinero"

**Malos ejemplos (demasiado vagos):**
- "Reflexiona sobre tus precios" ← NO
- "Piensa en tu equipo" ← NO
- "Mejora tu proceso de ventas" ← NO
- "Trabaja en tu mentalidad" ← NO

---

## 6. PROMPTS IA PARA CADA MÓDULO

Referencia de los 6 tipos de prompt que puede incluir el agente GPT de cada módulo:

1. **Diagnóstico rápido:** "Actúa como consultor de rentabilidad. Hazme 10 preguntas para identificar por dónde se me va el dinero."
2. **Análisis de precios:** "Crea una tabla con mis servicios, precios, costes y margen. Señala los que bajan del 30%."
3. **Plan de mejora rápida:** "Dame un plan de 3 acciones para mejorar mi rentabilidad sin subir precios ni aumentar horas."
4. **Rediseño de modelo:** "Analiza mi negocio como si fuera tuyo. Dime 3 cosas que harías distinto."
5. **Revisión de mentalidad:** "Hazme 5 preguntas que me ayuden a pensar como empresario rentable, no como autoempleado."
6. **Visión e integración:** "Resume lo aprendido en este módulo en 3 frases y escribe una acción inmediata."

---

## 7. CHECKLIST RENTABILISTA PARA PUBLICAR CUALQUIER CONTENIDO

### Para módulos y lecciones
- [ ] ¿Cada lección sigue el embudo Síntoma → Promesa?
- [ ] ¿El empresario entiende el "por qué" y el "para qué" antes del "cómo"?
- [ ] ¿Hay emoción, claridad y práctica en equilibrio?
- [ ] ¿El ejemplo o caso real es reconocible?
- [ ] ¿Cada cierre tiene una frase recordable?
- [ ] ¿Se anticipa el siguiente paso del curso?
- [ ] ¿El tono es humano, directo y sin humo?
- [ ] ¿Se puede seguir sin tener que tomar notas para entenderlo?

### Para textos y copies
- [ ] ¿Está en segunda persona?
- [ ] ¿Dice la verdad sin rodeos?
- [ ] ¿Provoca acción o reflexión real?
- [ ] ¿Sin palabras de humo?
- [ ] ¿Suena a humano, no a PowerPoint?

### Para ejercicios
- [ ] ¿Provoca reflexión real, no una lista de tareas?
- [ ] ¿Empieza desde el dolor y termina en acción?
- [ ] ¿Puede hacerse en menos de 15 minutos?
- [ ] ¿Lo que anota el empresario se aplica a su negocio real?
- [ ] ¿Encaja con el embudo narrativo del módulo?

---

## 8. INFORMES DE EVOLUCIÓN (4 hitos)

| Informe | Trigger | Contenido | Momento |
|---------|---------|-----------|---------|
| 1. Motivacional | Completa Mentalidad | ROI calculado + empuje a la compra | Pre-pago |
| 2. Diagnóstico | Completa Diagnóstico | Foto del negocio + datos iniciales | Post-pago |
| 3. Progreso | Completa 5 módulos | Avance + datos trabajados + racha | Post-pago |
| 4. Final | Completa 10 módulos | Evolución completa + termómetro + plan 90 días | Post-pago |

Los informes usan datos reales de las respuestas del usuario. Aparecen dentro del dashboard,
no en sección separada. Se generan como HTML con CSS de impresión.

---

*Versión: 2.0 — Abril 2026*
*Actualizado con decisiones del Mapa de Flujo Definitivo de abril 2026.*
*"No hay milagros, hay método." — Pablo García Dacosta*
