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
# Descargar e Inicializar LMAgent
# ==========================================
ORIGINAL_PWD="$(pwd)"

echo -e "\n${CYAN}[2/2] Descargando e inicializando LMAgent ($ORIGINAL_PWD)...${NC}"

set +e # Evitar que el script aborte inmediatamente si el hijo falla
# Usamos npx de forma puramente transitiva, con encapsulacion de modulos
npx --yes @qubiit/lmagent@latest init
INIT_EXIT_CODE=$?
set -e

if [ $INIT_EXIT_CODE -ne 0 ]; then
    echo -e "\n${RED}❌ Ocurrió un error durante la carga npx o inicialización.${NC}"
    exit $INIT_EXIT_CODE
fi

# ==========================================
# Cierre
# ==========================================
echo -e "\n${CYAN}${BOLD}🎉 LMAgent fue integrado en tu proyecto local.${NC}"
echo -e "${NC}Para interactuar con la terminal de comandos en el futuro, utiliza npx:"
echo -e "${BOLD}npx @qubiit/lmagent${NC}\n"
