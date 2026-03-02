<#
.SYNOPSIS
    LMAgent Localized Installer for Windows PowerShell
.DESCRIPTION
    Instala de forma local el framework LMAgent en el proyecto actual.
    Descarga el core transitoriamente vía npx y ejecuta la inicialización nativa.
    Compatible con ejecución remota vía Invoke-WebRequest (iwr).
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
Write-Host "[1/2] Verificando dependencias locales..." -ForegroundColor Cyan

if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "X Error: Node.js no esta instalado o no figura en tu PATH." -ForegroundColor Red
    Write-Host "  Por favor instala Node.js (v18+) desde https://nodejs.org/ y reinicia esta terminal." -ForegroundColor Yellow
    Exit
}

if (-not (Get-Command "npx" -ErrorAction SilentlyContinue)) {
    Write-Host "X Error: npx/npm no esta instalado o no figura en tu PATH." -ForegroundColor Red
    Write-Host "  Asegurate que npm fue instalado junto con Node.js." -ForegroundColor Yellow
    Exit
}

$originalPath = Get-Location

Write-Host "`n[2/2] Descargando e inicializando LMAgent ($originalPath)..." -ForegroundColor Cyan

try {
    # Usamos npx para que sea transient, con sus modulos encapsulados y sin instalaciones globales.
    npx --yes @qubiit/lmagent@latest init
} catch {
    Write-Host "X Ocurrio un error durante la carga de npx y la instalacion." -ForegroundColor Red
    Exit
}

Write-Host "`n🎉 LMAgent fue integrado en tu proyecto local." -ForegroundColor Cyan
Write-Host "Para interactuar con la terminal de comandos en el futuro, utiliza npx:" -ForegroundColor Gray
Write-Host "npx @qubiit/lmagent" -ForegroundColor White
Write-Host ""
