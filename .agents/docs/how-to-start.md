# Cómo Empezar un Proyecto con LMAgent

> **LMAgent Framework v3.0 (SPEC+LM)**
> 
> Esta guía explica el proceso automatizado para iniciar un nuevo proyecto.

---

## 🎯 Resumen del Flujo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUJO AUTOMATIZADO DE INICIO                              │
│                                                                              │
│   DESARROLLADOR                           AGENTE DE IA                       │
│   ─────────────                           ─────────────                       │
│                                                                              │
│   1. Crear carpeta del proyecto                                              │
│         │                                                                    │
│         ▼                                                                    │
│   2. Crear PROJECT_KICKOFF.md ──────────┐                                   │
│      (5-10 minutos)                     │                                   │
│                                          │                                   │
│   3. Abrir en IDE agéntico              │                                   │
│         │                                │                                   │
│         ▼                               ▼                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    AUTOMÁTICO (Sin intervención)                     │   │
│   │                                                                      │   │
│   │   4. Agente detecta PROJECT_KICKOFF.md                               │   │
│   │   5. Ejecuta: lmagent init                                          │   │
│   │   6. Ejecuta: /spec workflow                                         │   │
│   │   7. Crea: spec.yaml → plan.yaml → tasks.yaml                       │   │
│   │   8. Implementa código siguiendo tasks                               │   │
│   │   9. Tests + Documentación                                           │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   10. USUARIO: Revisar y aprobar cada fase                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Paso a Paso

### Paso 1: Crear Carpeta del Proyecto

```bash
mkdir mi-nuevo-proyecto
cd mi-nuevo-proyecto
```

### Paso 2: Crear PROJECT_KICKOFF.md

Copia el template desde el repositorio de LMAgent:

```bash
# Si tienes LMAgent instalado globalmente:
lmagent kickoff

# O manualmente, copia el archivo:
cp /path/to/lmagent/templates/PROJECT_KICKOFF.md ./PROJECT_KICKOFF.md
```

### Paso 3: Completar el Template (OPCIONAL)

Abre `PROJECT_KICKOFF.md` y tienes DOS opciones:

#### Opción A: Completar manualmente (5-10 minutos)
Llena las secciones marcadas con `[...]`. Solo necesitas:
- Nombre del proyecto
- Descripción en una línea
- Tipo de proyecto
- Usuario principal
- Problema a resolver
- 2-5 features MUST HAVE

#### Opción B: Dejar que el agente pregunte
Si no completas el template, el agente detectará que está vacío y te hará las preguntas necesarias en el chat:

```
Agente: "Detecté que este es un proyecto nuevo. Voy a hacerte 
        algunas preguntas para entender qué quieres construir."
        
        "¿Cómo se llama tu proyecto?"
        
Tú:     "NutriTrack AI"

Agente: "En una frase, ¿qué es y para quién?"

Tú:     "App para rastrear nutrición con IA que analiza fotos de comida"

... (5-7 preguntas en total)
```

### Paso 4: Abrir en tu IDE Agéntico

Abre la carpeta del proyecto en tu IDE favorito:

| IDE | Cómo Abrir |
|-----|-----------|
| **Cursor** | `cursor .` |
| **Claude Code** | `claude .` |
| **Antigravity** | Abrir carpeta en VS Code + extensión |
| **Copilot** | Abrir en VS Code |

### Paso 5: El Agente Toma el Control 🤖

Una vez que el IDE agéntico analice tu carpeta, detectará `PROJECT_KICKOFF.md` y comenzará automáticamente:

1. **Detecta Framework** → Inicializa LMAgent
2. **Lee tu Kickoff** → Entiende el proyecto
3. **Ejecuta /spec** → Crea especificación formal
4. **Te muestra spec.yaml** → Pide aprobación
5. **Diseña arquitectura** → Crea plan.yaml
6. **Te muestra el plan** → Pide aprobación
7. **Crea tasks** → Desglose de implementación
8. **Implementa** → Código real

---

## 🔄 Puntos de Aprobación

El agente se detendrá y pedirá tu aprobación en estos puntos:

```
┌────────────────┐
│  spec.yaml     │ ← "¿Está bien el alcance y las features?"
└───────┬────────┘
        │ ✅ Aprobado
        ▼
┌────────────────┐
│  plan.yaml     │ ← "¿Está bien la arquitectura y el plan?"
└───────┬────────┘
        │ ✅ Aprobado
        ▼
┌────────────────┐
│  tasks.yaml    │ ← "¿Puedo empezar a implementar?"
└───────┬────────┘
        │ ✅ Aprobado
        ▼
  🚀 IMPLEMENTACIÓN
```

---

## 📂 Estructura Final del Proyecto

Después del proceso, tu proyecto tendrá esta estructura:

```
mi-nuevo-proyecto/
├── PROJECT_KICKOFF.md     # Tu input original
├── AGENTS.md              # Main entry point de LMAgent
├── .lmagent               # Marker del framework
├── README.md              # Generado automáticamente
│
├── specs/
│   └── mi-nuevo-proyecto/
│       ├── spec.yaml      # Especificación formal
│       ├── plan.yaml      # Plan de arquitectura
│       └── tasks.yaml     # Tasks desglosadas
│
├── src/                   # Código fuente
│   ├── app/              
│   ├── services/
│   └── ...
│
├── tests/                 # Tests automatizados
│
├── docs/                  # Documentación
│   └── adr/               # Architecture Decision Records
│
├── docker-compose.yml     # Si aplica
└── pyproject.toml         # O package.json
```

---

## ⚡ Comandos Útiles

Una vez que el proyecto está inicializado:

| Comando | Qué Hace |
|---------|----------|
| `/spec status` | Ver estado del spec actual |
| `/spec validate` | Validar implementación vs spec |
| `/pm` | Activar Product Manager para cambios de requisitos |
| `/arch` | Activar Architect para decisiones técnicas |
| `/dev` | Activar Developer para implementar |
| `/qa` | Activar QA para testing |

---

## ❓ FAQ

### ¿Qué pasa si quiero cambiar algo después?

Simplemente dile al agente:
```
"Quiero agregar feature X al proyecto"
```
El agente actualizará spec.yaml y te pedirá aprobación.

### ¿Puedo usar LMAgent en un proyecto existente?

Sí, ejecuta:
```bash
cd mi-proyecto-existente
lmagent init
```
Luego crea un PROJECT_KICKOFF.md describiendo lo que quieres agregar.

### ¿Qué IDEs son compatibles?

- ✅ Cursor
- ✅ Claude Code
- ✅ Antigravity (VS Code)
- ✅ GitHub Copilot
- ✅ Windsurf
- ✅ Roo Code

---

## 🎬 Video Demo (Conceptual)

```
00:00 - Crear carpeta y PROJECT_KICKOFF.md
00:05 - Completar template (fast-forward)
00:15 - Abrir en Cursor
00:20 - Agente detecta y comienza
00:30 - spec.yaml generado, revisión
00:40 - plan.yaml generado, revisión
00:50 - Implementación automática
02:00 - Proyecto MVP funcionando 🎉
```

---

*LMAgent v3.0.0 (SPEC+LM) - Build More, Automate Dreams* 🚀
