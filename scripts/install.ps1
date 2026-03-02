<#
.SYNOPSIS
    LMAgent Universal Installer for Windows PowerShell
.DESCRIPTION
    Instala de forma global el paquete @qubiit/lmagent y prepara el entorno actual para su uso.
    Compatible con ejecución remota vía Invoke-WebRequest (iwr).
#>
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

    Write-Host "X Error: No se encuentra 'install.js' en la raiz." -ForegroundColor Red
    Write-Host "  Ubicacion actual: $pwd" -ForegroundColor Yellow
    Exit
}

Write-Host "`n[2/2] Vinculando LMAgent globalmente (Symlink)..." -ForegroundColor Cyan

try {
    # 1. Crear el archivo wrapper lmagent.cmd en un directorio que sabemos está en PATH
    $npmGlobalPrefix = npm config get prefix
    $binDir = if ($npmGlobalPrefix) { $npmGlobalPrefix } else { "$env:APPDATA\npm" }

    if (-not (Test-Path $binDir)) {
        New-Item -ItemType Directory -Force -Path $binDir | Out-Null
    }

    $lmagentCmdPath = Join-Path $binDir "lmagent.cmd"
    $lmagentPs1Path = Join-Path $binDir "lmagent.ps1"
    
    # 2. El comando apunta explícitamente a node ejecutando el install.js de esta carpeta
    $targetScript = Join-Path $pwd "install.js"
    
    $cmdContent = "@ECHO OFF`r`n`"node`" `"$targetScript`" %*"
    Set-Content -Path $lmagentCmdPath -Value $cmdContent -Encoding UTF8

    $ps1Content = "& `"node`" `"$targetScript`" `$args"
    Set-Content -Path $lmagentPs1Path -Value $ps1Content -Encoding UTF8
    
    Write-Host "V Enlaces simbolicos creados en $binDir" -ForegroundColor Green
    
} catch {
    Write-Host "X Hubo un problema vinculando el paquete." -ForegroundColor Red
    Write-Host "$_" -ForegroundColor DarkRed
    Exit
}

# Comprobación final del binario
if (-not (Get-Command "lmagent" -ErrorAction SilentlyContinue)) {
     Write-Host "X LMAgent fue vinculado, pero el comando 'lmagent' no se reconoce en esta sesion." -ForegroundColor Red
     Write-Host "  Puede que necesites reiniciar tu terminal o verificar que $binDir este en tu PATH." -ForegroundColor Yellow
}

Write-Host "V LMAgent instalado con exito." -ForegroundColor Green


# Inicialización Local
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
Write-Host "`n🎉 LMAgent v3.6.0 está listo para trabajar!" -ForegroundColor Cyan
Write-Host "Abre cualquier agente soportado en este proyecto para comenzar a delegar."
Write-Host "Para ver la ayuda, escribe: lmagent --help`n"
