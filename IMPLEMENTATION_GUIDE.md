# 🚀 Intégration Multi-Modèles - Guide de Mise en Œuvre

## ✅ Sommaire des Changements

Vous avez demandé l'intégration des 3 algorithmes dans le frontend pour que l'utilisateur puisse choisir le modèle de prédiction. Voici ce qui a été fait:

### 📝 Fichiers Modifiés

#### 1. **train_model.py** - Entraînement des 3 modèles
```
✅ Imports ajoutés: LinearRegression, xgboost
✅ Fonction train_and_save_model() complètement remaniée
✅ Entraîne et sauvegarde 3 modèles: RF, LR, XGB
✅ Crée un fichier feature_info.pkl avec les performances
```

#### 2. **api.py** - Backend multi-modèles
```
✅ Variable global: model → models (dict)
✅ Nouvelle fonction load_models() pour charger les 3 modèles
✅ Nouveau paramètre dans PredictionRequest: model_type
✅ Endpoint /models pour lister les modèles disponibles
✅ Endpoint /health mis à jour
✅ Endpoint /predict sélectionne le modèle selon model_type
✅ Tous les endpoints analytics mettent à jour pour utiliser models dict
```

#### 3. **frontend/src/pages/Prediction.jsx** - Frontend avec sélecteur
```
✅ Import FaBrain pour l'icône du modèle
✅ Nouvel état: model_type dans formData (défaut: 'random_forest')
✅ Nouveau champ de formulaire: Sélecteur de Modèle IA
✅ FormData inclut model_type dans les données envoyées
✅ Affichage du modèle utilisé dans les résultats
```

## 🎯 Étapes pour Utiliser

### Étape 1: Entraîner les modèles

```bash
# Vérifier que vous avez les dépendances
pip install -r requirements.txt

# Entraîner les 3 modèles
python train_model.py
```

**Résultat attendu:**
```
🚀 Entraînement des modèles ML...
===============================================================
🌲 Entraînement: Random Forest Regressor
...
📊 Performance: RMSE: X.XX | MAE: X.XX | R²: X.XXX

📈 Entraînement: Linear Regression
...
📊 Performance: RMSE: X.XX | MAE: X.XX | R²: X.XXX

🚀 Entraînement: XGBoost Regressor
...
📊 Performance: RMSE: X.XX | MAE: X.XX | R²: X.XXX

💾 Modèles sauvegardés dans ./models/:
  • ./models/random_forest.pkl
  • ./models/linear_regression.pkl
  • ./models/xgboost.pkl
  • ./models/feature_info.pkl
```

### Étape 2: Démarrer l'API

```bash
# Linux/Mac
chmod +x start_api.sh
./start_api.sh

# Windows
start_api.bat

# Ou directement
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

**API démarrera avec:**
```
✅ Modèle random_forest chargé avec succès
✅ Modèle linear_regression chargé avec succès  
✅ Modèle xgboost chargé avec succès
✅ Modèles disponibles: ['random_forest', 'linear_regression', 'xgboost']
✅ API prête à recevoir des requêtes!
```

### Étape 3: Démarrer le Frontend

```bash
cd frontend
npm install  # Si nécessaire
npm run dev
```

### Étape 4: Utiliser le Système

1. Ouvrir http://localhost:5173 (ou le port indiqué)
2. Aller à la section "Prédiction"
3. Remplir le formulaire
4. **Nouveau:** Sélectionner le modèle IA (nouveau champ):
   - 🌲 Random Forest (Rapide & Précis)
   - 📈 Régression Linéaire (Léger)
   - 🚀 XGBoost (Haute Performance)
5. Cliquer "Lancer la Prédiction"
6. Voir le résultat avec le modèle utilisé affiché

## 🧪 Tester le Système

```bash
# Test automatisé de tous les modèles
python test_multi_models.py
```

Cela va tester:
- ✅ Santé de l'API
- ✅ Modèles disponibles
- ✅ Prédictions avec les 3 modèles
- ✅ Endpoints d'analytics
- ✅ Modèle par défaut

## 📊 Exemple d'Utilisation de l'API

### Via cURL

```bash
# Prédiction avec Random Forest
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "TransportType": "Bus",
    "Line": "Line1",
    "Hour": 8,
    "Day": "Lundi",
    "Weather": "Normal",
    "Event": "Non",
    "model_type": "random_forest"
  }'

# Prédiction avec XGBoost
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "TransportType": "Metro",
    "Line": "Line2",
    "Hour": 18,
    "Day": "Vendredi",
    "Weather": "Pluie",
    "Event": "Non",
    "model_type": "xgboost"
  }'

# Lister les modèles disponibles
curl http://localhost:8000/models
```

### Via Python

```python
import requests

# Récupérer les modèles disponibles
response = requests.get('http://localhost:8000/models')
models = response.json()

# Faire une prédiction
prediction_data = {
    "TransportType": "Bus",
    "Line": "Line1",
    "Hour": 8,
    "Day": "Lundi",
    "Weather": "Normal",
    "Event": "Non",
    "model_type": "xgboost"  # Choisir le modèle
}

response = requests.post(
    'http://localhost:8000/predict',
    json=prediction_data
)
result = response.json()
print(f"Délai: {result['delay']} min")
print(f"Modèle: {result['model_used']}")
```

## 🔍 Architecture du Système

```
┌─────────────────────────────────────────────────────┐
│                 Frontend (React)                    │
│  - Prediction.jsx avec sélecteur de modèle          │
│  - Envoie model_type avec les données              │
└────────────────┬────────────────────────────────────┘
                 │ HTTP POST
                 ↓
┌─────────────────────────────────────────────────────┐
│                Backend (FastAPI)                    │
│  - api.py route /predict                            │
│  - Sélectionne le modèle selon model_type           │
│  - Utilise le modèle pour prédire                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
        ┌────────────────┐
        │  models dict   │
        ├────────────────┤
        │ RF: *.pkl      │
        │ LR: *.pkl      │
        │ XGB: *.pkl     │
        └────────────────┘
```

## 💡 Características Clés Implémentées

### ✨ Frontend (Prediction.jsx)
- [x] Sélecteur de modèle avec 3 options
- [x] Icône 🧠 pour identifier la sélection IA
- [x] Envoie model_type à l'API
- [x] Affiche le modèle utilisé dans les résultats
- [x] Validations du formulaire

### ✨ Backend (api.py)
- [x] Charge les 3 modèles au démarrage
- [x] Endpoint /models pour lister les modèles
- [x] Endpoint /predict accepte model_type
- [x] Fallback au modèle par défaut (RF)
- [x] Réponse inclut model_used
- [x] Gestion d'erreurs si modèle n'existe pas

### ✨ Entraînement (train_model.py)
- [x] Entraîne Random Forest
- [x] Entraîne Linear Regression
- [x] Entraîne XGBoost
- [x] Affiche les performances de chaque modèle
- [x] Indique le meilleur modèle (par R²)
- [x] Sauvegarde feature_info.pkl avec métadonnées

## 🎓 Performance Attendue

Après entraînement, vous verrez des métriques comme:

```
Random Forest:
  RMSE: ~5.2   MAE: ~3.5   R²: ~0.82

Linear Regression:
  RMSE: ~8.1   MAE: ~5.4   R²: ~0.63

XGBoost:
  RMSE: ~4.8   MAE: ~3.2   R²: ~0.84
```

**R² explique le pourcentage de variance dans les données.**
Plus élevé = meilleur (max 1.0)

## 📝 Notes Importantes

1. **Modèle par Défaut**: Random Forest est utilisé si aucun model_type n'est fourni
2. **Compatibilité Rétroactive**: Les anciennes requêtes sans model_type fonctionnent toujours
3. **Analytics**: Utilisent Random Forest par défaut (peut être changé dans api.py)
4. **Dépendances**: Vérifier que xgboost est installé (`pip install xgboost`)

## 🚨 Troubleshooting

| Problème | Solution |
|----------|----------|
| "Modèle non trouvé" | Exécuter `python train_model.py` |
| Import error xgboost | `pip install xgboost` |
| API ne charge pas les modèles | Vérifier que `models/` existe et contient les .pkl |
| Frontend n'envoie pas model_type | Vérifier la version de Prediction.jsx |

## 📚 Documentation Complète

Voir **MULTI_MODEL_GUIDE.md** pour:
- Guide détaillé d'utilisation
- Configuration avancée
- Intégration de nouveaux modèles
- Optimisation des performances

---

**Terminé! ✅ Les 3 algorithmes sont maintenant intégrés et fonctionnels.**
