#!/bin/bash
# Script de démarrage avec tests rapides

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║       DÉMARRAGE: HISTORIQUE & COMPARAISON SYSTÈME        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Vérification des fichiers
echo "📋 Vérification des fichiers créés..."
echo ""

files_to_check=(
    "database.py"
    "frontend/src/pages/History.jsx"
    "frontend/src/pages/Comparison.jsx"
    "test_history_and_comparison.py"
    "DATABASE_HISTORY_GUIDE.md"
    "HISTORY_COMPARISON_SUMMARY.md"
)

missing_files=0
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MANQUANT"
        ((missing_files++))
    fi
done

echo ""

if [ $missing_files -eq 0 ]; then
    echo "✅ Tous les fichiers sont présents!"
else
    echo "⚠️  $missing_files fichier(s) manquant(s)"
fi

echo ""
echo "────────────────────────────────────────────────────────────"
echo ""

# Menu
PS3="Que voulez-vous faire? > "
options=(
    "Démarrer l'API (et tests préalables)"
    "Faire un test rapide de l'historique"
    "Faire un test complet (10 tests)"
    "Démarrer le Frontend"
    "Afficher le guide d'utilisation"
    "Afficher le résumé du système"
    "Quitter"
)

select opt in "${options[@]}"
do
    case $opt in
        "Démarrer l'API (et tests préalables)")
            echo ""
            echo "🚀 Démarrage de l'API..."
            echo ""
            
            # Vérifier si database.py existe
            if [ -f "database.py" ]; then
                echo "✅ database.py trouvé"
            else
                echo "❌ database.py non trouvé!"
                echo "Le système d'historique ne fonctionnera pas."
            fi
            
            echo ""
            echo "Démarrage en cours..."
            echo "L'API sera disponible à: http://localhost:8000"
            echo ""
            python api.py
            break
            ;;
            
        "Faire un test rapide de l'historique")
            echo ""
            echo "🧪 Test rapide de l'historique..."
            echo ""
            
            # Vérifier que l'API répond
            if curl -s http://localhost:8000/health > /dev/null 2>&1; then
                echo "✅ API répond"
                echo ""
                
                # Faire une prédiction
                echo "📝 Prédiction de test..."
                curl -s -X POST http://localhost:8000/predict \
                  -H "Content-Type: application/json" \
                  -d '{
                    "TransportType": "Bus",
                    "Line": "Line1",
                    "Hour": 8,
                    "Day": "Monday",
                    "Weather": "Normal",
                    "Event": "None",
                    "model_type": "random_forest"
                  }' | python -m json.tool
                
                echo ""
                echo "📊 Historique (dernières prédictions)..."
                curl -s "http://localhost:8000/history?limit=5" | python -m json.tool | head -30
                
                echo ""
                echo "📈 Comparaison des modèles..."
                curl -s "http://localhost:8000/comparison" | python -m json.tool | head -30
            else
                echo "❌ L'API n'est pas accessible"
                echo "Assurez-vous que l'API est en cours d'exécution"
                echo "Lancez: python api.py"
            fi
            
            read -p "Appuyez sur Entrée pour continuer..."
            echo ""
            ;;
            
        "Faire un test complet (10 tests)")
            echo ""
            if [ -f "test_history_and_comparison.py" ]; then
                echo "🧪 Lancement de la suite de tests complète..."
                echo ""
                python test_history_and_comparison.py
            else
                echo "❌ test_history_and_comparison.py non trouvé!"
            fi
            
            read -p "Appuyez sur Entrée pour continuer..."
            echo ""
            ;;
            
        "Démarrer le Frontend")
            echo ""
            echo "🎨 Démarrage du Frontend..."
            echo "Le Frontend sera disponible à: http://localhost:5173"
            echo ""
            cd frontend && npm run dev
            break
            ;;
            
        "Afficher le guide d'utilisation")
            echo ""
            echo "📚 Guide d'utilisation complet:"
            echo "────────────────────────────────────────────────────────────"
            echo ""
            if [ -f "DATABASE_HISTORY_GUIDE.md" ]; then
                less DATABASE_HISTORY_GUIDE.md
            else
                echo "❌ DATABASE_HISTORY_GUIDE.md non trouvé!"
            fi
            echo ""
            ;;
            
        "Afficher le résumé du système")
            echo ""
            echo "📋 Résumé du système:"
            echo "────────────────────────────────────────────────────────────"
            echo ""
            if [ -f "HISTORY_COMPARISON_SUMMARY.md" ]; then
                less HISTORY_COMPARISON_SUMMARY.md
            else
                echo "❌ HISTORY_COMPARISON_SUMMARY.md non trouvé!"
            fi
            echo ""
            ;;
            
        "Quitter")
            echo ""
            echo "👋 Au revoir!"
            break
            ;;
            
        *) 
            echo "❌ Option invalide"
            ;;
    esac
done
