const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Copia un directorio entero recursivamente
 */
function copyRecursiveSync(src, dest, overwrite) {
    if (fs.cpSync) {
        try {
            fs.cpSync(src, dest, { recursive: true, force: overwrite, errorOnExist: false });
        } catch (e) {
            console.error(chalk.red(`Error copying(cpSync) ${path.basename(src)}: ${e.message} `));
            // Fallback manual implementation just in case
            if (fs.existsSync(src)) {
                const stat = fs.statSync(src);
                if (stat.isDirectory()) {
                    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                    fs.readdirSync(src).forEach(child => {
                        copyRecursiveSync(path.join(src, child), path.join(dest, child), overwrite);
                    });
                } else {
                    fs.copyFileSync(src, dest);
                }
            }
        }
    } else {
        // Fallback for older Node versions
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(function (childItemName) {
                copyRecursiveSync(path.join(src, childItemName),
                    path.join(dest, childItemName), overwrite);
            });
        } else {
            if (overwrite || !fs.existsSync(dest)) {
                fs.copyFileSync(src, dest);
            }
        }
    }
}

/**
 * Obtiene archivos o carpetas hijas de un nivel (soporta isNested para skills)
 */
function getAllItems(dir, isNested) {
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir);
    if (isNested) {
        return items.filter(item => {
            const p = path.join(dir, item);
            return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
        });
    } else {
        return items.filter(item => item.endsWith('.md') || item.endsWith('.txt') || item.endsWith('.cursorrules') || item.endsWith('.toml'));
    }
}

/**
 * Obtiene una lista plana de todos los archivos recursivamente dentro de un dir
 */
function getAllItemsFlat(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(getAllItemsFlat(fullPath));
        } else {
            results.push(fullPath);
        }
    }
    return results;
}

/**
 * Calcula el path relativo exacto entre dos archivos para usarse en un Markdown Link
 */
function getRelLink(fromRelPath, toRelPath) {
    const fromDir = path.dirname(fromRelPath);
    let rel = path.relative(fromDir, toRelPath);
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel.replace(/\\/g, '/'); // Force forward slashes for Markdown
}

module.exports = {
    copyRecursiveSync,
    getAllItems,
    getAllItemsFlat,
    getRelLink
};
