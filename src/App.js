import React, { useState, useMemo } from 'react';
import { plantData } from './plantData.js'; // This line imports your data

// --- DATA & HELPERS ---
const locations = { "Australia": {"Sydney": "Temperate", "Melbourne": "Temperate", "Brisbane": "Subtropical", "Perth": "Mediterranean"}, "USA": {"New York": "Cold", "Los Angeles": "Mediterranean", "Chicago": "Cold", "Miami": "Tropical"}, "Canada": {"Toronto": "Cold", "Vancouver": "Temperate", "Montreal": "Cold"}, "UK": {"London": "Temperate", "Manchester": "Temperate", "Edinburgh": "Cold"}, "Germany": {"Berlin": "Cold", "Munich": "Cold", "Hamburg": "Temperate"}, "France": {"Paris": "Temperate", "Marseille": "Mediterranean", "Lyon": "Temperate"}, "India": {"Delhi": "Subtropical", "Mumbai": "Tropical", "Bangalore": "Tropical"}, "China": {"Beijing": "Cold", "Shanghai": "Subtropical", "Guangzhou": "Subtropical"}, "Brazil": {"São Paulo": "Subtropical", "Rio de Janeiro": "Tropical", "Brasília": "Tropical"}, "South Africa": {"Johannesburg": "Temperate", "Cape Town": "Mediterranean", "Durban": "Subtropical"}, "New Zealand": {"Auckland": "Temperate", "Wellington": "Temperate", "Christchurch": "Temperate"}, "Japan": {"Tokyo": "Temperate", "Osaka": "Temperate", "Sapporo": "Cold"}, "Russia": {"Moscow": "Cold", "Saint Petersburg": "Cold"}, "Italy": {"Rome": "Mediterranean", "Milan": "Temperate"}, "Spain": {"Madrid": "Mediterranean", "Barcelona": "Mediterranean"}, "Mexico": {"Mexico City": "Temperate", "Cancun": "Tropical"}, "Argentina": {"Buenos Aires": "Temperate"}, "Egypt": {"Cairo": "Hot/Arid"}, "Nigeria": {"Lagos": "Tropical"}, "Indonesia": {"Jakarta": "Tropical"}, };

const countryHemispheres = { "Australia": "Southern", "USA": "Northern", "Canada": "Northern", "UK": "Northern", "Germany": "Northern", "France": "Northern", "India": "Northern", "China": "Northern", "Brazil": "Southern", "South Africa": "Southern", "New Zealand": "Southern", "Japan": "Northern", "Russia": "Northern", "Italy": "Northern", "Spain": "Northern", "Mexico": "Northern", "Argentina": "Southern", "Egypt": "Northern", "Nigeria": "Northern", "Indonesia": "Southern", };
const seasonStartMonths = {
  Northern: { Spring: 2, Summer: 5, Autumn: 8, Winter: 11 },
  Southern: { Spring: 8, Summer: 11, Autumn: 2, Winter: 5 },
};

function App() {
  const [country, setCountry] = useState(Object.keys(locations)[0]);
  const [city, setCity] = useState(Object.keys(locations[Object.keys(locations)[0]])[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [gardenPlan, setGardenPlan] = useState([]);

  const sortedCountries = useMemo(() => {
    const countries = Object.keys(locations);
    const otherCountries = countries.filter(c => c !== 'Australia');
    otherCountries.sort();
    return ['Australia', ...otherCountries];
  }, []);

  const climate = useMemo(() => locations[country]?.[city], [country, city]);
  const hemisphere = useMemo(() => countryHemispheres[country], [country]);
  
  const filteredPlants = useMemo(() => {
    if (!searchTerm) return [];
    return plantData.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.scientific.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm]);

  const calculateHarvestDate = (plantedDate, harvestData, climate) => {
    const date = new Date(plantedDate);
    let daysToHarvest = '75';

    if (typeof harvestData === 'object' && harvestData !== null) {
        daysToHarvest = harvestData[climate] || Object.values(harvestData)[0];
    } else if (harvestData) {
        daysToHarvest = harvestData;
    }

    const harvestDays = (typeof daysToHarvest === 'string' && daysToHarvest.includes('-'))
      ? Math.round(daysToHarvest.split('-').map(Number).reduce((a, b) => a + b, 0) / 2)
      : parseInt(daysToHarvest, 10);
    
    date.setDate(date.getDate() + harvestDays);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const plannedBeds = useMemo(() => {
    const getSuggestedPlantingDate = (plantingSeason) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const seasonMatch = plantingSeason.match(/Spring|Summer|Autumn|Winter/i);
        if (!seasonMatch) return now; 
        const season = seasonMatch[0];

        const targetMonth = seasonStartMonths[hemisphere][season];
        let targetYear = currentYear;

        if (currentMonth > targetMonth) {
            targetYear++;
        }

        return new Date(targetYear, targetMonth, 1);
    };

    if (gardenPlan.length === 0) return [];
  
    const getAveragePh = (soilString) => {
      if (!soilString) return null;
      const phMatches = soilString.match(/(\d+(\.\d+)?)/g);
      if (!phMatches || phMatches.length === 0) return null;
      const numbers = phMatches.map(Number);
      return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    };
  
    const beds = [];
    const sortedGardenPlan = [...gardenPlan].sort((a,b) => a.name.localeCompare(b.name));

    sortedGardenPlan.forEach(plant => {
      const plantAvgPh = getAveragePh(plant.soil);
      
      let foundBed = false;
      for (const bed of beds) {
        const bedAvgPh = getAveragePh(bed.soil);
        
        const positionMatch = bed.position === plant.position;
        const waterCompatible = Math.abs(bed.water - plant.water) <= 2;
        const phCompatible = (plantAvgPh === null && bedAvgPh === null) || 
                             (plantAvgPh !== null && bedAvgPh !== null && Math.abs(plantAvgPh - bedAvgPh) <= 0.5);

        if (positionMatch && phCompatible && waterCompatible) {
          bed.plants.push(plant);
          foundBed = true;
          break;
        }
      }
  
      if (!foundBed) {
        beds.push({
          position: plant.position,
          soil: plant.soil,
          water: plant.water,
          plants: [plant]
        });
      }
    });
  
    let dateOffset = 0;
    beds.forEach(bed => {
      bed.plants.sort((a, b) => a.name.localeCompare(b.name));
      bed.plants.forEach(plant => {
        const plantingSeason = plant.planting[climate] || "Spring";
        const baseDate = getSuggestedPlantingDate(plantingSeason);
        baseDate.setDate(baseDate.getDate() + dateOffset);
        plant.suggestedDate = baseDate;
        dateOffset += 7;
      });
    });
  
    return beds;
  }, [gardenPlan, climate, hemisphere]);

  const handleDownloadPdf = () => {
    const input = document.getElementById('garden-plan-section');
    if (!input) return;

    // Temporarily clone the node to modify styles for printing
    const clonedInput = input.cloneNode(true);
    clonedInput.style.position = 'absolute';
    clonedInput.style.left = '-9999px';
    document.body.appendChild(clonedInput);

    // Modify the clone for PDF output
    const downloadButton = clonedInput.querySelector('.download-button-container');
    if(downloadButton) downloadButton.style.display = 'none';

    const beds = clonedInput.querySelectorAll('.garden-bed');
    beds.forEach(bed => {
        const actionHeader = bed.querySelector('.action-header');
        const notesHeader = bed.querySelector('.notes-header');
        if(actionHeader) actionHeader.style.display = 'none';
        if(notesHeader) notesHeader.style.display = 'table-cell';

        const actionCells = bed.querySelectorAll('.action-cell');
        actionCells.forEach(c => c.style.display = 'none');
        const notesCells = bed.querySelectorAll('.notes-cell');
        notesCells.forEach(c => {
            c.style.display = 'table-cell';
            c.style.border = '1px solid #eee';
        });
    });
    
    window.html2canvas(clonedInput, { scale: 2 })
      .then((canvas) => {
        document.body.removeChild(clonedInput); // Clean up the cloned element
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        const contentWidth = pdfWidth - (margin * 2);
        const pdfHeight = (canvas.height * contentWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, pdfHeight);
        pdf.save('home-harvest-plan.pdf');
      });
  };

  const handleAddToPlan = (plantToAdd) => {
    if (!gardenPlan.some(p => p.name === plantToAdd.name)) {
      setGardenPlan(prevPlan => [...prevPlan, plantToAdd]);
    }
  };

  const handleRemoveFromPlan = (plantToRemove) => {
    setGardenPlan(prevPlan => prevPlan.filter(p => p.name !== plantToRemove.name));
  };


  return (
    <div className="min-h-screen font-sans" style={{backgroundColor: '#F3EAD3'}}>
      <header 
        className="bg-cover bg-center text-white p-8 shadow-lg" 
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?q=80&w=2070&auto=format&fit=crop')"}}
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-5xl font-bold tracking-tight">Home Harvest</h1>
          <p className="mt-2 text-lg">Your personal guide to a bountiful harvest.</p>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <section className="bg-white/80 p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Find Your Perfect Plant</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <select id="country" value={country} onChange={e => { setCountry(e.target.value); setCity(Object.keys(locations[e.target.value])[0]); }} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                {sortedCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <select id="city" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                {Object.keys(locations[country]).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4 p-2 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-r-lg">
              <p>Your selected climate zone: <strong className="font-bold">{climate}</strong></p>
          </div>
          
          <div className="relative">
            <label htmlFor="plant-search" className="block text-sm font-medium text-gray-700">Search for a plant (e.g., Tomato, Solanum)</label>
            <input 
              id="plant-search" 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Start typing..."
            />
            {filteredPlants.length > 0 && searchTerm && (
              <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                {filteredPlants.map(plant => (
                  <li 
                    key={plant.name} 
                    className="p-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => {
                      setSelectedPlant(plant);
                      setSearchTerm('');
                    }}
                  >
                    {plant.name} ({plant.scientific})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {selectedPlant && (
          <section className="bg-white/80 p-6 rounded-xl shadow-md mb-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-green-900 mb-2">{selectedPlant.name}</h2>
                    <p className="text-lg text-gray-500 mb-4 -mt-2">({selectedPlant.scientific})</p>
                </div>
                <button
                    onClick={() => handleAddToPlan(selectedPlant)}
                    disabled={gardenPlan.some(p => p.name === selectedPlant.name)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {gardenPlan.some(p => p.name === selectedPlant.name) ? 'Added to Plan' : 'Add to my garden'}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-700 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">When to Plant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Where to Plant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Soil Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Avg. Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Spacing</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Harvest Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-green-800">{selectedPlant.planting[climate] || 'Not Recommended'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{selectedPlant.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{selectedPlant.soil}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{selectedPlant.size}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{selectedPlant.spacing}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                Approx. {typeof selectedPlant.harvest === 'object' ? (selectedPlant.harvest[climate] || Object.values(selectedPlant.harvest)[0]) : selectedPlant.harvest} days
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </section>
        )}
        
        {gardenPlan.length > 0 && (
            <section className="bg-white/80 p-6 rounded-xl shadow-md mb-8">
                <div id="garden-plan-section">
                    <div className="flex justify-between items-center mb-4 download-button-container">
                        <h2 className="text-2xl font-semibold text-green-800">Your Suggested Garden Plan</h2>
                        <button
                            onClick={handleDownloadPdf}
                            className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700"
                        >
                            Download Plan as PDF
                        </button>
                    </div>
                    <p className="mb-6 text-gray-600">These beds group plants with similar sun, soil, and water needs. The timeline is staggered to spread out your planting and harvesting.</p>
                    
                    <div className="space-y-8">
                        {plannedBeds.map((bed, index) => (
                            <div key={index} className="garden-bed break-inside-avoid" data-bed-id={`bed-${index}`}>
                                <h3 className="text-xl font-bold text-green-900 mb-2">
                                    Bed {index + 1}: <span className="font-medium">{bed.position}</span>
                                </h3>
                                <div className="text-sm text-gray-600 mb-3 -mt-1 space-y-1">
                                    <p><span className="font-semibold">Representative Soil Type:</span> {bed.soil}</p>
                                    <p><span className="font-semibold">Watering Schedule:</span> Approx. every {bed.water} days</p>
                                </div>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-green-700 text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Plant</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Spacing</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Suggested Plant Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Est. Harvest Date</th>
                                                <th className="action-header px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                                                <th className="notes-header px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/4" style={{display: 'none'}}>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bed.plants.map(plant => (
                                                <tr key={plant.name}>
                                                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{plant.name}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">{plant.spacing}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-orange-600 font-semibold">{plant.suggestedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-green-800 font-semibold">{calculateHarvestDate(plant.suggestedDate, plant.harvest, climate)}</td>
                                                    <td className="action-cell px-4 py-4 whitespace-nowrap">
                                                        <button onClick={() => handleRemoveFromPlan(plant)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                                                    </td>
                                                    <td className="notes-cell px-4 py-4 whitespace-nowrap" style={{display: 'none'}}></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                        <p className="font-bold">Disclaimer</p>
                        <p className="text-sm">This is a generated guide based on general climate data. Local conditions, weather variations, and soil quality will affect actual growth and harvest times. Always use this plan as a starting point and adapt to your specific garden's needs.</p>
                    </div>
                </div>
            </section>
        )}
      </main>

      <footer className="text-center p-4 text-sm text-gray-600 mt-8">
        <p>&copy; 2025 Home Harvest. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
