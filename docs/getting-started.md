# Guía de Inicio Rápido (Getting Started)

Bienvenido a **LMAgent**, tu framework para desarrollo asistido por IA. Esta guía te llevará desde cero hasta estar productivo con tus agentes.

## 1. Instalación

### Requisitos previos
- Python 3.10+
- Git
- Un IDE agéntico (Antigravity, Cursor, Windsurf, VS Code + Claude/Copilot)
- API Keys para tus LLMs (OpenAI, Anthropic, Google)

### Instalación del CLI
```bash
# Clona tu repositorio o ve a tu carpeta de proyecto
pip install -e .
```

### Inicialización en un Proyecto Nuevo
```bash
mkdir mi-nuevo-proyecto
cd mi-nuevo-proyecto
lmagent init
```
Esto creará la carpeta `.agent/` con toda la estructura necesaria.

## 2. Configuración Básica

1. **Variables de Entorno**:
   Copia el ejemplo y edita tus claves:
   ```bash
   cp .env.example .env
   # Edita .env con tus API KEYS
   ```

2. **Verifica la instalación**:
   ```bash
   lmagent doctor
   ```
   Deberías ver "✨ All checks passed!".

## 3. Tu Primera Tarea con el Agente

LMAgent está diseñado para trabajar **contigo** en el chat de tu IDE.

### Paso 1: Entender el Contexto
Abre el chat y dile al agente:
> "Hola, soy nuevo en este proyecto. ¿Puedes explicarme la estructura y qué personas tienes disponibles?"

### Paso 2: Activar una Persona
Si vas a trabajar en backend, activa al experto:
> "Actúa como @Backend Engineer /dev"

El agente adoptará el rol, conocimientos y reglas de esa persona.

### Paso 3: Ejecutar un Workflow
Vamos a crear una automatización simple. Dile al agente:
> "Quiero crear una nueva automatización de n8n. Usa el workflow /new-automation"

El agente:
1. Leerá `workflows/new-automation.md`
2. Te guiará paso a paso
3. Creará los archivos necesarios

## 4. Conceptos Clave

### 🎭 Personas
Son roles especializados que el agente adopta. Cada uno tiene sus propias instrucciones y "superpoderes".
- **/pm** - Product Manager (Define QUÉ hacer)
- **/arch** - Architect (Define CÓMO hacerlo)
- **/dev** - Backend Dev (Escribe el código)
- **/qa** - QA Engineer (Escribe los tests)

### 📏 Niveles (Levels)
Determinan cuánto "pensar" antes de "hacer".
- **Level 0**: Trivial. Hazlo ya.
- **Level 2**: Medium. Crea un plan (`implementation_plan.md`) y espera mi OK.
- **Level 4**: Enterprise. Plan muy detallado, revisión de seguridad, aprobación humana obligatoria.

### 📜 Reglas Proactivas
El agente lee tus reglas en `.agent/rules/`. Si rompes una regla (ej. "No usar prints"), el agente te corregirá o lo arreglará automáticamente.

## 5. Siguientes Pasos

- Lee la [Guía de Uso Completa](usage-guide.md) para dominar el framework.
- Explora las [Personas](../personas/) disponibles.
- Revisa los [Workflows](../workflows/) para automatizar tus tareas repetitivas.
