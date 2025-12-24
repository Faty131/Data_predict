import { Link } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaCloudRain, FaRocket, FaShieldAlt, FaChartLine, FaUsers, FaStar } from 'react-icons/fa';

const Home = () => {
  // Simulated KPIs with enhanced data
  const kpis = [
    {
      icon: FaClock,
      label: 'Retard moyen aujourd\'hui',
      value: '8 min',
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      darkBg: 'from-orange-900/20 to-red-900/20',
      trend: '-12%',
      trendColor: 'text-green-500'
    },
    {
      icon: FaCheckCircle,
      label: '% de trajets à l\'heure',
      value: '85%',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      darkBg: 'from-green-900/20 to-emerald-900/20',
      trend: '+5%',
      trendColor: 'text-green-500'
    },
    {
      icon: FaCloudRain,
      label: 'Impact météo actuel',
      value: 'Faible',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      darkBg: 'from-blue-900/20 to-cyan-900/20',
      trend: 'Stable',
      trendColor: 'text-gray-500'
    },
  ];

  const features = [
    {
      icon: FaRocket,
      title: 'Prédictions Ultra-Rapides',
      description: 'Analyse en temps réel avec des algorithmes d\'IA avancés',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaShieldAlt,
      title: 'Fiabilité Garantie',
      description: 'Précision de 85% basée sur des millions de données historiques',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaChartLine,
      title: 'Analytics Avancés',
      description: 'Visualisations interactives et insights actionnables',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: FaUsers,
      title: 'Communauté Active',
      description: 'Rejoignez des milliers d\'utilisateurs satisfaits',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/30 to-orange-600/30 rounded-full blur-xl animate-float animation-delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-xl animate-float animation-delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-green-400/30 to-teal-600/30 rounded-full blur-xl animate-float animation-delay-3000"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Main Title with Gradient Animation */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Smart
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-gradient-x animation-delay-500">
                Mobility
              </span>
            </h1>

            {/* Animated Subtitle */}
            <div className="relative">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-1000 leading-relaxed">
                Révolutionnez vos déplacements avec l'IA prédictive.
                <br />
                <span className="font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Anticipez les retards avant qu'ils n'arrivent.
                </span>
              </p>

              {/* Typing Animation Effect */}
              <div className="inline-block animate-pulse">
                <span className="text-4xl md:text-6xl animate-bounce">🚍</span>
                <span className="text-4xl md:text-6xl animation-delay-500 animate-bounce">🚌</span>
                <span className="text-4xl md:text-6xl animation-delay-1000 animate-bounce">🚇</span>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div className="mb-16 animate-fade-in-up animation-delay-1500">
            <Link
              to="/prediction"
              className="group relative inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-110 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <FaRocket className="mr-3 text-2xl animate-pulse" />
              Commencer l'Analyse
              <div className="ml-3 w-2 h-2 bg-white rounded-full animate-ping"></div>
            </Link>
          </div>

          {/* KPIs Grid with Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={index}
                  className="relative group animate-fade-in-up backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${(index + 2) * 200}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgColor} dark:${kpi.darkBg} opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${kpi.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-3xl text-white animate-pulse" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                      {kpi.label}
                    </h3>

                    <div className="flex items-center justify-between">
                      <p className={`text-4xl font-black bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                        {kpi.value}
                      </p>
                      <div className={`text-sm font-semibold ${kpi.trendColor} bg-white/20 dark:bg-black/20 px-2 py-1 rounded-full`}>
                        {kpi.trend}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fonctionnalités Révolutionnaires
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Découvrez comment notre plateforme transforme l'expérience des transports en commun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-8 hover:bg-white/20 dark:hover:bg-black/20 transform hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-3xl overflow-hidden"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-3xl text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '2M+', label: 'Prédictions par jour' },
              { number: '99.5%', label: 'Disponibilité' },
              { number: '50+', label: 'Villes couvertes' },
              { number: '4.9/5', label: 'Note utilisateurs', icon: FaStar }
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.icon ? <FaStar className="inline text-yellow-400" /> : null}
                  {stat.number}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;