#!/usr/bin/env python3
"""
Script de modélisation prédictive pour l'analyse des retards des transports en commun
Exécute directement le code de modélisation sans notebook
"""

import sys
import os
import warnings
warnings.filterwarnings('ignore')

# Configuration matplotlib pour éviter les erreurs GUI
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, f1_score, roc_auc_score
import xgboost as xgb
import joblib

# Configuration des visualisations
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")
pd.set_option('display.max_columns', 50)
pd.set_option('display.width', 1000)

# Création des dossiers nécessaires
os.makedirs("./models", exist_ok=True)
os.makedirs("./results", exist_ok=True)
os.makedirs("./reports", exist_ok=True)

print("✅ Configuration terminée")

# Chargement des données préparées (issues des notebooks précédents)
print("📥 Chargement des données préparées...")
df = pd.read_csv("./data/processed/clean_data.csv")
print(f"📊 Shape: {df.shape}")
print(f"🎯 Colonnes: {list(df.columns)}")

# Aperçu rapide
print("\n📋 Aperçu des données:")
print(df.head())

# Préparation des données pour la modélisation
print("🔧 Préparation des données pour la modélisation...")

# Encodage des variables catégorielles si nécessaire
categorical_cols = ['TransportType', 'Line', 'Status', 'IncidentCause']
le = LabelEncoder()

for col in categorical_cols:
    if col in df.columns:
        df[col + '_encoded'] = le.fit_transform(df[col].astype(str))

# Sélection des features (adapter selon les features créées dans le notebook de feature engineering)
feature_cols = [col for col in df.columns if col.endswith('_encoded') or col in ['delay_minutes']]
if 'hour' in df.columns:
    feature_cols.append('hour')
if 'day_of_week' in df.columns:
    feature_cols.append('day_of_week')

X = df[feature_cols].drop('delay_minutes', axis=1)
y = df['delay_minutes']

print(f"📐 Features sélectionnées: {list(X.columns)}")
print(f"🎯 Target: delay_minutes")
print(f"📊 Shape: {X.shape}")

# Split des données
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Train shape: {X_train.shape}")
print(f"Test shape: {X_test.shape}")

# Modèles à tester
models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'XGBoost': xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
}

results = {}

for name, model in models.items():
    print(f"\n🏃 Entraînement de {name}...")

    # Entraînement
    model.fit(X_train, y_train)

    # Prédictions
    y_pred = model.predict(X_test)

    # Métriques
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    results[name] = {
        'RMSE': rmse,
        'MAE': mae,
        'R²': r2
    }

    print(f"  • RMSE: {rmse:.2f}")
    print(f"  • MAE: {mae:.2f}")
    print(f"  • R²: {r2:.3f}")

# Sauvegarde du meilleur modèle
best_model_name = max(results, key=lambda x: results[x]['R²'])
best_model = models[best_model_name]
joblib.dump(best_model, f"./models/{best_model_name.lower().replace(' ', '_')}.pkl")

print(f"\n💾 Meilleur modèle sauvegardé: {best_model_name}")

# Comparaison des modèles
results_df = pd.DataFrame(results).T
print("\n📊 Comparaison des Modèles:")
print(results_df)

# Visualisation
results_df.plot(kind='bar', figsize=(10, 6))
plt.title('Comparaison des Métriques des Modèles')
plt.ylabel('Valeur')
plt.xticks(rotation=45)
plt.legend(loc='upper left', bbox_to_anchor=(1, 1))
plt.tight_layout()
plt.savefig("./results/model_comparison.png")
# plt.show()  # Commenté pour éviter l'erreur GUI

# Analyse des features importantes (pour Random Forest)
if 'Random Forest' in models:
    rf_model = models['Random Forest']
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)

    plt.figure(figsize=(10, 6))
    sns.barplot(x='importance', y='feature', data=feature_importance.head(10))
    plt.title('Top 10 Features Importantes (Random Forest)')
    plt.savefig("./results/feature_importance.png")
    # plt.show()  # Commenté pour éviter l'erreur GUI

    print("\n🔍 Top 5 features importantes:")
    print(feature_importance.head(5))

# Validation croisée pour le meilleur modèle
print("🔄 Validation croisée du meilleur modèle...")

cv_scores = cross_val_score(best_model, X, y, cv=5, scoring='neg_mean_squared_error')
cv_rmse_scores = np.sqrt(-cv_scores)

print(f"📊 Scores RMSE en validation croisée: {cv_rmse_scores}")
print(f"• Moyenne: {cv_rmse_scores.mean():.2f}")
print(f"• Écart-type: {cv_rmse_scores.std():.2f}")

# Prédictions sur un échantillon de test
print("🧪 Test de prédictions...")

sample_data = X_test.head(5)
sample_predictions = best_model.predict(sample_data)
sample_actual = y_test.head(5)

print("📋 Comparaison prédictions vs réalité:")
for i, (pred, actual) in enumerate(zip(sample_predictions, sample_actual)):
    print(f"  Échantillon {i+1}: Prédit={pred:.2f}min, Réel={actual:.2f}min, Erreur={abs(pred-actual):.2f}min")

print("\n🎯 SYNTHÈSE DE LA MODÉLISATION")
print("=" * 50)

print(f"\n📊 Performance du meilleur modèle ({best_model_name}):")
print(f"• RMSE: {results[best_model_name]['RMSE']:.2f}")
print(f"• MAE: {results[best_model_name]['MAE']:.2f}")
print(f"• R²: {results[best_model_name]['R²']:.3f}")

if results[best_model_name]['R²'] > 0.7:
    print("✅ Objectif de précision (70%) atteint !")
else:
    print("⚠️ Objectif de précision non atteint, amélioration nécessaire.")

print("\n🔍 FACTEURS PRINCIPAUX IDENTIFIÉS:")
print("• Analyse des features importantes révèle les variables les plus influentes")
if 'Random Forest' in models:
    print("• Features importantes :", list(feature_importance.head(3)['feature']))

# Sauvegarde des résultats
results_df.to_csv("./results/model_comparison.csv")
if 'Random Forest' in models:
    feature_importance.to_csv("./results/feature_importance.csv")

print("\n💾 Résultats sauvegardés dans ./results/")
print("✅ MODÉLISATION TERMINÉE AVEC SUCCÈS !")