# 🚀 LMAgent Bootstrap — Instrucciones Iniciales

> **Tipo**: `rule` | **Versión**: 3.3.0 | **Prioridad**: MÁXIMA
> Esta regla se aplica **SIEMPRE** como primer paso antes de cualquier tarea.

---

## 📌 Startup Check (Auto-Start)

**¿Existe `PROJECT_KICKOFF.md` en la raíz del proyecto?**
- **SÍ** → Activa el skill `product-manager` (`/pm`) y ejecuta el workflow `spec-driven`.
- **NO** → Continuar con el flujo normal.

---

## 🧠 Framework

> ⚠️ **FLEXIBILIDAD TECNOLÓGICA UNIVERSAL**: LMAgent se diseña asumiendo que **la tecnología evoluciona**. Cualquier framework, librería o versión específica mencionada en las reglas (`.agents/rules/`), skills (`.agents/skills/`) o workflows (`.agents/workflows/`) actúa como **ejemplo de referencia**. Como agente, tienes libertad total para recomendar, evaluar y utilizar herramientas más modernas, seguras o estables si esto beneficia al proyecto.

Este archivo define la identidad, propósito y reglas fundamentales de **LMAgent v3.6.0**. Antes de implementar cualquier cambio:

1. **Lee `AGENTS.md`** — Catálogo completo de skills, rules y workflows
2. **Clasifica la tarea** — Nivel 0-4 según complejidad (ver `.agents/rules/01-workflow.md`)
3. **Activa el skill apropiado** — Según la tabla de abajo

---

## 🤖 Activación de Skills por IDE

**La forma de activar skills depende del IDE:**

| IDE | Mecanismo | Ejemplo |
|-----|-----------|---------|
| **Cursor** | `/slash-commands` nativos del IDE | Escribir `/dev` en el chat |
| **Antigravity** | Automático por contexto | El agente lee `SKILL.md` al detectar tarea relevante |
| **Claude Code** | Lectura de `SKILL.md` | El agente accede al directorio `skills/` |
| **Otros IDEs** | Según configuración del IDE | Ver documentación del IDE |

> **En Antigravity**: Los triggers como `/dev` o `/pm` **no son comandos ejecutables**. Son convenciones para que el agente identifique qué skill activar. El agente debe:
> 1. Detectar la naturaleza de la tarea (ej: "crear endpoint" → backend)
> 2. Leer el `SKILL.md` completo del skill relevante
> 3. Adoptar el rol, principios y patrones descritos
> 4. Seguir la "Definition of Done" del skill

---

## 🎯 Skills Disponibles

Activa el skill apropiado según la tarea. Cada skill tiene `SKILL.md` con instrucciones detalladas, y opcionalmente `scripts/`, `references/` y `assets/`.

<!-- LMAGENT_REGISTRY:SKILLS_START -->

| ID / Trigger | Skill | Icono & ROL | Descripción |
|:---|:---|:---|:---|
| `/ai` | **ai-agent-engineer** | 🤖 *Diseño y Desarrollo de Agentes IA* | Diseño e implementación de agentes de IA, sistemas multi-agente, RAG pipelines y evaluación de LLMs. Úsalo con /ai para construir agentes autónomos, pipelines de IA o sistemas de evaluación. |
| `/api` | **api-designer** | 🔌 *Especialista en Diseño de APIs y Developer Experience* | Diseño de contratos de API REST y GraphQL, especificaciones OpenAPI y AsyncAPI. Úsalo con /api-design para definir contratos antes de implementar. |
| `/architect` | **architect** | �️ *Senior Solutions Architect - Diseño de Sistemas Distribuidos* | Diseño de arquitectura de software, patrones de diseño y estructuración de sistemas robustos y escalables. Úsalo con /arch para decisiones técnicas críticas, diseño de sistemas distribuidos o creación de ADRs. |
| `/automation` | **automation-engineer** | ⚙️ *Automatización e Integraciones* | Automatización de procesos con n8n, Make y scripts. Úsalo con /auto para diseñar workflows de automatización, integraciones entre sistemas o bots. |
| `/backend` | **backend-engineer** | ⚙️ *Senior Backend Engineer & Tech Lead - Ingeniería de Software Robusta* | Desarrollo de lógica de servidor, APIs REST/GraphQL, bases de datos y servicios escalables. Úsalo con /dev para implementar endpoints, refactorizar código o debuggear problemas de backend. |
| `/blockchain` | **blockchain-engineer** | ⛓️ *Web3 & Smart Contract Auditor - Tolerancia Cero Fallas* | Ingeniería de Smart Contracts, criptografía asimétrica y Web3. Úsalo con /web3 para diseñar en Solidity, Rust, arquitectura de dApps o auditar seguridad de cadenas de bloques (DeFi, NFTs). |
| `/bmad` | **bmad-methodology** | 🧠 *Scale-Adaptive Intelligence & Project Orchestration* | Clasificación de complejidad de tareas y selección de metodología (BMAD, SWE-Agent, Spec-Driven). Úsalo con /bmad para determinar el nivel de una tarea (0-4) y el workflow correcto. |
| `/browser` | **browser-agent** | 🌐 *Automatización de Navegador para Agentes IA* | Automatización de navegadores web, scraping, testing E2E y verificación visual de UIs. Úsalo con /browser para interactuar con páginas web, extraer datos o verificar flujos de usuario. |
| `/cloud` | **cloud-architect** | ☁️ *Senior Cloud Architect & DevOps Engineer - Infraestructura Segura* | Diseño y despliegue de Infraestructura como Código (IaC) en AWS, GCP y Azure. Úsalo con /cloud para escribir Terraform, CloudFormation, políticas IAM y evaluar arquitecturas Cloud Native seguras y escalables. |
| `/code` | **code-reviewer** | 🔍 *Experto en Code Review y Calidad de Código* | Revisión exhaustiva de código para detectar bugs, problemas de seguridad, deuda técnica y violaciones de estilo. Úsalo con /review para hacer code reviews de PRs o módulos. |
| `/cursor` | **cursor-expert** | 🖱️ *IDE Automation and Configuration* | Especialista en configuración y desarrollo nativo para el IDE Cursor. Úsalo cuando necesites crear reglas de proyecto (.mdc), generar o migrar skills, configurar subagentes (.cursor/agents/) o modificar las configuraciones del usuario (settings.json). |
| `/data` | **data-engineer** | 🗜️ *Diseño y Administración de Bases de Datos* | Diseño de pipelines de datos, ETL/ELT, modelado de datos y análisis. Úsalo con /data para construir pipelines, optimizar queries o diseñar esquemas de datos. |
| `/devops` | **devops-engineer** | 🚀 *Infrastructure, CI/CD y Operaciones* | Configuración de CI/CD, infraestructura en la nube, contenedores y automatización de despliegues. Úsalo con /devops para Dockerfiles, pipelines de GitHub Actions, manifiestos de Kubernetes o configuración de monitoreo. |
| `/document` | **document-generator** | 📄 *Generación de Documentos de Oficina* | Generación de documentación técnica, READMEs, changelogs y wikis. Úsalo con /docs para crear o actualizar documentación de proyectos. |
| `/frontend` | **frontend-engineer** | 🎨 *Desarrollo de Interfaces de Usuario* | Desarrollo de interfaces de usuario modernas, responsivas y centradas en la experiencia del usuario con React/Next.js. Úsalo con /front para implementar componentes, integrar APIs o optimizar performance frontend. |
| `/game` | **game-developer** | 🎮 *Graphics & Gameplay Engineer - Rendimiento y Renderizado* | Especialista en desarrollo de videojuegos, simulaciones 3D, física y arquitecturas ECS. Úsalo con /game para programar lógica en Unity (C#), Unreal Engine (C++/Blueprints), Godot (GDScript) o web (Three.js/WebGL). |
| `/git` | **git-workflow** | 🌿 *Especialista en Git Workflows y Release Management* | Gestión de flujos de trabajo Git, branching strategies, commits semánticos y releases. Úsalo con /git para gestionar ramas, crear releases o resolver conflictos. |
| `/machine` | **machine-learning-engineer** | 🧠 *Principal AI/ML Researcher & Data Scientist - Matemáticas y Entrenamiento* | Experto en ciencia de datos, Deep Learning, entrenamiento de modelos, PyTorch, TensorFlow y Scikit-Learn. Úsalo con /ml para diseñar arquitecturas de redes neuronales, optimizar loss functions y limpiar datasets masivos. |
| `/mcp` | **mcp-builder** | 🔧 *Especialista en Model Context Protocol y Agent Tooling* | Construcción de servidores MCP (Model Context Protocol) para extender capacidades de agentes de IA. Úsalo con /mcp para crear herramientas y recursos MCP. |
| `/mobile` | **mobile-engineer** | 📱 *Desarrollo de Aplicaciones Móviles* | Desarrollo de aplicaciones móviles con React Native y Expo. Úsalo con /mobile para implementar pantallas, navegación o integraciones nativas en apps iOS/Android. |
| `/native` | **native-mobile-expert** | 📱 *Arquitecto Mobile Nativo - Swift & Kotlin* | Desarrollador Nivel Experto en arquitecturas nativas para iOS y Android. Úsalo con /native para crear o refactorizar en Swift, Kotlin, puentes (Bridges) JNI/TurboModules e integraciones OS profundas. |
| `/orchestrator` | **orchestrator** | 🎯 *Meta-Agent que decide qué persona y workflow activar* | Meta-agente orquestador que clasifica tareas y rutea al experto correcto. Úsalo con /orch al inicio de cualquier tarea compleja o cuando no está claro qué persona activar. |
| `/pentester` | **pentester** | 🥷 *Ciberseguridad Ofensiva & DevSecOps - Ethical Hacker* | Auditoría de ciberseguridad ofensiva, escaneo de vulnerabilidades, Red Teaming y DevSecOps. Úsalo con /hack o /sec para evaluar la seguridad de tu código, inyecciones, XSS, SSRF y mitigaciones OWASP. |
| `/performance` | **performance-engineer** | 🏎️ *Optimización de Rendimiento y Escalabilidad* | Optimización de rendimiento de aplicaciones, profiling, análisis de bottlenecks y tuning. Úsalo con /perf para identificar y resolver problemas de performance. |
| `/product` | **product-manager** | 📊 *Senior Product Manager - Estrategia y Visión de Producto* | Definición de la visión del producto, roadmap y requisitos detallados para maximizar el valor al usuario. Úsalo con /pm para generar PRDs, priorizar features con RICE/MoSCoW o conducir sesiones de brainstorming. |
| `/prompt` | **prompt-engineer** | 🧠 *Ingeniería de Prompts y Arquitectura Cognitiva* | Diseño y optimización de prompts para LLMs, system prompts y cadenas de razonamiento. Úsalo con /prompt para mejorar la calidad de respuestas de agentes de IA. |
| `/qa` | **qa-engineer** | 🧪 *Testing y Aseguramiento de Calidad* | Aseguramiento de la calidad mediante pruebas automatizadas, manuales y validación rigurosa de criterios de aceptación. Úsalo con /qa para escribir tests, analizar cobertura, reproducir bugs o evaluar agentes de IA con LLM Evals. |
| `/scrum` | **scrum-master** | 🏉 *Agile Coach & Senior Scrum Master - Facilitador de Alto Rendimiento* | Facilitación de ceremonias ágiles, gestión de sprints y remoción de impedimentos. Úsalo con /scrum para planificar sprints, hacer retrospectivas o gestionar el backlog. |
| `/security` | **security-analyst** | 🛡️ *Seguridad y Compliance* | Análisis de seguridad, threat modeling, revisión de vulnerabilidades y hardening. Úsalo con /sec para auditar código, revisar configuraciones o hacer threat modeling. |
| `/seo` | **seo-auditor** | 🔎 *Auditoría Web y SEO Técnico* | Auditoría SEO, análisis de Core Web Vitals, optimización de metadatos y estrategia de contenido. Úsalo con /seo para auditar páginas web o mejorar el posicionamiento. |
| `/spec` | **spec-driven-dev** | 📋 *Development Methodology - Specification as Source of Truth* | Metodología SPEC DRIVEN: pipeline SPECIFY → PLAN → TASKS → CODE → VERIFY. Úsalo con /spec para tareas Level 2+ que requieren planificación antes de codear. |
| `/supabase` | **supabase-expert** | ⚡ *Experto en Supabase Platform & PostgreSQL* | Desarrollo con Supabase: Auth, Realtime, Storage, Edge Functions y Row Level Security. Úsalo con /supabase para implementar features con Supabase como backend. |
| `/swe` | **swe-agent** | 🔧 *Autonomous Software Engineering Agent* | Resolución autónoma de issues de GitHub usando trajectory-based debugging. Úsalo con /swe para resolver bugs complejos de forma sistemática y autónoma. |
| `/systematic` | **systematic-debugger** | 🔍 *Debugging Metódico y Resolución de Problemas* | Debugging sistemático y análisis de causa raíz de bugs. Úsalo con /debug para investigar errores complejos de forma metódica. |
| `/tech` | **tech-lead** | 🧭 *Liderazgo Técnico y Mentorship* | Liderazgo técnico, decisiones de arquitectura, mentoring y gestión de deuda técnica. Úsalo con /lead para decisiones técnicas ejecutivas o revisiones de arquitectura. |
| `/technical` | **technical-writer** | 📝 *Documentación Técnica y Comunicación* | Redacción de documentación técnica clara, tutoriales, guías de API y changelogs. Úsalo con /write para crear documentación de alta calidad. |
| `/testing` | **testing-strategist** | 🧪 *Especialista en Testing Strategy y Quality Assurance Automation* | Diseño de estrategias de testing, selección de herramientas y definición de métricas de calidad. Úsalo con /test-strategy para planificar la cobertura de tests de un proyecto. |
| `/ux` | **ux-ui-designer** | 🎨 *Diseño de Experiencia e Interfaz de Usuario* | Diseño de experiencias de usuario, sistemas de diseño, wireframes y accesibilidad. Úsalo con /ux para definir flujos de usuario, componentes de diseño o auditar accesibilidad. |


<!-- LMAGENT_REGISTRY:SKILLS_END -->

---

### Estructura de Reglas (Orden de Lectura)

1. **[00-master.md](.agents/rules/00-master.md)**: Este índice.
2. **[01-workflow.md](.agents/rules/01-workflow.md)**: Ciclo de vida del desarrollo.
3. **[02-tech-stack.md](.agents/rules/02-tech-stack.md)**: Tecnologías y herramientas.
4. **[03-code-style.md](.agents/rules/03-code-style.md)**: Convenciones de código.
5. **[04-security.md](.agents/rules/04-security.md)**: Seguridad y secretos.
6. **[05-testing.md](.agents/rules/05-testing.md)**: Estrategias de prueba.
7. **[06-api-design.md](.agents/rules/06-api-design.md)**: Estándares REST API.
8. **[07-documentation.md](.agents/rules/07-documentation.md)**: Guías de documentación.
9. **[08-agents-ai.md](.agents/rules/08-agents-ai.md)**: Construcción de Agentes.
10. **[09-automations.md](.agents/rules/09-automations.md)**: Integraciones n8n.
11. **[10-git-flow.md](.agents/rules/10-git-flow.md)**: Gestión de versiones y commits.

---

## 📂 Estructura del Framework

```
rules/          → Guardrails de comportamiento (CÓMO)
skills/         → Capacidades especializadas (QUÉ)
  └── {skill}/
      ├── SKILL.md        → Instrucciones del skill
      ├── scripts/        → Scripts ejecutables
      ├── references/     → Guías y patrones
      └── assets/         → Templates, SQL, YAML
workflows/      → Procedimientos operativos (SOPs)
config/         → Configuración del framework
templates/      → Plantillas de proyecto
```
