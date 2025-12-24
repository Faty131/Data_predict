#!/usr/bin/env python3
"""
Script de test pour l'API ML
"""

import requests
import json

def test_api():
    """Test de l'API de prédiction"""

    url = "http://localhost:8000/predict"

    # Test data
    test_data = {
        "TransportType": "Bus",
        "Line": "Line1",
        "Hour": 8,
        "Day": "Lundi",
        "Weather": "Normal",
        "Event": "Non"
    }

    print("🧪 Test de l'API SmartMobility ML")
    print(f"📡 URL: {url}")
    print(f"📤 Données: {json.dumps(test_data, indent=2)}")
    print()

    try:
        response = requests.post(url, json=test_data, timeout=10)

        print(f"📊 Status Code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ Succès!")
            print("📋 Résultat:")
            print(json.dumps(result, indent=2))
        else:
            print("❌ Erreur!")
            print(f"Response: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur de connexion: {e}")
        print("💡 Vérifiez que l'API est démarrée sur http://localhost:8000")

if __name__ == "__main__":
    test_api()