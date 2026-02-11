# Level 4: Enterprise - Checklist

## Descripción
Cambios críticos que requieren planificación tipo auditoría.

**Tiempo estimado**: 8+ horas (múltiples días/semanas)
**Confirmación requerida**: Múltiples aprobaciones
**Artefactos**: implementation_plan.md, architecture.md, test_plan.md, security_review.md, rollback_plan.md

## Ejemplos
- Migración de base de datos en producción
- Cambio de proveedor de autenticación
- Implementación de compliance (GDPR, SOC2, HIPAA)
- Refactor mayor de arquitectura core
- Integración con sistemas financieros
- Cambios que afectan SLAs

---

## Checklist

### 📋 Fase 1: Governance y Aprobaciones

#### Stakeholders
- [ ] Identificar todos los stakeholders afectados
- [ ] Obtener sponsor/owner del proyecto
- [ ] Definir comité de aprobación

#### Documentación Inicial
```markdown
## Project Charter

### Nombre del Proyecto
[Nombre]

### Sponsor
[Nombre/Rol]

### Objetivo de Negocio
[Por qué este proyecto es necesario]

### Alcance
- **In Scope**: [...]
- **Out of Scope**: [...]

### Stakeholders
| Nombre | Rol | Interés | Poder |
|--------|-----|---------|-------|
| [Nombre] | [Rol] | Alto/Medio/Bajo | Alto/Medio/Bajo |

### Timeline Alto Nivel
| Fase | Fecha Inicio | Fecha Fin |
|------|--------------|-----------|
| Planning | [Fecha] | [Fecha] |
| Implementation | [Fecha] | [Fecha] |
| Testing | [Fecha] | [Fecha] |
| Rollout | [Fecha] | [Fecha] |

### Presupuesto
[Estimación de recursos]

### Riesgos Críticos
[Top 3-5 riesgos]
```

#### Aprobación de Inicio
- [ ] **Aprobación del sponsor para iniciar planning**

---

### 📐 Fase 2: Análisis y Diseño Extensivo

#### Análisis de Impacto Completo
```markdown
## Impact Analysis

### Sistemas Afectados
| Sistema | Tipo de Impacto | Downtime Requerido |
|---------|----------------|-------------------|
| [Sistema 1] | Directo/Indirecto | Sí/No |

### Usuarios Afectados
- Internos: [Número y roles]
- Externos: [Número y tipos]

### Datos Afectados
- Volumen: [X registros/GB]
- Sensibilidad: [PII, financiero, etc.]
- Retención: [Políticas aplicables]

### Dependencias Externas
| Sistema Externo | Tipo | Contacto |
|----------------|------|----------|
| [Sistema] | [API/DB/Service] | [Persona] |

### Compliance
- [ ] GDPR
- [ ] SOC2
- [ ] HIPAA
- [ ] PCI-DSS
- [ ] Otro: [...]
```

#### Arquitectura Detallada
- [ ] Documento de arquitectura completo
- [ ] Diagramas de flujo detallados
- [ ] Diagramas de secuencia
- [ ] Modelo de datos
- [ ] ADRs para todas las decisiones mayores

#### Security Review Document
```markdown
## Security Review: [Nombre del Proyecto]

### Clasificación de Datos
| Tipo de Dato | Clasificación | Protección Requerida |
|--------------|---------------|---------------------|
| [Dato 1] | Público/Interno/Confidencial/Restringido | [Medidas] |

### Threat Model
```
[Diagrama o descripción del threat model]
```

### Controles de Seguridad
| Control | Estado | Responsable |
|---------|--------|-------------|
| Autenticación | [Implementado/Pendiente] | [Nombre] |
| Autorización | [...] | [...] |
| Encriptación en tránsito | [...] | [...] |
| Encriptación en reposo | [...] | [...] |
| Logging de auditoría | [...] | [...] |
| Rate limiting | [...] | [...] |

### Vulnerabilidades Identificadas
| ID | Descripción | Severidad | Mitigación |
|----|-------------|-----------|------------|
| V1 | [...] | Crítica/Alta/Media/Baja | [...] |

### Penetration Testing
- [ ] Requerido
- [ ] Scope definido
- [ ] Fecha programada: [...]

### Compliance Checklist
- [ ] Revisión de privacidad
- [ ] Data retention policy
- [ ] Right to be forgotten
- [ ] Audit trail
```

### 📝 Fase 3: Planning Detallado

#### Plan de Implementación por Sprints/Fases
```markdown
## Implementation Plan

### Phase 1: Foundation (Week 1-2)
**Goal**: [Objetivo de la fase]

#### Tasks
| Task | Owner | Estimate | Dependencies |
|------|-------|----------|--------------|
| [Task 1] | [Nombre] | [X días] | [...] |

#### Exit Criteria
- [ ] [Criterio 1]
- [ ] [Criterio 2]

#### Risks
- [Riesgo específico de esta fase]

---

### Phase 2: Core Implementation (Week 3-4)
[Similar estructura]

---

### Phase 3: Integration (Week 5)
[Similar estructura]

---

### Phase 4: Testing & Validation (Week 6)
[Similar estructura]

---

### Phase 5: Rollout (Week 7)
[Similar estructura]
```

#### Plan de Rollback Detallado
```markdown
## Rollback Plan

### Triggers para Rollback
- [ ] Error rate > X% por más de Y minutos
- [ ] Latencia > Xms p99
- [ ] Data inconsistency detectada
- [ ] Security incident
- [ ] Stakeholder request

### Pre-requisitos para Rollback
- [ ] Backup de base de datos (antes de migración)
- [ ] Versión anterior desplegable
- [ ] Feature flags configurados
- [ ] Comunicación template lista

### Procedimiento de Rollback

#### Paso 1: Decisión
- Quién puede decidir: [Nombres/Roles]
- Escalation path: [...]

#### Paso 2: Comunicación
Notificar a:
- [ ] Equipo de desarrollo
- [ ] Operations
- [ ] Stakeholders
- [ ] Usuarios (si aplica)

Template:
```
[ROLLBACK INICIADO]
Proyecto: [Nombre]
Razón: [...]
ETA: [...]
```

#### Paso 3: Ejecución Técnica
1. [Comando/Acción 1]
2. [Comando/Acción 2]
3. [Comando/Acción 3]

#### Paso 4: Verificación
- [ ] Sistema responde correctamente
- [ ] Datos consistentes
- [ ] Métricas normalizadas
- [ ] Tests smoke pasando

#### Paso 5: Post-mortem
- [ ] Documentar qué falló
- [ ] Programar revisión
- [ ] Identificar acciones correctivas
```

### ✋ Gate 1: Aprobación de Plan

**Requiere aprobación de**:
- [ ] Technical Lead
- [ ] Security Officer (si hay cambios de seguridad)
- [ ] Data Protection Officer (si hay datos PII)
- [ ] Project Sponsor

---

### 🛠️ Fase 4: Implementación Controlada

#### Ambiente de Staging/Pre-prod
- [ ] Ambiente idéntico a producción
- [ ] Datos de prueba representativos
- [ ] Todos los componentes desplegados

#### Feature Flags
- [ ] Feature flags implementados
- [ ] Rollout gradual configurado
- [ ] Kill switch funcional

#### Implementación por Fases
Para cada fase:
- [ ] Implementar cambios
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Review de código
- [ ] Merge a staging
- [ ] Validar en staging
- [ ] Gate review
- [ ] Merge a main

### ✋ Gate 2: Aprobación para Producción

**Pre-requisitos**:
- [ ] Todos los tests pasando
- [ ] Security scan completado
- [ ] Performance testing completado
- [ ] Rollback testado en staging
- [ ] Runbook actualizado
- [ ] On-call team notificado

**Aprobación de**:
- [ ] Technical Lead
- [ ] QA Lead
- [ ] Security (si aplica)
- [ ] Operations

---

### 🚀 Fase 5: Rollout

#### Pre-deployment
- [ ] Backup de producción completado
- [ ] Maintenance window comunicada (si aplica)
- [ ] Team de soporte en standby
- [ ] Dashboards de monitoreo abiertos

#### Deployment
- [ ] Deploy inicial (canary o % pequeño)
- [ ] Monitorear métricas clave
- [ ] Validar funcionalidad
- [ ] Incrementar rollout gradualmente
- [ ] Monitorear cada incremento

#### Post-deployment Validation
- [ ] Smoke tests pasando
- [ ] No aumento en error rate
- [ ] Latencia dentro de SLA
- [ ] No alertas críticas
- [ ] Usuarios reportando éxito

### 📊 Fase 6: Observación y Cierre

#### Período de Observación (24-72h)
- [ ] Monitoreo continuo
- [ ] Respuesta a incidentes si ocurren
- [ ] Feedback de usuarios

#### Cierre del Proyecto
- [ ] Rollback plan puede ser retirado
- [ ] Documentation finalizada
- [ ] Knowledge transfer completado
- [ ] Retrospectiva programada
- [ ] Métricas de éxito reportadas

#### Post-mortem / Retrospectiva
```markdown
## Project Retrospective

### Qué salió bien
- [...]

### Qué podría mejorar
- [...]

### Lecciones aprendidas
- [...]

### Action items para futuros proyectos
| Item | Owner | Due Date |
|------|-------|----------|
| [...] | [...] | [...] |
```

---

## Documentos Requeridos - Resumen

| Documento | Cuándo | Aprobación |
|-----------|--------|------------|
| Project Charter | Inicio | Sponsor |
| Impact Analysis | Análisis | Tech Lead |
| Architecture Doc | Diseño | Architect + Tech Lead |
| Security Review | Diseño | Security Officer |
| Implementation Plan | Planning | Tech Lead + PM |
| Test Plan | Planning | QA Lead |
| Rollback Plan | Planning | Operations |
| Runbook | Pre-deploy | Operations |
| Retrospective | Cierre | Team |
