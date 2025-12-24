#!/bin/bash

echo "🚀 Démarrage de l'API SmartMobility ML..."
echo

# Vérifier si l'environnement virtuel existe
if [ ! -d ".venv" ]; then
    echo "❌ Environnement virtuel non trouvé. Création..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements_api.txt
else
    echo "✅ Environnement virtuel trouvé."
    source .venv/bin/activate
fi

# Vérifier si les dépendances sont installées
pip list | grep -q "fastapi"
if [ $? -ne 0 ]; then
    echo "📦 Installation des dépendances..."
    pip install -r requirements_api.txt
fi

echo
echo "🔧 Vérification du modèle ML..."
if [ ! -f "models/random_forest.pkl" ]; then
    echo "⚠️ Modèle non trouvé. Entraînement en cours..."
    python3 train_model.py
else
    echo "✅ Modèle trouvé."
fi

echo
echo "🌐 Démarrage du serveur API sur http://localhost:8000"
echo "📖 Documentation API: http://localhost:8000/docs"
echo
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo

python3 api.py