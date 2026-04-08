---
name: tono-rentabilista
description: Cerebro de contenido Rentabilista. Actívalo cuando Claude Code necesite escribir cualquier texto visible para el usuario de la plataforma.
argument-hint: "[tipo de texto: ejercicio | placeholder | botón | mensaje | pantalla | error | descripción]"
user-invocable: true
tools: Read, Grep
model: sonnet
---

# Skill: Tono Rentabilista — El cerebro de contenido de Rentabilismo Academy

## Cuándo se activa
Siempre que Claude Code necesite escribir CUALQUIER texto que verá el usuario final:
- Instrucciones de ejercicios
- Placeholders de campos
- Textos de botones
- Mensajes de error o éxito
- Pantallas de cierre o transición
- Descripciones de módulos o lecciones
- Copy de cualquier elemento de la interfaz
- Mensajes de confirmación, alertas, tooltips

## QUIÉN ES EL USUARIO (Avatar)

### Perfil demográfico
- Empresario/a de habla hispana
- Autónomo solo, o pyme de 1 a 15-20 empleados
- Negocios locales y físicos: restaurantes, clínicas, gimnasios, empresas de limpieza, tiendas, talleres, despachos, consultas
- También negocios digitales pequeños, pero sobre todo físicos
- Edad: 30-55 años (mayoría 35-50)
- Formación empresarial: escasa o nula. Muchos heredaron el negocio, lo montaron por impulso, o aprendieron sobre la marcha

### Situación real
- Trabaja más horas que cualquier empleado suyo
- No sabe cuánto gana de verdad (confunde facturación con beneficio)
- Siente que su negocio depende al 100% de él/ella
- No tiene tiempo para pensar porque está siempre apagando fuegos
- Tiene miedo a subir precios, a delegar, a cambiar cosas
- Muchos están solos (sin equipo) y no saben cómo salir de ahí
- Lleva meses (o años) sabiendo que algo tiene que cambiar pero no sabe por dónde

### Cómo piensa
- No quiere más teoría. Quiere soluciones prácticas para SU negocio
- Desconfía de "gurús", cursos online y promesas de éxito fácil
- Necesita sentir que le entienden ANTES de confiar
- Compra por dolor, no por aspiración
- Valora la honestidad y la cercanía por encima de la profesionalidad fría
- Si siente que le están vendiendo, se cierra
- Si siente que le entienden, se abre

### Cómo compra
- Necesita ver que quien le habla ha pasado por lo mismo
- Necesita entender QUÉ va a conseguir (no qué incluye el programa)
- El precio (799€) es significativo para él — no es un gasto impulsivo
- Necesita sentir urgencia real (no artificial) para decidirse
- Si siente que es "un curso más", no compra. Si siente que es "alguien que me va a ayudar de verdad", sí

## LOS 8 DOLORES (referencia rápida)

| # | Dolor | Frase del avatar |
|---|-------|-----------------|
| 1 | Trabaja más, gana igual | "No paro y no llego a fin de mes" |
| 2 | No sabe cuánto gana | "Algo queda, pero no sé cuánto" |
| 3 | No le da la vida | "Estoy agotado y no veo resultados" |
| 4 | Precios a ojo | "Si subo precios, pierdo clientes" |
| 5 | Sin método | "Hago lo de siempre porque no sé qué más hacer" |
| 6 | Sin datos | "Decido a ojo y espero que salga bien" |
| 7 | No comunica su valor | "No sé explicar por qué deberían elegirme" |
| 8 | Siente que podría más | "Sé que hay algo más, pero no sé cómo llegar" |

## CÓMO SE ESCRIBE EN RENTABILISMO

### Los 5 pilares
1. **Verdad sin anestesia** — Si algo no funciona, se dice. Con respeto, pero sin rodeos.
2. **Cercanía absoluta** — Como alguien que se sienta enfrente con un café. Sin disfraz.
3. **Emoción con propósito** — Cada frase mueve una fibra o un paso. Nunca drama vacío.
4. **Acción constante** — Cada párrafo empuja a decidir algo.
5. **Claridad brutal** — No adornar. Di las cosas como son.

### SÍ usar
- Segunda persona siempre: tú, tu negocio, te pasa, te frustra
- Frases cortas, respirables, sin relleno
- Verbos que mueven: consigue, aclara, aplica, corta, mejora, mide, define, ajusta
- "Cuando" en lugar de "si" (da certeza)
- "Porque" y "por qué" (la gente quiere razones)
- Ritmo: frase que golpea → frase que calma

### NUNCA usar
- "nosotros", "nuestro equipo"
- Verbos débiles: aprende, compra, preocúpate
- **PALABRAS PROHIBIDAS:** estrategia, plataforma, metodología, propuesta de valor, innovación, empoderamiento, motivación, mindset, crecimiento exponencial, éxito, aprendizaje, aprenderás, descubrirás
- Frases largas o neutras
- Empezar con contexto — empieza siempre con verdad
- Emojis (NUNCA en la plataforma — usar lucide-react para iconos)

### Estructura de cualquier texto Rentabilista
```
1. Golpe inicial (emoción)     — La frase que agarra
2. Reconocimiento (empatía)    — "Te entiendo"
3. Cambio de enfoque (claridad) — "El problema no es lo que crees"
4. Solución o método (acción)   — Paso concreto
5. Cierre (impacto)            — Frase que retumba
```

No todos los textos necesitan los 5 pasos. Un botón solo necesita el cierre.
Un placeholder solo necesita el golpe. Una pantalla de error necesita empatía + acción.

## EJEMPLOS POR TIPO DE TEXTO

### Botones
```
MAL:  "Continuar" / "Siguiente paso" / "Enviar respuestas"
BIEN: "Completar lección" / "Ver mi diagnóstico" / "Siguiente: tus clientes"
```

### Placeholders de ejercicios
```
MAL:  "Escribe tu respuesta aquí..."
BIEN: "Lo que más me deja es... / Lo que más tiempo me quita es..."
BIEN: "Mi día empieza a las... y normalmente hago..."
BIEN: "Dentro de dos años quiero..."
```

### Mensajes de éxito
```
MAL:  "¡Lección completada con éxito!"
BIEN: "Lección completada. Cada respuesta cuenta."
BIEN: "Has terminado. Ahora sabes más de tu negocio que ayer."
```

### Mensajes de error
```
MAL:  "Error: no se pudo guardar la respuesta. Inténtelo de nuevo."
BIEN: "Algo falló al guardar. Vuelve a intentarlo. Tu respuesta no se pierde."
```

### Pantalla de lección bloqueada
```
MAL:  "Esta lección está bloqueada. Complete la lección anterior para continuar."
BIEN: "Primero termina la lección anterior. Esto va paso a paso, como tu negocio."
```

### Pantalla de módulo completado
```
MAL:  "¡Felicidades! Has completado el módulo."
BIEN: "Has terminado. Pero esto no se queda aquí — lo que has trabajado se aplica mañana."
```

### Estado vacío (sin datos)
```
MAL:  "No hay datos disponibles."
BIEN: "Todavía no hay nada aquí. Empieza por la primera lección."
```

## FRASES GANCHO DE LA MARCA (usar cuando encaje)
- "No hay milagros, hay método."
- "Hazlo rentable o déjalo tranquilo."
- "No necesitas suerte, necesitas claridad."
- "Tu negocio te está hablando. Escúchalo antes de que te grite."
- "Lo que no mides, lo pierdes."
- "Cuando entiendas esto, dejarás de sobrevivir para empezar a dirigir."

## CHECKLIST ANTES DE ESCRIBIR CUALQUIER TEXTO
- [ ] ¿Está en segunda persona (tú)?
- [ ] ¿Dice la verdad sin rodeos?
- [ ] ¿Provoca acción o reflexión real?
- [ ] ¿Sin palabras de humo / palabras prohibidas?
- [ ] ¿Suena a humano, no a PowerPoint?
- [ ] ¿Sin emojis?
- [ ] ¿El avatar lo entendería a la primera?

## REGLA FINAL
Cuando dudes entre dos textos, elige el más corto, el más directo y el que suene más a
alguien sentado enfrente del empresario con un café. No a una app. No a un chatbot.
A un consultor que ya pasó por lo mismo.
