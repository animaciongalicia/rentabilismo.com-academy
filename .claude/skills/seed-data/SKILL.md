---
name: seed-data
description: Inserta datos en Supabase desde un documento MÓDULO-X-COMPLETO-PARA-PROGRAMAR.md
argument-hint: "[ruta al documento o 'all' para todos los módulos]"
user-invocable: true
tools: Read, Bash, Grep, Glob
model: sonnet
---

# Skill: Seed Data — Rentabilismo Academy

## Qué hace este skill
Genera y ejecuta el SQL necesario para insertar módulos, lecciones y ejercicios en Supabase
directamente desde los documentos MÓDULO-X-COMPLETO-PARA-PROGRAMAR.md.

## Cuándo usarlo
- Cuando hay un documento nuevo aprobado y quieres insertar los datos sin implementar las páginas
- Cuando necesitas reinsertar datos después de un reset de la base de datos
- Cuando usas el argumento `all` para insertar todos los módulos de una vez

## Paso 1 — Leer el documento
1. Si se pasa ruta: leer ese archivo
2. Si se pasa `all`: buscar todos los `MODULO-*-COMPLETO-PARA-PROGRAMAR*.md`
3. Extraer: ficha de módulo, fichas de lección, ejercicios con JSON

## Paso 2 — Generar SQL

### Orden de inserción (CRÍTICO — respetar dependencias de FK)
1. `modules` → obtener UUID
2. `lessons` → usar module UUID → obtener UUIDs de lecciones
3. `exercises` → usar lesson UUIDs
4. Si hay ALTER TABLE (campos nuevos en profiles, etc.) → ejecutar PRIMERO

### Patrón SQL para módulo
```sql
-- Verificar si ya existe para evitar duplicados
DO $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Verificar si existe
  SELECT id INTO v_module_id FROM modules WHERE slug = '[slug]';
  
  IF v_module_id IS NULL THEN
    INSERT INTO modules (slug, title, description, order_number, is_free, gpt_agent_url)
    VALUES ('[slug]', '[title]', '[description]', [order], [is_free], null)
    RETURNING id INTO v_module_id;
    RAISE NOTICE 'Módulo insertado: % con ID %', '[slug]', v_module_id;
  ELSE
    RAISE NOTICE 'Módulo ya existe: % con ID %', '[slug]', v_module_id;
  END IF;
END $$;
```

### Patrón SQL para lecciones
```sql
DO $$
DECLARE
  v_module_id UUID;
  v_lesson_id UUID;
BEGIN
  SELECT id INTO v_module_id FROM modules WHERE slug = '[módulo-slug]';
  
  -- Lección 1
  INSERT INTO lessons (module_id, title, slug, order_number, frase_clave, audio_url)
  VALUES (v_module_id, '[title]', '[slug]', 1, '[frase]', null)
  ON CONFLICT (module_id, slug) DO NOTHING
  RETURNING id INTO v_lesson_id;
  
  -- Ejercicios de Lección 1
  INSERT INTO exercises (lesson_id, type, title, description, config, order_number, is_kaizen)
  VALUES
    (v_lesson_id, '[type]', '[title]', '[description]', '[config]'::jsonb, 1, false),
    (v_lesson_id, '[type]', '[title]', '[description]', '[config]'::jsonb, 2, false),
    ...
    (v_lesson_id, 'kaizen_step', '[title]', '[description]', '[config]'::jsonb, [N], true);
    
  -- Repetir para cada lección...
END $$;
```

## Paso 3 — Ejecutar SQL
1. Ejecutar via Supabase MCP si disponible
2. Si MCP no disponible, generar archivo `.sql` y dar instrucciones a Pablo para ejecutar en SQL Editor
3. NUNCA ejecutar SQL en la terminal del Mac

## Paso 4 — Verificar
```sql
-- Verificar módulo
SELECT id, slug, title FROM modules WHERE slug = '[slug]';

-- Verificar lecciones
SELECT id, title, order_number FROM lessons WHERE module_id = '[uuid]' ORDER BY order_number;

-- Verificar ejercicios por lección
SELECT e.title, e.type, e.is_kaizen, l.title as leccion
FROM exercises e JOIN lessons l ON e.lesson_id = l.id
WHERE l.module_id = '[uuid]'
ORDER BY l.order_number, e.order_number;
```

Mostrar resumen:
```
SEED DATA: [nombre del módulo]
✅ Módulo: [slug] — insertado
✅ Lecciones: [N] insertadas
✅ Ejercicios: [N] insertados ([N] kaizen_step)
```

## Reglas inamovibles
- Textos EXACTOS del documento — NO cambiar nada
- JSON de config EXACTOS — NO modificar estructura
- Usar ON CONFLICT para evitar duplicados en re-ejecuciones
- SQL va en Supabase SQL Editor o via MCP, NUNCA en terminal del Mac
- Verificar siempre después de insertar
