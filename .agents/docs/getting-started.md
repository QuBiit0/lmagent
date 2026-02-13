# 🚀 Getting Started with LMAgent

Bienvenido a **LMAgent v3.0.3**, el framework que transforma tu IDE en una agencia de desarrollo de software.

## 1. Requisitos Previos
- **Node.js**: v18+ (Requerido para el CLI).
- **IDE**: Cursor, VSCode, Windsurf o cualquier editor que soporte `.cursorrules` o contexto por archivo.
- **LLM**: Una key de OpenAI, Anthropic o Google configurada en tu IDE.

## 2. Instalación e Inicialización

### Opción A: Proyecto Nuevo (Recomendado)
Para empezar un proyecto con toda la estructura lista:

```bash
# 1. Crea tu directorio
mkdir mi-nuevo-proyecto
cd mi-nuevo-proyecto

# 2. Inicializa LMAgent (No requiere instalación global)
npx @qubiit/lmagent@latest init
```

### Opción B: Proyecto Existente
Agrega inteligencia a tu código legacy sin tocar tu código fuente:

```bash
cd mi-proyecto-brownfield
npx @qubiit/lmagent@latest init
```

### ¿Qué acaba de pasar?
El comando `init`:
1. Creó `.agents/` con la estructura de reglas y configuración.
2. Copió `AGENTS.md` (El cerebro central) y `CLAUDE.md` (Contexto para LLMs).
3. Configuró `.gitignore` para no subir archivos basura.

## 3. Instalación de Skills (Bridge)
Para que tu IDE entienda los skills, necesitas instalarlos localmente:

```bash
npx lmagent install
```
Selecciona tu IDE (ej. Cursor) y elige **"Instalación Rápida"**.
Esto creará enlaces simbólicos (o copias) en `.cursor/rules` apuntando a `.agents/skills`.

---

## 4. Tu Primer Flujo de Trabajo

### Paso 1: Define el Proyecto (Memoria)
Edita `.agents/memory/01-project.md`. Dile al agente quién eres y qué construyes.
*Ejemplo:*
> "Este es un SaaS de gestión de gastos para freelancers en Latam."

### Paso 2: Activa un Skill
Abre el chat de tu IDE (Ctrl+L / Cmd+L) y escribe:
> "Hola `/pm`. Lee la memoria del proyecto y ayúdame a crear las historias de usuario para el Login."

El agente detectará `/pm`, leerá las reglas de **Product Manager** y actuará en consecuencia.

### Paso 3: Código
Luego, cambia de sombrero:
> "Gracias PM. Ahora `/dev`, implementa el Login en Next.js siguiendo las historias de usuario."

---

## 5. Comandos Útiles

- `npx lmagent doctor`: Verifica que todo esté bien configurado.
- `npx lmagent update`: Actualiza tus skills a la última versión.
- `npx lmagent validate`: (Para creadores) Valida que tus skills custom sigan el estándar.

## 🔗 Referencias
- [Guía de Uso Completa](usage-guide.md)
- [Índice de Comandos](commands.md)
- [Reglas del Sistema](../rules/00-master.md)
