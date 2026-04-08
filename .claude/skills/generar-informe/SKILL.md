---
name: generar-informe
description: Crea o modifica informes PDF/HTML de Rentabilismo Academy con CSS de impresión correcto
argument-hint: "[tipo de informe: diagnostico | progreso | final]"
user-invocable: true
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

# Skill: Generar Informe PDF/HTML — Rentabilismo Academy

## Qué hace este skill
Crea informes que se muestran como HTML en la plataforma y se pueden descargar/imprimir como PDF.
El método es SIEMPRE HTML + Tailwind + CSS de impresión. NUNCA usar reportlab, pypdf ni generación directa.

## Tipos de informe
| Tipo | Trigger | Fuente de datos |
|------|---------|-----------------|
| diagnostico_inicial | Completa Módulo 1 | Módulo 0 (mentalidad) + Módulo 1 (diagnóstico) |
| progreso | 5 módulos completados | Respuestas de 5 módulos + termómetro |
| final | 10 módulos completados | Todo + termómetro comparativo + plan 90 días |

## Arquitectura técnica

### Ruta API
```
/app/api/informe/[tipo]/[userId]/route.tsx
```
- GET → devuelve HTML renderizado (para ver en plataforma)
- GET con ?format=pdf → devuelve PDF para descarga
- El PDF se genera con Puppeteer o html-pdf desde el mismo HTML

### Ruta de visualización
```
/app/(dashboard)/informes/[tipo]/page.tsx
```
- Muestra el informe embebido en la plataforma
- Botón "Descargar PDF" / "Imprimir"

## CSS de impresión — REGLAS OBLIGATORIAS

```css
@media print {
  /* Cada sección del informe en página nueva */
  .report-section {
    page-break-before: always;
  }
  
  /* Primera sección no necesita salto */
  .report-section:first-child {
    page-break-before: avoid;
  }
  
  /* Nunca cortar un bloque de respuesta por la mitad */
  .response-block {
    page-break-inside: avoid;
  }
  
  /* Nunca cortar una tabla por la mitad */
  table {
    page-break-inside: avoid;
  }
  
  /* Encabezado en cada página */
  .report-header {
    position: running(header);
  }
  
  @page {
    margin: 2cm;
    @top-center {
      content: element(header);
    }
  }
  
  /* Ocultar botones y navegación al imprimir */
  .no-print {
    display: none !important;
  }
}
```

## Encabezado del informe (en cada página)
| Elemento | Fuente de datos |
|----------|-----------------|
| Logo Rentabilismo | Asset estático `/public/logo-rentabilismo.png` |
| Título del informe | Según tipo: "Informe de Diagnóstico Inicial", etc. |
| Nombre del usuario | `profiles.full_name` |
| Nombre de la empresa | `profiles.business_name` (si existe) |
| Sector | `profiles.business_sector` (si existe) |
| Fecha de generación | Fecha actual formateada: "1 de abril de 2026" |

## Estructura visual del informe
1. **Portada** — Logo grande + título + datos usuario + frase de apertura
2. **Secciones** — Una por bloque temático, con:
   - Título de sección con color de acento
   - Datos numéricos destacados (tamaño grande, negrita)
   - Textos del usuario en bloques con fondo suave
   - Indicadores visuales (barras, escalas) donde aplique
3. **Cierre** — Prioridad destacada + frase final + siguiente paso

## Colores del informe
- Fondo: blanco (#FFFFFF)
- Texto principal: casi negro (#1A1A1A)
- Acento principal: rojo Rentabilismo (#FF4D6A)
- Acento secundario: dorado (#D4A574)
- Bloques de respuesta: fondo gris muy claro (#F5F5F5)
- Alertas/áreas críticas: fondo naranja claro (#FFF3E0)

## Cómo obtener los datos
1. Consultar `question_responses` filtrado por user_id y exercise_id
2. Los ejercicios marcados con `save_for_report: true` en su config son los que van al informe
3. El campo `report_section` del config indica en qué sección del informe va cada respuesta
4. Para datos de módulos anteriores, consultar por module_id + user_id

## Guardar el informe
```sql
INSERT INTO evolution_reports (user_id, type, generated_at, data)
VALUES ([user_id], '[tipo]', NOW(), '[JSON con datos]'::jsonb);
```
- Solo se genera UNA VEZ por usuario por tipo
- Si ya existe, no regenerar (mostrar el existente)
- El usuario puede ver/descargar su informe desde el dashboard en cualquier momento

## Reglas inamovibles
- HTML + Tailwind + CSS de impresión. NUNCA generación directa de PDF
- El informe debe verse bien en pantalla Y al imprimir/descargar
- Encabezado con datos del usuario en cada página
- Secciones que no se corten por la mitad
- Textos del usuario tal cual los escribió, sin editar
- Consultar @CLAUDE.md para reglas de código
