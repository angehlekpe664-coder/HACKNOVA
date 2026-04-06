#!/bin/zsh
# Script de démarrage BRAND.AI
# Usage: ./start.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Démarrage de BRAND.AI..."

# Tuer les anciens processus si existants
pkill -f "uvicorn main:app" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 1

# Démarrer le backend
echo "📡 Démarrage du Backend (port 8000)..."
cd "$SCRIPT_DIR/backend"
/home/ange/anaconda3/bin/uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Attendre que le backend soit prêt
sleep 3

# Démarrer le frontend
echo "🎨 Démarrage du Frontend (port 5173)..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ BRAND.AI démarré !"
echo "   Frontend : http://localhost:5173"
echo "   Backend  : http://localhost:8000"
echo ""
echo "Pour arrêter : Ctrl+C ou kill $BACKEND_PID $FRONTEND_PID"

# Attendre que l'un ou l'autre s'arrête
wait
