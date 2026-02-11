---
description: Workflow autónomo para resolver issues de GitHub (inspirado en SWE-agent)
level: auto-detect
personas: [backend-engineer, qa-engineer]
autonomous: true
---

# Resolve GitHub Issue Workflow

Este workflow permite que un agente analice y resuelva issues de GitHub de forma autónoma, inspirado en **SWE-agent**.

## Pre-requisitos

1. Leer [AGENTS.md](../AGENTS.md)
2. Leer [rules/workflow.md](../rules/workflow.md)
3. Issue con etiqueta `agent-resolvable` o asignado al agente
4. `GITHUB_TOKEN` configurado

## Información de Entrada

```yaml
# Input esperado
github_issue:
  owner: "org-name"
  repo: "repo-name"
  issue_number: 123
  
options:
  max_cost: 2.00          # USD máximo
  max_iterations: 15      # Pasos máximos
  auto_create_pr: false   # Crear PR automáticamente
  require_review: true    # Pedir review antes de PR
```

---

## Flujo de Resolución

```
┌─────────────────────────────────────────────────────────────────┐
│              RESOLVE GITHUB ISSUE WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  1. FETCH ISSUE                                          │
    │  • Obtener título, descripción, comentarios              │
    │  • Identificar tipo (bug, feature, refactor)             │
    │  • Clasificar nivel de complejidad                       │
    └────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
    ┌──────────────────────────────────────────────────────────┐
    │  2. ANALYZE & PLAN                                        │
    │  • Entender el problema                                  │
    │  • Localizar archivos relevantes                         │
    │  • Proponer solución                                     │
    └────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
    ┌──────────────────────────────────────────────────────────┐
    │  3. REPRODUCE (si es bug)                                │
    │  • Crear script de reproducción                          │
    │  • Ejecutar en sandbox                                   │
    │  • Confirmar que el error ocurre                         │
    └────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
    ┌──────────────────────────────────────────────────────────┐
    │  4. IMPLEMENT                                            │
    │  • Hacer cambios mínimos necesarios                      │
    │  • Seguir patrones existentes                            │
    │  • Agregar/actualizar tests                              │
    └────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
    ┌──────────────────────────────────────────────────────────┐
    │  5. VALIDATE                                             │
    │  • Verificar que reproducción ya no falla                │
    │  • Ejecutar test suite completo                          │
    │  • Verificar linting                                     │
    └────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
    ┌──────────────────────────────────────────────────────────┐
    │  6. SUBMIT                                               │
    │  • Crear branch fix/issue-{number}                       │
    │  • Commit con mensaje descriptivo                        │
    │  • Crear PR (o pedir review primero)                     │
    │  • Adjuntar trajectory log                               │
    └──────────────────────────────────────────────────────────┘
```

---

## Paso 1: Fetch Issue

### 1.1 Obtener Información del Issue

```python
# Pseudocódigo del proceso
async def fetch_issue(owner: str, repo: str, issue_number: int):
    """Obtiene toda la información del issue."""
    
    # Obtener issue principal
    issue = await github.get_issue(owner, repo, issue_number)
    
    # Obtener comentarios
    comments = await github.get_issue_comments(owner, repo, issue_number)
    
    # Obtener PRs relacionados (si hay)
    related_prs = await github.search_prs(f"fixes #{issue_number}")
    
    return {
        "title": issue.title,
        "body": issue.body,
        "labels": issue.labels,
        "comments": comments,
        "related_prs": related_prs,
        "created_at": issue.created_at,
        "author": issue.user.login
    }
```

### 1.2 Clasificar Issue

```
Determinar tipo:
- bug: Contiene "error", "bug", "fix", "broken"
- feature: Contiene "add", "new", "implement", "feature"
- refactor: Contiene "refactor", "improve", "optimize"
- docs: Contiene "doc", "readme", "typo"

Determinar nivel:
- Level 0: Typos, docs
- Level 1: Bug fix simple, feature pequeño
- Level 2: Bug complejo, feature mediano
- Level 3: Cambio arquitectural, múltiples archivos
```

---

## Paso 2: Analyze & Plan

### 2.1 Localizar Código Relevante

```
Estrategias de búsqueda:
1. Buscar keywords del issue en el código
2. Buscar archivos mencionados en stacktrace
3. Buscar funciones/clases mencionadas
4. Analizar imports y dependencias
```

### 2.2 Crear Plan de Solución

```markdown
## Plan de Resolución: Issue #{number}

### Problema
[Resumen del problema]

### Causa Raíz (si es bug)
[Análisis de la causa]

### Archivos a Modificar
- [ ] `path/to/file1.py` - [Cambio]
- [ ] `path/to/file2.py` - [Cambio]

### Tests Necesarios
- [ ] Test que reproduce el issue
- [ ] Test del fix

### Riesgos
- [Posible riesgo 1]
- [Posible riesgo 2]
```

---

## Paso 3: Reproduce (para bugs)

### 3.1 Crear Script de Reproducción

```python
# reproduce_issue_{number}.py
"""
Script para reproducir Issue #{number}.

Issue: {title}
URL: {url}

Comportamiento esperado: {expected}
Comportamiento actual: {actual}
"""

import asyncio
from app.main import app
from httpx import AsyncClient

async def reproduce():
    """Intenta reproducir el issue."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Configurar estado según el issue
        
        # Ejecutar acción que causa el problema
        response = await client.post("/endpoint", json={
            # Datos del issue
        })
        
        # Verificar si el bug ocurre
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Assert que demuestra el bug
        # assert response.status_code == 200  # FALLA antes del fix

if __name__ == "__main__":
    asyncio.run(reproduce())
```

### 3.2 Ejecutar en Sandbox

```
Usar sandbox_execute tool:
- language: python
- timeout: 30s
- network: none (aislado)

Verificar que el error ocurre como se describe en el issue.
```

---

## Paso 4: Implement

### 4.1 Principios de Implementación

```
✅ HACER:
- Cambios mínimos necesarios
- Seguir patrones existentes en el código
- Mantener estilo consistente
- Agregar comentarios donde sea necesario

❌ NO HACER:
- Refactors no relacionados
- Cambios de estilo/formato masivos
- Agregar dependencias innecesarias
- Cambiar APIs públicas sin necesidad
```

### 4.2 Logging de Acciones (Trajectory)

Cada paso se registra en formato SWE-agent:

```
🤠 INFO ========================= STEP {n} =========================
💭 THOUGHT: {razonamiento del agente}
🎬 ACTION: {herramienta usada con parámetros}
📤 OBSERVATION: {resultado de la acción}
```

Ejemplo:
```
🤠 INFO ========================= STEP 3 =========================
💭 THOUGHT: El error está en la función validate_email(). 
   No está manejando el caso cuando el email es None.
   Necesito agregar un check al inicio de la función.
🎬 ACTION: file_write(
    path="app/utils/validators.py",
    content="...",
    mode="replace"
)
📤 OBSERVATION: File updated successfully. 5 lines changed.
```

---

## Paso 5: Validate

### 5.1 Re-ejecutar Reproducción

```bash
python reproduce_issue_{number}.py

# Debería NO mostrar el error ahora
```

### 5.2 Ejecutar Test Suite

```bash
# Ejecutar todos los tests
pytest --cov=app

# Verificar linting
ruff check .
ruff format --check .

# Verificar types (si aplica)
mypy app/
```

### 5.3 Criterios de Éxito

- [ ] Script de reproducción pasa
- [ ] Tests existentes pasan
- [ ] Nuevos tests pasan
- [ ] Linting pasa
- [ ] Cobertura no disminuye

---

## Paso 6: Submit

### 6.1 Crear Branch y Commit

```bash
# Crear branch
git checkout -b fix/issue-{number}

# Stage cambios
git add -A

# Commit con mensaje descriptivo
git commit -m "fix(module): descripción corta

Fixes #{number}

- [Cambio 1]
- [Cambio 2]

Root cause: [Explicación breve]

🤖 Resolved by LMAgent
Trajectory: {trajectory_id}"
```

### 6.2 Crear Pull Request
> 💡 **Tip**: Usa `/prompt` para generar la descripción del PR basada en el Trajectory Log.

```markdown
## Fix: {Issue Title}
 
Fixes #{number}
 
### Problem
{Descripción del problema}
 
### Root Cause
{Análisis de causa raíz}
 
### Solution
{Descripción de la solución}
 
### Testing
- [x] Created reproduction script
- [x] Fixed issue verified
- [x] All existing tests pass
- [x] Added new tests for fix
 
### Trajectory
<details>
<summary>Agent execution log</summary>
 
{Trajectory completo en formato collapsible}
 
</details>
 
---
🤖 *This PR was created by LMAgent*
Cost: ${cost}
Iterations: {iterations}
Time: {time}
```

### 6.3 Limpiar

```bash
# Eliminar script de reproducción (ya hay test)
rm reproduce_issue_{number}.py

# Guardar trajectory para análisis
mv trajectory.json trajectories/issue-{number}-{timestamp}.json
```

---

## Límites de Seguridad

### Costo
```yaml
max_cost_per_issue: 2.00  # USD
alert_at: 1.50            # Alertar al 75%
```

### Tiempo
```yaml
max_iterations: 15
max_time_minutes: 30
```

### Acceso
```yaml
allowed_operations:
  - file_read
  - file_write (non-protected)
  - file_search
  - sandbox_execute
  - github_comment
  - github_pr_create

blocked_operations:
  - deploy
  - database_write (production)
  - secrets_access
```

### Archivos Protegidos
```yaml
protected_files:
  - ".env*"
  - "**/secrets/**"
  - "docker-compose.prod.yml"
  - "**/migrations/**"  # Requiere review
```

---

## Output del Workflow

### Éxito
```json
{
  "success": true,
  "issue_number": 123,
  "resolution": {
    "type": "fix",
    "files_changed": ["app/utils/validators.py", "tests/test_validators.py"],
    "lines_added": 15,
    "lines_removed": 3
  },
  "pr": {
    "number": 456,
    "url": "https://github.com/org/repo/pull/456"
  },
  "cost": 0.45,
  "iterations": 8,
  "time_seconds": 120,
  "trajectory_id": "issue-123-1705838400"
}
```

### Fallo
```json
{
  "success": false,
  "issue_number": 123,
  "reason": "Could not reproduce the issue",
  "suggestion": "Issue may need more information or manual investigation",
  "cost": 0.15,
  "iterations": 5,
  "trajectory_id": "issue-123-1705838400",
  "comment_posted": true
}
```

---

## Comentario en Issue (si falla)

```markdown
🤖 **LMAgent Automated Analysis**

I attempted to resolve this issue automatically but encountered difficulties:

**Status**: Unable to complete resolution

**Reason**: {reason}

**What I tried**:
1. {step_1}
2. {step_2}
3. {step_3}

**Suggestions for manual investigation**:
- {suggestion_1}
- {suggestion_2}

<details>
<summary>Execution Details</summary>

- Cost: ${cost}
- Iterations: {iterations}
- Trajectory: {link}

</details>

---
*This is an automated analysis. A human developer should review this issue.*
```

---

## Checklist de Resolución

### Pre-ejecución
- [ ] Issue tiene información suficiente
- [ ] Etiqueta `agent-resolvable` presente
- [ ] GITHUB_TOKEN configurado
- [ ] Repositorio clonado localmente

### Durante ejecución
- [ ] Issue analizado y clasificado
- [ ] Plan de solución creado
- [ ] Bug reproducido (si aplica)
- [ ] Fix implementado
- [ ] Tests agregados
- [ ] Validación pasada

### Post-ejecución
- [ ] PR creado (o cambios listos para review)
- [ ] Trajectory guardado
- [ ] Issue comentado con resultado
- [ ] Métricas registradas
