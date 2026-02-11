
import os
import re
import yaml
from datetime import datetime

# Configuration
SKILLS_DIR = r"skills"
TEMPLATE_SKILL_MD = """---
name: {name}
role: {role}
type: agent_persona
version: 1.0.0
icon: {icon}
expertise:
{expertise_list}
activates_on:
{activates_on_list}
triggers:
{triggers_list}
---

# {name} Persona

## 🧠 System Prompt
> **Instrucciones para el LLM**: Copia este bloque en tu system prompt.

```markdown
Eres **{name}**, {role_description}.
Tu objetivo es **{objective}**.
Tu tono es **{tone}**.

**Principios Core:**
1. **Principio 1**: Descripción.
2. **Principio 2**: Descripción.

**Restricciones:**
- NUNCA ...
- SIEMPRE ...
```

## 🔄 Arquitectura Cognitiva (Cómo Pensar)

### 1. Fase de Análisis
- ...

### 2. Fase de Ejecución
- ...

---

## Rol

{description}

## Responsabilidades

1. **Responsabilidad 1**: ...
2. **Responsabilidad 2**: ...

## Stack Técnico

### Tools
```
tool_name -> Description
```

## Interacción con otros roles

| Rol | Colaboración |
|-----|-------------|
| Architect | ... |

---

## 🛠️ Herramientas Preferidas

| Herramienta | Cuándo Usarla |
|-------------|---------------|
| `run_command` | ... |

## 📋 Definition of Done

- [ ] Tarea 1
- [ ] Tarea 2
"""

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

def get_input_list(prompt_text):
    print(f"\n{prompt_text} (Enter empty line to finish):")
    items = []
    while True:
        item = input("- ").strip()
        if not item:
            break
        items.append(item)
    return items

def main():
    print("Welcome to the LMAgent Skill Generator! 🚀")
    print("This script will help you create a new skill following the standard structure.\n")
    
    # Basic Info
    name = input("Skill Name (e.g. 'Data Engineer'): ").strip()
    if not name:
        print("❌ Name is required.")
        return

    slug = slugify(name)
    skill_path = os.path.join(SKILLS_DIR, slug)
    
    if os.path.exists(skill_path):
        print(f"❌ Skill '{slug}' already exists at {skill_path}")
        return

    print(f"📍 Creating skill at: {skill_path}")
    
    role = input("Role Short Description (e.g. 'Diseño de Bases de Datos'): ").strip()
    icon = input("Icon (emoji, e.g. 🗜️): ").strip() or "🤖"
    
    # Lists
    expertise = get_input_list("Enter Expertise areas")
    if not expertise: expertise = ["General Knowledge"]
    
    activates_on = get_input_list("Enter Activation phrases (User Intents)")
    if not activates_on: activates_on = ["General request"]
    
    triggers = get_input_list("Enter Slash Commands (e.g. /data)")
    if not triggers: triggers = [f"/{slug}"]

    # Detailed Info for Template
    role_description = input("\nRole Description for Prompt (e.g. 'el guardián de los datos'): ").strip()
    objective = input("Main Objective (e.g. 'GARANTIZAR DATOS CONSISTENTES'): ").strip()
    tone = input("Tone (e.g. 'Metódico, Preciso'): ").strip()
    description = input("Long Description: ").strip()

    # Formatting lists for YAML
    expertise_str = "\n".join([f"  - {item}" for item in expertise])
    activates_on_str = "\n".join([f"  - {item}" for item in activates_on])
    triggers_str = "\n".join([f"  - {item}" for item in triggers])

    # Fill Template
    content = TEMPLATE_SKILL_MD.format(
        name=name,
        role=role,
        icon=icon,
        expertise_list=expertise_str,
        activates_on_list=activates_on_str,
        triggers_list=triggers_str,
        role_description=role_description,
        objective=objective,
        tone=tone,
        description=description
    )

    # Create Directory Structure
    try:
        os.makedirs(skill_path)
        os.makedirs(os.path.join(skill_path, "references"))
        os.makedirs(os.path.join(skill_path, "scripts"))
        os.makedirs(os.path.join(skill_path, "assets"))
        
        # Write SKILL.md
        with open(os.path.join(skill_path, "SKILL.md"), "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"\n✅ Skill '{name}' created successfully!")
        print(f"📂 Location: {skill_path}")
        print("👉 Next steps:")
        print("   1. Edit SKILL.md to refine the System Prompt.")
        print("   2. Add reference materials to 'references/'.")
        print("   3. Run 'node install.js' to install it in your IDE.")
        
    except Exception as e:
        print(f"❌ Error creating skill: {e}")

if __name__ == "__main__":
    main()
