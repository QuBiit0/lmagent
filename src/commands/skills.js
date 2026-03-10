const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { copyRecursiveSync } = require('../utils/file-system.js');

module.exports = async function runSkills(action, source, opts) {
    if (action !== 'add') {
        console.error(chalk.red(`❌ Acción desconocida: ${action}. Usa: lmagent skills add <owner/repo>`));
        process.exit(1);
    }

    const repoSlug = source.replace('https://github.com/', '').replace(/\.git$/, '');
    const parts = repoSlug.split('/');
    const owner = parts[0];
    const repo = parts[1];

    if (!owner || !repo) {
        console.error(chalk.red('❌ Formato inválido. Usa: lmagent skills add owner/repo o URL completa'));
        process.exit(1);
    }

    let subPath = '';
    let branch = 'main';
    if (parts.length > 3 && parts[2] === 'tree') {
        branch = parts[3];
        subPath = parts.slice(4).join('/');
    }

    const tmpDir = path.join(os.tmpdir(), `lmagent-skill-${Date.now()}`);
    const targetSkillsDir = path.join(process.cwd(), '.agents', 'skills');
    console.log(chalk.cyan(`📦 Descargando skill desde github.com/${owner}/${repo}${subPath ? '/' + subPath : ''}...`));

    try {
        if (subPath) {
            execSync(`git clone --depth 1 --filter=blob:none --sparse --branch ${branch} https://github.com/${owner}/${repo} "${tmpDir}"`, { stdio: 'pipe' });
            execSync(`cd "${tmpDir}" && git sparse-checkout set "${subPath}"`, { stdio: 'pipe' });
        } else {
            execSync(`git clone --depth 1 https://github.com/${owner}/${repo} "${tmpDir}"`, { stdio: 'pipe' });
        }

        let skillsPath = tmpDir;
        if (subPath) {
            skillsPath = path.join(tmpDir, subPath);
        } else {
            skillsPath = fs.existsSync(path.join(tmpDir, 'skills')) ? path.join(tmpDir, 'skills') : tmpDir;
        }

        const isDirectSkill = fs.existsSync(path.join(skillsPath, 'SKILL.md'));
        let items = [];

        if (isDirectSkill) {
            const skillName = path.basename(skillsPath);
            items = [skillName];
            const parentTmp = path.join(os.tmpdir(), `lmagent-parent-${Date.now()}`);
            fs.mkdirSync(parentTmp, { recursive: true });
            copyRecursiveSync(skillsPath, path.join(parentTmp, skillName), true);
            skillsPath = parentTmp;
        } else {
            if (fs.existsSync(skillsPath)) {
                items = fs.readdirSync(skillsPath).filter(i => {
                    const p = path.join(skillsPath, i);
                    return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
                });
            }
        }

        if (items.length === 0) {
            console.log(chalk.yellow('⚠️  No se encontraron skills con SKILL.md en la ruta especificada.'));
            fs.rmSync(tmpDir, { recursive: true, force: true });
            if (skillsPath !== tmpDir && skillsPath.includes('lmagent-parent-')) {
                fs.rmSync(skillsPath, { recursive: true, force: true });
            }
            return;
        }

        const toInstall = opts.skill ? items.filter(i => i.includes(opts.skill)) : items;
        if (!fs.existsSync(targetSkillsDir)) fs.mkdirSync(targetSkillsDir, { recursive: true });

        for (const skill of toInstall) {
            const src = path.join(skillsPath, skill);
            const dest = path.join(targetSkillsDir, skill);
            copyRecursiveSync(src, dest, true);
            console.log(`  ${chalk.green('✔')} ${skill}/`);
        }

        fs.rmSync(tmpDir, { recursive: true, force: true });
        if (skillsPath !== tmpDir && skillsPath.includes('lmagent-parent-')) {
            fs.rmSync(skillsPath, { recursive: true, force: true });
        }

        console.log(chalk.green(`✨ ${toInstall.length} skill(s) instalado(s) en .agents/skills/`));
        console.log(chalk.dim('   Ejecuta `lmagent install` para sincronizarlos a tu agente.'));
    } catch (e) {
        console.error(chalk.red(`❌ Error al instalar skill: ${e.message}`));
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) { }
        process.exit(1);
    }
};
