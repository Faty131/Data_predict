import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BarChart3, RefreshCw, Trophy, User, Flame } from 'lucide-react';

const Comparison = () => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    fetchComparison();
    const interval = setInterval(fetchComparison, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/comparison');
      if (!response.ok) throw new Error('Erreur lors du chargement de la comparaison');

      const data = await response.json();
      setComparison(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModelInfo = (modelName) => {
    const models = {
      'random_forest': {
        name: 'Random Forest',
        emoji: '🌲',
        color: 'from-blue-500 to-blue-600',
        icon: '🌲',
        description: 'Ensemble d\'arbres de décision',
        pros: ['Rapide', 'Précis', 'Robuste'],
        cons: ['Consomme de la mémoire'],
        type: 'Ensemble'
      },
      'linear_regression': {
        name: 'Régression Linéaire',
        emoji: '📈',
        color: 'from-purple-500 to-purple-600',
        icon: '📈',
        description: 'Modèle linéaire simple',
        pros: ['Léger', 'Rapide', 'Interprétable'],
        cons: ['Peut être imprécis pour données complexes'],
        type: 'Linéaire'
      },
      'xgboost': {
        name: 'XGBoost',
        emoji: '🚀',
        color: 'from-green-500 to-green-600',
        icon: '🚀',
        description: 'Gradient Boosting extrême',
        pros: ['Très précis', 'Performant', 'Gère bien les non-linéarités'],
        cons: ['Plus complexe'],
        type: 'Boosting'
      }
    };
    return models[modelName] || { name: modelName, emoji: '🤖', color: 'from-gray-500 to-gray-600' };
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    if (typeof num === 'number') {
      return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num;
  };

  if (loading && !comparison) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 animate-spin text-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600 text-lg">Chargement de la comparaison...</p>
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-lg">
            <p className="font-bold text-xl mb-2">Erreur</p>
            <p className="text-lg">{error || 'Impossible de charger la comparaison'}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = comparison.statistics || {};
  const models = Object.keys(stats);

  const getBestModel = (metric) => {
    let best = { model: null, value: null };
    let isBetter = metric === 'total_predictions' ? (a, b) => a > b : (a, b) => a > b;

    for (const [model, data] of Object.entries(stats)) {
      if (data[metric] !== null && data[metric] !== undefined) {
        if (!best.value || isBetter(data[metric], best.value)) {
          best = { model, value: data[metric] };
        }
      }
    }
    return best;
  };

  const chartData = ['random_forest', 'linear_regression', 'xgboost'].map(model => {
    const info = getModelInfo(model);
    const modelStats = stats[model] || {};
    return {
      name: info.name,
      emoji: info.emoji,
      predictions: modelStats.total_predictions || 0,
      avgDelay: modelStats.avg_predicted_delay || 0,
      confidence: (modelStats.avg_confidence || 0) * 100,
      verified: modelStats.verified_predictions || 0
    };
  });

  const radarData = chartData.map(item => ({
    model: item.name,
    predictions: item.predictions,
    delay: 100 - item.avgDelay,
    confidence: item.confidence,
    verified: item.verified
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête moderne */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white p-8 md:p-10 rounded-2xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-10 h-10" />
                <h1 className="text-3xl md:text-4xl font-bold">Comparaison des Modèles IA</h1>
              </div>
              <p className="text-orange-100 text-lg">Analysez et comparez les performances de vos trois modèles</p>
            </div>
            <button
              onClick={fetchComparison}
              className="px-6 py-3 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" /> Actualiser
            </button>
          </div>
        </div>

        {/* Cartes de présentation des modèles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['random_forest', 'linear_regression', 'xgboost'].map((modelName) => {
            const info = getModelInfo(modelName);
            const modelStats = stats[modelName];

            return (
              <div
                key={modelName}
                onClick={() => setSelectedModel(selectedModel === modelName ? null : modelName)}
                className={`rounded-2xl shadow-lg p-6 cursor-pointer transition-all transform hover:scale-105 ${
                  selectedModel === modelName
                    ? `bg-gradient-to-br ${info.color} text-white shadow-2xl scale-105`
                    : 'bg-white hover:shadow-2xl'
                }`}
              >
                <div className="text-5xl mb-3">{info.emoji}</div>
                <h3 className={`text-2xl font-bold mb-2 ${selectedModel === modelName ? 'text-white' : 'text-gray-800'}`}>
                  {info.name}
                </h3>
                <p className={`text-sm mb-4 ${selectedModel === modelName ? 'text-white/90' : 'text-gray-600'}`}>
                  {info.description}
                </p>

                {modelStats && (
                  <div className={`space-y-3 ${selectedModel === modelName ? 'text-white' : 'text-gray-700'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Utilisations:</span>
                      <span className="font-bold text-lg">{modelStats.total_predictions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Délai Moyen:</span>
                      <span className="font-bold text-lg">{formatNumber(modelStats.avg_predicted_delay)} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Confiance Moyenne:</span>
                      <span className="font-bold text-lg">{formatNumber(modelStats.avg_confidence)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparaison Graphique */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <BarChart3 className="text-blue-600 w-8 h-8" />
            Comparaison Graphique des Modèles
          </h2>

          <div className="space-y-12">
            {/* Graphique des prédictions totales */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-6">Nombre total de prédictions par modèle</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#4b5563' }} />
                  <YAxis tick={{ fill: '#4b5563' }} />
                  <Tooltip
                    formatter={(value, name) => [value, 'Prédictions']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="predictions" fill="#3B82F6" name="Prédictions" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Graphique des délais moyens */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-6">Délai moyen prédit par modèle (minutes)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#4b5563' }} />
                  <YAxis tick={{ fill: '#4b5563' }} />
                  <Tooltip
                    formatter={(value, name) => [`${value.toFixed(2)} min`, 'Délai moyen']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="avgDelay" fill="#10B981" name="Délai moyen (min)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Graphique de confiance */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-6">Confiance moyenne par modèle (%)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#4b5563' }} />
                  <YAxis tick={{ fill: '#4b5563' }} />
                  <Tooltip
                    formatter={(value, name) => [`${value.toFixed(1)}%`, 'Confiance']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="confidence" fill="#F59E0B" name="Confiance (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Graphique radar de comparaison globale */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-6">Comparaison globale des performances</h3>
              <ResponsiveContainer width="100%" height={450}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="model" tick={{ fill: '#4b5563' }} />
                  <PolarRadiusAxis tick={{ fill: '#4b5563' }} />
                  <Radar
                    name="Prédictions"
                    dataKey="predictions"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Performance délai"
                    dataKey="delay"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Confiance"
                    dataKey="confidence"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.3}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Détails du modèle sélectionné */}
        {selectedModel && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <User className="text-blue-600 w-8 h-8" />
              Détails: {getModelInfo(selectedModel).name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Avantages */}
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                  ✅ Avantages
                </h3>
                <ul className="space-y-3">
                  {getModelInfo(selectedModel).pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-base">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inconvénients */}
              <div className="bg-red-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                  ⚠️ Inconvénients
                </h3>
                <ul className="space-y-3">
                  {getModelInfo(selectedModel).cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-red-500 text-xl">✕</span>
                      <span className="text-base">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Statistiques du modèle */}
            {stats[selectedModel] && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
                  <p className="text-gray-600 text-sm font-medium mb-2">Utilisations</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {stats[selectedModel].total_predictions}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md">
                  <p className="text-gray-600 text-sm font-medium mb-2">Délai moyen</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {formatNumber(stats[selectedModel].avg_predicted_delay)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md">
                  <p className="text-gray-600 text-sm font-medium mb-2">Confiance</p>
                  <p className="text-4xl font-bold text-green-600">
                    {(stats[selectedModel].avg_confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md">
                  <p className="text-gray-600 text-sm font-medium mb-2">Vérifiées</p>
                  <p className="text-4xl font-bold text-orange-600">
                    {stats[selectedModel].verified_predictions}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommandation */}
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-100 border-l-4 border-blue-600 p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3">
            <Flame className="text-orange-500 w-7 h-7" /> Recommandation
          </h3>
          <p className="text-blue-800 text-lg leading-relaxed">
            Choisissez le modèle basé sur vos besoins:
          </p>
          <div className="mt-4 space-y-3 text-blue-900">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌲</span>
              <div>
                <strong className="text-lg">Random Forest</strong>
                <p className="text-blue-700">Pour un bon équilibre entre précision et vitesse</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <strong className="text-lg">Régression Linéaire</strong>
                <p className="text-blue-700">Pour une exécution très rapide et légère</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <strong className="text-lg">XGBoost</strong>
                <p className="text-blue-700">Pour la meilleure précision possible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;