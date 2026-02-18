const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '..', '.agents', 'skills');

function fixDescriptions() {
    if (!fs.existsSync(skillsDir)) {
        console.error('Skills directory not found:', skillsDir);
        process.exit(1);
    }

    const skills = fs.readdirSync(skillsDir);
    let updated = 0;

    skills.forEach(skill => {
        const skillPath = path.join(skillsDir, skill, 'SKILL.md');
        if (fs.existsSync(skillPath)) {
            let content = fs.readFileSync(skillPath, 'utf8');

            // Regex to find description line
            // Captures "description: value" where value is NOT double-quoted
            // Note: This is a simple heuristic. It assumes description is on one line.
            const regex = /^description: ([^"].*)$/m;

            const match = content.match(regex);

            if (match) {
                const originalDescription = match[1].trim();
                // Escape existing quotes if any (though regex excludes starting quote)
                const escapedDescription = originalDescription.replace(/"/g, '\\"');
                const newLine = `description: "${escapedDescription}"`;

                content = content.replace(match[0], newLine);
                fs.writeFileSync(skillPath, content, 'utf8');
                console.log(`✅ Fixed ${skill}: ${originalDescription.substring(0, 30)}...`);
                updated++;
            } else {
                // Check if it's already quoted
                if (/^description: ".*"$/m.test(content)) {
                    console.log(`👌 ${skill} already quoted.`);
                } else {
                    console.log(`⚠️ ${skill} description format not matching expected pattern.`);
                }
            }
        }
    });

    console.log(`\nFixed ${updated} skills.`);
}

fixDescriptions();
