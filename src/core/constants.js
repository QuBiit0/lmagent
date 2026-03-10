const path = require('path');

// Root dir del framework (subiendo src/core hasta la raíz)
const ROOT_DIR = path.join(__dirname, '..', '..');

const PKG_VERSION = require(path.join(ROOT_DIR, 'package.json')).version;

// Configuración: Directorios fuente del paquete original de LMAgent
const PACKAGE_SKILLS_DIR = path.join(ROOT_DIR, '.agents', 'skills');
const PACKAGE_RULES_DIR = path.join(ROOT_DIR, '.agents', 'rules');
const PACKAGE_WORKFLOWS_DIR = path.join(ROOT_DIR, '.agents', 'workflows');
const PACKAGE_CONFIG_DIR = path.join(ROOT_DIR, '.agents', 'config');
const PACKAGE_TEMPLATES_DIR = path.join(ROOT_DIR, '.agents', 'templates');
const PACKAGE_DOCS_DIR = path.join(ROOT_DIR, '.agents', 'docs');
const PACKAGE_MEMORY_DIR = path.join(ROOT_DIR, '.agents', 'memory');

// Archivos de proyecto que init copia a la raíz
// Usan {{VERSION}} como placeholder; se reemplaza dinámicamente al instalar
const INIT_FILES = [
    { src: 'AGENTS.md', desc: 'Catálogo de capacidades LMAgent (Entry Point Universal)', versionTemplate: false },
    { src: 'AGENTS_CATALOG.md', desc: 'Registro de Tablas Masivas LMAgent', versionTemplate: false },
];

// Directorios core a verificar en .agents/ (usado por doctor)
const CORE_DIRS = [
    { src: 'skills', desc: 'Skills especializados' },
    { src: 'rules', desc: 'Reglas de comportamiento' },
    { src: 'workflows', desc: 'SOPs y Procedimientos' },
    { src: 'config', desc: 'Configuración del framework' },
    { src: 'docs', desc: 'Documentación extendida' },
    { src: 'memory', desc: 'Contexto persistente' },
];

module.exports = {
    PKG_VERSION,
    ROOT_DIR,
    PACKAGE_SKILLS_DIR,
    PACKAGE_RULES_DIR,
    PACKAGE_WORKFLOWS_DIR,
    PACKAGE_CONFIG_DIR,
    PACKAGE_TEMPLATES_DIR,
    PACKAGE_DOCS_DIR,
    PACKAGE_MEMORY_DIR,
    INIT_FILES,
    CORE_DIRS
};
