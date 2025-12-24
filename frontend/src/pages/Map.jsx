const Map = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Carte Interactive</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-96 bg-gray-200 rounded flex items-center justify-center">
          <p className="text-gray-500 text-lg">Carte interactive à implémenter avec Leaflet ou Mapbox</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-100 p-4 rounded">
            <span className="text-2xl">🟢</span>
            <p>Faible retard</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <span className="text-2xl">🟡</span>
            <p>Retard moyen</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <span className="text-2xl">🔴</span>
            <p>Retard élevé</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;