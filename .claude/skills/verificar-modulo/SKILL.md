---
name: verificar-modulo
description: Checklist de calidad post-implementación de un módulo de Rentabilismo Academy
argument-hint: "[módulo-slug]"
user-invocable: true
tools: Read, Bash, Grep, Glob
model: sonnet
---

# Skill: Verificar Módulo — Rentabilismo Academy

## Qué hace este skill
Ejecuta un checklist completo de calidad después de implementar un módulo.
Verifica base de datos, páginas, ejercicios, progreso, navegación y contenido.

## Paso 1 — Verificar base de datos

### Módulo
```sql
SELECT id, slug, title, description, order_number, is_free
FROM modules WHERE slug = '[módulo-slug]';
```
- [ ] El módulo existe
- [ ] El slug coincide con el documento
- [ ] El título coincide exactamente con el documento
- [ ] La descripción coincide exactamente
- [ ] order_number es correcto
- [ ] is_free es correcto (false para módulos de pago)

### Lecciones
```sql
SELECT id, title, slug, order_number, frase_clave, audio_url
FROM lessons WHERE module_id = '[module_uuid]' ORDER BY order_number;
```
- [ ] Hay el número correcto de lecciones (normalmente 4)
- [ ] Los títulos coinciden exactamente con el documento
- [ ] Los slugs coinciden
- [ ] Las frases clave coinciden
- [ ] El order_number es secuencial (1, 2, 3, 4)

### Ejercicios
```sql
SELECT e.id, e.type, e.title, e.order_number, e.is_kaizen, l.title as leccion
FROM exercises e JOIN lessons l ON e.lesson_id = l.id
WHERE l.module_id = '[module_uuid]' ORDER BY l.order_number, e.order_number;
```
- [ ] Cada lección tiene el número correcto de ejercicios
- [ ] Los tipos coinciden con el documento (open_reflection, text_input, scale, etc.)
- [ ] Los títulos coinciden exactamente
- [ ] Solo los kaizen_step tienen is_kaizen = true
- [ ] El kaizen_step es siempre el último ejercicio de cada lección
- [ ] Los config JSON son válidos y coinciden con el documento

## Paso 2 — Verificar páginas

### Compilación
```bash
npm run build
```
- [ ] Compila sin errores
- [ ] Sin warnings de TypeScript

### Rutas
- [ ] `/app/(dashboard)/modules/[slug]/` carga sin error
- [ ] Cada `/app/(dashboard)/modules/[slug]/[lesson-slug]/` carga sin error
- [ ] La navegación entre lecciones funciona (anterior/siguiente)

### Contenido visual
- [ ] El título del módulo se muestra correctamente
- [ ] La descripción del módulo se muestra
- [ ] Si hay vídeo del módulo, muestra player o placeholder elegante
- [ ] Cada lección muestra su frase clave
- [ ] La explicación escrita de cada lección se muestra completa
- [ ] Placeholder de audio cuando audio_url es null (elegante, sin error)

## Paso 3 — Verificar ejercicios

Para cada tipo de ejercicio presente en el módulo:
- [ ] `open_reflection` → textarea renderiza con placeholder y min_chars
- [ ] `text_input` → campos renderizan según fields del config
- [ ] `number_input` → campos numéricos renderizan según fields del config
- [ ] `scale` → slider/input con min, max y labels correctos
- [ ] `multiple_choice` → opciones renderizan correctamente
- [ ] `checklist` → checkboxes con items correctos
- [ ] `kaizen_step` → bloque visualmente destacado con action_prompt y deadline_label
- [ ] Ejercicios condicionales (follow_up) → lógica funciona según opción elegida

## Paso 4 — Verificar progreso y guardado

- [ ] Al completar un ejercicio, la respuesta se guarda en `question_responses`
- [ ] Al completar una lección, `user_progress` se actualiza
- [ ] La siguiente lección se desbloquea al completar la anterior
- [ ] La barra de progreso del módulo se actualiza
- [ ] Si hay pantalla de cierre del módulo, se muestra al completar todas las lecciones

## Paso 5 — Verificar coherencia de contenido

Comparar textos de la plataforma con el documento fuente:
- [ ] Los textos de las explicaciones coinciden EXACTAMENTE
- [ ] Las instrucciones de los ejercicios coinciden EXACTAMENTE
- [ ] Las opciones de multiple_choice coinciden
- [ ] Los placeholders coinciden
- [ ] NO hay textos inventados que no estén en el documento

## Paso 6 — Verificar acceso

- [ ] Usuario sin pago NO puede acceder (redirect a pricing o login)
- [ ] Usuario con pago SÍ puede acceder
- [ ] Las lecciones son secuenciales (no se puede saltar)

## Output
Al terminar, generar resumen:
```
VERIFICACIÓN MÓDULO: [nombre]
✅ Pasados: X/Y
❌ Fallidos: [lista de los que fallan]
⚠️ Pendientes de verificar manual: [lo que Pablo debe comprobar en dashboard]
```

Si hay fallos, proponer fix para cada uno.
