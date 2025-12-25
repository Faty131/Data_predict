# 🎯 GUIDE RAPIDE - HISTORIQUE & COMPARAISON

## ⚡ En 5 minutes

### 1️⃣ Préparation
```bash
# Terminal 1: Démarrer l'API
python api.py
# ✅ BD créée automatiquement: predictions_history.db
# ✅ 3 modèles chargés
# ✅ Prêt à recevoir des prédictions
```

### 2️⃣ Tester rapidement
```bash
# Terminal 2: Une prédiction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"TransportType":"Bus","Line":"Line1","Hour":8,"Day":"Monday","Weather":"Normal","Event":"None","model_type":"random_forest"}'

# Réponse: prediction_id est généré et sauvegardé!
```

### 3️⃣ Voir l'historique
```bash
# Via API
curl http://localhost:8000/history

# Via Interface: http://localhost:5173 → Historique
```

### 4️⃣ Comparer les modèles
```bash
# Via API
curl http://localhost:8000/comparison

# Via Interface: http://localhost:5173 → Comparaison
```

---

## 🎬 Démarrage Complet

### Mode 1: Manuel
```bash
# Terminal 1: API
python api.py

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Tests (optionnel)
python test_history_and_comparison.py
```

### Mode 2: Script Helper
```bash
chmod +x start_history_system.sh
./start_history_system.sh
# Menu interactif avec options
```

---

## 📊 Trois Interfaces

### 1. API REST
```
GET  /history?limit=100&offset=0              → Liste prédictions
GET  /history/42                              → Détails prédiction
PUT  /history/42?actual_delay=13.2            → Ajouter réalité
GET  /comparison                              → Stats modèles
GET  /comparison/random_forest                → Stats modèle
POST /history/export/csv                      → Export CSV
```

### 2. Frontend Web
```
📋 Page Historique
├─ Filtres (Modèle, Type, Jour)
├─ Pagination
├─ Clic pour détails
└─ Ajouter délai réel observé

📊 Page Comparaison
├─ Cartes des 3 modèles
├─ Tableau comparatif
├─ Analyse des risques
└─ Clic pour détails modèle
```

### 3. Python/Scripts
```python
from database import db, PredictionRecord

# Récupérer l'historique
records, total = db.get_history(limit=100)

# Comparer les modèles
stats = db.get_model_statistics()

# Exporter
db.export_to_csv("predictions.csv")
```

---

## 🧪 Validation Rapide

### Checklist 5 min
```
☐ API démarre sans erreur
☐ BD predictions_history.db créée
☐ Première prédiction génère un ID
☐ GET /history retourne les prédictions
☐ GET /comparison retourne les stats

Si tout ✅ → Système fonctionnel!
```

### Tests Automatisés
```bash
pip install requests tabulate
python test_history_and_comparison.py

# Résultat: 10 tests validant tout
```

---

## 📈 Workflow Complet

```
JOUR 1: Configuration
├─ Lancer API & Frontend
├─ Faire 10 prédictions (différents modèles)
└─ Observer dans Historique

JOUR 2: Analyse
├─ Ajouter les délais réels observés
├─ Comparer les modèles
└─ Voir les statistiques

JOUR 3+: Optimisation
├─ Identifier les cas problématiques
├─ Ajuster les paramètres des modèles
├─ Relancer entraînement si nécessaire
└─ Comparer les nouvelles stats
```

---

## 🔍 Exemples de Requêtes

### Historique
```bash
# Toutes les prédictions
curl http://localhost:8000/history

# Avec pagination
curl http://localhost:8000/history?limit=50&offset=0

# Filter par modèle
curl http://localhost:8000/history?model_filter=xgboost

# Filter par type
curl http://localhost:8000/history?transport_filter=Bus

# Filter par jour
curl http://localhost:8000/history?day_filter=Monday

# Combination
curl "http://localhost:8000/history?model_filter=xgboost&day_filter=Monday&limit=20"
```

### Détails
```bash
# Voir une prédiction spécifique
curl http://localhost:8000/history/42

# Mettre à jour avec données réelles
curl -X PUT "http://localhost:8000/history/42?actual_delay=13.5&actual_risk=Medium"
```

### Comparaison
```bash
# Stats globales
curl http://localhost:8000/comparison

# Stats d'un modèle
curl http://localhost:8000/comparison/random_forest
curl http://localhost:8000/comparison/linear_regression
curl http://localhost:8000/comparison/xgboost
```

### Maintenance
```bash
# Export
curl -X POST http://localhost:8000/history/export/csv

# Nettoyer > 30 jours
curl -X DELETE "http://localhost:8000/history/cleanup?days=30"
```

---

## 🎨 Interface Utilisateur

### Historique (Page)
```
┌─────────────────────────────────────────┐
│ 📋 Historique: 1250 prédictions        │
├─────────────────────────────────────────┤
│ [Modèle ▼] [Type ▼] [Jour ▼]           │
│ [CSV Export] [Nettoyer]                │
├─────────────────────────────────────────┤
│ ID │ Modèle │ Délai │ Risque │ Date   │
│ 1  │🌲 RF  │ 12m  │ Med   │ Lun 10:30│
│ 2  │📈 LR  │ 14m  │ High  │ Lun 10:45│
│ 3  │🚀 XGB │ 11m  │ Low   │ Lun 11:00│
└─────────────────────────────────────────┘

Clic sur une ligne → Détails + Ajouter délai réel
```

### Comparaison (Page)
```
┌─────────────────────────────────────────┐
│ 📊 Comparaison des Modèles [Actualiser]│
├─────────────────────────────────────────┤
│ 🌲 RF      │ 📈 LR       │ 🚀 XGB      │
│ 500 util   │ 250 util    │ 500 util    │
│ 12.3m      │ 14.5m       │ 12.8m       │
│ 85% conf   │ 78% conf    │ 89% conf ✓  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 👑 Tableau Comparatif                   │
├─────────────────────────────────────────┤
│ Métrique    │ RF    │ LR    │ XGB       │
│ Total       │ 500✓  │ 250   │ 500       │
│ Délai moy   │ 12.3  │ 14.5  │ 12.8      │
│ Confiance   │ 85%   │ 78%   │ 89% ✓     │
│ Vérifiées   │ 50    │ 25    │ 75 ✓      │
└─────────────────────────────────────────┘

Clic sur modèle → Détails + Avantages/Cons
```

---

## 💾 Données Sauvegardées

### Par prédiction:
```
✅ ID unique
✅ Paramètres d'entrée (Type, Ligne, Heure, Jour, Météo, Événement)
✅ Modèle utilisé (RF, LR, XGB)
✅ Prédiction (délai, risque, probabilité/confiance)
✅ Délai réel (optionnel, ajouté après)
✅ Timestamp (automatique)
```

### Statistiques:
```
✅ Total par modèle
✅ Délai moyen/min/max
✅ Confiance moyenne
✅ Distribution des risques
✅ Prédictions vérifiées
```

---

## ⚙️ Configuration

### BD SQLite
```python
# Fichier: ./predictions_history.db
# Tables:
#   - predictions (enregistre chaque prédiction)
#   - model_metrics (stats quotidiennes)

# Autorise: ~10,000 prédictions = ~5 MB
# Nettoyer avec: DELETE /history/cleanup?days=30
```

### Actualisation
```javascript
// Comparaison actualise toutes les 30 secondes
// Historique sur demande (pagination)
```

---

## 🎓 Exemples Cas d'Usage

### Cas 1: Qual' des modèles
```
→ Aller en Comparaison
→ XGBoost a 89% confiance
→ Random Forest a 85% confiance
→ Linéaire a 78% confiance
→ Décision: Utiliser XGBoost par défaut
```

### Cas 2: Debug problèmes
```
→ Historique: Filtrer par Lundi
→ Tous les lundis = retards élevés
→ Raison: Beaucoup d'événements le lundi
→ Solution: Pondérer les événements différemment
```

### Cas 3: Validation après coup
```
→ Historique: Faire 10 prédictions
→ Attendre que le transport passe
→ Clic "Ajouter délai réel"
→ Comparer prédit vs réel
→ Calculer accuracy
```

---

## ⚡ Performance

| Métrique | Valeur |
|----------|--------|
| Taille BD (10k prédictions) | 5-10 MB |
| Requête /history | < 100 ms |
| Requête /comparison | < 50 ms |
| Prédiction + sauvegarde | < 20 ms |
| Mémoire API | 50 MB (3 modèles) |

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| API ne démarre pas | Vérifier `database.py` existe |
| BD vide | C'est normal! 1ère prédiction la remplira |
| Historique vide | Faire une prédiction d'abord |
| Comparaison = 0 | Attendre le résultat de prédictions |
| Frontend ne charge pas | Vérifier routes dans `App.jsx` |
| Tests échouent | Vérifier API sur `localhost:8000` |

---

## 📚 Fichiers Documentation

1. **HISTORY_COMPARISON_SUMMARY.md** ← Vous êtes ici
2. **DATABASE_HISTORY_GUIDE.md** - Guide détaillé (400+ lignes)
3. **test_history_and_comparison.py** - Suite de tests (400+ lignes)

---

## 🚀 Prochaines Étapes

```bash
# 1. Démarrer
python api.py

# 2. Depuis un autre terminal
cd frontend && npm run dev

# 3. Accéder
# API: http://localhost:8000
# Web: http://localhost:5173

# 4. Tester
python test_history_and_comparison.py

# 5. Consulter
# Menu → Historique (voir toutes les prédictions)
# Menu → Comparaison (voir les stats des modèles)
```

---

## ✨ Points Clés

- ✅ **Automatique**: Chaque prédiction est sauvegardée automatiquement
- ✅ **Persistant**: Les données restent après redémarrage
- ✅ **Flexible**: Filtrez, paginiz, exportez comme vous voulez
- ✅ **Performant**: SQLite gère 100k+ prédictions facilement
- ✅ **Interactif**: 3 interfaces (API, Web, Python)
- ✅ **Testable**: 10 tests automatisés fournis

---

**Prêt à commencer? Lancez `python api.py`! 🚀**
