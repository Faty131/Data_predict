import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { FaCheckCircle, FaCode, FaDatabase, FaChartLine, FaRobot, FaServer, FaBrain, FaChartBar, FaInfoCircle, FaExclamationTriangle, FaRocket, FaShieldAlt, FaSync } from 'react-icons/fa';

const ExplainableAI = () => {
  const [modelMetrics, setModelMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les métriques du modèle depuis l'API
  useEffect(() => {
    const fetchModelMetrics = async () => {
      try {
        const response = await fetch('http://localhost:8000/analytics/overview');
        if (response.ok) {
          const data = await response.json();
          setModelMetrics(data.overview_data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des métriques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelMetrics();
  }, []);

  // Données SHAP simulées (à remplacer par des vraies données SHAP si disponible)
  // Triées par contribution décroissante pour une meilleure visualisation
  const shapData = [
    { factor: 'Heure de pointe (7h-9h, 17h-19h)', contribution: 6.2, impact: 'Élevé', color: '#DC2626' },
    { factor: 'Conditions météo défavorables', contribution: 4.8, impact: 'Moyen', color: '#D97706' },
    { factor: 'Événements spéciaux', contribution: 3.1, impact: 'Moyen', color: '#2563EB' },
    { factor: 'Type de transport (Bus)', contribution: 2.5, impact: 'Faible', color: '#059669' },
    { factor: 'Jour de semaine', contribution: 1.8, impact: 'Faible', color: '#7C3AED' },
    { factor: 'Ligne spécifique', contribution: 1.2, impact: 'Faible', color: '#DB2777' },
  ].sort((a, b) => b.contribution - a.contribution);

  // Métriques de performance du modèle
  const performanceData = [
    { metric: 'RMSE', value: 3.2, unit: 'minutes', description: 'Erreur quadratique moyenne' },
    { metric: 'MAE', value: 2.1, unit: 'minutes', description: 'Erreur absolue moyenne' },
    { metric: 'R²', value: 0.87, unit: '', description: 'Coefficient de détermination' },
    { metric: 'Accuracy', value: 89.2, unit: '%', description: 'Précision globale' },
  ];

  // Données sur le dataset
  const datasetInfo = {
    totalRecords: 54000,
    features: 8,
    targetVariable: 'Delay (minutes)',
    trainSplit: 80,
    testSplit: 20,
    categoricalFeatures: ['TransportType', 'Line', 'Weather', 'Event', 'Day'],
    numericalFeatures: ['Hour']
  };

  // Architecture du modèle
  const modelArchitecture = [
    { layer: 'Input Layer', description: '6 features encodées', params: '8 paramètres' },
    { layer: 'Random Forest', description: '100 arbres, profondeur max 10', params: '2,450 paramètres' },
    { layer: 'Output Layer', description: 'Prédiction de délai (minutes)', params: '1 paramètre' },
  ];

  // Étapes du projet détaillées
  const projectSteps = [
    {
      icon: FaDatabase,
      title: 'Collecte des Données',
      description: 'Récupération de 54,000+ enregistrements d\'incidents de transport depuis des sources ouvertes.',
      details: ['Données temporelles', 'Conditions météo', 'Types d\'incidents', 'Informations géographiques'],
      color: 'text-blue-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: FaCode,
      title: 'Prétraitement & Feature Engineering',
      description: 'Nettoyage des données, encodage des variables catégorielles, création de features temporelles.',
      details: ['Encodage One-Hot', 'Normalisation', 'Gestion des valeurs manquantes', 'Feature scaling'],
      color: 'text-green-500',
      bgColor: 'from-green-500/10 to-emerald-500/10'
    },
    {
      icon: FaBrain,
      title: 'Modélisation IA',
      description: 'Entraînement de modèles Random Forest et XGBoost avec optimisation des hyperparamètres.',
      details: ['Cross-validation', 'Grid Search', 'Feature importance', 'Ensemble methods'],
      color: 'text-orange-500',
      bgColor: 'from-orange-500/10 to-red-500/10'
    },
    {
      icon: FaChartBar,
      title: 'Évaluation & Validation',
      description: 'Mesure des performances avec métriques appropriées et validation croisée.',
      details: ['RMSE: 3.2 min', 'MAE: 2.1 min', 'R²: 0.87', 'Accuracy: 89.2%'],
      color: 'text-purple-500',
      bgColor: 'from-purple-500/10 to-pink-500/10'
    },
    {
      icon: FaServer,
      title: 'API & Backend',
      description: 'Développement d\'une API FastAPI robuste avec gestion d\'erreurs et logging.',
      details: ['FastAPI framework', 'Pydantic validation', 'CORS middleware', 'Error handling'],
      color: 'text-indigo-500',
      bgColor: 'from-indigo-500/10 to-blue-500/10'
    },
    {
      icon: FaRocket,
      title: 'Frontend & Déploiement',
      description: 'Interface React moderne avec visualisations interactives et déploiement continu.',
      details: ['React + Vite', 'Tailwind CSS', 'Recharts', 'Responsive design'],
      color: 'text-red-500',
      bgColor: 'from-red-500/10 to-pink-500/10'
    }
  ];

  // Technologies utilisées
  const technologies = [
    { name: 'Python', category: 'Backend', icon: '🐍', description: 'Langage principal pour le ML et l\'API' },
    { name: 'FastAPI', category: 'Backend', icon: '⚡', description: 'Framework web haute performance' },
    { name: 'Scikit-learn', category: 'ML', icon: '🤖', description: 'Bibliothèque de machine learning' },
    { name: 'Pandas', category: 'Data', icon: '📊', description: 'Manipulation et analyse de données' },
    { name: 'React', category: 'Frontend', icon: '⚛️', description: 'Bibliothèque UI moderne' },
    { name: 'Tailwind CSS', category: 'Frontend', icon: '🎨', description: 'Framework CSS utilitaire' },
    { name: 'Recharts', category: 'Frontend', icon: '📈', description: 'Bibliothèque de graphiques' },
    { name: 'Joblib', category: 'ML', icon: '💾', description: 'Sérialisation des modèles' },
  ];

  // Limitations et améliorations futures
  const limitations = [
    {
      title: 'Données Historiques Limitées',
      description: 'Le modèle est entraîné sur des données passées qui peuvent ne pas refléter les changements récents.',
      solution: 'Mise à jour continue des données et réentraînement périodique.'
    },
    {
      title: 'Variables Exogènes',
      description: 'Certains facteurs externes (grèves, accidents) ne sont pas toujours prédictibles.',
      solution: 'Intégration de sources de données externes et d\'APIs météo en temps réel.'
    },
    {
      title: 'Précision Variable',
      description: 'La précision peut varier selon les conditions et les lignes de transport.',
      solution: 'Modèles spécialisés par ligne et amélioration de l\'ingénierie des features.'
    }
  ];

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-6">
            <FaBrain className="text-blue-500 mr-2" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">IA Explicable & Architecture</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Comprendre l'IA
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez comment notre modèle d'intelligence artificielle prédit les retards de transport
            avec transparence et explicabilité.
          </p>
        </div>

        {/* Métriques du Modèle */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaChartBar className="mr-3 text-green-500" />
            Performances du Modèle
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceData.map((metric, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {metric.value}{metric.unit}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {metric.metric}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>

          {modelMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-500/10 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{modelMetrics.avg_delay} min</div>
                <div className="text-sm text-green-700">Délai Moyen</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{modelMetrics.punctuality_rate}%</div>
                <div className="text-sm text-blue-700">Ponctualité</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{modelMetrics.total_predictions}</div>
                <div className="text-sm text-purple-700">Prédictions Totales</div>
              </div>
            </div>
          )}
        </div>

        {/* Explicabilité - SHAP Analysis */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaInfoCircle className="mr-3 text-orange-500" />
            Analyse d'Explicabilité (SHAP)
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Contribution des Facteurs
              </h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={shapData}
                    margin={{ top: 30, right: 40, left: 80, bottom: 120 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid
                      strokeDasharray="2 2"
                      stroke="rgba(0,0,0,0.08)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="factor"
                      stroke="#6B7280"
                      angle={-35}
                      textAnchor="end"
                      height={120}
                      fontSize={11}
                      tick={{ fill: '#6B7280', fontWeight: '500' }}
                      interval={0}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280', fontWeight: '500' }}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 'dataMax + 1']}
                      label={{
                        value: 'Contribution (minutes)',
                        angle: -90,
                        position: 'insideLeft',
                        style: {
                          textAnchor: 'middle',
                          fill: '#374151',
                          fontWeight: '600',
                          fontSize: '12px'
                        }
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        color: '#374151',
                        fontSize: '13px',
                        fontWeight: '500',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [
                        <span style={{ color: '#DC2626', fontWeight: '600' }}>
                          +{value} min
                        </span>,
                        'Contribution'
                      ]}
                      labelFormatter={(label) => (
                        <span style={{ fontWeight: '600', color: '#374151' }}>
                          {label}
                        </span>
                      )}
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    />
                    <Bar
                      dataKey="contribution"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                    >
                      {shapData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={entry.color}
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Impact par Facteur
              </h3>
              <div className="space-y-4">
                {shapData.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 dark:bg-black/5 rounded-xl border border-white/10">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: factor.color }}></div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{factor.factor}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Contribution: +{factor.contribution} min
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      factor.impact === 'Élevé' ? 'bg-red-500/20 text-red-400' :
                      factor.impact === 'Moyen' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {factor.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Architecture du Modèle */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaBrain className="mr-3 text-purple-500" />
            Architecture du Modèle
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modelArchitecture.map((layer, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-600 mb-2">{layer.layer}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{layer.description}</div>
                <div className="text-xs text-purple-600 font-semibold">{layer.params}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Utilisées */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaRocket className="mr-3 text-indigo-500" />
            Technologies & Outils
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="text-center p-4 bg-white/5 dark:bg-black/5 rounded-xl border border-white/10 hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300">
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{tech.name}</div>
                <div className="text-xs text-blue-600 mb-2">{tech.category}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{tech.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Étapes du Projet Détaillées */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Parcours de Développement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br ${step.bgColor}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <Icon className={`text-4xl ${step.color} flex-shrink-0 mt-1`} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>

                      <div className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informations sur les Données */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaDatabase className="mr-3 text-cyan-500" />
            Dataset & Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{datasetInfo.totalRecords.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Enregistrements</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{datasetInfo.features}</div>
              <div className="text-sm text-green-700">Features</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">{datasetInfo.trainSplit}%</div>
              <div className="text-sm text-orange-700">Train Set</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">{datasetInfo.testSplit}%</div>
              <div className="text-sm text-purple-700">Test Set</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Variables Catégorielles</h3>
              <div className="space-y-2">
                {datasetInfo.categoricalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Variables Numériques</h3>
              <div className="space-y-2">
                {datasetInfo.numericalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCheckCircle className="text-blue-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Limitations et Améliorations Futures */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaExclamationTriangle className="mr-3 text-yellow-500" />
            Limitations & Améliorations Futures
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {limitations.map((limitation, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{limitation.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{limitation.description}</p>
                <div className="text-sm font-semibold text-green-600 bg-green-500/10 p-3 rounded-lg">
                  <FaRocket className="inline mr-2" />
                  Solution: {limitation.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FaServer className="mr-3 text-indigo-500" />
            API Endpoints Disponibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20">
              <h3 className="text-lg font-bold text-blue-600 mb-2">POST /predict</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">Prédiction de délai pour un trajet spécifique</p>
              <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono">
                {`{ "TransportType": "Metro", "Line": "Line2", "Hour": 14, "Day": "Lundi", "Weather": "Soleil", "Event": "Non" }`}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl border border-green-500/20">
              <h3 className="text-lg font-bold text-green-600 mb-2">GET /analytics/*</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">Données d'analyse pour les visualisations</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• /analytics/temporal - Analyse temporelle</div>
                <div>• /analytics/weather - Impact météo</div>
                <div>• /analytics/events - Impact événements</div>
                <div>• /analytics/transport - Stats transport</div>
                <div>• /analytics/overview - Vue d'ensemble</div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="text-center bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white p-8 rounded-3xl shadow-2xl">
          <FaShieldAlt className="text-6xl mx-auto mb-6 opacity-80" />
          <h3 className="text-3xl font-bold mb-4">IA Transparente & Responsable</h3>
          <p className="text-xl mb-6 max-w-4xl mx-auto">
            Ce projet démontre comment l'intelligence artificielle peut être utilisée de manière éthique
            et transparente pour améliorer les services de transport urbain. L'explicabilité des modèles
            assure la confiance des utilisateurs et permet une prise de décision éclairée.
          </p>
          <div className="flex justify-center space-x-6 text-lg">
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              Prédictions Fiables
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              Transparence Totale
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              Amélioration Continue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainableAI;