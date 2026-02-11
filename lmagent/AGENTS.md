# 🤖 LMAgent Intelligence Catalog

This document details the capabilities available in the **LMAgent** ecosystem.

## 🏗️ 1. Skills (Capacidades Ejecutables)
*Located in: `.cursor/skills/` or `~/.agents/skills/`*

Skills allow the Agent to **DO** things. They combine reasoning instructions (LLM context) with executable tools.

| Skill | Description | Usage Scenario |
| :--- | :--- | :--- |
| **ai-agent-engineer** | Expert in Large Language Models, Prompt Engineering, and Agentic Architectures (ReAct, Tool-use). | "Design a new agent", "Fix this prompt" |
| **architect** | System design, scalable patterns, cloud infrastructure. | "Plan the microservices architecture" |
| **devops-engineer** | CI/CD pipelines, Docker, Kubernetes, Terraform. | "Dockerize this app", "Fix the build" |
| **frontend-engineer** | React, Next.js, Tailwind, State Management. | "Build the dashboard UI", "Fix CSS bug" |
| **backend-engineer** | API design, Database schema, Authentication, Performance. | "Create a new API endpoint", "Optimize SQL" |
| **security-analyst** | Code auditing, vulnerability scanning, best practices. | "Audit this file for security flaws" |
| **qa-engineer** | Testing strategies, E2E tests (Playwright), Unit tests. | "Write tests for this feature" |

## 📜 2. Rules (Guardrails de Comportamiento)
*Located in: `.cursor/rules/` or `~/.agents/rules/`*

Rules define **HOW** the Agent should behave. They are fundamentally constraints and standards.

| Rule File | Enforces |
| :--- | :--- |
| `code-style.md` | Linter rules, naming conventions, directory structure. |
| `security.md` | No hardcoded secrets, input validation, auth checks. |
| `testing.md` | Mandatory TDD, test coverage requirements. |
| `api-design.md` | RESTful standards, error handling, versioning. |
| `stack.md` | Approved libraries and technology choices. |

## ⚡ 3. Workflows (Procedimientos Operativos)
*Located in: `.cursor/workflows/` or `~/.agents/workflows/`*

Workflows are **SOPs (Standard Operating Procedures)** that guide the Agent through complex, multi-step processes.

| Workflow | Goal |
| :--- | :--- |
| `new-feature.md` | End-to-end guide for implementing a feature request. |
| `bugfix-backend.md` | Protocol for diagnosing and fixing server-side bugs. |
| `generate-prd.md` | Template and process for writing Product Requirement Documents. |
| `security-review.md` | Checklist for pre-deployment security audits. |

---

## 💾 Installation

To install these capabilities into your current environment:

```bash
lmagent install
```
