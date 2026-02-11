# Guía de Uso Completa de LMAgent

Esta guía detalla cómo sacar el máximo provecho al framework LMAgent en tu día a día.

## Flujo de Trabajo Mental

Cuando le pidas algo al agente, sigue este patrón mental para obtener los mejores resultados:

1. **¿QUIÉN debe hacerlo?** → Selecciona la Persona (`/dev`, `/pm`, `/arch`)
2. **¿QUÉ tan complejo es?** → Define el Nivel (0-4)
3. **¿CÓMO debe hacerlo?** → Selecciona un Workflow o Regla

---

## 1. Trabajando con Personas

Las personas no son solo "prompts"; son contextos completos con instrucciones específicas.

### Cómo activarlas
Simplemente menciónalas en el chat o usa su trigger:

> "Actúa como **/product-manager** para analizar este requerimiento."
> "Hola **/arch**, necesito diseñar un nuevo microservicio."

### Cuándo cambiar de persona
Es común cambiar de persona durante una tarea compleja:

1. **Inicio**: `/pm` analiza el pedido y crea User Stories.
2. **Diseño**: `/arch` revisa las stories y define la estructura de DB y API.
3. **Desarrollo**: `/dev` toma el diseño e implementa el código.
4. **Revisión**: `/qa` escribe los tests para validar el código.
5. **Prompting**: `/prompt` ajusta el system prompt del agente creado.
6. **Cierre**: `/tech-writer` actualiza la documentación.

---

## 2. El Sistema de Niveles (The Thinking Process)

El error #1 de los agentes es "correr a escribir código" sin entender el problema. Los niveles fuerzan un momento de planificación.

### Tipos de Niveles

| Nivel | Cuándo usarlo | Comportamiento del Agente |
|-------|---------------|---------------------------|
| **L0 (Trivial)** | Typos, logs, fixes obvios de 1 línea | Ejecuta directo. Sin preámbulos. |
| **L1 (Small)** | Funciones pequeñas, tweaks de UI | Piensa brevemente, confirma, ejecuta. |
| **L2 (Medium)** | Features completos, endpoints nuevos | **STOP & PLAN**. Crea `implementation_plan.md`. Pide OK. |
| **L3 (Complex)** | Refactors grandes, integraciones | Plan extenso. Verifica impactos. Pide revisión de `/arch`. |
| **L4 (Enterprise)** | Migraciones, cambios críticos de seguridad | Plan paranoico. Plan de rollback. Múltiples confirmaciones. |

### Cómo usarlos
Dile al agente explícitamente o deja que él clasifique:
> "Esto es una tarea **Level 2**. Haz un plan primero."

---

## 3. Workflows: Autopistas al Éxito

Los workflows son "recetas" paso a paso para tareas comunes. Garantizan consistencia.

### Workflows más usados

- **/new-feature**: Para crear algo nuevo de punta a punta.
- **/fix**: Para debugging sistemático (no adivinar).
- **/refactor**: Para mejorar código sin romper nada.
- **/test**: Para generar estrategias de testing.

### Cómo invocarlos
> "Usa el workflow **/fix** para arreglar este error en producción."

---

## 4. Reglas y Documentación Continua

LMAgent tiene una "memoria muscular" basada en reglas.

### Reglas Globales (`.agent/rules/`)
Aplican a todos los proyectos. Ej: "Siempre usar English para nombres de variables".

### Reglas de Proyecto (`.agent/rules/project.md`)
Específicas de ESTE proyecto. Ej: "Los endpoints deben empezar con `/api/v1`".

### La Regla de Oro: Documentación Continua
Si el agente o tú descubren algo nuevo (un truco, un bug recurrente, una decisión de diseño), **DEBEN** escribirlo en una nueva regla o actualizar la documentación.

> "Agente, aprendimos que la librería X falla con Y. Crea una regla en `rules/tech-stack.md` para evitar esto en el futuro."

---

## 5. Artefactos (Tu Memoria Externa)

El agente usa archivos Markdown para mantener el contexto entre sesiones.

- **`task.md`**: El estado actual. Qué hicimos, qué falta.
- **`implementation_plan.md`**: El plan detallado (para L2+).
- **`tech_spec.md`**: Especificaciones técnicas complejas.
- **`walkthrough.md`**: Guía visual de lo que se construyó (al final).

**Tip**: Si el agente "olvida" algo, dile que lea los artefactos:
> "Lee `task.md` y dime qué sigue."

---

## FAQ

**Q: El agente se queda atascado en un bucle.**
A: Dile "STOP". Pídele que revise sus últimos pasos, identifique el error y proponga un enfoque alternativo. Cambia a L2 para forzar planificación.

**Q: El agente ignora mis reglas.**
A: Recuérdaselo explícitamente: "Revisa `rules/code-style.md` antes de escribir código". Asegúrate que la regla sea clara y esté en la carpeta correcta.

**Q: ¿Puedo crear mis propias personas?**
A: ¡Sí! Crea un archivo `.md` en `.agent/personas/` siguiendo el formato de los existentes.
