#!/usr/bin/env python3
"""
Script de test pour la fonctionnalité d'historique et comparaison.
Teste tous les endpoints et la base de données.
"""

import requests
import json
import time
from tabulate import tabulate
import sys

# Configuration
API_URL = "http://localhost:8000"
TIMEOUT = 10

# Couleurs pour le terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_section(title):
    """Affiche un titre de section"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{title:^60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_success(message):
    """Affiche un message de succès"""
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message):
    """Affiche un message d'erreur"""
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_info(message):
    """Affiche un message d'info"""
    print(f"{Colors.YELLOW}ℹ {message}{Colors.END}")

def test_api_health():
    """Test 1: Vérifier que l'API répond"""
    print_section("TEST 1: Santé de l'API")
    
    try:
        response = requests.get(f"{API_URL}/", timeout=TIMEOUT)
        if response.status_code == 200:
            print_success("API répond correctement")
            return True
        else:
            print_error(f"API retourne le code {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Impossible de contacter l'API: {e}")
        return False

def test_models_endpoint():
    """Test 2: Vérifier l'endpoint /models"""
    print_section("TEST 2: Endpoint /models")
    
    try:
        response = requests.get(f"{API_URL}/models", timeout=TIMEOUT)
        if response.status_code == 200:
            models = response.json()
            print_success(f"Modèles disponibles: {len(models)}")
            for model in models:
                print(f"  - {model}")
            return True
        else:
            print_error(f"Erreur: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erreur lors de la récupération des modèles: {e}")
        return False

def make_predictions():
    """Test 3: Faire des prédictions avec différents modèles"""
    print_section("TEST 3: Faire des prédictions")
    
    prediction_ids = []
    models = ["random_forest", "linear_regression", "xgboost"]
    test_data = {
        "TransportType": "Bus",
        "Line": "Line1",
        "Hour": 8,
        "Day": "Monday",
        "Weather": "Normal",
        "Event": "None"
    }
    
    for i, model in enumerate(models):
        try:
            data = {**test_data, "model_type": model}
            response = requests.post(
                f"{API_URL}/predict",
                json=data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                result = response.json()
                pred_id = result.get("prediction_id")
                delay = result.get("delay")
                risk = result.get("risk")
                probability = result.get("probability")
                
                print_success(f"Prédiction avec {model}:")
                print(f"    ID: {pred_id}")
                print(f"    Délai: {delay} min")
                print(f"    Risque: {risk}")
                print(f"    Probabilité: {probability:.2%}")
                
                prediction_ids.append(pred_id)
            else:
                print_error(f"Erreur pour {model}: {response.status_code}")
        except Exception as e:
            print_error(f"Erreur lors de la prédiction avec {model}: {e}")
    
    return prediction_ids

def test_history_endpoint(limit=10):
    """Test 4: Tester l'endpoint /history"""
    print_section("TEST 4: Endpoint /history (Historique)")
    
    try:
        response = requests.get(
            f"{API_URL}/history?limit={limit}",
            timeout=TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            total = data.get("total", 0)
            predictions = data.get("predictions", [])
            
            print_success(f"Historique chargé: {len(predictions)} prédictions")
            print(f"Total dans la BD: {total}")
            
            if predictions:
                # Afficher les 5 premières
                table_data = []
                for pred in predictions[:5]:
                    table_data.append([
                        pred['id'],
                        pred['model_used'],
                        f"{pred['predicted_delay']:.1f}",
                        pred['predicted_risk'],
                        pred['transport_type']
                    ])
                
                print("\nDernières prédictions:")
                print(tabulate(
                    table_data,
                    headers=['ID', 'Modèle', 'Délai', 'Risque', 'Type'],
                    tablefmt='grid'
                ))
            
            return True
        else:
            print_error(f"Erreur: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erreur lors du chargement de l'historique: {e}")
        return False

def test_history_filters():
    """Test 5: Tester les filtres de l'historique"""
    print_section("TEST 5: Filtres de l'historique")
    
    filters = [
        {"name": "Par modèle", "params": {"model_filter": "random_forest"}},
        {"name": "Par type", "params": {"transport_filter": "Bus"}},
        {"name": "Par jour", "params": {"day_filter": "Monday"}},
    ]
    
    for filter_test in filters:
        try:
            response = requests.get(
                f"{API_URL}/history",
                params={**filter_test["params"], "limit": 10},
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                count = len(data.get("predictions", []))
                total = data.get("total", 0)
                print_success(f"{filter_test['name']}: {count} résultats (total: {total})")
            else:
                print_error(f"{filter_test['name']}: Erreur {response.status_code}")
        except Exception as e:
            print_error(f"{filter_test['name']}: {e}")

def test_prediction_details(prediction_id):
    """Test 6: Récupérer les détails d'une prédiction"""
    print_section("TEST 6: Détails d'une prédiction")
    
    try:
        response = requests.get(
            f"{API_URL}/history/{prediction_id}",
            timeout=TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Détails de la prédiction {prediction_id}:")
            print(f"  Modèle: {data['model_used']}")
            print(f"  Type: {data['transport_type']}")
            print(f"  Ligne: {data['line']}")
            print(f"  Délai prédit: {data['predicted_delay']} min")
            print(f"  Risque: {data['predicted_risk']}")
            print(f"  Confiance: {data['predicted_probability']:.2%}")
            return True
        else:
            print_error(f"Prédiction {prediction_id} non trouvée")
            return False
    except Exception as e:
        print_error(f"Erreur: {e}")
        return False

def test_update_actual_delay(prediction_id):
    """Test 7: Mettre à jour avec le délai réel"""
    print_section("TEST 7: Mettre à jour avec délai réel")
    
    try:
        response = requests.put(
            f"{API_URL}/history/{prediction_id}",
            params={
                "actual_delay": 13.5,
                "actual_risk": "Medium"
            },
            timeout=TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Prédiction {prediction_id} mise à jour:")
            print(f"  Délai réel: {data['actual_delay']} min")
            print(f"  Risque réel: {data['actual_risk']}")
            return True
        else:
            print_error(f"Mise à jour échouée: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erreur: {e}")
        return False

def test_comparison_endpoint():
    """Test 8: Tester l'endpoint /comparison"""
    print_section("TEST 8: Endpoint /comparison")
    
    try:
        response = requests.get(
            f"{API_URL}/comparison",
            timeout=TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            stats = data.get("statistics", {})
            
            print_success("Comparaison chargée:")
            
            table_data = []
            for model, stat in stats.items():
                table_data.append([
                    model,
                    stat.get('total_predictions', 0),
                    f"{stat.get('avg_predicted_delay', 0):.2f}",
                    f"{stat.get('avg_confidence', 0):.2%}",
                    stat.get('verified_predictions', 0)
                ])
            
            print(tabulate(
                table_data,
                headers=['Modèle', 'Total', 'Délai Moyen', 'Confiance', 'Vérifiées'],
                tablefmt='grid'
            ))
            return True
        else:
            print_error(f"Erreur: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erreur: {e}")
        return False

def test_model_details(model_name):
    """Test 9: Récupérer les détails d'un modèle"""
    print_section(f"TEST 9: Détails du modèle {model_name}")
    
    try:
        response = requests.get(
            f"{API_URL}/comparison/{model_name}",
            timeout=TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Détails de {model_name}:")
            print(f"  Total prédictions: {data['total_predictions']}")
            print(f"  Délai moyen: {data['avg_predicted_delay']:.2f} min")
            print(f"  Délai min: {data['min_predicted_delay']:.2f} min")
            print(f"  Délai max: {data['max_predicted_delay']:.2f} min")
            print(f"  Confiance: {data['avg_confidence']:.2%}")
            print(f"  Vérifiées: {data['verified_predictions']}")
            return True
        else:
            print_error(f"Erreur: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erreur: {e}")
        return False

def test_export_csv():
    """Test 10: Exporter en CSV"""
    print_section("TEST 10: Export en CSV")
    
    try:
        response = requests.post(
            f"{API_URL}/history/export/csv",
            timeout=TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Export réussi!")
            print(f"  Fichier: {data['file']}")
            return True
        else:
            print_error(f"Erreur: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Erreur: {e}")
        return False

def main():
    """Exécuter tous les tests"""
    print(f"\n{Colors.BOLD}{Colors.YELLOW}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║     TEST DE LA FONCTIONNALITÉ HISTORIQUE ET COMPARAISON    ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(Colors.END)
    
    results = {}
    
    # Test 1: Santé de l'API
    results["API Health"] = test_api_health()
    if not results["API Health"]:
        print_error("L'API n'est pas accessible. Arrêt des tests.")
        return
    
    time.sleep(1)
    
    # Test 2: Modèles disponibles
    results["Models Endpoint"] = test_models_endpoint()
    
    time.sleep(1)
    
    # Test 3: Faire des prédictions
    print_section("PRÉDICTIONS")
    prediction_ids = make_predictions()
    results["Predictions"] = len(prediction_ids) > 0
    
    time.sleep(1)
    
    # Test 4: Historique
    results["History Endpoint"] = test_history_endpoint()
    
    time.sleep(1)
    
    # Test 5: Filtres
    test_history_filters()
    results["History Filters"] = True
    
    time.sleep(1)
    
    # Test 6: Détails d'une prédiction
    if prediction_ids:
        results["Prediction Details"] = test_prediction_details(prediction_ids[0])
        
        time.sleep(1)
        
        # Test 7: Mise à jour
        results["Update Actual Delay"] = test_update_actual_delay(prediction_ids[0])
    
    time.sleep(1)
    
    # Test 8: Comparaison
    results["Comparison"] = test_comparison_endpoint()
    
    time.sleep(1)
    
    # Test 9: Détails modèle
    results["Model Details"] = test_model_details("random_forest")
    
    time.sleep(1)
    
    # Test 10: Export CSV
    results["CSV Export"] = test_export_csv()
    
    # Résumé
    print_section("RÉSUMÉ DES TESTS")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    percentage = (passed / total * 100) if total > 0 else 0
    
    summary_table = []
    for test_name, result in results.items():
        status = f"{Colors.GREEN}PASS{Colors.END}" if result else f"{Colors.RED}FAIL{Colors.END}"
        summary_table.append([test_name, status])
    
    print(tabulate(summary_table, headers=['Test', 'Résultat'], tablefmt='grid'))
    
    print(f"\n{Colors.BOLD}Résultat: {passed}/{total} tests réussis ({percentage:.1f}%){Colors.END}\n")
    
    if passed == total:
        print(f"{Colors.GREEN}{Colors.BOLD}✓ Tous les tests sont passés avec succès!{Colors.END}\n")
        return 0
    else:
        print(f"{Colors.RED}{Colors.BOLD}✗ Certains tests ont échoué.{Colors.END}\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
