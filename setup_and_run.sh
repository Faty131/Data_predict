#!/usr/bin/env bash
# Script de démarrage complet du système multi-modèles
# Usage: ./setup_and_run.sh

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🚀 SYSTÈME DE PRÉDICTION MULTI-MODÈLES SETUP          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Vérifier si Python est installé
print_step "Étape 1: Vérification de Python"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python trouvé: $PYTHON_VERSION"
else
    print_error "Python3 n'est pas installé"
    exit 1
fi

# Installer les dépendances
print_step "Étape 2: Installation des dépendances"
print_info "Installation des packages Python..."
pip install -q -r requirements.txt
pip install -q -r requirements_api.txt
print_success "Dépendances Python installées"

# Entraîner les modèles
print_step "Étape 3: Entraînement des modèles IA"
print_info "Cela peut prendre quelques secondes..."
python3 train_model.py

if [ -f "./models/random_forest.pkl" ] && [ -f "./models/linear_regression.pkl" ] && [ -f "./models/xgboost.pkl" ]; then
    print_success "Les 3 modèles ont été entraînés et sauvegardés"
else
    print_error "Erreur lors de l'entraînement des modèles"
    exit 1
fi

# Vérifier Node.js pour le frontend
print_step "Étape 4: Vérification du frontend"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js trouvé: $NODE_VERSION"
    
    print_info "Installation des dépendances frontend..."
    cd frontend
    npm install -q
    cd ..
    print_success "Dépendances frontend installées"
else
    print_error "Node.js n'est pas installé. Le frontend ne peut pas être lancé."
fi

# Afficher le résumé
print_step "SETUP TERMINÉ! 🎉"
echo ""
echo "Pour démarrer le système complet, exécutez:"
echo ""
echo -e "${GREEN}Terminal 1 (API):${NC}"
echo "  ./start_api.sh"
echo ""
echo -e "${GREEN}Terminal 2 (Frontend):${NC}"
echo "  cd frontend && npm run dev"
echo ""
echo "Puis accédez à: http://localhost:5173"
echo ""
echo "Pour tester les modèles:"
echo "  python3 test_multi_models.py"
echo ""
echo -e "${BLUE}📚 Documentation: MULTI_MODEL_GUIDE.md${NC}"
echo -e "${BLUE}📚 Guide complet: IMPLEMENTATION_GUIDE.md${NC}"
echo ""
