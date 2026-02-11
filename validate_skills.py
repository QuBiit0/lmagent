import os
import yaml
import re

SKILLS_DIR = r"c:\Users\QuBit\Desktop\DESARROLLO\lmagent\skills"

REQUIRED_FIELDS = [
    "name",
    "role",
    "type",
    "version",
    "icon",
    "expertise",
    "activates_on",
    "triggers"
]

def parse_frontmatter(content):
    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if match:
        return yaml.safe_load(match.group(1))
    return None

def validate_skill(dirname):
    skill_path = os.path.join(SKILLS_DIR, dirname)
    skill_file = os.path.join(skill_path, "SKILL.md")
    
    if not os.path.isfile(skill_file):
        print(f"❌ {dirname}: Missing SKILL.md")
        return False
        
    try:
        with open(skill_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        frontmatter = parse_frontmatter(content)
        if not frontmatter:
            print(f"❌ {dirname}: Invalid or missing YAML frontmatter")
            return False
            
        missing = [field for field in REQUIRED_FIELDS if field not in frontmatter]
        if missing:
            print(f"❌ {dirname}: Missing fields: {missing}")
            return False
            
        # Optional: Check structure
        subdirs = [d for d in os.listdir(skill_path) if os.path.isdir(os.path.join(skill_path, d))]
        print(f"✅ {dirname}: Valid. Found subdirs: {subdirs}")
        return True
        
    except Exception as e:
        print(f"❌ {dirname}: Error reading file: {e}")
        return False

print(f"Scanning {SKILLS_DIR}...")
skills = [d for d in os.listdir(SKILLS_DIR) if os.path.isdir(os.path.join(SKILLS_DIR, d))]
results = []
for skill in skills:
    results.append(validate_skill(skill))

if all(results):
    print("\n🎉 All skills are valid!")
else:
    print("\n⚠️ Some skills have issues.")
