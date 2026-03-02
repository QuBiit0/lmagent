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
# Validaciones
# ==========================================
echo -e "${CYAN}[1/3] Verificando dependencias locales...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado.${NC}"
    echo -e "${YELLOW}Por favor instala Node.js (v18 o superior) desde https://nodejs.org/ y vuelve a intentar.${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git no está instalado.${NC}"
    echo -e "${YELLOW}Por favor instala Git desde https://git-scm.com/ y vuelve a intentar.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2)
echo -e "${GREEN}✓ Node.js detectado (v${NODE_VERSION})${NC}"

# ==========================================
# Descargar Instalador Temporal
# ==========================================
ORIGINAL_PWD="$(pwd)"
TMP_DIR="$ORIGINAL_PWD/.lmagent-tmp"

echo -e "\n${CYAN}[2/3] Descargando Core Installer de LMAgent...${NC}"

if [ -d "$TMP_DIR" ]; then
    rm -rf "$TMP_DIR"
fi

echo -e "Clonando repositorio de forma transitoria..."
git clone https://github.com/QuBiit0/lmagent.git "$TMP_DIR" --depth 1 --quiet

# ==========================================
# Ejecutar Instalador Local
# ==========================================
echo -e "\n${CYAN}[3/3] Ejecutando instalacion nativa en el proyecto ($ORIGINAL_PWD)...${NC}"

TARGET_SCRIPT="$TMP_DIR/install.js"

if [ ! -f "$TARGET_SCRIPT" ]; then
    echo -e "${RED}❌ Error critico: No se pudo descargar el instalador base.${NC}"
    exit 1
fi

set +e # Evitar que el script aborte inmediatamente si el hijo falla
node "$TARGET_SCRIPT" init
INIT_EXIT_CODE=$?
set -e

# ==========================================
# Limpieza Final Automática
# ==========================================
if [ -d "$TMP_DIR" ]; then
    rm -rf "$TMP_DIR"
    echo -e "${NC}✓ Archivos temporales de instalación limpiados."
fi

if [ $INIT_EXIT_CODE -ne 0 ]; then
    echo -e "\n${RED}❌ Ocurrió un error durante la inicialización.${NC}"
    exit $INIT_EXIT_CODE
fi

# ==========================================
# Cierre
# ==========================================
echo -e "\n${CYAN}${BOLD}🎉 LMAgent fue integrado en tu proyecto local.${NC}"
echo -e "${NC}Para interactuar con el framework en el futuro (actualizar, agregar skills), ejecuta:"
echo -e "${BOLD}node .agents/tools/lmagent.js${NC}\n"
