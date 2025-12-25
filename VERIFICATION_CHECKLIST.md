## 🎯 CHECKLIST DE VÉRIFICATION - SYSTÈME MULTI-MODÈLES

### ✅ Phase 1: Préparation

- [ ] **Python 3.8+** installé
  ```bash
  python3 --version  # Vérifier version
  ```

- [ ] **Dépendances installées**
  ```bash
  pip install -r requirements.txt
  pip install -r requirements_api.txt
  ```

- [ ] **Dossier `models/` existe**
  ```bash
  mkdir -p models
  ```

- [ ] **Node.js installé** (pour le frontend)
  ```bash
  node --version  # Vérifier version
  npm --version
  ```

### ✅ Phase 2: Entraînement des Modèles

```bash
# Exécuter l'entraînement
python train_model.py
```

**Vérifications:**
- [ ] Affichage de 3 sections "Entraînement"
- [ ] Affichage des métriques (RMSE, MAE, R²) pour chaque modèle
- [ ] Affichage du "Meilleur modèle"
- [ ] 3 fichiers `.pkl` créés dans `models/`:
  ```bash
  ls -la models/
  # random_forest.pkl
  # linear_regression.pkl
  # xgboost.pkl
  # feature_info.pkl
  ```

**Exemple de sortie attendue:**
```
🚀 Entraînement des modèles ML...
🌲 Entraînement: Random Forest Regressor
  • RMSE: 5.23
  • MAE: 3.45
  • R²: 0.82

📈 Entraînement: Linear Regression
  • RMSE: 7.89
  • MAE: 5.23
  • R²: 0.65

🚀 Entraînement: XGBoost Regressor
  • RMSE: 4.56
  • MAE: 3.12
  • R²: 0.85

🏆 Meilleur modèle: XGBoost (R² = 0.85)
```

### ✅ Phase 3: Démarrage de l'API

**Terminal 1:**
```bash
./start_api.sh  # ou: python -m uvicorn api:app --reload
```

**Vérifications:**
- [ ] Pas d'erreurs d'import (surtout xgboost)
- [ ] Affichage:
  ```
  ✅ Modèle random_forest chargé avec succès
  ✅ Modèle linear_regression chargé avec succès
  ✅ Modèle xgboost chargé avec succès
  ✅ Modèles disponibles: ['random_forest', 'linear_regression', 'xgboost']
  ✅ API prête à recevoir des requêtes!
  ```
- [ ] Serveur écoute sur `http://localhost:8000`

### ✅ Phase 4: Test de l'API (sans Frontend)

**Test 1: Santé de l'API**
```bash
curl http://localhost:8000/health
```
**Réponse attendue:**
```json
{
  "status": "healthy",
  "models_loaded": true,
  "available_models": ["random_forest", "linear_regression", "xgboost"],
  "timestamp": "..."
}
```
- [ ] `models_loaded`: true
- [ ] 3 modèles dans la liste

**Test 2: Modèles Disponibles**
```bash
curl http://localhost:8000/models
```
**Réponse attendue:**
```json
{
  "available_models": [
    {
      "id": "random_forest",
      "name": "🌲 Random Forest",
      "description": "...",
      "available": true
    },
    ...
  ],
  "total_available": 3
}
```
- [ ] `total_available`: 3
- [ ] Les 3 modèles avec `available`: true

**Test 3: Prédiction avec Random Forest**
```bash
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
```
- [ ] Réponse sans erreur
- [ ] `delay`: nombre positif
- [ ] `model_used`: "random_forest"

**Test 4: Prédiction avec Linear Regression**
```bash
# Changer model_type en "linear_regression"
```
- [ ] Réponse sans erreur
- [ ] `model_used`: "linear_regression"

**Test 5: Prédiction avec XGBoost**
```bash
# Changer model_type en "xgboost"
```
- [ ] Réponse sans erreur
- [ ] `model_used`: "xgboost"

**Test 6: Prédiction par défaut (sans model_type)**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "TransportType": "Metro",
    "Line": "Line2",
    "Hour": 18,
    "Day": "Vendredi",
    "Weather": "Pluie",
    "Event": "Non"
  }'
```
- [ ] Réponse sans erreur
- [ ] `model_used`: "random_forest" (défaut)

### ✅ Phase 5: Démarrage du Frontend

**Terminal 2:**
```bash
cd frontend
npm install  # Si première fois
npm run dev
```

**Vérifications:**
- [ ] Pas d'erreurs de compilation
- [ ] Serveur écoute sur `http://localhost:5173` (ou port indiqué)
- [ ] Frontend se charge sans erreurs

### ✅ Phase 6: Test du Frontend

1. **Ouvrir l'application**
   - [ ] Aller à http://localhost:5173
   - [ ] Page charge sans erreurs

2. **Naviguer à Prédiction**
   - [ ] Voir le formulaire "Paramètres de Prédiction"
   - [ ] Voir tous les champs (TransportType, Line, Hour, Day, Weather, Event)

3. **Nouveau Champ: Sélecteur de Modèle**
   - [ ] Voir le champ "Sélectionner le Modèle IA"
   - [ ] Voir 3 options:
     - 🌲 Random Forest (Rapide & Précis)
     - 📈 Régression Linéaire (Léger)
     - 🚀 XGBoost (Haute Performance)
   - [ ] Option par défaut: Random Forest

4. **Remplir le formulaire**
   - [ ] TransportType: "Bus"
   - [ ] Line: "Line1"
   - [ ] Hour: "08"
   - [ ] Day: "Lundi"
   - [ ] Weather: "Normal"
   - [ ] Event: "Non"
   - [ ] Model: "Random Forest" (défaut)

5. **Soumettre la prédiction**
   - [ ] Cliquer "Lancer la Prédiction"
   - [ ] Voir animation de chargement
   - [ ] Résultats s'affichent

6. **Vérifier les résultats**
   - [ ] Voir "Retard Prévu" (ex: 12.5 minutes)
   - [ ] Voir "Niveau de Risque" (Faible/Moyen/Élevé)
   - [ ] Voir "Probabilité" (%)
   - [ ] Voir "Confiance" (%)
   - [ ] **NOUVEAU:** Voir badge "Modèle: 🌲 Random Forest"

7. **Tester avec XGBoost**
   - [ ] Remplir formulaire à nouveau
   - [ ] Sélectionner "XGBoost"
   - [ ] Soumettre
   - [ ] Voir badge "Modèle: 🚀 XGBoost"
   - [ ] Comparer avec résultat Random Forest

8. **Tester avec Linear Regression**
   - [ ] Remplir formulaire à nouveau
   - [ ] Sélectionner "Linear Regression"
   - [ ] Soumettre
   - [ ] Voir badge "Modèle: 📈 Régression Linéaire"
   - [ ] Comparer avec les autres résultats

### ✅ Phase 7: Test Automatisé Complet

```bash
python test_multi_models.py
```

**Vérifications:**
- [ ] Test 1: Santé - ✅ PASSÉ
- [ ] Test 2: Modèles - ✅ PASSÉ
- [ ] Test 3: Prédictions - ✅ PASSÉ
- [ ] Test 4: Analytics - ✅ PASSÉ
- [ ] Test 5: Modèle par défaut - ✅ PASSÉ
- [ ] Message final: "Tous les tests sont passés!"

### ✅ Phase 8: Cas d'Usage Avancés

**Test: Erreur si modèle invalide**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "TransportType": "Bus",
    "Line": "Line1",
    "Hour": 8,
    "Day": "Lundi",
    "Weather": "Normal",
    "Event": "Non",
    "model_type": "invalid_model"
  }'
```
- [ ] Réponse: Erreur 400 avec message d'erreur clair

**Test: Analytics/Temporal**
```bash
curl http://localhost:8000/analytics/temporal
```
- [ ] Retourne les données d'analyse temporelle
- [ ] 15 points de données (heures 6-20)

**Test: Analytics/Weather**
```bash
curl http://localhost:8000/analytics/weather
```
- [ ] Retourne les données météo
- [ ] Contient: Soleil, Pluie, Neige, Tempête

### ✅ Phase 9: Vérifications Finales

**Base de Données de Modèles**
```bash
ls -lah models/
```
- [ ] random_forest.pkl (plusieurs MB)
- [ ] linear_regression.pkl (plus petit)
- [ ] xgboost.pkl (plusieurs MB)
- [ ] feature_info.pkl (petit)

**Logs de l'API**
```
# Dans le terminal de l'API, vous devriez voir:
🤖 Modèle utilisé: random_forest
📤 Réponse envoyée: {...}

🤖 Modèle utilisé: xgboost
📤 Réponse envoyée: {...}
```

**Pas d'Erreurs JavaScript**
- [ ] Ouvrir DevTools (F12)
- [ ] Onglet Console
- [ ] Aucune erreur rouge
- [ ] Aucun warning rouge

### 📊 Résumé de Vérification

| Composant | Status | Notes |
|-----------|--------|-------|
| train_model.py | ✅ | 3 modèles entraînés |
| api.py | ✅ | Charge les 3 modèles |
| /models endpoint | ✅ | Liste les 3 modèles |
| /predict avec model_type | ✅ | Accepte les 3 modèles |
| Frontend sélecteur | ✅ | 3 options affichées |
| Résultats avec badge | ✅ | Modèle affiché |
| Tests automatisés | ✅ | Tous passent |

### 🎯 Conclusion

Si tous les items sont cochés ✅, le système multi-modèles est **pleinement fonctionnel**!

**Prochaines étapes:**
- [ ] Montrer à l'équipe
- [ ] Collecter les retours
- [ ] Déployer en production
- [ ] Monitorer les performances
- [ ] Envisager l'ajout d'autres modèles

---

**Dernière mise à jour**: Décembre 2025
