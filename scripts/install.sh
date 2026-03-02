#!/usr/bin/env bash

# LMAgent Localized Installer para MacOS / Linux / Git Bash

set -e

# ==========================================
# Colores y Estilos
# ==========================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${CYAN}${BOLD}"
echo "       __    __  ___  ___                    __ "
echo "      / /   /  |/  / /   | ____  ___  ____  / /_"
echo "     / /   / /|_/ / / /| |/ __ \/ _ \/ __ \/ __/"
echo "    / /___/ /  / / / ___ / /_/ /  __/ / / / /_  "
echo "   /_____/_/  /_/ /_/  |_\__, /\___/_/ /_/\__/  "
echo "                        /____/                  "
echo -e "${NC}"
echo -e "${BLUE}${BOLD}        The Agentic Engineering Framework       ${NC}"
echo ""

# ==========================================
# Inicio del Instalador
# ==========================================
echo -e "\n${CYAN}[1/3] Verificando dependencias locales...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js no está instalado o no figura en tu PATH.${NC}"
    echo -e "${YELLOW}Por favor instala Node.js (v18+) desde https://nodejs.org/ y vuelve a intentar.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm no está instalado.${NC}"
    echo -e "${YELLOW}Asegúrate que npm fue instalado junto con Node.js.${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Error: git no está instalado o no figura en tu PATH.${NC}"
    echo -e "${YELLOW}git es requerido para realizar la instalación directa desde GitHub.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2)
echo -e "${GREEN}✓ Node.js detectado (v${NODE_VERSION})${NC}"

# ==========================================
# Instalar Core Globalmente desde GitHub
# ==========================================
echo -e "\n${CYAN}[2/3] Instalando LMAgent globalmente desde GitHub...${NC}"

set +e
npm install -g git+https://github.com/QuBiit0/lmagent.git --silent
INSTALL_EXIT_CODE=$?
set -e

if [ $INSTALL_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}❌ Hubo un problema instalando el paquete. Revisa tu conexión a internet o configuración de Git.${NC}"
    exit $INSTALL_EXIT_CODE
fi

if ! command -v lmagent &> /dev/null; then
    echo -e "${RED}❌ LMAgent fue instalado, pero el comando 'lmagent' no se reconoce.${NC}"
    echo -e "${YELLOW}Asegurate que el directorio global de npm (~/.npm-global/bin o similar) esté en tu PATH.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ LMAgent instalado con éxito.${NC}"

# ==========================================
# Inicialización de Proyecto Actual
# ==========================================
echo -e "\n${CYAN}[3/3] Inicializando entorno en el directorio actual...${NC}"

ORIGINAL_PWD="$(pwd)"
echo -n "Deseas inicializar LMAgent en el directorio actual ($ORIGINAL_PWD)? [Y/n] "
read response

if [[ "$response" =~ ^([nN][oO]|[nN])$ ]]; then
    echo -e "${CYAN}Saltando inicializacion. Puedes hacerlo luego ingresando: lmagent init${NC}"
else
    echo -e "${BLUE}Ejecutando lmagent init...${NC}"
    lmagent init
    echo -e "${GREEN}✓ Proyecto inicializado exitosamente.${NC}"
fi

# ==========================================
# Cierre
# ==========================================
echo -e "\n${CYAN}${BOLD}🎉 LMAgent está listo para trabajar!${NC}"
echo -e "Abre cualquier agente soportado en este proyecto para comenzar a delegar."
echo -e "${NC}Para ver la ayuda en cualquier momento, escribe: ${BOLD}lmagent --help${NC}\n"
