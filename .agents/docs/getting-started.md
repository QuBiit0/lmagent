# 🚀 Getting Started with LMAgent

Bienvenido a **LMAgent v3.4.1** — el framework que transforma cualquier agente de IA en una agencia de desarrollo de software completa.

## Requisitos Previos
- **Node.js**: v22+ (requerido para el CLI)
- **Un agente de IA**: Cursor, Claude Code, Windsurf, Gemini CLI, o cualquiera de los [37 agentes soportados](../../README.md#-37-supported-agents)

---

## Instalación (One Command)

```bash
npx @qubiit/lmagent@latest
```

Un solo comando. El instalador:
1. Despliega `AGENTS.md` a la raíz del proyecto (entry point universal)
2. Detecta automáticamente qué agentes tenés en el proyecto
3. Instala skills, rules, workflows, memory, config y docs en `.agents/` (centralizado)
4. Genera bridge files ligeros para cada agente detectado
5. Despliega config files específicos (CLAUDE.md, GEMINI.md) solo cuando corresponde

> `lmagent init`, `lmagent install` y `lmagent update` ejecutan el mismo flujo unificado.

### Verificar
```bash
npx @qubiit/lmagent@latest doctor
```

---

## Tu Primer Flujo de Trabajo

### 1. Define el contexto del proyecto
Editá `.agents/memory/01-project.md` con una descripción de tu proyecto:
> "Este es un SaaS de gestión de gastos para freelancers en Latam. Stack: Next.js + Supabase."

### 2. Activá un skill en el chat
Abrí el chat de tu agente y escribí:
> "Hola `/pm`. Lee la memoria del proyecto y ayúdame a crear las historias de usuario para el Login."

El agente detectará `/pm`, cargará el skill **product-manager** y actuará en consecuencia.

### 3. Cambiá de rol cuando necesites
> "Gracias PM. Ahora `/dev`, implementa el Login en Next.js siguiendo las historias de usuario."

---

## Comandos Útiles

```bash
npx @qubiit/lmagent@latest doctor       # Verificar configuración
npx @qubiit/lmagent@latest update       # Actualizar (alias de install)
npx @qubiit/lmagent@latest validate     # Validar integridad de skills
npx @qubiit/lmagent@latest tokens       # Ver consumo de tokens del framework
npx @qubiit/lmagent@latest uninstall    # Limpiar archivos del framework
```

---

## Referencias

- [Catálogo completo de Skills y Reglas](../../AGENTS.md)
- [Referencia de Comandos CLI](commands.md)
- [Guía de Uso](usage-guide.md)
- [Reglas del Sistema](../rules/00-master.md)
- [Cómo Contribuir](../../CONTRIBUTING.md)
