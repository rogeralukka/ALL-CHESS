#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

echo "==> Setting up ALL-CHESS Backend in $BACKEND_DIR..."

# 1. Virtual Environment
VENV_PATH="$BACKEND_DIR/.venv"
if [ ! -d "$VENV_PATH" ]; then
    echo "Creating Python virtual environment in .venv..."
    python3 -m venv "$VENV_PATH"
else
    echo "Virtual environment already exists in .venv."
fi

PIP_BIN="$VENV_PATH/bin/pip"

# 2. Dependencies
echo "Installing dependencies from requirements.txt..."
"$PIP_BIN" install -r "$BACKEND_DIR/requirements.txt"

# 3. Environment file
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "Creating .env from .env.example..."
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
else
    echo ".env already exists."
fi

# 4. Stockfish Binary
BIN_DIR="$BACKEND_DIR/bin"
mkdir -p "$BIN_DIR"
STOCKFISH_BIN="$BIN_DIR/stockfish"

if [ ! -f "$STOCKFISH_BIN" ]; then
    echo "Downloading Stockfish for Linux/macOS..."
    OS="$(uname -s)"
    if [ "$OS" = "Darwin" ]; then
        SF_URL="https://github.com/official-stockfish/Stockfish/releases/download/sf_19/stockfish-macos-universal.tar.gz"
    else
        SF_URL="https://github.com/official-stockfish/Stockfish/releases/download/sf_19/stockfish-linux-x86-64-universal.tar.gz"
    fi
    curl -sL "$SF_URL" -o "$BIN_DIR/stockfish.tar.gz"
    tar -xzf "$BIN_DIR/stockfish.tar.gz" -C "$BIN_DIR"
    rm "$BIN_DIR/stockfish.tar.gz"
    SF_FOUND=$(find "$BIN_DIR" -type f -name "stockfish*" ! -name "*.tar.gz" | head -n 1)
    if [ -n "$SF_FOUND" ]; then
        mv "$SF_FOUND" "$STOCKFISH_BIN"
        chmod +x "$STOCKFISH_BIN"
    fi
    echo "Stockfish installed at $STOCKFISH_BIN."
else
    echo "Stockfish already present at $STOCKFISH_BIN."
fi

echo ""
echo "==> Setup complete!"
echo "To start the backend server:"
echo "  cd backend"
echo "  source .venv/bin/activate"
echo "  uvicorn app.main:app --reload --port 8000"
