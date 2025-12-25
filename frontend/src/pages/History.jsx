import React, { useState, useEffect } from 'react';
import { FaHistory, FaSearch, FaDownload, FaTrash, FaClock, FaCheckCircle } from 'react-icons/fa';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    model_filter: '',
    transport_filter: '',
    day_filter: '',
    page: 0,
    limit: 50
  });
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger l'historique des prédictions
  useEffect(() => {
    fetchHistory();
  }, [filters.page, filters.model_filter, filters.transport_filter, filters.day_filter, filters.limit]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: filters.limit,
        offset: filters.page * filters.limit,
        ...(filters.model_filter && { model_filter: filters.model_filter }),
        ...(filters.transport_filter && { transport_filter: filters.transport_filter }),
        ...(filters.day_filter && { day_filter: filters.day_filter })
      });

      const response = await fetch(`http://localhost:8000/history?${params}`);
      if (!response.ok) throw new Error('Erreur lors du chargement de l\'historique');

      const data = await response.json();
      setPredictions(data.predictions || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 0 // Réinitialiser à la première page
    }));
  };

  const handlePageChange = (direction) => {
    const maxPage = Math.ceil(total / filters.limit) - 1;
    let newPage = filters.page + direction;
    newPage = Math.max(0, Math.min(newPage, maxPage));
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:8000/history/export/csv', {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Erreur lors de l\'export');

      alert('Export réussi! Fichier sauvegardé: predictions_export.csv');
    } catch (err) {
      alert('Erreur lors de l\'export: ' + err.message);
    }
  };

  const handleCleanup = async () => {
    const days = prompt('Supprimer les prédictions plus anciennes que (jours):', '30');
    if (days === null) return;

    try {
      const response = await fetch(`http://localhost:8000/history/cleanup?days=${days}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur lors du nettoyage');

      const data = await response.json();
      alert(`${data.deleted_count} prédictions supprimées`);
      fetchHistory();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const updateActualDelay = async (id) => {
    const actualDelay = prompt('Entrez le délai réel observé (minutes):');
    if (actualDelay === null) return;

    const actualRisk = prompt('Entrez le risque réel (Low/Medium/High):', 'Medium');
    if (actualRisk === null) return;

    try {
      const response = await fetch(`http://localhost:8000/history/${id}?actual_delay=${actualDelay}&actual_risk=${actualRisk}`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      alert('Prédiction mise à jour avec succès');
      fetchHistory();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('fr-FR');
  };

  const formatDelay = (delay) => {
    if (delay === null || delay === undefined) return '-';
    return `${delay.toFixed(1)} min`;
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModelColor = (model) => {
    const colors = {
      'random_forest': 'bg-blue-100 text-blue-800',
      'linear_regression': 'bg-purple-100 text-purple-800',
      'xgboost': 'bg-green-100 text-green-800'
    };
    return colors[model] || 'bg-gray-100 text-gray-800';
  };

  const getModelEmoji = (model) => {
    const emojis = {
      'random_forest': '🌲',
      'linear_regression': '📈',
      'xgboost': '🚀'
    };
    return emojis[model] || '🤖';
  };

  if (loading && predictions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block">
          <FaClock className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        </div>
        <p className="text-gray-600">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <FaHistory className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Historique des Prédictions</h1>
          </div>
          <p className="text-blue-100">Total: <span className="font-bold text-xl">{total}</span> prédictions</p>
        </div>

        {/* Barres de contrôle et filtres */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Filtre Modèle */}
            <div className="flex-1 min-w-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
              <select
                value={filters.model_filter}
                onChange={(e) => handleFilterChange('model_filter', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les modèles</option>
                <option value="random_forest">🌲 Random Forest</option>
                <option value="linear_regression">📈 Régression Linéaire</option>
                <option value="xgboost">🚀 XGBoost</option>
              </select>
            </div>

            {/* Filtre Type de Transport */}
            <div className="flex-1 min-w-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.transport_filter}
                onChange={(e) => handleFilterChange('transport_filter', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="Bus">Bus</option>
                <option value="Metro">Metro</option>
                <option value="Train">Train</option>
              </select>
            </div>

            {/* Filtre Jour */}
            <div className="flex-1 min-w-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Jour</label>
              <select
                value={filters.day_filter}
                onChange={(e) => handleFilterChange('day_filter', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les jours</option>
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
              </select>
            </div>
          </div>

          {/* Affichage de la page actuelle */}
          <div className="text-sm text-gray-600">
            Page {filters.page + 1} de {Math.ceil(total / filters.limit) || 1}
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {/* Liste des prédictions */}
        {predictions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            <FaHistory className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune prédiction trouvée avec ces filtres</p>
          </div>
        ) : (
          <div className="space-y-3">
            {predictions.map((pred) => (
              <div
                key={pred.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* En-tête du prédiction */}
                <div
                  className="p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => setExpandedId(expandedId === pred.id ? null : pred.id)}
                >
                  <div className="flex-1 grid grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">ID</p>
                      <p className="font-bold">{pred.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Modèle</p>
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getModelColor(pred.model_used)}`}>
                        {getModelEmoji(pred.model_used)} {pred.model_used}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Délai Prédit</p>
                      <p className="font-bold">{formatDelay(pred.predicted_delay)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Risque</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRiskColor(pred.predicted_risk)}`}>
                        {pred.predicted_risk}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm">{new Date(pred.timestamp).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <span className="ml-4">{expandedId === pred.id ? '▼' : '▶'}</span>
                </div>

                {/* Détails étendus */}
                {expandedId === pred.id && (
                  <div className="border-t p-4 bg-white">
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      {/* Paramètres d'entrée */}
                      <div>
                        <h3 className="font-bold text-gray-700 mb-3">Paramètres d'entrée</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-600">Type:</span> <strong>{pred.transport_type}</strong></p>
                          <p><span className="text-gray-600">Ligne:</span> <strong>{pred.line}</strong></p>
                          <p><span className="text-gray-600">Heure:</span> <strong>{pred.hour}:00</strong></p>
                          <p><span className="text-gray-600">Jour:</span> <strong>{pred.day}</strong></p>
                          <p><span className="text-gray-600">Météo:</span> <strong>{pred.weather}</strong></p>
                          <p><span className="text-gray-600">Événement:</span> <strong>{pred.event}</strong></p>
                        </div>
                      </div>

                      {/* Prédictions et résultats */}
                      <div>
                        <h3 className="font-bold text-gray-700 mb-3">Résultats de la Prédiction</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-600">Modèle:</span> <strong>{pred.model_used}</strong></p>
                          <p><span className="text-gray-600">Délai Prédit:</span> <strong className="text-lg">{formatDelay(pred.predicted_delay)}</strong></p>
                          <p><span className="text-gray-600">Confiance:</span> <strong>{(pred.predicted_probability * 100).toFixed(1)}%</strong></p>
                          <p><span className="text-gray-600">Risque:</span> <strong>{pred.predicted_risk}</strong></p>
                          <p><span className="text-gray-600">Horodatage:</span> <strong>{formatDate(pred.timestamp)}</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* Délai réel si disponible */}
                    {pred.actual_delay !== null ? (
                      <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center gap-3">
                        <FaCheckCircle className="text-green-600" />
                        <div>
                          <p className="text-sm"><span className="text-gray-600">Délai réel:</span> <strong>{formatDelay(pred.actual_delay)}</strong></p>
                          <p className="text-sm"><span className="text-gray-600">Risque réel:</span> <strong>{pred.actual_risk}</strong></p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateActualDelay(pred.id)}
                        className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
                      >
                        Ajouter le délai réel
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(total / filters.limit) > 1 && (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={filters.page === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>
            <span className="text-gray-700 font-medium">
              Page {filters.page + 1} / {Math.ceil(total / filters.limit)}
            </span>
            <button
              onClick={() => handlePageChange(1)}
              disabled={filters.page >= Math.ceil(total / filters.limit) - 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
  );
};

export default History;
