<#
.SYNOPSIS
    LMAgent Universal Installer for Windows PowerShell
.DESCRIPTION
    Instala de forma global el paquete @qubiit/lmagent desde GitHub y prepara el entorno.
    Compatible con ejecución remota vía Invoke-RestMethod (irm).
#>
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Stop"

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

Write-Header
Write-Host "[1/4] Verificando dependencias locales..." -ForegroundColor Cyan

if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "X Error: Node.js no esta instalado o no figura en tu PATH." -ForegroundColor Red
    Write-Host "  Por favor instala Node.js (v18+) desde https://nodejs.org/ y reinicia esta terminal." -ForegroundColor Yellow
    Exit
}

if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "X Error: Git no esta instalado o no figura en tu PATH." -ForegroundColor Red
    Write-Host "  Por favor instala Git desde https://git-scm.com/ y reinicia esta terminal." -ForegroundColor Yellow
    Exit
}

$originalPath = Get-Location
$installDir = Join-Path $HOME ".lmagent"

Write-Host "`n[2/4] Obteniendo LMAgent desde GitHub ($installDir)..." -ForegroundColor Cyan
if (Test-Path $installDir) {
    Write-Host "Directorio encontrado. Actualizando repositorio..." -ForegroundColor DarkGray
    Set-Location $installDir
    git pull origin main --quiet
    Set-Location $originalPath
} else {
    Write-Host "Clonando repositorio..." -ForegroundColor DarkGray
    git clone https://github.com/QuBiit0/lmagent.git $installDir --depth 1 --quiet
}

Write-Host "`n[3/4] Vinculando LMAgent globalmente (Symlink)..." -ForegroundColor Cyan

try {
    $npmGlobalPrefix = npm config get prefix
    $binDir = if ($npmGlobalPrefix) { $npmGlobalPrefix } else { "$env:APPDATA\npm" }

    if (-not (Test-Path $binDir)) {
        New-Item -ItemType Directory -Force -Path $binDir | Out-Null
    }

    $lmagentCmdPath = Join-Path $binDir "lmagent.cmd"
    $lmagentPs1Path = Join-Path $binDir "lmagent.ps1"
    
    $targetScript = Join-Path $installDir "install.js"
    
    $cmdContent = "@ECHO OFF`r`n`"node`" `"$targetScript`" %*"
    Set-Content -Path $lmagentCmdPath -Value $cmdContent -Encoding UTF8

    $ps1Content = "& `"node`" `"$targetScript`" `$args"
    Set-Content -Path $lmagentPs1Path -Value $ps1Content -Encoding UTF8
    
    Write-Host "V Enlaces creados en $binDir" -ForegroundColor Green
    
} catch {
    Write-Host "X Hubo un problema vinculando el paquete." -ForegroundColor Red
    Write-Host "$_" -ForegroundColor DarkRed
    Exit
}

Write-Host "`n[4/4] Inicializando entorno en el directorio actual..." -ForegroundColor Cyan

$response = Read-Host "Deseas inicializar LMAgent en el directorio actual ($originalPath)? [Y/n]"

if ($response -match "^n$|^no$") {
    Write-Host "Saltando inicializacion. Puedes hacerlo luego ingresando: lmagent init" -ForegroundColor Cyan
} else {
    Write-Host "Ejecutando lmagent init..." -ForegroundColor Blue
    & $lmagentCmdPath init
}

Write-Host "`n🎉 LMAgent v3.6.0 está listo para trabajar!" -ForegroundColor Cyan
Write-Host "Abre cualquier agente soportado para comenzar a delegar."
Write-Host "Para ver la ayuda, escribe: lmagent --help`n"
