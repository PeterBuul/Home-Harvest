import React, { useState, useMemo } from 'react';
import { plantData } from './plantData.js'; // Correctly imports the plant data

// --- DATA ---
const locations = { 
  "Australia": {"Sydney": "Temperate", "Melbourne": "Temperate", "Brisbane": "Subtropical", "Perth": "Mediterranean"}, 
  "USA": {"New York": "Cold", "Los Angeles": "Mediterranean", "Chicago": "Cold", "Miami": "Tropical"},
  "Canada": {"Toronto": "Cold", "Vancouver": "Temperate", "Montreal": "Cold"},
  "UK": {"London": "Temperate", "Manchester": "Temperate", "Edinburgh": "Cold"},
};

// --- Main App Component ---
function App() {
  const [selectedCountry, setSelectedCountry] = useState(Object.keys(locations)[0]);
  const [selectedCity, setSelectedCity] = useState(Object.keys(locations[Object.keys(locations)[0]])[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedCity(Object.keys(locations[country])[0]);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const climateZone = locations[selectedCountry][selectedCity];

  const filteredPlants = useMemo(() => {
    if (!climateZone) return [];
    
    return plantData.filter(plant => {
      const plantNameMatch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const climateMatch = plant.planting[climateZone] && plant.planting[climateZone] !== "Not suitable";
      return plantNameMatch && climateMatch;
    });
  }, [searchTerm, climateZone]);

  return (
    <div className="container mx-auto p-4 font-sans text-gray-800">
      <header className="text-center mb-8">
        {/* Correctly loads the logo from the public folder */}
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Home Harvest Logo" className="w-24 h-24 mx-auto mb-4"/>
        <h1 className="text-5xl font-bold text-green-800">Home Harvest</h1>
        <p className="text-lg text-green-600">Your personal guide to planting success.</p>
      </header>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Location Selectors */}
          <div>
            <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select id="country-select" value={selectedCountry} onChange={handleCountryChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
              {Object.keys(locations).map(country => <option key={country} value={country}>{country}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select id="city-select" value={selectedCity} onChange={handleCityChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
              {Object.keys(locations[selectedCountry]).map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Plants</label>
            <input type="text" id="search" placeholder="e.g., Tomato" value={searchTerm} onChange={handleSearchChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
          </div>
        </div>
        <div className="text-center mt-4 p-2 bg-green-100 border border-green-200 rounded-md">
          Your climate zone is: <strong className="text-green-800">{climateZone}</strong>
        </div>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlants.length > 0 ? (
          filteredPlants.map(plant => (
            <div key={plant.name} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500 transition-transform transform hover:scale-105">
              <h2 className="text-2xl font-bold text-green-700">{plant.name}</h2>
              <p className="text-sm italic text-gray-500 mb-3">{plant.scientific}</p>
              <div className="space-y-2 text-sm">
                <p><strong>🌱 Plant In:</strong> <span className="font-semibold text-orange-600">{plant.planting[climateZone]}</span></p>
                <p><strong>☀️ Position:</strong> {plant.position}</p>
                <p><strong>🌿 Soil:</strong> {plant.soil}</p>
                <p><strong>💧 Water:</strong> Every {plant.water} days (approx)</p>
                <p><strong>🌾 Harvest:</strong> {plant.harvest} days</p>
                <p><strong>📏 Spacing:</strong> {plant.spacing}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 md:col-span-2 lg:col-span-3">No plants match your search for the selected climate. Try a different search term!</p>
        )}
      </main>
    </div>
  );
}

export default App;
