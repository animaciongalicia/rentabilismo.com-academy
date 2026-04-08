---
name: crear-leccion
description: Implementa o modifica una lección individual de Rentabilismo Academy
argument-hint: "[módulo-slug] [lección-número o slug]"
user-invocable: true
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

# Skill: Crear/Modificar Lección — Rentabilismo Academy

## Qué hace este skill
Implementa o modifica una lección individual sin necesidad de rehacer el módulo entero.
Útil para añadir lecciones nuevas, corregir ejercicios o actualizar textos.

## Paso 0 — Identificar contexto
1. Leer el argumento: módulo-slug + lección (número o slug)
2. Buscar el documento MÓDULO-X-COMPLETO del módulo correspondiente
3. Localizar la ficha de la lección dentro del documento
4. Si no hay documento, pedir a Pablo la ficha de lección con la estructura estándar

## Estructura estándar de una lección
Cada lección tiene exactamente estos elementos (en este orden):

```
| Campo       | Valor                    |
|-------------|--------------------------|
| order_number | [N]                     |
| title        | [título exacto]         |
| slug         | [slug-del-titulo]       |
| frase_clave  | [frase en tono Rentabilista] |
| audio_url    | null (PENDIENTE)        |

Explicación de la lección (300-400 palabras, tono Rentabilista)

Ejercicio X.1 — [título]  (JSON con type, config, etc.)
Ejercicio X.2 — [título]  (JSON con type, config, etc.)
...
Paso Mejora — [título]    (JSON con type kaizen_step, siempre el último)
```

## Paso 1 — Base de datos
1. Si es lección nueva: INSERT en `lessons` con el module_id correcto
2. Si es modificación: UPDATE de los campos que cambien
3. Insertar/actualizar ejercicios en `exercises` con los JSON exactos del documento
4. El paso mejora (kaizen_step) siempre es el último ejercicio (order_number más alto)

## Paso 2 — Página de lección
1. Crear/modificar página en `/app/(dashboard)/modules/[módulo-slug]/[lección-slug]/`
2. Seguir el patrón de las lecciones existentes del mismo módulo
3. Explicación escrita completa + placeholder audio + ejercicios dinámicos + paso mejora
4. Si hay ejercicios condicionales (follow_up), implementar lógica de cliente

## Paso 3 — Verificación
1. La lección carga sin errores
2. Los ejercicios renderizan correctamente según su type
3. Las respuestas se guardan en question_responses
4. La navegación anterior/siguiente funciona
5. El progreso se actualiza al completar

## Paso 4 — Git
- Commit en la rama activa con mensaje descriptivo
- Si no hay rama activa, crear `feature/leccion-[slug]`

## Tipos de ejercicio disponibles
| Tipo | Renderiza como |
|------|----------------|
| text_input | Campos de texto según "fields" del config |
| number_input | Campos numéricos según "fields" del config |
| scale | Slider o input con min/max del config |
| multiple_choice | Radio buttons con opciones del config |
| checklist | Checkboxes con items del config |
| matrix | Tabla con filas/columnas del config |
| calculator | Campos numéricos + fórmula del config |
| open_reflection | Textarea con placeholder y min_chars del config |
| kaizen_step | Bloque destacado con action_prompt y deadline_label |

## Reglas inamovibles
- Textos exactos del documento — NO inventar, NO cambiar
- shadcn/ui para componentes de UI
- Textos de interfaz en español
- Consultar @CLAUDE.md
