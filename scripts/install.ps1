<#
.SYNOPSIS
    LMAgent Localized Installer for Windows PowerShell
.DESCRIPTION
    Instala de forma local el framework LMAgent en el proyecto actual.
    Descarga el core transitoriamente y ejecuta la inicialización nativa.
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
Write-Host "[1/3] Verificando dependencias locales..." -ForegroundColor Cyan

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
$tmpDir = Join-Path $originalPath ".lmagent-tmp"

Write-Host "`n[2/3] Descargando Core Installer de LMAgent..." -ForegroundColor Cyan
if (Test-Path $tmpDir) {
    Remove-Item -Recurse -Force $tmpDir | Out-Null
}

Write-Host "Clonando repositorio de forma transitoria..." -ForegroundColor DarkGray
git clone https://github.com/QuBiit0/lmagent.git $tmpDir --depth 1 --quiet

Write-Host "`n[3/3] Ejecutando instalacion nativa en el proyecto ($originalPath)..." -ForegroundColor Cyan

$targetScript = Join-Path $tmpDir "install.js"

if (-not (Test-Path $targetScript)) {
    Write-Host "X Error critico: No se pudo descargar el instalador base." -ForegroundColor Red
    Exit
}

try {
    # Ejecutamos el instalador base interactivo
    & "node" "$targetScript" init
} catch {
    Write-Host "X Ocurrio un error durante la inicializacion." -ForegroundColor Red
} finally {
    # Limpieza rigurosa del directorio temporal fuente
    if (Test-Path $tmpDir) {
        Remove-Item -Recurse -Force $tmpDir | Out-Null
        Write-Host "V Archivos temporales de instalacion limpiados." -ForegroundColor DarkGray
    }
}

Write-Host "`n🎉 LMAgent fue integrado en tu proyecto local." -ForegroundColor Cyan
Write-Host "Para interactuar con el framework en el futuro (actualizar, agregar skills), ejecuta:" -ForegroundColor Gray
Write-Host "node .agents/tools/lmagent.js" -ForegroundColor White
Write-Host ""
