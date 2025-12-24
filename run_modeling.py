#!/usr/bin/env python3
"""
Script pour exécuter le notebook de modélisation
Utilise l'environnement virtuel configuré
"""

import subprocess
import sys
import os

# Chemin vers l'environnement virtuel
venv_python = r"C:\Users\hp\OneDrive\Desktop\public-transport-delay-prediction\.venv\Scripts\python.exe"

# Commande pour exécuter le notebook avec jupyter
cmd = [
    venv_python, "-m", "jupyter", "nbconvert",
    "--to", "notebook", "--execute",
    "--inplace", "notebooks/04_modeling_clean.ipynb"
]

print("🚀 Exécution du notebook de modélisation...")
print(f"Utilisation de Python: {venv_python}")

try:
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=r"C:\Users\hp\OneDrive\Desktop\public-transport-delay-prediction")
    print("✅ Notebook exécuté avec succès!")
    print("Sortie:", result.stdout)
    if result.stderr:
        print("Erreurs:", result.stderr)
except Exception as e:
    print(f"❌ Erreur lors de l'exécution: {e}")
    print("💡 Essayez d'exécuter le notebook manuellement dans VS Code en sélectionnant le bon interpréteur Python")