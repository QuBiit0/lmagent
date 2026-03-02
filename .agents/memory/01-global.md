# 🧠 Project Identity & Core Goals
> **Update Frequency:** Start of project & Major Pivots.

## 🎯 Mission
Construir y mantener el estándar definitivo para orquestación e interacción unificada de agentes de IA en cualquier entorno de desarrollo y repositorio local (LMAgent Framework).

## 📦 Core Value Proposition
- Framework "Zero-Friction" que permite a cualquier subagente o IDE (Cursor, Windsurf, Claude, Gemini, CLI) adoptar el mismo catálogo de reglas y skills instantáneamente.
- Eliminar la fragmentación de prompts y reglas diseminadas entre múltiples IDEs unificando el "Source of Truth" en `.agents/`.
- Potenciar automatizaciones, MCPs y workflows declarativos modulares (BMAD/Spec-Driven).

## 👥 Key Stakeholders / Users
- **Primary:** Ingenieros de Software y Tech Leads que utilizan múltiples IAs (ej: Cursor + Claude + Terminal) sobre un mismo repositorio.
- **Secondary:** Constructores de nuevos agentes (AI Devs) que necesitan un core interoperable y listo para producción sin reinventar prompt engineering arquitectural.

## 🌟 Definition of Success
1. El framework logra ser 100% agnóstico del IDE. Se actualiza una vez en `.agents/` y automáticamente repercute en todas las IAs interconectadas mediante CLI bridges/entry points.
2. Soporta +35 agentes out-of-the-box sin conflictos y permite fácil adición de *skills* comunitarias vía GH (ej: `lmagent skills add`).
