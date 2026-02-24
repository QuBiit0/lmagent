# 🧠 LMAgent: The Universal AI Agent Runtime

```text
██╗     ███╗   ███╗ █████╗  ██████╗ ███████╗███╗   ██╗████████╗
██║     ████╗ ████║██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
██║     ██╔████╔██║███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║
██║     ██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║
███████╗██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║
╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝
                                                  by QuBit
```

![Version](https://img.shields.io/badge/version-3.2.0-blue.svg) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge) ![Agents](https://img.shields.io/badge/Agents-37_Supported-cyan?style=for-the-badge) ![Skills](https://img.shields.io/badge/Skills-31_Available-purple?style=for-the-badge)

> **"Separate the reasoning from the execution."**
> LMAgent is the foundational runtime that empowers your AI Agents with standardized **Skills**, **Rules**, and **Workflows** across **37 supported agents** (Cursor, Claude Code, Windsurf, Gemini CLI, Cline, Roo, Copilot, and many more).

---

## ⚡ One Command. Any Agent.

```bash
npx @qubiit/lmagent@latest
```

That's it. No global install required. LMAgent will:
1. **Auto-detect** which AI agents you have installed on your system
2. **Pre-select** the detected agents for installation
3. **Deploy** skills, rules, and workflows to each agent's directory
4. **Generate** the entry point file so each agent auto-invokes the framework

> **Requires Node.js ≥ 22**. Works on macOS, Linux, and Windows.

---

## 🚀 Full Setup Guide

### Step 1 — Initialize your project (first time only)
```bash
npx @qubiit/lmagent@latest init
```
Copies `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` to your project root. These are the entry points that agents read automatically when they start.

### Step 2 — Install the framework
```bash
npx @qubiit/lmagent@latest install
```
Deploys skills, rules, and workflows to all detected agents. Generates agent-specific config files.

### Step 3 — Verify
```bash
npx @qubiit/lmagent@latest doctor
```
Checks that everything is correctly configured.

### Update (when new versions are released)
```bash
npx @qubiit/lmagent@latest update
```

---

## 🏛️ Architecture

LMAgent uses a **Hub & Spoke** model: one universal brain (`.agents/`) that feeds all agents.

```text
Your Project/
├── .agents/                    # ← UNIVERSAL BRAIN (source of truth)
│   ├── rules/                  # 11 behavioral rules
│   ├── skills/                 # 31 specialized roles
│   ├── workflows/              # 13 SOPs (Standard Operating Procedures)
│   ├── memory/                 # 5 persistent context files
│   ├── templates/              # Project scaffolds & agent config templates
│   ├── scripts/                # Utility scripts
│   ├── config/                 # Framework settings
│   └── docs/                   # Extended documentation
│
├── AGENTS.md                   # ← PILLAR 1: Capability catalog (read by all agents)
├── CLAUDE.md                   # ← PILLAR 2: Entry point for Claude Code / Antigravity
├── GEMINI.md                   # ← PILLAR 3: Entry point for Gemini CLI / Antigravity
│
├── .cursor/rules/              # ← Cursor-specific rules & skills
├── .windsurf/rules/            # ← Windsurf-specific rules & skills
├── .claude/rules/              # ← Claude Code-specific rules & skills
└── ...                         # (one directory per installed agent)
```

### How auto-invocation works

Each agent reads a specific file when it starts. LMAgent generates that file automatically:

| Agent | Entry Point Generated |
|:---|:---|
| Cursor | `.cursorrules` |
| Claude Code | `CLAUDE.md` |
| Gemini CLI / Antigravity | `GEMINI.md` |
| Windsurf | `.windsurf/rules/lmagent.md` |
| Cline | `.clinerules/00-lmagent.md` |
| Roo Code | `.roo/rules/00-lmagent.md` |
| VSCode Copilot | `.github/copilot-instructions.md` |
| Goose | `.goosehints` |
| Continue | `.continuerules` |
| Junie | `.junie/guidelines.md` |
| OpenHands | `.openhands/microagents/repo.md` |
| Codex CLI | `AGENTS.md` |
| All others | `00-lmagent.md` in their `rulesDir` |

All entry points point to `AGENTS.md` — the single source of truth.

---

## 🧩 Skills Catalog (31 Skills)

Activate any skill by typing its trigger in the chat:

### 🎯 Management & Architecture
| Trigger | Skill | Description |
|:---|:---|:---|
| `/orch` | **orchestrator** | High-level task planning and agent coordination |
| `/pm` | **product-manager** | PRD generation, user stories, roadmap planning |
| `/arch` | **architect** | System design, scalable patterns, cloud infrastructure |
| `/lead` | **tech-lead** | Code review, technical decisions, mentoring |
| `/sm` | **scrum-master** | Agile ceremonies, sprint planning, retrospectives |
| `/doc` | **technical-writer** | Documentation, API refs, user guides |

### 🔧 Engineering
| Trigger | Skill | Description |
|:---|:---|:---|
| `/dev` | **backend-engineer** | APIs, database schema, authentication |
| `/front` | **frontend-engineer** | React, Next.js, Tailwind, state management |
| `/mobile` | **mobile-engineer** | React Native, Expo, iOS/Android pipelines |
| `/data` | **data-engineer** | ETL pipelines, SQL optimization, data warehousing |
| `/devops` | **devops-engineer** | CI/CD, Docker, Kubernetes, Terraform |
| `/sec` | **security-analyst** | Vulnerability scanning, OWASP, code auditing |
| `/test` | **qa-engineer** | E2E testing (Playwright), unit tests, QA strategy |
| `/review` | **code-reviewer** | Static analysis, logic verification, clean code |
| `/api` | **api-designer** | REST/GraphQL contracts, OpenAPI standards |
| `/supa` | **supabase-expert** | Supabase architecture, RLS, Edge Functions |
| `/git` | **git-workflow** | Branch management, conventional commits, releases |
| `/web` | **browser-agent** | Web automation, scraping, UI testing |
| `/seo` | **seo-auditor** | Technical SEO, Core Web Vitals, accessibility |

### ⚡ Specialized & AI
| Trigger | Skill | Description |
|:---|:---|:---|
| `/fix` | **systematic-debugger** | Methodical 4-phase debugging (RCA) |
| `/perf` | **performance-engineer** | Profiling, load testing, optimization |
| `/ux` | **ux-ui-designer** | Design systems, user flow, prototyping |
| `/agent` | **ai-agent-engineer** | Building LLM-based systems & MCP servers |
| `/auto` | **automation-engineer** | n8n workflows, Zapier, scripting |
| `/prompt` | **prompt-engineer** | Optimizing system prompts and LLM interactions |
| `/mcp` | **mcp-builder** | Build MCP servers, tools, and resources |
| `/pdf` | **document-generator** | Programmatic PDF/DOCX/XLSX generation |

### 🧠 Methodologies
| Trigger | Skill | Description |
|:---|:---|:---|
| `/bmad` | **bmad-methodology** | Scale-Adaptive Intelligence, complexity classification |
| `/sdd` | **spec-driven-dev** | Spec-first development pipeline |
| `/swe` | **swe-agent** | Autonomous issue resolution, trajectory logging |
| `/test-s` | **testing-strategist** | Test planning, pyramid strategy, coverage goals |

---

## 🌍 37 Supported Agents

| Agent | Config Path | Entry Point |
|:---|:---|:---|
| **Cursor** | `.cursor/` | `.cursorrules` |
| **Windsurf** | `.windsurf/` | `.windsurf/rules/lmagent.md` |
| **Cline** | `.clinerules/` | `.clinerules/00-lmagent.md` |
| **Roo Code** | `.roo/` | `.roo/rules/00-lmagent.md` |
| **VSCode Copilot** | `.github/` | `.github/copilot-instructions.md` |
| **Trae** | `.trae/` | `.trae/rules/lmagent.md` |
| **Trae CN** | `.trae-cn/` | `.trae-cn/rules/lmagent.md` |
| **Claude Code** | `.claude/` | `CLAUDE.md` |
| **Zed** | `.rules/` | `.rules/lmagent.md` |
| **Amp / Kimi / Replit** | `.agents/` | `.agents/rules/00-lmagent.md` |
| **Antigravity** | `.agent/` | `GEMINI.md` |
| **Augment** | `.augment/` | `.augment/rules/00-lmagent.md` |
| **Gemini CLI** | `.gemini/` | `GEMINI.md` |
| **OpenClaw / Envoid** | `rules/` | `openclaw.json` |
| **CodeBuddy** | `.codebuddy/` | `.codebuddy/rules/00-lmagent.md` |
| **Codex CLI** | `.codex/` | `AGENTS.md` |
| **Command Code** | `.commandcode/` | `.commandcode/rules/00-lmagent.md` |
| **Continue** | `.continue/` | `.continuerules` |
| **Crush** | `.crush/` | `.crush/rules/00-lmagent.md` |
| **Droid** | `.factory/` | `.factory/rules/00-lmagent.md` |
| **Goose** | `.goose/` | `.goosehints` |
| **Junie** | `.junie/` | `.junie/guidelines.md` |
| **iFlow CLI** | `.iflow/` | `.iflow/rules/00-lmagent.md` |
| **Kilo Code** | `.kilocode/` | `.kilocode/rules/00-lmagent.md` |
| **Kiro CLI** | `.kiro/` | `.kiro/rules/00-lmagent.md` |
| **Kode** | `.kode/` | `.kode/rules/00-lmagent.md` |
| **MCPJam** | `.mcpjam/` | `.mcpjam/rules/00-lmagent.md` |
| **Mistral Vibe** | `.vibe/` | `.vibe/rules/00-lmagent.md` |
| **Mux** | `.mux/` | `.mux/rules/00-lmagent.md` |
| **OpenCode** | `.opencode/` | `.opencode/rules/00-lmagent.md` |
| **OpenHands** | `.openhands/` | `.openhands/microagents/repo.md` |
| **Pi** | `.pi/` | `.pi/rules/00-lmagent.md` |
| **Qoder** | `.qoder/` | `.qoder/rules/00-lmagent.md` |
| **Qwen Code** | `.qwen/` | `.qwen/rules/00-lmagent.md` |
| **Zencoder** | `.zencoder/` | `.zencoder/rules/00-lmagent.md` |
| **Neovate** | `.neovate/` | `.neovate/rules/00-lmagent.md` |
| **Pochi** | `.pochi/` | `.pochi/rules/00-lmagent.md` |
| **AdaL** | `.adal/` | `.adal/rules/00-lmagent.md` |

---

## 🛠️ CLI Reference

```bash
# Core
npx @qubiit/lmagent@latest              # Interactive install (auto-detects agents)
npx @qubiit/lmagent@latest init         # Initialize project (copies AGENTS.md, CLAUDE.md, GEMINI.md)
npx @qubiit/lmagent@latest install      # Install/update framework in current project
npx @qubiit/lmagent@latest update       # Alias for install
npx @qubiit/lmagent@latest uninstall    # Remove all LMAgent files from project
npx @qubiit/lmagent@latest uninstall --all  # Also remove root entry points (CLAUDE.md, etc.)

# Diagnostics
npx @qubiit/lmagent@latest doctor       # Verify project configuration
npx @qubiit/lmagent@latest validate     # Validate integrity of all skills
npx @qubiit/lmagent@latest tokens       # Analyze framework token consumption

# Skills Management
npx @qubiit/lmagent@latest create-skill             # Create a new skill interactively
npx @qubiit/lmagent@latest skills add owner/repo    # Install external skill from GitHub
```

---

## 🛠️ Creating Custom Skills

```bash
# Create a new skill interactively
npx @qubiit/lmagent@latest create-skill

# Install an external skill from GitHub
npx @qubiit/lmagent@latest skills add owner/repo-name

# Validate all skills
npx @qubiit/lmagent@latest validate
```

Skills follow the standard structure:
```text
.agents/skills/my-skill/
├── SKILL.md          # Main instructions (required)
└── ...               # Optional additional files
```

---

## 👨‍💻 Developer Setup

If you are contributing to the framework:

```bash
git clone https://github.com/QuBiit0/lmagent.git
cd lmagent
npm install
npm link
lmagent doctor
```

---

## 🤝 Contributing

We welcome contributions to expand the **Universal Agent Brain**.
Check out `CONTRIBUTING.md` to add new Skills, Rules, or IDE support.

---

<p align="center">
  Built with ❤️ by <b>QuBit</b> · <a href="https://github.com/QuBiit0/lmagent">GitHub</a>
</p>
