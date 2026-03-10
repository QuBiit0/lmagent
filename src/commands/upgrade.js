const fs = require('fs');
const path = require('path');
const https = require('https');
const chalk = require('chalk');

module.exports = async function runUpgrade() {
    const targetSkillsDir = path.join(process.cwd(), '.agents', 'skills');
    if (!fs.existsSync(targetSkillsDir)) {
        console.error(chalk.red('❌ No se encontró la carpeta .agents/skills. Inicializa primero con `lmagent init`'));
        process.exit(1);
    }

    const skills = fs.readdirSync(targetSkillsDir).filter(s => {
        return fs.statSync(path.join(targetSkillsDir, s)).isDirectory() && fs.existsSync(path.join(targetSkillsDir, s, 'SKILL.md'));
    });

    if (skills.length === 0) {
        console.log(chalk.yellow('⚠️  No hay skills instalados para actualizar.'));
        return;
    }

    console.log(chalk.cyan(`🔄 Buscando actualizaciones para ${skills.length} skill(s)...`));

    let updated = 0;
    let upToDate = 0;

    const parseVersion = (content) => {
        const match = content.match(/version:\s*['"]?([0-9.]+)['"]?/);
        return match ? match[1] : '0.0.0';
    };

    const fetchRemoteSkill = (skillName) => {
        return new Promise((resolve) => {
            const url = `https://raw.githubusercontent.com/QuBiit0/lmagent/main/.agents/skills/${skillName}/SKILL.md`;
            https.get(url, (res) => {
                if (res.statusCode !== 200) {
                    resolve(null);
                    return;
                }
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', () => resolve(null));
        });
    };

    for (const skill of skills) {
        const localFile = path.join(targetSkillsDir, skill, 'SKILL.md');
        const localContent = fs.readFileSync(localFile, 'utf8');
        const localVersion = parseVersion(localContent);

        const remoteContent = await fetchRemoteSkill(skill);
        if (!remoteContent) {
            console.log(`  ${chalk.yellow('?')} ${skill} (No encontrado en repositorio central)`);
            continue;
        }

        const remoteVersion = parseVersion(remoteContent);
        const v1 = localVersion.split('.').map(Number);
        const v2 = remoteVersion.split('.').map(Number);

        let isNewer = false;
        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;
            if (num2 > num1) { isNewer = true; break; }
            if (num2 < num1) { break; }
        }

        if (isNewer) {
            fs.writeFileSync(localFile, remoteContent, 'utf8');
            console.log(`  ${chalk.green('✔')} ${skill}: Actualizado de v${localVersion} a v${remoteVersion}`);
            updated++;
        } else {
            console.log(`  ${chalk.gray('-')} ${skill}: Al día (v${localVersion})`);
            upToDate++;
        }
    }

    console.log(chalk.green(`\n✨ Proceso completado. ${updated} skill(s) actualizados, ${upToDate} ya al día.`));
};
