# WORKFLOW EJECUTOR-AUDITOR — Rentabilismo Academy

> **Qué es esto:** Protocolo de trabajo con Claude Code usando dos agentes separados
> (Ejecutor + Auditor) para evitar parcheo y desviaciones del plan original.
>
> **Quién lo usa:** Pablo (no programador) desde la terminal de Mac.
>
> **Versión:** v1 — Abril 2026

---

## PRINCIPIO FUNDAMENTAL

**Una sesión = una tarea = un agente = un commit.**

Nunca corrijas un error en la misma sesión que lo causó.
Nunca mezcles ejecución y auditoría en la misma terminal.

---

## 1. EL FLUJO COMPLETO (paso a paso)

```
┌─────────────────────────────────────────────┐
│  PABLO decide la tarea                      │
│  (con ficha aprobada / instrucción clara)   │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  TERMINAL 1 — EJECUTOR                      │
│  Claude Code recibe UNA tarea acotada       │
│  Ejecuta → Hace commit → Sesión termina     │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  TERMINAL 2 — AUDITOR                       │
│  Claude Code nuevo, contexto limpio         │
│  Lee directrices + revisa lo implementado   │
│  Genera INFORME (no corrige nada)           │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  PABLO lee el informe del Auditor           │
│  Decide qué corregir                        │
│  Abre TERMINAL 3 con correcciones puntuales │
└─────────────────────────────────────────────┘
```

---

## 2. CÓMO ABRIR CADA AGENTE

### Terminal 1 — El Ejecutor

```bash
# Abrir terminal en Mac (Cmd + Espacio → "Terminal")
# Navegar al proyecto:
cd ~/ruta-a-tu-proyecto/rentabilismo.com-academy

# Iniciar Claude Code:
claude

# Pulsar Shift+Tab para activar Plan Mode
# Pegar el prompt de la tarea (ver sección 4)
# Aprobar el plan
# Dejar que ejecute
# Cuando termine: /clear y cerrar
```

### Terminal 2 — El Auditor

```bash
# Abrir OTRA ventana de terminal (Cmd + N en Terminal)
# IMPORTANTE: Esperar a que el Ejecutor haya terminado y hecho commit

cd ~/ruta-a-tu-proyecto/rentabilismo.com-academy

# Asegurarte de tener los últimos cambios:
git pull

# Iniciar Claude Code:
claude

# Pegar el prompt de auditoría (ver sección 5)
# El Auditor genera un informe — NO toca código
# Cuando termine: /clear y cerrar
```

### Terminal 3 — Correcciones (solo si el Auditor encontró problemas)

```bash
cd ~/ruta-a-tu-proyecto/rentabilismo.com-academy
claude

# Pegar las correcciones puntuales del informe del Auditor
# Una corrección por sesión si son complejas
# /clear al terminar
```

---

## 3. REGLAS DE ORO

### Para el Ejecutor
- Recibe UNA tarea concreta (nunca "implementa todo")
- Usa Plan Mode (Shift+Tab) SIEMPRE antes de ejecutar
- Hace UN commit al terminar con mensaje descriptivo
- Duración máxima: 45-60 minutos. Si no termina, divide la tarea
- NO le pidas que corrija sus propios errores en la misma sesión

### Para el Auditor
- NUNCA modifica código. Solo lee e informa
- Siempre arranca con contexto limpio (nueva terminal, nueva sesión)
- Compara SIEMPRE contra la fuente de verdad (fichas, CLAUDE.md, skills)
- Su informe tiene formato estándar (ver sección 6)
- Si encuentra un error, describe QUÉ está mal y QUÉ debería ser, pero NO lo arregla

### Para Pablo
- Tú decides qué se corrige y en qué orden
- Nunca dejes que una sesión pase de 15 prompts sin /clear
- Si algo se complica: para, cierra, abre nueva sesión con contexto fresco
- Las fichas y documentos aprobados son la ley. Si Claude se desvía, el Auditor lo detecta

---

## 4. PROMPTS PARA EL EJECUTOR

### Prompt base — Implementar un módulo

```
Lee el skill /mnt/skills/user/crear-modulo/SKILL.md antes de empezar.

TAREA: Implementar el Módulo [X] - [Nombre] de Rentabilismo Academy.

FUENTE DE VERDAD:
- Contenido: [nombre del archivo .md del módulo]
- Arquitectura: CLAUDE.md
- Tono: RENTABILISMO-MASTER-v2.md

REGLAS:
- Sigue EXACTAMENTE el contenido del documento fuente
- NO inventes textos, ejercicios ni instrucciones
- NO añadas funcionalidades que no estén en el documento
- Haz commit al terminar con mensaje: "feat: implementar módulo [X] - [nombre]"

Empieza con el plan. No ejecutes hasta que yo lo apruebe.
```

### Prompt base — Implementar funcionalidad (pago, auth, etc.)

```
Lee CLAUDE.md antes de empezar.

TAREA: [Descripción concreta de la funcionalidad]

FUENTE DE VERDAD:
- Arquitectura: CLAUDE.md
- [Documento específico si aplica]

REGLAS:
- Sigue la arquitectura definida en CLAUDE.md
- TypeScript estricto, sin 'any'
- Server Components por defecto, 'use client' solo cuando sea necesario
- Haz commit al terminar con mensaje descriptivo

Empieza con el plan. No ejecutes hasta que yo lo apruebe.
```

### Prompt base — Corrección puntual (post-auditoría)

```
Lee CLAUDE.md antes de empezar.

CORRECCIÓN del informe de auditoría:

PROBLEMA: [Copiar la descripción del problema del informe del Auditor]
DEBERÍA SER: [Copiar lo que dice el Auditor que debería ser]
ARCHIVO(S): [Si el Auditor los menciona]

Corrige SOLO este problema. No toques nada más.
Haz commit con mensaje: "fix: [descripción breve del fix]"
```

---

## 5. PROMPTS PARA EL AUDITOR

### Prompt base — Auditar un módulo

```
ERES EL AUDITOR. Tu trabajo es VERIFICAR, no corregir.

Lee estos archivos primero:
1. CLAUDE.md (arquitectura y reglas)
2. RENTABILISMO-MASTER-v2.md (tono y contenido)
3. El skill /mnt/skills/user/verificar-modulo/SKILL.md (checklist)
4. [Nombre del archivo fuente del módulo .md]

TAREA: Auditar el Módulo [X] - [Nombre]

VERIFICA:
1. BASE DE DATOS: ¿Los datos en Supabase coinciden con el documento fuente?
2. PÁGINAS: ¿Las rutas existen y compilan sin error?
3. CONTENIDO: ¿Los textos son EXACTOS al documento fuente? ¿Hay algo inventado?
4. EJERCICIOS: ¿Los tipos, configuración y orden son correctos?
5. PROGRESO: ¿El guardado y la navegación funcionan según CLAUDE.md?
6. ACCESO: ¿Las restricciones de pago funcionan?

REGLAS:
- NO modifiques ningún archivo
- NO hagas commits
- NO ejecutes comandos que cambien el estado del proyecto
- Solo puedes: leer archivos, hacer consultas SELECT a Supabase, ejecutar npm run build
- Genera un INFORME con el formato estándar (ver abajo)

FORMATO DEL INFORME:
```
AUDITORÍA MÓDULO [X] — [Nombre]
Fecha: [fecha]
Auditor: Claude Code (sesión limpia)

═══ RESUMEN ═══
✅ Correcto: X items
❌ Errores: X items
⚠️ Verificación manual necesaria: X items

═══ DETALLE DE ERRORES ═══
[Para cada error:]
ERROR [N]: [título corto]
- Qué encontré: [descripción de lo que está implementado]
- Qué debería ser: [descripción de lo correcto según el documento fuente]
- Archivo(s): [ruta del archivo afectado]
- Severidad: CRÍTICO / IMPORTANTE / MENOR

═══ VERIFICACIÓN MANUAL (Pablo) ═══
[Cosas que solo Pablo puede verificar en el navegador/dashboard]

═══ LO QUE ESTÁ BIEN ═══
[Lista de lo que pasó la verificación]
```
```

### Prompt base — Auditar funcionalidad (pago, auth, etc.)

```
ERES EL AUDITOR. Tu trabajo es VERIFICAR, no corregir.

Lee CLAUDE.md primero.

TAREA: Auditar la funcionalidad de [nombre de la funcionalidad]

VERIFICA según la arquitectura definida en CLAUDE.md:
1. ¿El código sigue las reglas de código? (TypeScript estricto, Server Components, etc.)
2. ¿La lógica de negocio es correcta? (precios, accesos, flujos)
3. ¿Hay errores de seguridad? (Stripe keys en frontend, RLS faltante, etc.)
4. ¿Los archivos están en las rutas correctas según la arquitectura?
5. ¿Hay código muerto, duplicado o que contradiga CLAUDE.md?

REGLAS:
- NO modifiques ningún archivo
- NO hagas commits
- Genera un INFORME con el formato estándar
```

### Prompt base — Auditoría general del proyecto

```
ERES EL AUDITOR. Tu trabajo es VERIFICAR, no corregir.

Lee estos archivos:
1. CLAUDE.md
2. RENTABILISMO-MASTER-v2.md

TAREA: Auditoría general del estado del proyecto Rentabilismo Academy.

VERIFICA:
1. ¿El proyecto compila sin errores? (npm run build)
2. ¿Hay errores de TypeScript? (npm run lint)
3. ¿La estructura de carpetas sigue la arquitectura de CLAUDE.md?
4. ¿Hay archivos huérfanos o rutas rotas?
5. ¿Las variables de entorno necesarias están documentadas?
6. ¿Hay código que contradiga las reglas de CLAUDE.md?

NO modifiques nada. Genera informe con formato estándar.
```

---

## 6. CUÁNDO USAR CADA TIPO DE AUDITORÍA

| Acabas de...                        | Usa este prompt de auditoría     |
|--------------------------------------|----------------------------------|
| Implementar un módulo nuevo          | Auditar un módulo                |
| Implementar pago/auth/perfil         | Auditar funcionalidad            |
| Hacer varias correcciones seguidas   | Auditoría general                |
| Llevar 3+ sesiones sin auditar       | Auditoría general                |
| Antes de hacer deploy a producción   | Auditoría general                |

---

## 7. SEÑALES DE ALARMA (para Pablo)

Si ves alguna de estas señales, PARA y abre una sesión nueva:

- Claude Code empieza a dar explicaciones largas en vez de ejecutar
- El plan tiene más de 8-10 pasos
- Claude Code dice "voy a ajustar" o "voy a refactorizar" algo que no le pediste
- Lleva más de 15 prompts en la misma sesión
- Empieza a deshacer cosas que hizo antes en la misma sesión
- Propone "una solución alternativa" a algo que ya estaba definido
- Los errores de compilación aumentan en vez de disminuir

**En cualquiera de estos casos:**
1. Para la sesión (/clear)
2. Haz commit de lo que esté funcional
3. Abre el Auditor para ver el estado real
4. Con el informe del Auditor, decide los siguientes pasos

---

## 8. EJEMPLO REAL — Implementar Módulo 3

### Paso 1: Pablo prepara
- Tiene el archivo `MODULO-3-COMPLETO-PARA-PROGRAMAR.md` aprobado
- Lo sube al proyecto (o lo tiene en el knowledge del proyecto)

### Paso 2: Ejecutor (Terminal 1)
```
Lee el skill /mnt/skills/user/crear-modulo/SKILL.md antes de empezar.

TAREA: Implementar el Módulo 3 - Finanzas de Rentabilismo Academy.

FUENTE DE VERDAD:
- Contenido: MODULO-3-COMPLETO-PARA-PROGRAMAR.md
- Arquitectura: CLAUDE.md
- Tono: RENTABILISMO-MASTER-v2.md

Empieza con el plan. No ejecutes hasta que yo lo apruebe.
```

Pablo aprueba el plan. El Ejecutor implementa. Hace commit. Pablo cierra con /clear.

### Paso 3: Auditor (Terminal 2)
```
ERES EL AUDITOR. Tu trabajo es VERIFICAR, no corregir.

Lee estos archivos primero:
1. CLAUDE.md
2. RENTABILISMO-MASTER-v2.md
3. /mnt/skills/user/verificar-modulo/SKILL.md
4. MODULO-3-COMPLETO-PARA-PROGRAMAR.md

TAREA: Auditar el Módulo 3 - Finanzas.
NO modifiques nada. Genera informe con formato estándar.
```

### Paso 4: Pablo lee el informe
```
AUDITORÍA MÓDULO 3 — Finanzas
✅ Correcto: 18 items
❌ Errores: 2 items
⚠️ Verificación manual: 3 items

ERROR 1: Ejercicio 3.2 tiene tipo "text_input" pero el documento dice "number_input"
- Archivo: seed del módulo 3 en Supabase
- Severidad: IMPORTANTE

ERROR 2: La frase clave de la lección 4 no coincide con el documento
- Encontré: "Controla tu flujo de caja"
- Debería ser: "Tu caja es tu oxígeno"
- Severidad: MENOR
```

### Paso 5: Corrección (Terminal 3)
```
CORRECCIÓN del informe de auditoría:

PROBLEMA 1: Ejercicio 3.2 tiene tipo "text_input" pero debería ser "number_input"
PROBLEMA 2: Frase clave de lección 4 dice "Controla tu flujo de caja", debería ser "Tu caja es tu oxígeno"

Corrige SOLO estos dos problemas. No toques nada más.
Commit: "fix: corregir tipo ejercicio 3.2 y frase clave lección 4 módulo finanzas"
```

---

## 9. NOTAS TÉCNICAS

### ¿Puedo tener dos Claude Code abiertos a la vez?
Sí, en terminales separadas. Pero NO los uses sobre los mismos archivos simultáneamente.
El flujo correcto es: Ejecutor termina → commit → Auditor empieza.

### ¿El Auditor puede usar Supabase MCP?
Sí, para hacer consultas SELECT (lectura). NUNCA para INSERT, UPDATE o DELETE.

### ¿Qué pasa si el Auditor encuentra muchos errores?
Prioriza por severidad (CRÍTICO > IMPORTANTE > MENOR).
Corrige los críticos primero, cada uno en una sesión limpia.
Después vuelve a auditar.

### ¿Cada cuánto debo auditar?
- Después de cada módulo nuevo: SIEMPRE
- Después de cada funcionalidad sensible (pago, auth): SIEMPRE
- Como rutina general: cada 3-5 sesiones de ejecución
- Antes de cualquier deploy: SIEMPRE
