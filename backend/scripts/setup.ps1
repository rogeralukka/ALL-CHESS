# ALL-CHESS Backend Setup Script (PowerShell for Windows)
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Split-Path -Parent $scriptDir

Write-Host "==> Setting up ALL-CHESS Backend in $backendDir..."

# 1. Virtual Environment
$venvPath = Join-Path $backendDir ".venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "Creating Python virtual environment in .venv..."
    python -m venv $venvPath
} else {
    Write-Host "Virtual environment already exists in .venv."
}

$pythonExe = Join-Path $venvPath "Scripts\python.exe"
$pipExe = Join-Path $venvPath "Scripts\pip.exe"

# 2. Dependencies
Write-Host "Installing dependencies from requirements.txt..."
$reqFile = Join-Path $backendDir "requirements.txt"
& $pipExe install -r $reqFile

# 3. Environment file
$envFile = Join-Path $backendDir ".env"
$envExample = Join-Path $backendDir ".env.example"
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env from .env.example..."
    Copy-Item $envExample $envFile
} else {
    Write-Host ".env already exists."
}

# Generate random SESSION_SECRET if missing or placeholder
if (Test-Path $envFile) {
    $randomSecret = & $pythonExe -c "import secrets; print(secrets.token_hex(32))"
    $content = Get-Content $envFile -Raw
    if ($content -match "SESSION_SECRET=(your_session_secret_here)?\r?\n" -or $content -match "SESSION_SECRET=$") {
        $content = $content -replace "SESSION_SECRET=.*", "SESSION_SECRET=$randomSecret"
        Set-Content $envFile $content
        Write-Host "Generated random SESSION_SECRET in .env."
    } elseif ($content -notmatch "SESSION_SECRET=") {
        Add-Content $envFile "`nSESSION_SECRET=$randomSecret"
        Write-Host "Added random SESSION_SECRET to .env."
    }
}

# 4. Stockfish Binary
$binDir = Join-Path $backendDir "bin"
$stockfishExe = Join-Path $binDir "stockfish.exe"
if (-not (Test-Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir | Out-Null
}

if (-not (Test-Path $stockfishExe)) {
    Write-Host "Downloading Stockfish for Windows..."
    $zipFile = Join-Path $binDir "stockfish.zip"
    $downloadUrl = "https://github.com/official-stockfish/Stockfish/releases/download/sf_19/stockfish-windows-x86-64-universal.zip"
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile
    Expand-Archive -Path $zipFile -DestinationPath (Join-Path $binDir "temp_sf") -Force
    Remove-Item $zipFile
    $extractedExe = Get-ChildItem -Path (Join-Path $binDir "temp_sf") -Filter "*.exe" -Recurse | Select-Object -First 1
    if ($extractedExe) {
        Move-Item $extractedExe.FullName $stockfishExe -Force
    }
    Remove-Item (Join-Path $binDir "temp_sf") -Recurse -Force
    Write-Host "Stockfish installed at $stockfishExe."
} else {
    Write-Host "Stockfish already present at $stockfishExe."
}

Write-Host ""
Write-Host "==> Setup complete!"
Write-Host "To start the backend server:"
Write-Host "  cd backend"
Write-Host "  .\.venv\Scripts\activate"
Write-Host "  uvicorn app.main:app --reload --port 8000"
