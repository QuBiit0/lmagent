<#
.SYNOPSIS
    LMAgent Universal Installer for Windows PowerShell
.DESCRIPTION
    Instala de forma global el paquete lmagent directamente desde GitHub y prepara el entorno actual.
    Compatible con ejecución remota vía Invoke-WebRequest (iwr).
.PARAMETER Yes
    Modo no interactivo: instala todo sin preguntar.
#>
param(
    [Alias("y")]
    [switch]$Yes
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

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

# 3. Chequear git (Requerido para clonar desde el repo)
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "X Error: git no esta instalado o no figura en tu PATH." -ForegroundColor Red
    Write-Host "  git es requerido para realizar la instalacion directa desde GitHub." -ForegroundColor Yellow
    Exit
}

$nodeVersion = node -v
Write-Host "V Node.js detectado ($nodeVersion)" -ForegroundColor Green


Write-Host "`n[2/3] Limpiando instalaciones obsoletas y actualizando LMAgent..." -ForegroundColor Cyan

# Limpiar restos de versiones anteriores (v3.4.x o menores) instaladas localmente
$lmagentDir = Join-Path $HOME ".lmagent"
if (Test-Path $lmagentDir) {
    Write-Host "  > Removiendo motor antiguo en ~/.lmagent/..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $lmagentDir -ErrorAction SilentlyContinue
}

$localBin = Join-Path $HOME ".local\bin\lmagent"
if (Test-Path $localBin) {
    Write-Host "  > Removiendo binario obsoleto en ~/.local/bin..." -ForegroundColor Yellow
    Remove-Item -Force $localBin -ErrorAction SilentlyContinue
}

$localBinCmd = Join-Path $HOME ".local\bin\lmagent.cmd"
if (Test-Path $localBinCmd) {
    Write-Host "  > Removiendo binario cmd obsoleto en ~/.local/bin..." -ForegroundColor Yellow
    Remove-Item -Force $localBinCmd -ErrorAction SilentlyContinue
}

try {
    # Instalamos directamente desde el repo fuente para evitar usar el registro de npm publico
    npm install -g git+https://github.com/QuBiit0/lmagent.git --silent
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

if ($Yes) {
    Write-Host "Ejecutando lmagent init --yes..." -ForegroundColor Blue
    lmagent init --yes
    Write-Host "V Proyecto inicializado exitosamente." -ForegroundColor Green
} else {
    $response = Read-Host "Deseas inicializar LMAgent en el directorio actual ($pwd)? [Y/n]"

    if ($response -match "^n$|^no$") {
        Write-Host "Saltando inicializacion. Puedes hacerlo luego ingresando: lmagent init" -ForegroundColor Cyan
    } else {
        Write-Host "Ejecutando lmagent init..." -ForegroundColor Blue
        lmagent init
        Write-Host "V Proyecto inicializado exitosamente." -ForegroundColor Green
    }
}

# ==========================================
# Cierre
# ==========================================
Write-Host "`n🎉 LMAgent está listo para trabajar!" -ForegroundColor Cyan
Write-Host "Abre cualquier agente soportado en este proyecto para comenzar a delegar."
Write-Host "Para ver la ayuda en cualquier momento, escribe: lmagent --help`n"
