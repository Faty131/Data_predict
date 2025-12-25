# 📸 VISUALISATION DES CHANGEMENTS

## Vue Avant/Après

### Frontend - Page de Prédiction

#### AVANT
```
┌─────────────────────────────────────────┐
│ Paramètres de Prédiction                │
├─────────────────────────────────────────┤
│ Type de Transport    [Bus         ▼]    │
│ Ligne                [Line1       ▼]    │
│ Heure de Départ      [08:00       ]    │
│ Jour                 [Lundi       ▼]    │
│ Conditions Météo     [Normal      ▼]    │
│ Événement Majeur     [Non         ▼]    │
│                                         │
│        [🚀 Lancer la Prédiction]       │
└─────────────────────────────────────────┘
```

#### APRÈS
```
┌─────────────────────────────────────────┐
│ Paramètres de Prédiction                │
├─────────────────────────────────────────┤
│ Type de Transport    [Bus         ▼]    │
│ Ligne                [Line1       ▼]    │
│ Heure de Départ      [08:00       ]    │
│ Jour                 [Lundi       ▼]    │
│ Conditions Météo     [Normal      ▼]    │
│ Événement Majeur     [Non         ▼]    │
│ Sélectionner Modèle  [Random Forest ▼] │ ← NOUVEAU!
│    Options:                             │
│    - 🌲 Random Forest (Rapide & Précis)│
│    - 📈 Régression Linéaire (Léger)    │
│    - 🚀 XGBoost (Haute Performance)    │
│                                         │
│        [🚀 Lancer la Prédiction]       │
└─────────────────────────────────────────┘
```

### Résultats de Prédiction

#### AVANT
```
┌──────────────────────────────────┐
│      Résultats de Prédiction     │
├──────────────────────────────────┤
│                                  │
│      Retard Prévu: 12.5 min     │
│                                  │
│  Risque: Moyen | Proba: 65%     │
│                                  │
│  "Vérifiez votre trajet..."     │
└──────────────────────────────────┘
```

#### APRÈS
```
┌──────────────────────────────────┐
│      Résultats de Prédiction     │
├──────────────────────────────────┤
│                                  │
│      Retard Prévu: 12.5 min     │
│                                  │
│  Risque: Moyen | Proba: 65%     │
│                                  │
│   🧠 Modèle: 🚀 XGBoost         │ ← NOUVEAU!
│                                  │
│  "Vérifiez votre trajet..."     │
└──────────────────────────────────┘
```

## Flux de Communication

### AVANT
```
Frontend                                API
   │                                     │
   ├─ POST /predict ─────────────────────>│
   │  {TransportType, Line, Hour,        │
   │   Day, Weather, Event}              │
   │                                     │
   │<────── Prédiction ────────────────── │
   │  {delay, risk, probability}         │
   │                                     │
   └─ Affiche le résultat ──────────────>│
```

### APRÈS
```
Frontend                                API
   │                                     │
   ├─ POST /predict ─────────────────────>│
   │  {TransportType, Line, Hour,        │
   │   Day, Weather, Event,              │
   │   model_type: "xgboost"}    ← NOUVEAU!
   │                                     │
   │  [Sélection du modèle]              │
   │  ├─ Charge random_forest.pkl        │
   │  ├─ Charge linear_regression.pkl    │
   │  ├─ Charge xgboost.pkl      ← Utilisé!
   │  └─ Prédiction avec XGBoost         │
   │                                     │
   │<────── Prédiction ────────────────── │
   │  {delay, risk, probability,         │
   │   model_used: "xgboost"}     ← NOUVEAU!
   │                                     │
   └─ Affiche résultat + modèle ────────>│
```

## Structure des Fichiers

### Avant
```
models/
└── random_forest.pkl  (seul modèle)

train_model.py
├─ load_and_prepare_data()
└─ train_and_save_model()
   └─ RandomForestRegressor seul

api.py
├─ model = None
└─ /predict
   └─ utilise model unique

frontend/
└─ Prediction.jsx
   └─ sans sélecteur de modèle
```

### Après
```
models/
├── random_forest.pkl      (RF)
├── linear_regression.pkl  (LR)
├── xgboost.pkl            (XGB) ← NOUVEAU!
└── feature_info.pkl

train_model.py
├─ load_and_prepare_data()
└─ train_and_save_model()
   ├─ RandomForestRegressor
   ├─ LinearRegression
   └─ XGBRegressor ← NOUVEAU!

api.py
├─ models = {} ← dict au lieu de model
├─ load_models() ← charge les 3
├─ /models ← NOUVEAU! liste les modèles
└─ /predict
   ├─ reçoit model_type
   ├─ sélectionne le modèle
   └─ inclut model_used dans réponse

frontend/
└─ Prediction.jsx
   ├─ Nouveau champ: model_type
   ├─ Sélecteur avec 3 options
   └─ Affichage du modèle utilisé
```

## Endpoints Nouveaux/Modifiés

### Nouveau
```
GET /models
├─ Liste les 3 modèles disponibles
├─ Indique lequel est disponible
└─ Retourne descriptions
```

### Modifié
```
POST /predict
├─ AVANT: {TransportType, Line, Hour, Day, Weather, Event}
├─ APRÈS: + model_type (optionnel, défaut: random_forest)
└─ Réponse: + model_used

GET /health
├─ AVANT: {status, model_loaded}
└─ APRÈS: {status, models_loaded, available_models[]}
```

## Code Changes Summary

### train_model.py
```python
# AVANT
model = RandomForestRegressor(...)
model.fit(X_train, y_train)
joblib.dump(model, "./models/random_forest.pkl")

# APRÈS
models_info = {}
rf_model = RandomForestRegressor(...)
rf_model.fit(X_train, y_train)
joblib.dump(rf_model, "./models/random_forest.pkl")
models_info['random_forest'] = {...}

lr_model = LinearRegression(...)
lr_model.fit(X_train, y_train)
joblib.dump(lr_model, "./models/linear_regression.pkl")
models_info['linear_regression'] = {...}

xgb_model = XGBRegressor(...)
xgb_model.fit(X_train, y_train)
joblib.dump(xgb_model, "./models/xgboost.pkl")
models_info['xgboost'] = {...}
```

### api.py
```python
# AVANT
model = None
def load_model():
    global model
    model = joblib.load("./models/random_forest.pkl")

@app.post("/predict")
async def predict_delay(data: PredictionRequest):
    prediction = model.predict(input_data)[0]

# APRÈS
models = {}
def load_models():
    global models
    models['random_forest'] = joblib.load("./models/random_forest.pkl")
    models['linear_regression'] = joblib.load("./models/linear_regression.pkl")
    models['xgboost'] = joblib.load("./models/xgboost.pkl")

class PredictionRequest(BaseModel):
    # ... autres champs
    model_type: str = "random_forest"  # NOUVEAU!

@app.post("/predict")
async def predict_delay(data: PredictionRequest):
    selected_model = models[data.model_type]
    prediction = selected_model.predict(input_data)[0]
    response["model_used"] = data.model_type  # NOUVEAU!
```

### Prediction.jsx
```jsx
// AVANT
const [formData, setFormData] = useState({
    TransportType: '',
    Line: '',
    Hour: '',
    Day: '',
    Weather: '',
    Event: ''
});

const formFields = [
    { name: 'TransportType', ... },
    { name: 'Line', ... },
    { name: 'Hour', ... },
    { name: 'Day', ... },
    { name: 'Weather', ... },
    { name: 'Event', ... }
];

// APRÈS
const [formData, setFormData] = useState({
    TransportType: '',
    Line: '',
    Hour: '',
    Day: '',
    Weather: '',
    Event: '',
    model_type: 'random_forest'  // NOUVEAU!
});

const formFields = [
    { name: 'TransportType', ... },
    { name: 'Line', ... },
    { name: 'Hour', ... },
    { name: 'Day', ... },
    { name: 'Weather', ... },
    { name: 'Event', ... },
    {
        name: 'model_type',  // NOUVEAU!
        label: 'Sélectionner le Modèle IA',
        options: [
            { value: 'random_forest', label: '🌲 Random Forest' },
            { value: 'linear_regression', label: '📈 Régression Linéaire' },
            { value: 'xgboost', label: '🚀 XGBoost' }
        ]
    }
];

// Affichage nouveau
{prediction.model_used && (
    <div className="...">
        <span>Modèle: {prediction.model_used}</span>
    </div>
)}
```

## Impact sur les Performances

### Taille des Modèles
```
random_forest.pkl      ~15-20 MB
linear_regression.pkl  ~100-500 KB
xgboost.pkl           ~10-15 MB
```

### Temps de Prédiction (en ms)
```
Random Forest      ~10-50 ms
Linear Regression  ~1-5 ms
XGBoost           ~20-100 ms
```

### Consommation Mémoire
```
Au démarrage:
- Avant: 1 modèle chargé
- Après: 3 modèles chargés (~50 MB supplémentaires)
```

## Compatibilité

### Backward Compatibility ✅
```
Ancienne requête (sans model_type):
POST /predict
{
    "TransportType": "Bus",
    ...
    // Pas de model_type
}

Résultat: Utilise Random Forest par défaut ✅
```

### Forward Compatibility ✅
```
Nouvelle requête (avec model_type):
POST /predict
{
    "TransportType": "Bus",
    ...
    "model_type": "xgboost"
}

Résultat: Utilise XGBoost comme demandé ✅
```

---

**En résumé:** Le système supporte maintenant 3 modèles, et l'utilisateur peut choisir lequel utiliser. C'est transparent, efficace, et extensible! 🚀
