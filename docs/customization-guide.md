# LMAgent Customization Guide

Esta guía explica cómo personalizar el framework LMAgent para las necesidades de tu equipo.

## Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Personalizar Niveles](#personalizar-niveles)
3. [Crear Personas Custom](#crear-personas-custom)
4. [Agregar Herramientas](#agregar-herramientas)
5. [Crear Workflows Custom](#crear-workflows-custom)
6. [Configurar Modelos LLM](#configurar-modelos-llm)
7. [Extensiones](#extensiones)

---

## Configuración Inicial

### 1. Clonar y Configurar

```bash
# Clonar el repo
git clone https://github.com/tu-org/lmagent-template.git mi-proyecto
cd mi-proyecto

# Configurar información del proyecto
# Editar config/settings.yaml
```

### 2. Personalizar settings.yaml

```yaml
# config/settings.yaml

project:
  name: "Mi Proyecto"
  description: "Descripción de mi proyecto"
  team: "Mi Equipo"
  version: "0.1.0"

agent_behavior:
  language: "es"  # Idioma preferido
  autonomy:
    mode: "auto"  # auto, always_ask, never_ask
```

### 3. Variables de Entorno

```bash
# Copiar template
cp .env.example .env

# Configurar tus API keys
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

---

## Personalizar Niveles

### Opción 1: Ajustar Tiempos

Si tu equipo es más rápido o lento que el promedio:

```yaml
# config/settings.yaml
levels:
  time_multiplier: 1.5  # 1.5x más lento que default
```

### Opción 2: Crear Niveles Custom

```yaml
# config/levels-custom.yaml
# Luego en settings.yaml:
levels:
  use_custom: true
  custom_file: "config/levels-custom.yaml"
```

Ejemplo de level custom:

```yaml
levels:
  0:
    name: "Micro"
    description: "Cambios de < 1 minuto"
    planning_required: false
    estimated_time: "< 1 min"
    
  5:
    name: "Multi-Team"
    description: "Proyectos que involucran múltiples equipos"
    planning_required: true
    planning_depth: "strategic"
    estimated_time: "1+ mes"
    human_review: true
    human_approval_required: true
    artifacts:
      - project_charter.md
      - implementation_plan.md
      - architecture.md
      - test_plan.md
      - security_review.md
      - rollback_plan.md
      - communication_plan.md
```

### Agregar Reglas de Auto-Clasificación

```yaml
# config/settings.yaml
levels:
  auto_classification:
    level_bumps:
      # Tus patrones custom
      - pattern: "*payment*"
        min_level: 3
        reason: "Cambios de pagos son críticos"
      
      - pattern: "*api/v2/*"
        min_level: 2
        reason: "API v2 requiere más cuidado"
```

---

## Crear Personas Custom

### 1. Crear Archivo de Persona

```markdown
# personas/custom/devops-engineer.md

---
name: DevOps Engineer
role: Infrastructure and CI/CD
expertise:
  - Docker/Kubernetes
  - CI/CD pipelines
  - Cloud infrastructure
  - Monitoring
activates_on:
  - Cambios de Dockerfile
  - Configuración de CI/CD
  - Infrastructure as Code
---

# DevOps Engineer Persona

Eres un DevOps Engineer especializado en...

## Responsabilidades
1. ...

## Stack
- Docker, Kubernetes
- GitHub Actions
- Terraform
- ...

## Patrones
...
```

### 2. Habilitar en Settings

```yaml
# config/settings.yaml
personas:
  allow_custom: true
  custom_directory: "personas/custom"
  enabled:
    - product-manager
    - architect
    - backend-engineer
    - devops-engineer  # Tu persona custom
```

---

## Agregar Herramientas

### 1. Definir en tools.yaml

```yaml
# config/tools.yaml

tools:
  # Tu herramienta custom
  jira_integration:
    name: "Jira Integration"
    module: "agents.python.tools.jira_tool"
    class: "JiraTool"
    description: "Interact with Jira for issue management"
    category: "project_management"
    parameters:
      - name: action
        type: string
        enum: [get_issue, create_issue, update_status]
        required: true
      - name: issue_key
        type: string
        required: false
      - name: data
        type: object
        required: false
    requires:
      - JIRA_URL
      - JIRA_API_TOKEN
```

### 2. Implementar la Herramienta

```python
# agents/python/tools/jira_tool.py

from lmagent.tools.base import BaseTool, ToolResult
from pydantic import Field
import httpx

class JiraTool(BaseTool):
    """
    Interactúa con Jira para gestión de issues.
    
    Usa esta herramienta cuando necesites:
    - Obtener información de un issue
    - Crear nuevos issues
    - Actualizar estados
    """
    
    name: str = "jira_integration"
    description: str = "Interact with Jira for issue management"
    
    async def execute(
        self,
        action: str = Field(..., description="Action: get_issue, create_issue, update_status"),
        issue_key: str = Field(None, description="Issue key for get/update"),
        data: dict = Field(None, description="Data for create/update")
    ) -> ToolResult:
        """Execute Jira operation."""
        # Implementación...
        pass
```

### 3. Habilitar en Settings

```yaml
# config/settings.yaml
tools:
  default_enabled:
    - http_request
    - database_query
    - jira_integration  # Tu tool
```

---

## Crear Workflows Custom

### 1. Crear Archivo de Workflow

```markdown
# workflows/custom/deploy-to-production.md

---
description: Workflow para deploy a producción
level: 3
personas: [devops-engineer, backend-engineer]
---

# Deploy to Production Workflow

## Pre-requisitos
1. Código mergeado a main
2. Tests pasando
3. Aprobación de QA

## Paso 1: Pre-deploy Checks
...

## Paso 2: Deploy
...

## Paso 3: Verification
...

## Rollback
...
```

### 2. Habilitar en Settings

```yaml
# config/settings.yaml
workflows:
  allow_custom: true
  custom_directory: "workflows/custom"
  enabled:
    - new-automation
    - deploy-to-production  # Tu workflow
```

---

## Configurar Modelos LLM

### Agregar Proveedor Custom

```yaml
# config/models.yaml

providers:
  # Tu proveedor custom
  azure_openai:
    name: "Azure OpenAI"
    api_base: "https://your-resource.openai.azure.com/"
    env_key: "AZURE_OPENAI_API_KEY"
    models:
      gpt-4:
        name: "GPT-4 (Azure)"
        context_window: 128000
        max_output: 4096
        cost_per_1k_input: 0.03
        cost_per_1k_output: 0.06
        supports_tools: true
```

### Configurar por Tipo de Tarea

```yaml
# config/models.yaml

task_models:
  # Tu configuración custom
  financial_analysis:
    primary: "openai/o1"
    fallback: "anthropic/claude-sonnet-4"
    reason: "O1 para análisis financiero complejo"
```

---

## Extensiones

### Estructura de Extensión

```
extensions/
└── my-extension/
    ├── extension.yaml    # Metadata
    ├── __init__.py
    ├── tools/            # Tools adicionales
    ├── workflows/        # Workflows adicionales
    └── personas/         # Personas adicionales
```

### extension.yaml

```yaml
name: "my-extension"
version: "1.0.0"
description: "Mi extensión custom"
author: "Tu Nombre"

# Qué agrega
provides:
  tools:
    - my_custom_tool
  workflows:
    - my_custom_workflow
  personas:
    - my_custom_persona

# Configuración
settings:
  api_url: ""
  api_key_env: "MY_API_KEY"
```

### Habilitar Extensión

```yaml
# config/settings.yaml
extensions:
  enabled: true
  installed:
    - my-extension
```

---

## Tips de Personalización

### 1. Empezar Simple

- Primero usa el framework como está
- Identifica qué necesitas cambiar
- Personaliza incrementalmente

### 2. Documentar Cambios

- Documenta por qué personalizaste algo
- Facilita onboarding de nuevos miembros

### 3. Mantener Compatibilidad

- No modifiques archivos core directamente
- Usa archivos custom y overrides
- Facilita actualizar a nuevas versiones

### 4. Compartir con el Equipo

```bash
# Commitear solo lo necesario
git add config/settings.yaml
git add personas/custom/
git add workflows/custom/
git add config/tools-custom.yaml
git commit -m "chore: add team customizations"
```

---

## Troubleshooting

### Persona Custom No Funciona

1. Verificar que está en `personas/custom/` o directorio correcto
2. Verificar YAML frontmatter
3. Verificar que está habilitada en settings.yaml

### Tool Custom No Se Registra

1. Verificar path del módulo en tools.yaml
2. Verificar que la clase existe e importa
3. Verificar las dependencias necesarias

### Workflow No Aparece

1. Verificar que está habilitado en settings.yaml
2. Verificar YAML frontmatter
3. Verificar path del archivo
