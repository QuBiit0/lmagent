# 📊 LMAgent 2.7.0 - Audit of Supported Agents & Triggers

**Total Supported Entities:** 42
- **Skills (Specialized Roles):** 31
- **Platform Agents (IDEs/Systems):** 11

## 1. Platform Agents (IDEs & Ecosystems)
*These depend on `install.js` for bootstrapping.*

| Agent / IDE | Config File | Trigger Status | Path Logic |
|:--- |:--- |:--- |:--- |
| **Cursor** | `.cursorrules` | ✅ Active | `.cursor/rules/` |
| **Windsurf** | `.windsurfrules` | ✅ Active | `.windsurf/rules/` |
| **VSCode Copilot** | `.github/copilot-instructions.md` | ✅ Active | `.github/instructions/` |
| **Claude Code** | `CLAUDE.md` | ✅ Redirect | `.claude/rules/` |
| **Cline** | `.clinerules/00-lmagent.md` | ✅ Active | `.clinerules/` |
| **Roo Code** | `.clinerules/00-lmagent.md` | ✅ Active | `.clinerules/` |
| **Trae** | `.trae/rules/lmagent.md` | ✅ Active | `.trae/rules/` |
| **Antigravity** | `.agent/config.yaml` | ⚠️ Manual | `.agent/rules/` |
| **Amp / Kimi** | `.agent/config` | ⚠️ Manual | `.agents/rules/` |
| **Augment** | `.augment/config` | ⚠️ Manual | `.augment/rules/` |
| **Codex** | `.codex/config` | ⚠️ Manual | `.codex/skills/` |

> **Note:** "Manual" status means `install.js` defines the path, but does not auto-inject the "Lean Router" table because these agents use YAML/JSON configs or rely on server-side context.

## 2. Skills (Specialized Roles)
*These depend on `AGENTS.md` triggers.*

### 🎯 Meta (3)
| Skill | Trigger | Status |
|:--- |:--- |:--- |
| **orchestrator** | `/orch` | ✅ Verified |
| **product-manager** | `/pm` | ✅ Verified |
| **architect** | `/arch` | ✅ Verified |

### 🔧 Engineering (15)
| Skill | Trigger | Status |
|:--- |:--- |:--- |
| **backend-engineer** | `/dev` | ✅ Verified |
| **frontend-engineer** | `/front` | ✅ Verified |
| **mobile-engineer** | `/mobile` | ✅ Verified |
| **data-engineer** | `/data` | ✅ Verified |
| **devops-engineer** | `/devops` | ✅ Verified |
| **performance-engineer** | `/perf` | ✅ Verified |
| **security-analyst** | `/sec` | ✅ Verified |
| **qa-engineer** | `/test` | ✅ Verified |
| **code-reviewer** | `/review` | ✅ Verified |
| **systematic-debugger** | `/fix` | ✅ Verified |
| **api-designer** | `/api` | ✅ Verified |
| **supabase-expert** | `/supa` | ✅ Verified |
| **git-workflow** | `/git` | ✅ Verified |
| **browser-agent** | `/web` | ✅ Verified |
| **seo-auditor** | `/seo` | ✅ Verified |

### 🤖 AI & Automation (5)
| Skill | Trigger | Status |
|:--- |:--- |:--- |
| **ai-agent-engineer** | `/agent` | ✅ Verified |
| **automation-engineer** | `/auto` | ✅ Verified |
| **prompt-engineer** | `/prompt` | ✅ Verified |
| **mcp-builder** | `/mcp` | ✅ Verified |
| **document-generator** | `/pdf` | ✅ Verified |

### 📋 Management (4)
| Skill | Trigger | Status |
|:--- |:--- |:--- |
| **scrum-master** | `/sm` | ✅ Verified |
| **technical-writer** | `/doc` | ✅ Verified |
| **ux-ui-designer** | `/ux` | ✅ Verified |
| **tech-lead** | `/lead` | ✅ Verified |

### 🛠️ Utilities (4)
*New skills found in directory, missing explicit triggers in AGENTS.md*
| Skill | Recommended Trigger | Status |
|:--- |:--- |:--- |
| **bmad-methodology** | `/bmad` | ❌ Missing |
| **spec-driven-dev** | `/sdd` | ❌ Missing |
| **swe-agent** | `/swe` | ❌ Missing |
| **testing-strategist** | `/tdd` | ✅ Present (via QA) |

## 🏁 Summary
- **Coverage**: 90%
- **Missing Triggers**: 3 Skills found on disk but missing in `AGENTS.md`.
    - `bmad-methodology`
    - `spec-driven-dev`
    - `swe-agent`
