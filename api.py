from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
from typing import Optional
from contextlib import asynccontextmanager
import json

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestionnaire de lifespan pour l'initialisation et le nettoyage"""
    # Code d'initialisation (startup)
    print("🚀 Démarrage de l'API SmartMobility ML...")
    load_model()
    print("✅ API prête à recevoir des requêtes!")
    yield
    # Code de nettoyage (shutdown) si nécessaire
    print("🛑 Arrêt de l'API SmartMobility ML...")

app = FastAPI(
    title="SmartMobility ML API",
    version="1.0.0",
    lifespan=lifespan
)

# Configuration CORS pour permettre les requêtes du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware pour logger les requêtes
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware pour logger les requêtes entrantes"""
    if request.method == "POST" and request.url.path == "/predict":
        print(f"\n📨 Requête reçue: {request.method} {request.url.path}")
        print(f"🔗 URL complète: {request.url}")

        # Lire le corps de la requête
        body = await request.body()
        if body:
            try:
                body_json = json.loads(body.decode('utf-8'))
                print(f"📋 Données reçues: {json.dumps(body_json, indent=2, ensure_ascii=False)}")
            except json.JSONDecodeError:
                print(f"📋 Corps brut: {body.decode('utf-8')}")

        print(f"🌐 Headers: {dict(request.headers)}")
        print("-" * 50)

    response = await call_next(request)
    return response

# Modèle de données pour les prédictions
class PredictionRequest(BaseModel):
    TransportType: str
    Line: str
    Hour: int
    Day: str
    Weather: str
    Event: str

# Variables globales pour le modèle
model = None
feature_columns = None

def load_model():
    """Charge le modèle ML sauvegardé"""
    global model, feature_columns

    model_path = "./models/random_forest.pkl"
    if not os.path.exists(model_path):
        print("⚠️ Modèle non trouvé, entraînement d'un modèle de base...")
        train_basic_model()
        return

    try:
        model = joblib.load(model_path)
        print("✅ Modèle chargé avec succès")

        # Charger les informations des features depuis le fichier sauvegardé
        info_path = "./models/feature_info.pkl"
        if os.path.exists(info_path):
            feature_info = joblib.load(info_path)
            feature_columns = feature_info['feature_columns']
            print(f"📊 Features chargées depuis le fichier: {len(feature_columns)}")
            print(f"Features: {feature_columns}")
        else:
            # Fallback vers les features connues
            feature_columns = ['hour', 'TransportType_encoded', 'Line_encoded', 'Status_encoded', 'IncidentCause_encoded']
            print(f"📊 Features par défaut: {len(feature_columns)}")

    except Exception as e:
        print(f"❌ Erreur lors du chargement du modèle: {e}")
        train_basic_model()

def train_basic_model():
    """Entraîne un modèle de base si aucun modèle sauvegardé n'existe"""
    global model, feature_columns

    print("🔧 Entraînement d'un modèle de base...")

    # Créer des données d'exemple pour l'entraînement
    np.random.seed(42)
    n_samples = 1000

    # Features
    data = {
        'hour': np.random.randint(6, 20, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples),
        'TransportType_Metro': np.random.choice([0, 1], n_samples),
        'TransportType_Train': np.random.choice([0, 1], n_samples),
        'Line_Line2': np.random.choice([0, 1], n_samples),
        'Line_Line3': np.random.choice([0, 1], n_samples),
        'Line_Line4': np.random.choice([0, 1], n_samples),
        'Line_Line5': np.random.choice([0, 1], n_samples),
        'Status_Delayed': np.random.choice([0, 1], n_samples),
        'Status_OnTime': np.random.choice([0, 1], n_samples),
        'IncidentCause_Planned': np.random.choice([0, 1], n_samples),
        'IncidentCause_Traffic': np.random.choice([0, 1], n_samples),
        'IncidentCause_Weather': np.random.choice([0, 1], n_samples),
        'Weather_Pluvieux': np.random.choice([0, 1], n_samples),
        'Weather_TempsNormal': np.random.choice([0, 1], n_samples),
        'Event_Oui': np.random.choice([0, 1], n_samples),
    }

    X = pd.DataFrame(data)
    # Target: délai en minutes (0-30 minutes)
    y = np.random.exponential(5, n_samples) + np.random.normal(0, 2, n_samples)
    y = np.clip(y, 0, 30)

    from sklearn.ensemble import RandomForestRegressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Sauvegarder le modèle
    os.makedirs("./models", exist_ok=True)
    joblib.dump(model, "./models/random_forest.pkl")

    feature_columns = list(X.columns)
    print("✅ Modèle de base entraîné et sauvegardé")

def preprocess_input(data: PredictionRequest) -> pd.DataFrame:
    """Prétraite les données d'entrée pour le modèle"""

    # Créer un dictionnaire avec toutes les features à 0
    features = {col: 0 for col in feature_columns}

    # Remplir avec les données d'entrée
    features['hour'] = data.Hour

    # Transport Type encoding
    transport_mapping = {'Bus': 0, 'Metro': 1, 'Train': 2}
    features['TransportType_encoded'] = transport_mapping.get(data.TransportType, 0)

    # Line encoding
    line_mapping = {'Line1': 0, 'Line2': 1, 'Line3': 2, 'Line4': 3, 'Line5': 4}
    features['Line_encoded'] = line_mapping.get(data.Line, 0)

    # Status encoding (on suppose Delayed par défaut pour les prédictions)
    features['Status_encoded'] = 1  # Delayed

    # Incident Cause encoding (basé sur Weather et Event)
    if data.Weather == 'Pluie':
        features['IncidentCause_encoded'] = 2  # Weather
    elif data.Event == 'Oui':
        features['IncidentCause_encoded'] = 3  # Planned
    else:
        features['IncidentCause_encoded'] = 1  # Traffic (défaut)

    return pd.DataFrame([features])

def calculate_risk_level(delay: float) -> str:
    """Calcule le niveau de risque basé sur le délai prédit"""
    if delay < 5:
        return "Faible"
    elif delay < 15:
        return "Moyen"
    else:
        return "Élevé"

def calculate_probability(delay: float) -> float:
    """Calcule la probabilité de retard basée sur le délai prédit"""
    # Probabilité simplifiée basée sur le délai
    if delay < 5:
        return round(15 + np.random.uniform(0, 10), 1)
    elif delay < 15:
        return round(45 + np.random.uniform(0, 20), 1)
    else:
        return round(75 + np.random.uniform(0, 15), 1)

@app.get("/")
async def root():
    """Endpoint racine"""
    return {
        "message": "🚍 SmartMobility ML API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": [
            "GET /",
            "POST /predict",
            "GET /health",
            "GET /analytics/temporal",
            "GET /analytics/weather",
            "GET /analytics/events",
            "GET /analytics/transport",
            "GET /analytics/overview"
        ]
    }

@app.get("/health")
async def health_check():
    """Vérification de santé de l'API"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": pd.Timestamp.now().isoformat()
    }

@app.get("/analytics/temporal")
async def get_temporal_analytics():
    """Analyse temporelle des retards par heure"""
    if model is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé")

    try:
        hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        temporal_data = []

        # Générer des prédictions pour différentes heures avec conditions typiques
        for hour in hours:
            # Conditions représentatives pour chaque heure
            transport_types = ["Metro", "Bus", "Train"]
            lines = ["Line1", "Line2", "Line3", "Line4", "Line5"]
            weathers = ["Soleil", "Pluie", "TempsNormal"]
            events = ["Oui", "Non"]
            days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]

            # Faire plusieurs prédictions pour avoir une moyenne représentative
            delays = []
            volumes = []

            for _ in range(10):  # 10 échantillons par heure
                transport = np.random.choice(transport_types)
                line = np.random.choice(lines)
                weather = np.random.choice(weathers, p=[0.6, 0.3, 0.1])  # Soleil plus fréquent
                event = np.random.choice(events, p=[0.85, 0.15])  # Événements rares
                day = np.random.choice(days)

                # Volume de trafic simulé basé sur l'heure
                if 7 <= hour <= 9 or 17 <= hour <= 19:
                    volume = np.random.randint(400, 800)  # Heures de pointe
                elif 6 <= hour <= 6 or 20 <= hour <= 20:
                    volume = np.random.randint(100, 300)  # Heures creuses
                else:
                    volume = np.random.randint(200, 500)  # Heures normales

                volumes.append(volume)

                # Prédiction ML
                request_data = PredictionRequest(
                    TransportType=transport,
                    Line=line,
                    Hour=hour,
                    Day=day,
                    Weather=weather,
                    Event=event
                )

                input_data = preprocess_input(request_data)
                prediction = model.predict(input_data)[0]
                delays.append(float(prediction))

            avg_delay = round(np.mean(delays), 1)
            avg_volume = int(np.mean(volumes))
            punctuality = max(0, 100 - (avg_delay * 2))  # Estimation de la ponctualité

            temporal_data.append({
                "hour": f"{hour}h",
                "delay": avg_delay,
                "volume": avg_volume,
                "punctuality": round(punctuality, 1)
            })

        print(f"📊 Analyse temporelle générée: {len(temporal_data)} points de données")
        return {"temporal_data": temporal_data}

    except Exception as e:
        error_msg = f"Erreur lors de l'analyse temporelle: {str(e)}"
        print(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/analytics/weather")
async def get_weather_analytics():
    """Impact des conditions météo sur les retards"""
    if model is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé")

    try:
        weather_conditions = [
            {"name": "Soleil", "emoji": "☀️", "frequency": 65},
            {"name": "Pluie", "emoji": "🌧️", "frequency": 25},
            {"name": "Neige", "emoji": "❄️", "frequency": 5},
            {"name": "Tempête", "emoji": "⛈️", "frequency": 5}
        ]

        weather_data = []

        for condition in weather_conditions:
            delays = []

            # Générer des prédictions pour cette condition météo
            for _ in range(20):  # 20 échantillons par condition
                transport = np.random.choice(["Metro", "Bus", "Train"])
                line = np.random.choice(["Line1", "Line2", "Line3", "Line4", "Line5"])
                hour = np.random.randint(6, 22)
                day = np.random.choice(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"])
                event = np.random.choice(["Oui", "Non"], p=[0.9, 0.1])  # Peu d'événements

                request_data = PredictionRequest(
                    TransportType=transport,
                    Line=line,
                    Hour=hour,
                    Day=day,
                    Weather=condition["name"],
                    Event=event
                )

                input_data = preprocess_input(request_data)
                prediction = model.predict(input_data)[0]
                delays.append(float(prediction))

            avg_delay = round(np.mean(delays), 1)

            weather_data.append({
                "condition": f"{condition['emoji']} {condition['name']}",
                "delay": avg_delay,
                "frequency": condition["frequency"],
                "color": "#10B981" if condition["name"] == "Soleil" else
                        "#3B82F6" if condition["name"] == "Pluie" else
                        "#6B7280" if condition["name"] == "Neige" else "#EF4444"
            })

        print(f"🌤️ Analyse météo générée: {len(weather_data)} conditions")
        return {"weather_data": weather_data}

    except Exception as e:
        error_msg = f"Erreur lors de l'analyse météo: {str(e)}"
        print(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/analytics/events")
async def get_events_analytics():
    """Impact des événements sur les retards"""
    if model is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé")

    try:
        event_types = [
            {"name": "Jour normal", "emoji": "🚫", "frequency": 85},
            {"name": "Événement majeur", "emoji": "🚨", "frequency": 15}
        ]

        event_data = []

        for event_type in event_types:
            delays = []

            # Générer des prédictions pour ce type d'événement
            for _ in range(25):  # 25 échantillons par type
                transport = np.random.choice(["Metro", "Bus", "Train"])
                line = np.random.choice(["Line1", "Line2", "Line3", "Line4", "Line5"])
                hour = np.random.randint(6, 22)
                day = np.random.choice(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"])
                weather = np.random.choice(["Soleil", "Pluie", "TempsNormal"], p=[0.7, 0.2, 0.1])
                event = "Oui" if event_type["name"] == "Événement majeur" else "Non"

                request_data = PredictionRequest(
                    TransportType=transport,
                    Line=line,
                    Hour=hour,
                    Day=day,
                    Weather=weather,
                    Event=event
                )

                input_data = preprocess_input(request_data)
                prediction = model.predict(input_data)[0]
                delays.append(float(prediction))

            avg_delay = round(np.mean(delays), 1)

            event_data.append({
                "type": f"{event_type['emoji']} {event_type['name']}",
                "delay": avg_delay,
                "frequency": event_type["frequency"],
                "color": "#10B981" if event_type["name"] == "Jour normal" else "#F59E0B"
            })

        print(f"🎉 Analyse événements générée: {len(event_data)} types")
        return {"event_data": event_data}

    except Exception as e:
        error_msg = f"Erreur lors de l'analyse événements: {str(e)}"
        print(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/analytics/transport")
async def get_transport_analytics():
    """Répartition des types de transport"""
    if model is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé")

    try:
        transport_types = [
            {"name": "Bus", "color": "#3B82F6"},
            {"name": "Metro", "color": "#8B5CF6"},
            {"name": "Train", "color": "#10B981"}
        ]

        transport_data = []

        for transport_type in transport_types:
            delays = []

            # Générer des prédictions pour ce type de transport
            for _ in range(30):  # 30 échantillons par type
                line = np.random.choice(["Line1", "Line2", "Line3", "Line4", "Line5"])
                hour = np.random.randint(6, 22)
                day = np.random.choice(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"])
                weather = np.random.choice(["Soleil", "Pluie", "TempsNormal"], p=[0.7, 0.2, 0.1])
                event = np.random.choice(["Oui", "Non"], p=[0.9, 0.1])

                request_data = PredictionRequest(
                    TransportType=transport_type["name"],
                    Line=line,
                    Hour=hour,
                    Day=day,
                    Weather=weather,
                    Event=event
                )

                input_data = preprocess_input(request_data)
                prediction = model.predict(input_data)[0]
                delays.append(float(prediction))

            avg_delay = round(np.mean(delays), 1)

            # Valeurs représentatives pour la visualisation
            if transport_type["name"] == "Bus":
                value = 45
            elif transport_type["name"] == "Metro":
                value = 35
            else:  # Train
                value = 20

            transport_data.append({
                "name": transport_type["name"],
                "value": value,
                "avg_delay": avg_delay,
                "color": transport_type["color"]
            })

        print(f"🚌 Analyse transport générée: {len(transport_data)} types")
        return {"transport_data": transport_data}

    except Exception as e:
        error_msg = f"Erreur lors de l'analyse transport: {str(e)}"
        print(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/analytics/overview")
async def get_overview_analytics():
    """Vue d'ensemble des métriques clés"""
    if model is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé")

    try:
        # Générer des statistiques générales basées sur le modèle
        total_predictions = 100  # Simulé pour l'exemple
        avg_delay = 12.5
        max_delay = 28.3
        min_delay = 2.1
        punctuality_rate = 78.5

        # Calculer des métriques réelles basées sur des prédictions du modèle
        delays = []
        for _ in range(50):
            transport = np.random.choice(["Metro", "Bus", "Train"])
            line = np.random.choice(["Line1", "Line2", "Line3", "Line4", "Line5"])
            hour = np.random.randint(6, 22)
            day = np.random.choice(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"])
            weather = np.random.choice(["Soleil", "Pluie", "TempsNormal"], p=[0.7, 0.2, 0.1])
            event = np.random.choice(["Oui", "Non"], p=[0.9, 0.1])

            request_data = PredictionRequest(
                TransportType=transport,
                Line=line,
                Hour=hour,
                Day=day,
                Weather=weather,
                Event=event
            )

            input_data = preprocess_input(request_data)
            prediction = model.predict(input_data)[0]
            delays.append(float(prediction))

        real_avg_delay = round(np.mean(delays), 1)
        real_max_delay = round(np.max(delays), 1)
        real_min_delay = round(np.min(delays), 1)
        real_punctuality = round(100 - (real_avg_delay * 2), 1)

        overview_data = {
            "total_predictions": total_predictions,
            "avg_delay": real_avg_delay,
            "max_delay": real_max_delay,
            "min_delay": real_min_delay,
            "punctuality_rate": real_punctuality,
            "model_accuracy": 89.2,  # Simulé
            "last_updated": pd.Timestamp.now().isoformat()
        }

        print(f"📈 Vue d'ensemble générée: délai moyen {real_avg_delay} min")
        return {"overview_data": overview_data}

    except Exception as e:
        error_msg = f"Erreur lors de la vue d'ensemble: {str(e)}"
        print(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/predict")
async def predict_delay(data: PredictionRequest):
    """Endpoint de prédiction des retards"""

    if model is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé")

    try:
        # Prétraiter les données
        input_data = preprocess_input(data)

        # Faire la prédiction
        prediction = model.predict(input_data)[0]

        # Arrondir à 1 décimale
        delay = round(float(prediction), 1)

        # Calculer les métriques supplémentaires
        risk_level = calculate_risk_level(delay)
        probability = calculate_probability(delay)

        response_data = {
            "delay": delay,
            "risk": risk_level,
            "probability": probability,
            "unit": "minutes",
            "timestamp": pd.Timestamp.now().isoformat(),
            "input": data.model_dump()
        }

        print(f"📤 Réponse envoyée: {json.dumps(response_data, indent=2, ensure_ascii=False)}")
        print("-" * 50)

        return response_data

    except Exception as e:
        error_msg = f"Erreur lors de la prédiction: {str(e)}"
        print(f"❌ {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)