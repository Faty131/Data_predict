import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FaChartLine, FaCloudRain, FaCalendarAlt, FaClock, FaTachometerAlt, FaEye, FaDownload, FaSync } from 'react-icons/fa';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('temporal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les données ML
  const [temporalData, setTemporalData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [overviewData, setOverviewData] = useState({});

  // Fonction pour récupérer les données depuis l'API
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoints = [
        { key: 'temporal', url: 'http://localhost:8000/analytics/temporal' },
        { key: 'weather', url: 'http://localhost:8000/analytics/weather' },
        { key: 'events', url: 'http://localhost:8000/analytics/events' },
        { key: 'transport', url: 'http://localhost:8000/analytics/transport' },
        { key: 'overview', url: 'http://localhost:8000/analytics/overview' }
      ];

      const promises = endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint.url);
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          const data = await response.json();
          return { key: endpoint.key, data };
        } catch (err) {
          console.error(`Erreur lors de la récupération de ${endpoint.key}:`, err);
          return { key: endpoint.key, error: err.message };
        }
      });

      const results = await Promise.all(promises);

      // Traiter les résultats
      results.forEach(result => {
        if (result.error) {
          console.warn(`Données ${result.key} non disponibles: ${result.error}`);
          return;
        }

        switch (result.key) {
          case 'temporal':
            setTemporalData(result.data.temporal_data || []);
            break;
          case 'weather':
            setWeatherData(result.data.weather_data || []);
            break;
          case 'events':
            setEventData(result.data.event_data || []);
            break;
          case 'transport':
            setTransportData(result.data.transport_data || []);
            break;
          case 'overview':
            setOverviewData(result.data.overview_data || {});
            break;
        }
      });

    } catch (err) {
      setError(`Erreur lors du chargement des données: ${err.message}`);
      console.error('Erreur générale:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour exporter les données
  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      activeTab: activeTab,
      analytics: {
        temporal: temporalData.length > 0 ? temporalData : fallbackTemporalData,
        weather: weatherData.length > 0 ? weatherData : fallbackWeatherData,
        events: eventData.length > 0 ? eventData : fallbackEventData,
        transport: transportData.length > 0 ? transportData : fallbackTransportData,
        overview: Object.keys(overviewData).length > 0 ? overviewData : fallbackOverviewData
      },
      metadata: {
        description: "Rapport d'analyse prédictive des retards de transport en commun",
        version: "1.0",
        generatedBy: "Transport Delay Prediction Dashboard"
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `transport-delay-report-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Données de fallback si l'API n'est pas disponible
  const fallbackTemporalData = [
    { hour: '6h', delay: 2, volume: 120, punctuality: 95 },
    { hour: '7h', delay: 15, volume: 450, punctuality: 78 },
    { hour: '8h', delay: 25, volume: 680, punctuality: 65 },
    { hour: '9h', delay: 20, volume: 520, punctuality: 72 },
    { hour: '10h', delay: 5, volume: 380, punctuality: 88 },
    { hour: '17h', delay: 18, volume: 590, punctuality: 74 },
    { hour: '18h', delay: 22, volume: 720, punctuality: 68 },
    { hour: '19h', delay: 15, volume: 480, punctuality: 78 },
  ];

  const fallbackWeatherData = [
    { condition: '☀️ Temps clair', delay: 8, frequency: 65, color: '#10B981' },
    { condition: '🌧️ Pluie', delay: 15, frequency: 25, color: '#3B82F6' },
    { condition: '⛈️ Conditions extrêmes', delay: 25, frequency: 10, color: '#EF4444' },
  ];

  const fallbackEventData = [
    { type: '🚫 Jour normal', delay: 10, frequency: 85, color: '#10B981' },
    { type: '🚨 Événement majeur', delay: 20, frequency: 15, color: '#F59E0B' },
  ];

  const fallbackTransportData = [
    { name: 'Bus', value: 45, color: '#3B82F6' },
    { name: 'Metro', value: 35, color: '#8B5CF6' },
    { name: 'Train', value: 20, color: '#10B981' },
  ];

  const fallbackOverviewData = {
    totalPredictions: 15420,
    averageDelay: 12.5,
    accuracy: 87.3,
    topFactors: ['Heure de pointe', 'Conditions météo', 'Événements spéciaux']
  };

  // Utiliser les données ML ou les fallbacks
  const currentTemporalData = temporalData.length > 0 ? temporalData : fallbackTemporalData;
  const currentWeatherData = weatherData.length > 0 ? weatherData : fallbackWeatherData;
  const currentEventData = eventData.length > 0 ? eventData : fallbackEventData;
  const currentTransportData = transportData.length > 0 ? transportData : fallbackTransportData;

  const tabs = [
    { id: 'temporal', label: 'Analyse Temporelle', icon: FaClock, color: 'from-blue-500 to-cyan-500' },
    { id: 'weather', label: 'Impact Météo', icon: FaCloudRain, color: 'from-cyan-500 to-blue-500' },
    { id: 'events', label: 'Événements', icon: FaCalendarAlt, color: 'from-orange-500 to-red-500' },
    { id: 'overview', label: 'Vue d\'ensemble', icon: FaTachometerAlt, color: 'from-purple-500 to-pink-500' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-black/80 text-white p-4 rounded-xl border border-white/20 shadow-2xl">
          <p className="font-bold">{`Heure: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'delay' ? ' min' : entry.dataKey === 'punctuality' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
            <FaChartLine className="text-blue-500 mr-2" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Dashboard Analytics IA</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Insights Intelligents
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Explorez les données avec des visualisations avancées et des analyses prédictives basées sur l'IA
          </p>

          {/* Contrôles */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={fetchAnalyticsData}
              disabled={loading}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Chargement...' : 'Actualiser les données'}
            </button>

            {error && (
              <div className="text-red-500 text-sm bg-red-100 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {temporalData.length > 0 && (
              <div className="text-green-600 text-sm bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                ✅ Données ML chargées
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative group flex items-center px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-500 transform hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/25'
                    : 'backdrop-blur-xl bg-white/10 dark:bg-black/10 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-white/10 hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="mr-3 text-lg" />
                {tab.label}
                {!isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="animate-fade-in-up">
          {/* Temporal Analysis */}
          {activeTab === 'temporal' && (
            <div className="space-y-8">
              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaClock className="mr-3 text-blue-500" />
                  Analyse des Retards par Heure
                </h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentTemporalData}>
                      <defs>
                        <linearGradient id="delayGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="hour" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="delay" stroke="#3B82F6" fillOpacity={1} fill="url(#delayGradient)" strokeWidth={3} />
                      <Area type="monotone" dataKey="volume" stroke="#8B5CF6" fillOpacity={1} fill="url(#volumeGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Additional Temporal Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Heure de Pointe</h3>
                    <FaClock className="text-orange-500 text-2xl" />
                  </div>
                  <p className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">8h-9h</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Retard moyen: 22.5 min</p>
                </div>

                <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Heure Creuse</h3>
                    <FaClock className="text-green-500 text-2xl" />
                  </div>
                  <p className="text-3xl font-black bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">10h-17h</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Retard moyen: 5 min</p>
                </div>

                <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Soirée</h3>
                    <FaClock className="text-blue-500 text-2xl" />
                  </div>
                  <p className="text-3xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">17h-19h</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Retard moyen: 18.3 min</p>
                </div>
              </div>
            </div>
          )}

          {/* Weather Impact */}
          {activeTab === 'weather' && (
            <div className="space-y-8">
              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaCloudRain className="mr-3 text-cyan-500" />
                  Impact des Conditions Météo
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentWeatherData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="condition" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="delay" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {currentWeatherData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 dark:bg-black/5 rounded-xl border border-white/10">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{item.condition.split(' ')[0]}</span>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{item.condition}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Retard: {item.delay} min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: item.color }}>{item.frequency}%</p>
                          <p className="text-xs text-gray-500">fréquence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Analysis */}
          {activeTab === 'events' && (
            <div className="space-y-8">
              <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaCalendarAlt className="mr-3 text-orange-500" />
                  Impact des Événements Majeurs
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentEventData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="type" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="delay" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {currentEventData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 dark:bg-black/5 rounded-xl border border-white/10">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{item.type.split(' ')[0]}</span>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{item.type}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Retard: {item.delay} min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: item.color }}>{item.frequency}%</p>
                          <p className="text-xs text-gray-500">fréquence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Transport Distribution */}
                <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FaEye className="mr-3 text-purple-500" />
                    Répartition par Transport
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentTransportData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {currentTransportData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            color: 'white'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-6 mt-4">
                    {currentTransportData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FaTachometerAlt className="mr-3 text-green-500" />
                    Métriques Clés
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Délai Moyen</p>
                        <p className="text-2xl font-bold text-green-600">{overviewData.avg_delay || '12.5'} min</p>
                      </div>
                      <div className="text-4xl">⏱️</div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Taux de Ponctualité</p>
                        <p className="text-2xl font-bold text-blue-600">{overviewData.punctuality_rate || '78.5'}%</p>
                      </div>
                      <div className="text-4xl">🎯</div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Délai Maximum</p>
                        <p className="text-2xl font-bold text-purple-600">{overviewData.max_delay || '28.3'} min</p>
                      </div>
                      <div className="text-4xl">📈</div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Précision Modèle</p>
                        <p className="text-2xl font-bold text-orange-600">{overviewData.model_accuracy || '89.2'}%</p>
                      </div>
                      <div className="text-4xl">🤖</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <div className="text-center">
                <button
                  onClick={exportReport}
                  className="btn-primary inline-flex items-center hover:scale-105 transition-transform duration-300"
                >
                  <FaDownload className="mr-3" />
                  Exporter le Rapport Complet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;