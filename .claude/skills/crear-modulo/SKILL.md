---
name: crear-modulo
description: Implementa un módulo completo de Rentabilismo Academy desde un documento MÓDULO-X-COMPLETO-PARA-PROGRAMAR.md
argument-hint: "[ruta al documento]"
user-invocable: true
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

# Skill: Crear Módulo Completo — Rentabilismo Academy

## Qué hace este skill
Implementa un módulo completo desde un documento MÓDULO-X-COMPLETO-PARA-PROGRAMAR.md.
El documento es la fuente de verdad. NO inventar, NO cambiar, NO añadir nada que no esté en él.

## Paso 0 — Leer el documento
Lee el archivo $0 completo antes de hacer nada. Si no se pasa argumento, busca archivos
que coincidan con el patrón `MODULO-*-COMPLETO-PARA-PROGRAMAR*.md` en la raíz del proyecto.

## Paso 1 — Base de datos (Supabase MCP)
1. Insertar el módulo en la tabla `modules` con los datos exactos de la sección FICHA DE MÓDULO
2. Obtener el UUID del módulo insertado
3. Insertar las lecciones en `lessons` usando ese UUID como `module_id`
4. Para cada lección, obtener su UUID e insertar los ejercicios en `exercises`
5. Los campos `config` van como JSONB — usar el JSON exacto del documento
6. `is_kaizen = true` solo para ejercicios de tipo `kaizen_step`
7. Si el documento indica campos nuevos en `profiles` u otra tabla, ejecutar ALTER TABLE

**Reglas SQL:**
- Usar `INSERT INTO ... VALUES` con los textos EXACTOS del documento
- NO modificar slugs, títulos, descripciones ni frases clave
- `vimeo_id` y `audio_url` van a `null` salvo que el documento indique lo contrario
- Verificar que las inserciones se completaron correctamente

## Paso 2 — Página del módulo
Crear la página en `/app/(dashboard)/modules/[slug]/` siguiendo el patrón existente:
1. Reusar los componentes de `/components/modules/` que ya existen
2. Si el módulo tiene vídeo introductorio (sección VÍDEO DEL MÓDULO), mostrar player o placeholder
3. Lista de lecciones con estado de progreso y acceso secuencial
4. Si hay pantalla de cierre especificada, prepararla como componente

**Reglas de código:**
- Server Components por defecto. `'use client'` solo si es estrictamente necesario
- shadcn/ui para TODOS los componentes de UI
- Textos de interfaz en español — usar exactamente los del documento
- NO usar emojis ni iconos decorativos (solo lucide-react)
- Consultar @CLAUDE.md para reglas de código del proyecto

## Paso 3 — Páginas de lección
Para cada lección, crear página en `/app/(dashboard)/modules/[slug]/[lesson-slug]/`:
1. Título y frase clave
2. Explicación escrita de la lección (texto completo del documento)
3. Placeholder para audio (audio_url null)
4. Renderizado dinámico de ejercicios según su `type`:
   - `open_reflection` → textarea con description como label
   - `text_input` → campos según array "fields" del config
   - `number_input` → campos numéricos según "fields" del config
   - `scale` → slider o input numérico con min/max/labels del config
   - `multiple_choice` → radio buttons con opciones del config
   - `checklist` → checkboxes con items del config
   - `matrix` → tabla con filas/columnas del config
   - `calculator` → campos numéricos + fórmula automática del config
   - `kaizen_step` → bloque visualmente destacado con action_prompt y deadline_label
5. Si un ejercicio tiene `follow_up` condicional, implementar lógica de cliente
6. Botón "Completar lección": guarda respuestas + desbloquea siguiente
7. Navegación anterior/siguiente entre lecciones

## Paso 4 — Verificación
1. `npm run build` — debe compilar sin errores
2. Verificar que las rutas existen y cargan
3. Verificar que los ejercicios renderizan correctamente
4. Verificar que el progreso se guarda

## Paso 5 — Git
1. Toda la implementación en rama `feature/modulo-[slug]`
2. Un commit por paso (DB, páginas módulo, páginas lección, verificación)
3. Push a GitHub

## Reglas inamovibles
- **NUNCA inventar contenido** — si algo no está en el documento, no lo añadas
- **NUNCA cambiar textos** — los textos del documento son sagrados
- **NUNCA añadir features no solicitadas** — si el documento no lo pide, no lo hagas
- Consultar @CLAUDE.md para todas las reglas de código del proyecto
- Si algo no está claro, PARAR y preguntar a Pablo
