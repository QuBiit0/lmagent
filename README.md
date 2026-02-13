# 🧠 LMAgent: The Universal AI Agent Runtime

```text
██╗     ███╗   ███╗ █████╗  ██████╗ ███████╗███╗   ██╗████████╗
██║     ████╗ ████║██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
██║     ██╔████╔██║███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   
██║     ██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   
███████╗██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   
╚══════╝╚╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   
                                                  by QuBit
```

![Version](https://img.shields.io/badge/version-3.1.2-blue.svg) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge) ![Agentic](https://img.shields.io/badge/AI-Agentic_Workflow-cyan?style=for-the-badge)

> **"Separate the reasoning from the execution."**  
> LMAgent is the foundational runtime that empowers your AI Agents with standardized **Skills**, **Rules**, and **Workflows** across any IDE (Cursor, Windsurf, VSCode, Zed, Qodo).

---

## 🚀 Quick Start Guide

The recommended way to use LMAgent is via `npx`, ensuring you always run the latest version without managing global packages.

### ⚡ Instant Run (No Install)
Run these commands directly in your terminal:

```bash
# 1. Initialize Project (Context)
#    Copies AGENTS.md & CLAUDE.md to your root.
npx lmagent init

# 2. Install/Update Skills (Tools)
#    Configures your IDE (.cursor, .vscode, .windsurf, etc.)
npx lmagent install

# 3. Optimize & Verify
#    Checks your environment health.
npx lmagent doctor
```

### 📦 Global Installation (Optional)
If you prefer having the `lmagent` command available globally:

```bash
# Install
npm install -g @qubiit/lmagent

# Run
lmagent init
lmagent install
```

### 🛠️ Developer Setup
If you are contributing to the framework:

```bash
git clone https://github.com/QuBit/lmagent.git
cd lmagent
npm install
npm link
lmagent doctor
```

---

## 🏛️ Architecture: Global Brain vs. Local Project

LMAgent uses a **Hybrid Architecture** to balance **Centralized Updates** with **Project Portability**.

### The Problem it Solves
*   **Global Installs** run the risk of breaking projects if they rely on your specific machine paths.
*   **Local Copies** become stale and are hard to update across 10+ projects.

### The Solution: "Symlink Bridge"

| Layer | Location | Purpose |
| :--- | :--- | :--- |
| **1. Global Brain** | `~/.agents/` | **Single Source of Truth**. Hosted in your user home. Updated via `npm update -g`. |
| **2. Local Project** | `./.cursor/skills/` | **Symlinks** pointing to the Global Brain. Lightweight and bridge-like. |
| **3. Context** | `./CLAUDE.md` | Points to **Local Symlinks** (Relative Paths). **100% Portable** to other devs. |

### Why `init` and `install` are separate?
1.  **`lmagent init`**: Creates the **Portable Structure** (files that *must* exist in the repo to work, like `CLAUDE.md`).
2.  **`lmagent install`**: Builds the **Bridge** (Symlinks) specific to *your* machine's environment.

> **Best Practice**: Commit `CLAUDE.md` and `AGENTS.md`. **Do NOT** commit the `.cursor/skills` folder (add it to `.gitignore`), as each developer should run `lmagent install` to link their own brain.

---

## 🛠️ Creating New Skills
Need a custom agent? Use the interactive generator:

```bash
# Verify structure of existing skills
npx lmagent validate

# Create a new skill interactively
npx lmagent create-skill
```
This will generate the standard directory structure and `SKILL.md` template for you.

---

## 🛠️ CLI Reference

LMAgent includes a powerful CLI to manage your AI context.

| Command | Usage | Description |
| :--- | :--- | :--- |
| **`init`** | `npx lmagent init` | Initializes the project. Copies `AGENTS.md` (catalog) and `CLAUDE.md` to your root. |
| **`install`** | `npx lmagent install` | **Core Command**. This command will deploy the **Universal Intelligence** (`.agents/`) folder and the core pillars (`AGENTS.md`, `CLAUDE.md`) to your project root. |
| **`update`** | `npx lmagent update` | Alias for `install`. Use this to refresh your skills when new versions are released. |
| **`doctor`** | `npx lmagent doctor` | Verifies your environment, checking for correct file structures using `validate_skills` logic. |
| **`validate`** | `npx lmagent validate` | Scans all `SKILL.md` files for syntax errors or missing required fields. |
| **`create-skill`** | `npx lmagent create-skill` | Interactive wizard to generate a new Skill structure best practices. |

---

## 📂 Universal Project Structure

When you install **LMAgent** in your project, it creates a pristine environment:

```text
/
├── .agents/                    # [UNIVERSAL BRAIN]
│   ├── rules/                  # Core Behavior (00-master, personality, etc.)
│   ├── skills/                 # Capabilities (backend-engineer, etc.)
│   ├── workflows/              # Procedures (SOPs)
│   ├── templates/              # Project scaffolds
│   ├── memory/                 # Documentation & Logs
│   ├── scripts/                # Utility scripts
│   └── config/                 # Global settings
│
├── AGENTS.md                   # [PILLAR 1] Capability Catalog (Root)
├── CLAUDE.md                   # [PILLAR 2] Context & Instructions (Root)
│
└── package.json
```

### 🧠 The Two Pillars
1. **AGENTS.md**: The catalog of all capabilities. It tells the agent *what* it can do and *where* to find instructions.
2. **CLAUDE.md**: The context file. It tells the agent *how* to behave and points to the Master Rule in `.agents/rules/00-master.md`.

---

## 🏛️ The 3-Pillar Architecture

LMAgent organizes AI capabilities into three distinct pillars, enforcing a clear separation of concerns.

```mermaid
graph TD
    A["🤖 AI Agent"] --> B("🛠️ Skills")
    A --> C("📜 Rules")
    A --> D("⚡ Workflows")
    
    B --> B1["{ide}/skills/"]
    B --> B2["Executable Tools & Scripts"]
    
    C --> C1["{ide}/rules/"]
    C --> C2["Behavioral Guardrails & Context"]
    
    D --> D1["{ide}/workflows/"]
    D --> D2["Standard Operating Procedures (SOPs)"]
```

### 1. 🛠️ Skills (Capabilities)
*Executable units that allow the Agent to interact with the world.*  
**Location:** `{ide}/skills/` or `~/.agents/skills/`

| Skill Name | Description | Tools Included |
| :--- | :--- | :--- |
| **ai-agent-engineer** | Expert in building LLM-based systems & MCP servers. | `create-agent`, `scaffold-mcp` |
| **api-designer** | Design REST/GraphQL contracts, OpenAPI standards. | `scaffold-api`, `lint-openapi` |
| **architect** | System design, scalable patterns, cloud infrastructure. | `design-system`, `review-architecture` |
| **automation-engineer** | n8n workflows, Zapier integration, scripting. | `deploy-n8n`, `check-webhook` |
| **backend-engineer** | API design, Database schema, Authentication. | `scaffold-api`, `optimize-query` |
| **bmad-methodology** | Scale-Adaptive Intelligence, project kickoff, complexity classification. | `classify-level`, `kickoff-project` |
| **browser-agent** | Web automation, scraping, UI testing with Playwright. | `scrape-site`, `automate-flow` |
| **code-reviewer** | Static analysis, logic verification, clean code standards. | `review-pr`, `analyze-complexity` |
| **data-engineer** | ETL pipelines, SQL optimization, Data warehousing. | `analyze-schema`, `run-migration` |
| **devops-engineer** | CI/CD, Docker, Kubernetes, Terraform. | `docker-build`, `k8s-deploy` |
| **document-generator** | Programmatic PDF/DOCX/XLSX generation. | `gen-pdf`, `gen-report` |
| **frontend-engineer** | React, Next.js, Tailwind, State Management. | `scaffold-component`, `check-accessibility` |
| **git-workflow** | Branch management, conventional commits, release flow. | `feature-start`, `release-prep` |
| **mcp-builder** | Build MCP servers, tools, and resources. | `new-mcp-server`, `test-tool` |
| **mobile-engineer** | React Native, Expo, iOS/Android build pipelines. | `build-ios`, `debug-android` |
| **orchestrator** | High-level task planning and agent coordination. | `plan-task`, `delegate-subtask` |
| **performance-engineer** | Profiling, load testing, optimization. | `run-lighthouse`, `profile-memory` |
| **product-manager** | PRD generation, user stories, roadmap planning. | `generate-user-story`, `prioritize-backlog` |
| **prompt-engineer** | Optimizing system prompts and LLM interactions. | `optimize-prompt`, `eval-prompt` |
| **qa-engineer** | E2E testing (Playwright), Unit tests, QA strategy. | `run-playwright`, `generate-test-plan` |
| **scrum-master** | Agile ceremonies, sprint planning, retrospective. | `start-sprint`, `generate-retro` |
| **security-analyst** | Vulnerability scanning, code auditing, OWASP. | `scan-vulnerabilities`, `audit-code` |
| **seo-auditor** | Technical SEO, Core Web Vitals, accessibility audit. | `audit-seo`, `check-meta` |
| **spec-driven-dev** | Spec-first development pipeline: SPECIFY → PLAN → TASKS → IMPLEMENT → VERIFY. | `create-spec`, `validate-spec` |
| **supabase-expert** | Supabase architecture, RLS, Edge Functions. | `init-supabase`, `deploy-edge` |
| **swe-agent** | Autonomous issue resolution, trajectory logging, Edit-Lint-Test loops. | `resolve-issue`, `trajectory-log` |
| **systematic-debugger** | Methodical 4-phase debugging (RCA). | `debug-session`, `analyze-logs` |
| **tech-lead** | Code review, technical decision making, mentoring. | `review-pr`, `enforce-standards` |
| **technical-writer** | Documentation, API refs, user guides. | `generate-docs`, `update-readme` |
| **testing-strategist** | Test planning, pyramid strategy, coverage goals. | `plan-testing`, `define-coverage` |
| **ux-ui-designer** | Design systems, user flow, prototyping. | `analyze-ux`, `generate-palette` |


### 2. 📜 Rules (Context & Guardrails)
*Constraints and guidelines that shape Agent behavior.*  
**Location:** `{ide}/rules/` or `~/.agents/rules/`

| Rule File | Description |
| :--- | :--- |
| **_bootstrap.md** | ⭐ **Entry point**: Startup check, skill activation, critical rules for ALL IDEs. |
| **agents-ia.md** | Core guidelines for building AI Agents (Tool-first, Stateless, Observable). |
| **api-design.md** | REST/GraphQL standards, error handling, versioning best practices. |
| **automations-n8n.md** | Best practices for building robust n8n workflows. |
| **code-style.md** | Linter configuration, naming conventions, project structure. |
| **documentation.md** | Standards for code comments, READMEs, and architectural decision records (ADRs). |
| **security.md** | **Critical**: Input validation, secret management, OWASP Top 10 prevention. |
| **stack.md** | Approved technology stack and library choices for the project. |
| **testing.md** | Mandatory Test-Driven Development (TDD) workflows and coverage requirements. |
| **workflow.md** | General git flow and contribution guidelines. |


### 3. ⚡ Workflows (SOPs)
*Step-by-step guides for complex tasks.*  
**Location:** `{ide}/workflows/` or `~/.agents/workflows/`

| Workflow Name | Purpose |
| :--- | :--- |
| **bugfix-backend.md** | Protocol for diagnosing, fixing, and verifying server-side bugs. |
| **documentation.md** | Guide for updating and maintaining project documentation. |
| **generate-prd.md** | Template and instructions for creating Product Requirement Documents. |
| **ideation.md** | Brainstorming process for new features or products. |
| **new-agent-ia.md** | End-to-end guide for creating a new AI Agent from scratch. |
| **new-automation.md** | Steps to design and deploy a new automation (n8n/script). |
| **new-feature.md** | Standard flow: Ticket -> Design -> Implementation -> Test -> PR. |
| **optimize-performance.md** | Systematic approach to identifying and fixing bottlenecks. |
| **resolve-github-issue.md** | Standard flow for addressing GitHub Issues. |
| **security-review.md** | Checklist for pre-deployment security audits. |
| **spec-driven.md** | Development methodology based on detailed specifications (Spec-First). |
| **testing-strategy.md** | Defining the testing pyramid and strategy for a feature. |
| **third-party-integration.md** | Guide for securely integrating external APIs and SDKs. |

---

## 💎 Features & IDE Support

### 🌍 Centralized "Brain" (`~/.agents`)
LMAgent creates a **Single Source of Truth** in your home directory.
*   **Update Once, Reflect Everywhere**: Modify a rule in `~/.agents/rules/code-style.md`, and *every project* using Symlinks updates instantly.
*   **Zero-Copy Efficiency**: No more valid/duplicate `.md` files cluttering every repo.

### 🧩 Multi-IDE Support


| IDE | Status | Config Path |
| :--- | :--- | :--- |
| **Cursor** | ✅ Full | `.cursor/` |
| **Windsurf** | ✅ Full | `.windsurf/` |
| **VSCode / Copilot** | ✅ Full | `.github/` |
| **Zed** | ✅ Full | `.rules/` |
| **Antigravity** | ✅ Full | `.agent/` |
| **Claude Code** | ✅ Full | `.claude/` |
| **Cline / Roo Code** | ✅ Full | `.clinerules/` / `.roo/` |
| **Continue** | ✅ Full | `.continue/` |
| **Trae** | ✅ Full | `.trae/` |
| **Qodo** | ✅ Full | `agents/` |
| **Amp / Kimi / Replit** | ✅ Full | `.agents/` |
| **Augment** | ✅ Full | `.augment/` |
| **Codex** | ✅ Full | `.codex/` |
| **Gemini CLI** | ✅ Full | `.gemini/` |
| **OpenCode** | ✅ Full | `.opencode/` |
| **OpenHands** | ✅ Full | `.openhands/` |
| **Goose** | ✅ Full | `.goose/` |
| **Mistral Vibe** | ✅ Full | `.vibe/` |
| **Envoid (OpenClaw)** | ✅ Full | `openclaw.json` |
| **CodeBuddy** | ✅ Full | `.codebuddy/` |
| **Command Code** | ✅ Full | `.commandcode/` |
| **Crush** | ✅ Full | `.crush/` |
| **Droid** | ✅ Full | `.factory/` |
| **Junie** | ✅ Full | `.junie/` |
| **iFlow** | ✅ Full | `.iflow/` |
| **Kilo Code** | ✅ Full | `.kilocode/` |
| **Kiro** | ✅ Full | `.kiro/` |
| **Kode** | ✅ Full | `.kode/` |
| **MCPJam** | ✅ Full | `.mcpjam/` |
| **Mux** | ✅ Full | `.mux/` |
| **Pi** | ✅ Full | `.pi/` |
| **Qoder** | ✅ Full | `.qoder/` |
| **Qwen Code** | ✅ Full | `.qwen/` |
| **Trae CN** | ✅ Full | `.trae-cn/` |
| **Zencoder** | ✅ Full | `.zencoder/` |
| **Neovate** | ✅ Full | `.neovate/` |
| **Pochi** | ✅ Full | `.pochi/` |
| **AdaL** | ✅ Full | `.adal/` |

---

## 🤝 Contributing

We welcome contributions to expand the **Universal Agent Brain**.
Check out `CONTRIBUTING.md` to add new Skills, Rules, or IDE support.




---

<p align="center">
  Built with ❤️ by <b>QuBit</b>
</p>
