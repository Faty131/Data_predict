import { FaCloudRain, FaClock, FaExclamationTriangle, FaUsers, FaLightbulb, FaRocket, FaShieldAlt, FaCog } from 'react-icons/fa';

const Recommendations = () => {
  const recommendations = [
    {
      condition: 'Conditions Météorologiques Dégradées',
      icon: FaCloudRain,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      actions: [
        '+15-20% de fréquence sur les lignes affectées',
        'Déploiement de véhicules supplémentaires en réserve',
        'Activation du système de surveillance météo en temps réel',
        'Communication proactive aux usagers via applications mobiles'
      ],
      impact: 'Réduction de 25-30% des retards liés à la météo',
      priority: 'Haute'
    },
    {
      condition: 'Heures de Pointe et Affluence',
      icon: FaClock,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      actions: [
        'Renforcement des équipes de conduite et de contrôle',
        'Mise en place de services express sur les axes principaux',
        'Coordination inter-modale pour fluidifier les correspondances',
        'Diffusion d\'informations en temps réel sur les écrans des stations'
      ],
      impact: 'Amélioration de 20-25% de la régularité en heure de pointe',
      priority: 'Haute'
    },
    {
      condition: 'Événements Majeurs et Perturbations',
      icon: FaExclamationTriangle,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      actions: [
        'Activation des plans de déviation et d\'itinéraires alternatifs',
        'Renforcement de la signalétique temporaire',
        'Coordination avec les autorités locales et la police',
        'Mise à jour en temps réel des applications et sites web'
      ],
      impact: 'Minimisation de l\'impact sur 60-70% des usagers',
      priority: 'Critique'
    },
    {
      condition: 'Forte Affluence et Gestion de Foule',
      icon: FaUsers,
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      actions: [
        'Augmentation dynamique de la capacité des véhicules',
        'Mise en place de files prioritaires et de contrôles d\'accès',
        'Déploiement d\'agents supplémentaires pour la gestion de foule',
        'Utilisation de caméras et capteurs pour monitorer les flux'
      ],
      impact: 'Amélioration de 35-40% du confort et de la sécurité',
      priority: 'Moyenne'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critique': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Haute': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Moyenne': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-6">
              <FaLightbulb className="text-blue-500 mr-2" />
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Recommandations Opérationnelles</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Que peuvent faire
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                les opérateurs de transport ?
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez les stratégies éprouvées pour optimiser les performances du réseau de transport,
              réduire les retards et améliorer l'expérience utilisateur grâce à l'IA prédictive.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div
                key={index}
                className="group animate-fade-in-up backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${rec.gradient} shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {rec.condition}
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(rec.priority)}`}>
                        Priorité {rec.priority}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FaRocket className="mr-2 text-blue-500" />
                    Actions Recommandées
                  </h4>
                  <ul className="space-y-3">
                    {rec.actions.map((action, i) => (
                      <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${rec.gradient} mt-2 mr-3 flex-shrink-0`}></div>
                        <span className="text-sm leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact */}
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${rec.bgGradient} border ${rec.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaShieldAlt className={`text-xl mr-3 bg-gradient-to-r ${rec.gradient} bg-clip-text text-transparent`} />
                      <span className="font-semibold text-gray-900 dark:text-white">Impact Attendu</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {rec.impact}
                    </span>
                  </div>
                </div>

                {/* Implementation Button */}
                <div className="mt-6 text-center">
                  <button className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${rec.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
                    <FaCog className="mr-2" />
                    Implémenter cette stratégie
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Insights */}
        <div className="mt-16 text-center">
          <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Optimisation Continue du Réseau
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Ces recommandations sont générées dynamiquement en fonction des données en temps réel
              et des prédictions IA. Elles s'adaptent automatiquement aux conditions changeantes
              pour maintenir des niveaux de service optimaux.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Précision</h3>
                <p className="text-gray-600 dark:text-gray-300">Recommandations basées sur des données historiques et des modèles prédictifs avancés</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Temps Réel</h3>
                <p className="text-gray-600 dark:text-gray-300">Adaptation automatique aux conditions actuelles et futures</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Performance</h3>
                <p className="text-gray-600 dark:text-gray-300">Amélioration mesurable de la ponctualité et de la satisfaction client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;