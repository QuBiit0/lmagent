<#
.SYNOPSIS
    LMAgent Universal Installer for Windows PowerShell
.DESCRIPTION
    Instala de forma global el paquete @qubiit/lmagent y prepara el entorno actual para su uso.
    Compatible con ejecución remota vía Invoke-WebRequest (iwr).
#>

$ErrorActionPreference = "Stop"

# ==========================================
# Helpers de Interfaz
# ==========================================
function Write-Header {
    Write-Host ""
    Write-Host "       __    __  ___  ___                    __ " -ForegroundColor Cyan
    Write-Host "      / /   /  |/  / /   | ____  ___  ____  / /_" -ForegroundColor Cyan
    Write-Host "     / /   / /|_/ / / /| |/ __ \/ _ \/ __ \/ __/" -ForegroundColor Cyan
    Write-Host "    / /___/ /  / / / ___ / /_/ /  __/ / / / /_  " -ForegroundColor Cyan
    Write-Host "   /_____/_/  /_/ /_/  |_\__, /\___/_/ /_/\__/  " -ForegroundColor Cyan
    Write-Host "                        /____/                  " -ForegroundColor Cyan
    Write-Host "        The Agentic Engineering Framework       " -ForegroundColor Blue
    Write-Host ""
}

# ==========================================
# Inicio del Instalador
# ==========================================
Write-Header

Write-Host "[1/3] Verificando dependencias locales..." -ForegroundColor Cyan

# 1. Chequear Node.js
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "X Error: Node.js no esta instalado o no figura en tu PATH." -ForegroundColor Red
    Write-Host "  Por favor instala Node.js (v18+) desde https://nodejs.org/ y reinicia esta terminal." -ForegroundColor Yellow
    Exit
}

# 2. Chequear npm
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "X Error: npm no esta instalado." -ForegroundColor Red
    Write-Host "  Asegurate que npm fue instalado junto con Node.js." -ForegroundColor Yellow
    Exit
}

$nodeVersion = node -v
Write-Host "V Node.js detectado ($nodeVersion)" -ForegroundColor Green


Write-Host "`n[2/3] Instalando @qubiit/lmagent globalmente..." -ForegroundColor Cyan

try {
    # Evitar output redundante y priorizar errores graves
    npm install -g @qubiit/lmagent@latest --silent
} catch {
    Write-Host "X Hubo un problema instalando el paquete." -ForegroundColor Red
    Write-Host "$_" -ForegroundColor DarkRed
    Exit
}

# Comprobación final del binario
if (-not (Get-Command "lmagent" -ErrorAction SilentlyContinue)) {
     Write-Host "X LMAgent fue instalado via npm, pero el comando 'lmagent' no se reconoce." -ForegroundColor Red
     Write-Host "  Asegurate que el directorio de instalacion global de npm este en tus Variables de Entorno (PATH)." -ForegroundColor Yellow
     Exit
}

Write-Host "V LMAgent instalado con exito." -ForegroundColor Green


# ==========================================
# Inicialización de Proyecto Actual
# ==========================================
Write-Host "`n[3/3] Inicializando entorno en el directorio actual..." -ForegroundColor Cyan

$pwd = Get-Location
$response = Read-Host "Deseas inicializar LMAgent en el directorio actual ($pwd)? [Y/n]"

if ($response -match "^n$|^no$") {
    Write-Host "Saltando inicializacion. Puedes hacerlo luego ingresando: lmagent init" -ForegroundColor Cyan
} else {
    Write-Host "Ejecutando lmagent init..." -ForegroundColor Blue
    lmagent init
    Write-Host "V Proyecto inicializado exitosamente." -ForegroundColor Green
}

# ==========================================
# Cierre
# ==========================================
Write-Host "`n🎉 LMAgent V3.4+ está listo para trabajar!" -ForegroundColor Cyan
Write-Host "Abre cualquier agente soportado en este proyecto para comenzar a delegar."
Write-Host "Para ver la ayuda, escribe: lmagent --help`n"
