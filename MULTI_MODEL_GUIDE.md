# Guide Multi-Modèles - Prédiction des Retards de Transport

## 📋 Vue d'ensemble

Le système a été mis à jour pour supporter **3 modèles de machine learning** différents. L'utilisateur peut maintenant choisir le modèle qu'il souhaite utiliser pour les prédictions.

## 🤖 Modèles Disponibles

### 1. **🌲 Random Forest** (Par défaut)
- **Type**: Ensemble d'arbres de décision
- **Avantages**: 
  - Rapide et précis
  - Bonne généralisation
  - Peu sensible au surapprentissage
- **Cas d'utilisation**: Recommandé pour la plupart des scénarios

### 2. **📈 Régression Linéaire**
- **Type**: Modèle de régression simple
- **Avantages**:
  - Très léger en ressources
  - Interprétable facilement
  - Rapide à exécuter
- **Cas d'utilisation**: Quand la vitesse est cruciale et l'espace limité

### 3. **🚀 XGBoost** (Haute Performance)
- **Type**: Gradient Boosting
- **Avantages**:
  - Performance maximale
  - Très précis sur les données complexes
  - Gère bien les relations non-linéaires
- **Cas d'utilisation**: Quand la précision maximale est requise

## 🚀 Démarrage

### 1. **Entraîner les modèles**

```bash
# Entraîner les 3 modèles et les sauvegarder
python train_model.py
```

Cela va:
- Charger les données depuis `data/processed/clean_data.csv`
- Entraîner Random Forest, Linear Regression et XGBoost
- Sauvegarder les 3 modèles dans le dossier `models/`:
  - `random_forest.pkl`
  - `linear_regression.pkl`
  - `xgboost.pkl`
- Sauvegarder les informations dans `feature_info.pkl`

### 2. **Démarrer l'API**

```bash
# Linux/Mac
./start_api.sh

# Windows
start_api.bat
```

L'API chargera automatiquement tous les modèles disponibles.

### 3. **Démarrer le Frontend**

```bash
cd frontend
npm install
npm run dev
```

## 🎯 Utilisation

### Via le Frontend

1. Remplir les paramètres de prédiction:
   - Type de Transport
   - Ligne
   - Heure de Départ
   - Jour
   - Conditions Météo
   - Événement Majeur

2. **Sélectionner le Modèle** (nouveau champ):
   - 🌲 Random Forest
   - 📈 Régression Linéaire
   - 🚀 XGBoost

3. Cliquer sur "Lancer la Prédiction"

4. Voir le résultat avec:
   - Délai prévu en minutes
   - Niveau de risque
   - Probabilité de retard
   - **Modèle utilisé** (affiché dans les résultats)

### Via l'API REST

#### Récupérer les modèles disponibles
```bash
GET http://localhost:8000/models
```

Réponse:
```json
{
  "available_models": [
    {
      "id": "random_forest",
      "name": "🌲 Random Forest",
      "description": "Modèle rapide et précis...",
      "available": true
    },
    ...
  ],
  "total_available": 3
}
```

#### Faire une prédiction avec un modèle spécifique
```bash
POST http://localhost:8000/predict
Content-Type: application/json

{
  "TransportType": "Bus",
  "Line": "Line1",
  "Hour": 8,
  "Day": "Lundi",
  "Weather": "Normal",
  "Event": "Non",
  "model_type": "xgboost"  # Nouveau paramètre optionnel
}
```

Réponse:
```json
{
  "delay": 12.5,
  "risk": "Moyen",
  "probability": 65.3,
  "model_used": "xgboost",
  "unit": "minutes",
  "timestamp": "2025-12-25T...",
  "input": {...}
}
```

## 📊 Endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/` | GET | Info sur l'API |
| `/models` | GET | Liste des modèles disponibles |
| `/health` | GET | Santé de l'API |
| `/predict` | POST | Faire une prédiction |
| `/analytics/temporal` | GET | Analyse par heure |
| `/analytics/weather` | GET | Impact météo |
| `/analytics/events` | GET | Impact événements |
| `/analytics/transport` | GET | Stats par transport |
| `/analytics/overview` | GET | Vue d'ensemble |

## 📁 Structure des fichiers modifiés

```
├── train_model.py                    # Entraîne les 3 modèles
├── api.py                            # API avec support multi-modèles
├── frontend/src/pages/Prediction.jsx # Frontend avec sélecteur
├── models/
│   ├── random_forest.pkl            # Modèle RF
│   ├── linear_regression.pkl        # Modèle LR
│   ├── xgboost.pkl                  # Modèle XGB
│   └── feature_info.pkl             # Infos features
└── MULTI_MODEL_GUIDE.md             # Ce fichier
```

## 🔧 Configuration

### Changer le modèle par défaut

Dans `api.py`, à la ligne où on sélectionne le modèle pour les analytics:
```python
# Actuellement: Random Forest
model_to_use = models.get('random_forest', list(models.values())[0])

# Pour changer:
model_to_use = models.get('xgboost', list(models.values())[0])
```

### Ajouter un nouveau modèle

1. Modifier `train_model.py`:
   ```python
   from sklearn.your_new_model import YourNewModel
   
   # Ajouter dans train_and_save_model():
   your_model = YourNewModel(...)
   your_model.fit(X_train, y_train)
   
   joblib.dump(your_model, "./models/your_model.pkl")
   ```

2. Modifier `api.py`:
   ```python
   # Dans load_models():
   models_to_load = {
       ...
       'your_model': './models/your_model.pkl'
   }
   ```

3. Modifier `Prediction.jsx`:
   ```jsx
   {
     value: 'your_model',
     label: '🎯 Your Model Name'
   }
   ```

## 📈 Performance des Modèles

Après entraînement, vous verrez un rapport comparable à:

```
===============================================================
Random Forest:
  RMSE: 5.23 | MAE: 3.45 | R²: 0.82
  
📈 Régression Linéaire:
  RMSE: 7.89 | MAE: 5.23 | R²: 0.65

🚀 XGBoost:
  RMSE: 4.56 | MAE: 3.12 | R²: 0.85

🏆 Meilleur modèle: XGBoost (R² = 0.85)
```

## ⚙️ Troubleshooting

### "Modèle non trouvé"
```bash
# Réentraîner les modèles
python train_model.py
```

### Erreur "Aucun modèle chargé"
1. Vérifier que `models/` contient les `.pkl`
2. Redémarrer l'API

### Performance lente
- **Linear Regression** est le plus rapide
- **XGBoost** est le plus puissant mais plus lent
- **Random Forest** offre un bon compromis

## 📝 Notes

- Le modèle par défaut (utilisé si non spécifié) est **Random Forest**
- Les modèles sont chargés au démarrage de l'API
- Chaque prédiction inclut maintenant le `model_used` dans la réponse
- Les analytics utilisent Random Forest par défaut

## 🚀 Prochaines étapes

- [ ] Ajouter une interface de sélection visuelle des modèles dans le Dashboard
- [ ] Implémenter un A/B testing entre modèles
- [ ] Ajouter des métriques de performance en temps réel
- [ ] Créer une interface d'entraînement de nouveaux modèles

---

**Dernière mise à jour**: Décembre 2025
