@echo off
echo 🚀 Démarrage de l'API SmartMobility ML...
echo.

REM Vérifier si l'environnement virtuel existe
if not exist ".venv\Scripts\activate.bat" (
    echo ❌ Environnement virtuel non trouvé. Création...
    python -m venv .venv
    call .venv\Scripts\activate.bat
    pip install -r requirements_api.txt
) else (
    echo ✅ Environnement virtuel trouvé.
    call .venv\Scripts\activate.bat
)

REM Vérifier si les dépendances sont installées
pip list | findstr "fastapi" >nul
if errorlevel 1 (
    echo 📦 Installation des dépendances...
    pip install -r requirements_api.txt
)

echo.
echo 🔧 Vérification du modèle ML...
if not exist "models\random_forest.pkl" (
    echo ⚠️ Modèle non trouvé. Entraînement en cours...
    python train_model.py
) else (
    echo ✅ Modèle trouvé.
)

echo.
echo 🌐 Démarrage du serveur API sur http://localhost:8000
echo 📖 Documentation API: http://localhost:8000/docs
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

python api.py