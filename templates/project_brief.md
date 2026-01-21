# Project Brief Template 🚀

> **Instrucciones**: Copia este contenido en un nuevo archivo o pégalo directo en el chat.
> Reemplaza los textos entre corchetes `[...]` con tu información.
> Los ejemplos están en *cursiva* para guiarte. ¡Sé tan detallado como puedas!

---

## 1. Visión del Producto 🔭

**Nombre del Proyecto**: [Nombre Clave o Final]
> *Ejemplo: "FitTrack Pro" o "Proyecto Alfa"*

**Elevator Pitch** (En una frase, ¿qué es y para quién?):
[Describe tu producto en < 280 caracteres]
> *Ejemplo: Una plataforma SaaS que permite a pequeños gimnasios gestionar sus socios, pagos y rutinas de entrenamiento desde una sola app móvil, eliminando el uso de Excel y papel.*

**Objetivo Principal de Negocio**:
[Selecciona uno o describe]
- [ ] **Validar MVP (Quick & Dirty)**: *Prioridad velocidad, código descartable si es necesario.*
- [ ] **Producto Escalable (Long Term)**: *Prioridad calidad, arquitectura robusta, tests.*
- [ ] **Prototipo para Inversores**: *Prioridad visual, datos fake ("Click-dummy").*
- [ ] **Herramienta Interna**: *Prioridad funcionalidad sobre estética.*

## 2. Usuarios y Problema 👥

**Perfiles de Usuario (Personas)**:
1. **[Rol Principal]**: [Descripción breve]
   > *Ej: "Dueño de Gimnasio": Persona con poco tiempo, no muy técnica, usa el celular para todo.*
2. **[Rol Secundario]**: [Descripción breve]
   > *Ej: "Socio del Gimnasio": Quiere ver su rutina y pagar su cuota rápido.*

**Problemas a Resolver (Pain Points)**:
- [Problema 1]
  > *Ej: "Los dueños pierden dinero porque olvidan cobrar cuotas vencidas."*
- [Problema 2]
  > *Ej: "Los socios se aburren y abandonan porque no les cambian la rutina a tiempo."*

## 3. Funcionalidades Clave (Scope) ✨

*(Usa metodología MoSCoW para priorizar)*

### 🟢 Must Have (MVP Crítico - Sin esto NO se lanza)
- [Feature 1]
  > *Ej: Login social (Google) y Registro de usuarios.*
- [Feature 2]
  > *Ej: Dashboard administrativo para ver estado de pagos del mes.*
- [Feature 3]
  > *Ej: Módulo de creación de rutinas con ejercicios precargados.*

### 🟡 Should Have (Importante pero puede esperar a v1.1)
- [Feature 4]
  > *Ej: Notificaciones push automáticas cuando vence la cuota.*
- [Feature 5]
  > *Ej: Integración con MercadoPago/Stripe.*

### ⚪ Could Have (Deseable / Nice to have)
- [Feature 6]
  > *Ej: Gamification y ranking entre socios.*

### 🔴 Out of Scope (Explícitamente NO haremos esto ahora)
- [Anti-feature 1]
  > *Ej: No haremos app nativa iOS/Android por ahora, solo Web App Responsive (PWA).*

## 4. Preferencias Tecnológicas 🛠️

*(Marca con X tus preferencias. Deja en blanco si prefieres que el Arquitecto decida)*

**Frontend**:
- [ ] **React / Next.js** *(Estándar moderno, SEO friendly)*
- [ ] **Vue / Nuxt** *(Curva de aprendizaje suave)*
- [ ] **Mobile Nativo** *(React Native / Flutter)*
- [ ] **Otro**: [...]

**Backend**:
- [ ] **Python (FastAPI)** *(Rápido, excelente para IA/Data)*
- [ ] **Node.js (NestJS)** *(Estructurado, TypeScript, escalable)*
- [ ] **Node.js (Express)** *(Simple, minimalista)*
- [ ] **Otro**: [...]

**Base de Datos**:
- [ ] **SQL (PostgreSQL)** *(Relacional, datos estructurados, integridad)*
- [ ] **NoSQL (MongoDB)** *(Flexible, prototipado rápido)*
- [ ] **Arquitecto Decide** *(Según el caso de uso)*

**Infraestructura**:
- [ ] **Docker / Contenedores** *(Estándar)*
- [ ] **Serverless (Vercel/Supabase)** *(Rápido deploy, bajo costo inicial)*
- [ ] **Cloud Específico**: [AWS / GCP / Azure]

## 5. Diseño y UX 🎨

**Estilo Visual**:
- [ ] **Minimalista & Limpio** *(Mucho blanco, tipografía sans-serif)*
- [ ] **Corporativo & Serio** *(Azules, grises, confiable)*
- [ ] **Colorido & Juguetón** *(Para apps de consumo o jóvenes)*
- [ ] **Dark Mode** *(Obligatorio / Opcional)*

**Referencias (Inspiración)**:
- [Link 1] - *Qué te gusta: "Me gusta cómo muestran los gráficos aquí"*
- [Link 2] - *Qué te gusta: "El flujo de onboarding es perfecto"*

## 6. Reglas Especiales y Contexto ⚠️

**Compliance & Seguridad**:
- [Restricción 1]
  > *Ej: "Los datos deben estar alojados en Europa (GDPR)."*

**Integraciones Obligatorias**:
- [Integración 1]
  > *Ej: "Debe usar la API legacy de facturación de la empresa (adjunto docs)."*
