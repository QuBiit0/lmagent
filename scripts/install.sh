#!/usr/bin/env bash

# LMAgent v3.6.0 Universal Installer para MacOS / Linux / Git Bash

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

if [ ! -f "install.js" ]; then
    echo -e "${RED}❌ Error: No se encuentra 'install.js' en la raíz.${NC}"
    echo -e "${YELLOW}Asegúrate de ejecutar este script desde la carpeta del proyecto: ./scripts/install.sh${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2)
echo -e "${GREEN}✓ Node.js detectado (v${NODE_VERSION})${NC}"

# ==========================================
# Vinculación del Framework (Symlink Local)
# ==========================================
echo -e "\n${CYAN}[2/2] Vinculando LMAgent globalmente (Symlink)...${NC}"

TARGET_DIR="/usr/local/bin"
if [ ! -d "$TARGET_DIR" ] || [ ! -w "$TARGET_DIR" ]; then
    TARGET_DIR="$HOME/.local/bin"
    mkdir -p "$TARGET_DIR"
fi

INSTALL_JS_PATH="$(pwd)/install.js"

# Crear wrapper dinámico
WRAPPER_PATH="$TARGET_DIR/lmagent"
cat << 'EOF' > "$WRAPPER_PATH"
#!/usr/bin/env bash
node "INSTALL_PATH_PLACEHOLDER" "$@"
EOF

sed -i.bak "s|INSTALL_PATH_PLACEHOLDER|$INSTALL_JS_PATH|g" "$WRAPPER_PATH" && rm -f "${WRAPPER_PATH}.bak"
chmod +x "$WRAPPER_PATH"

if ! command -v lmagent &> /dev/null && [[ ":$PATH:" != *":$TARGET_DIR:"* ]]; then
    echo -e "${YELLOW}⚠️ Aviso: $TARGET_DIR no está en tu PATH. El comando 'lmagent' podría no funcionar hasta que reinicies la terminal.${NC}"
fi

echo -e "${GREEN}✓ LMAgent instalado con éxito.${NC}"

# ==========================================
# Inicialización de Proyecto Actual
# ==========================================
echo -e "\n${CYAN}[3/3] Inicializando entorno en el directorio actual...${NC}"

# Preguntamos si quiere inicializar el repo actual
echo -e "${YELLOW}¿Deseas inicializar LMAgent en el directorio actual ($(pwd))? [Y/n]${NC} \c"
if read -r response </dev/tty; then
    if [[ "$response" =~ ^([nN][oO]|[nN])$ ]]; then
        echo -e "${CYAN}Saltando inicialización. Puedes hacerlo luego ejecutando: ${BOLD}lmagent init${NC}"
    else
        echo -e "${BLUE}Ejecutando lmagent init...${NC}"
        lmagent init
        echo -e "${GREEN}✓ Proyecto inicializado exitosamente.${NC}"
    fi
else
    # Fallback silencioso si no hay tty disponible
    echo -e "\n${CYAN}Terminal no interactivo detectado. Saltando inicialización automatica."
    echo -e "Puedes hacerlo luego ejecutando: ${BOLD}lmagent init${NC}"
fi

# ==========================================
# Cierre
# ==========================================
echo -e "\n${CYAN}${BOLD}🎉 ¡LMAgent v3.6.0 está listo para trabajar!${NC}"
echo -e "Abre cualquier agente soportado (Cursor, Claude, Windsurf, Roo, etc) en este proyecto."
echo -e "Para ver los comandos disponibles, escribe: ${BOLD}lmagent --help${NC}\n"
