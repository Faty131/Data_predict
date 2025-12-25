#!/usr/bin/env python3
"""
Script de vérification rapide - Vérifie que tous les fichiers sont en place
"""

import os
import sys

def check_file(path, description):
    """Vérifier qu'un fichier existe"""
    if os.path.exists(path):
        size = os.path.getsize(path)
        print(f"✅ {path:50} ({size:,} bytes) - {description}")
        return True
    else:
        print(f"❌ {path:50} - MANQUANT")
        return False

def main():
    print("\n" + "="*80)
    print("VÉRIFICATION DU SYSTÈME D'HISTORIQUE ET COMPARAISON")
    print("="*80 + "\n")
    
    all_good = True
    
    # Fichiers créés
    print("📦 FICHIERS CRÉÉS:")
    print("-" * 80)
    files_created = [
        ("database.py", "Base de données SQLite"),
        ("frontend/src/pages/History.jsx", "Page historique"),
        ("frontend/src/pages/Comparison.jsx", "Page comparaison"),
        ("test_history_and_comparison.py", "Suite de tests"),
        ("DATABASE_HISTORY_GUIDE.md", "Guide détaillé"),
        ("HISTORY_COMPARISON_SUMMARY.md", "Résumé système"),
        ("QUICK_HISTORY_START.md", "Guide rapide"),
        ("CHANGES_HISTORY_SYSTEM.md", "Liste des changements"),
        ("start_history_system.sh", "Script helper"),
    ]
    
    for path, desc in files_created:
        if not check_file(path, desc):
            all_good = False
    
    print()
    
    # Fichiers modifiés
    print("📝 FICHIERS MODIFIÉS:")
    print("-" * 80)
    files_modified = [
        ("api.py", "API endpoints + sauvegarde BD"),
        ("frontend/src/components/Layout.jsx", "Liens menu ajoutés"),
        ("frontend/src/App.jsx", "Routes ajoutées"),
    ]
    
    for path, desc in files_modified:
        if not check_file(path, desc):
            all_good = False
    
    print()
    
    # Vérifications de contenu
    print("📋 VÉRIFICATIONS DE CONTENU:")
    print("-" * 80)
    
    checks = [
        ("api.py", "from database import db", "Import database"),
        ("api.py", "def get_history", "Endpoint /history"),
        ("api.py", "def get_model_comparison", "Endpoint /comparison"),
        ("frontend/src/App.jsx", "import History", "Import History"),
        ("frontend/src/App.jsx", "import Comparison", "Import Comparison"),
        ("frontend/src/App.jsx", "/history", "Route /history"),
        ("frontend/src/App.jsx", "/comparison", "Route /comparison"),
        ("frontend/src/components/Layout.jsx", "FaHistory", "Icône historique"),
        ("database.py", "class Database", "Classe Database"),
        ("database.py", "class PredictionRecord", "Classe PredictionRecord"),
    ]
    
    for filepath, content, description in checks:
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                file_content = f.read()
                if content in file_content:
                    print(f"✅ {filepath:50} - {description}")
                else:
                    print(f"⚠️  {filepath:50} - {description} - NON TROUVÉ")
                    all_good = False
        else:
            print(f"❌ {filepath:50} - Fichier manquant")
            all_good = False
    
    print()
    
    # Résumé
    print("="*80)
    if all_good:
        print("✅ ✅ ✅  TOUS LES FICHIERS SONT EN PLACE - SYSTÈME PRÊT!  ✅ ✅ ✅")
        print("="*80)
        print("\n🚀 Prochaines étapes:")
        print("   1. python api.py")
        print("   2. cd frontend && npm run dev")
        print("   3. python test_history_and_comparison.py")
        print()
        return 0
    else:
        print("❌ ERREUR: Des fichiers manquent ou du contenu est incorrect")
        print("="*80)
        print("\n⚠️  Veuillez vérifier que tous les fichiers ont été créés correctement")
        print()
        return 1

if __name__ == "__main__":
    sys.exit(main())
