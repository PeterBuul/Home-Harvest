import React, { useState, useMemo } from 'react';

// --- DATA ---
const locations = { "Australia": {"Sydney": "Temperate", "Melbourne": "Temperate", "Brisbane": "Subtropical", "Perth": "Mediterranean"}, "USA": {"New York": "Cold", "Los Angeles": "Mediterranean", "Chicago": "Cold", "Miami": "Tropical"}, "Canada": {"Toronto": "Cold", "Vancouver": "Temperate", "Montreal": "Cold"}, "UK": {"London": "Temperate", "Manchester": "Temperate", "Edinburgh": "Cold"}, "Germany": {"Berlin": "Cold", "Munich": "Cold", "Hamburg": "Temperate"}, "France": {"Paris": "Temperate", "Marseille": "Mediterranean", "Lyon": "Temperate"}, "India": {"Delhi": "Subtropical", "Mumbai": "Tropical", "Bangalore": "Tropical"}, "China": {"Beijing": "Cold", "Shanghai": "Subtropical", "Guangzhou": "Subtropical"}, "Brazil": {"São Paulo": "Subtropical", "Rio de Janeiro": "Tropical", "Brasília": "Tropical"}, "South Africa": {"Johannesburg": "Temperate", "Cape Town": "Mediterranean", "Durban": "Subtropical"}, "New Zealand": {"Auckland": "Temperate", "Wellington": "Temperate", "Christchurch": "Temperate"}, "Japan": {"Tokyo": "Temperate", "Osaka": "Temperate", "Sapporo": "Cold"}, "Russia": {"Moscow": "Cold", "Saint Petersburg": "Cold"}, "Italy": {"Rome": "Mediterranean", "Milan": "Temperate"}, "Spain": {"Madrid": "Mediterranean", "Barcelona": "Mediterranean"}, "Mexico": {"Mexico City": "Temperate", "Cancun": "Tropical"}, "Argentina": {"Buenos Aires": "Temperate"}, "Egypt": {"Cairo": "Hot/Arid"}, "Nigeria": {"Lagos": "Tropical"}, "Indonesia": {"Jakarta": "Tropical"}, };
const plantData = [ { name: "Tomato", scientific: "Solanum lycopersicum", planting: { "Cold": "Late Spring", "Temperate": "Early Spring", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Early Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.8", harvest: 60-85, water: 3 }, { name: "Carrot", scientific: "Daucus carota", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Loose, sandy, pH 6.0-7.0", harvest: 70-80, water: 4 }, { name: "Lettuce", scientific: "Lactuca sativa", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "High altitude/Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn/Winter" }, position: "Partial Shade", soil: "Rich, moist, pH 6.0-7.0", harvest: 30-70, water: 2 }, { name: "Cucumber", scientific: "Cucumis sativus", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Early Spring/Autumn" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: 50-70, water: 2 }, { name: "Bell Pepper", scientific: "Capsicum annuum", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Late Summer/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Early Spring/Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.8", harvest: 60-90, water: 3 }, { name: "Broccoli", scientific: "Brassica oleracea var. italica", planting: { "Cold": "Early Spring", "Temperate": "Late Summer/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, pH 6.0-7.0", harvest: 60-100, water: 4 }, { name: "Spinach", scientific: "Spinacia oleracea", planting: { "Cold": "Early Spring/Autumn", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "High altitude only", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Well-drained, rich, pH 6.5-7.5", harvest: 40-50, water: 3 }, { name: "Potato", scientific: "Solanum tuberosum", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Dry Season (high alt.)", "Mediterranean": "Winter/Early Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Acidic, loose, pH 4.8-6.5", harvest: 70-120, water: 5 }, { name: "Onion", scientific: "Allium cepa", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Early Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, fertile, pH 6.0-7.0", harvest: 90-120, water: 7 }, { name: "Garlic", scientific: "Allium sativum", planting: { "Cold": "Autumn", "Temperate": "Autumn", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, sandy loam, pH 6.0-7.0", harvest: 240-270, water: 7 }, { name: "Zucchini", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Early Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.5", harvest: 40-60, water: 3 }, { name: "Radish", scientific: "Raphanus sativus", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Loose, well-drained, pH 6.0-7.0", harvest: 20-30, water: 2 }, { name: "Pea", scientific: "Pisum sativum", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Early Spring", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.5", harvest: 60-70, water: 4 }, { name: "Corn", scientific: "Zea mays", planting: { "Cold": "Late Spring", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: 60-100, water: 4 }, { name: "Bean", scientific: "Phaseolus vulgaris", planting: { "Cold": "Late Spring", "Temperate": "Spring/Summer", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.0", harvest: 50-75, water: 3 }, { name: "Kale", scientific: "Brassica oleracea var. sabellica", planting: { "Cold": "Early Spring/Late Summer", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.5", harvest: 55-75, water: 4 }, { name: "Eggplant", scientific: "Solanum melongena", planting: { "Cold": "Late Spring (indoors first)", "Temperate": "Late Spring", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, fertile, pH 5.5-6.5", harvest: 100-120, water: 3 }, { name: "Sweet Potato", scientific: "Ipomoea batatas", planting: { "Cold": "Not suitable", "Temperate": "Late Spring", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Late Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Sandy, well-drained, pH 5.0-6.5", harvest: 90-120, water: 5 }, { name: "Pumpkin", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: 90-120, water: 7 }, { name: "Cabbage", scientific: "Brassica oleracea var. capitata", planting: { "Cold": "Early Spring", "Temperate": "Late Summer/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, pH 6.5-7.5", harvest: 70-100, water: 4 }, { name: "Beetroot", scientific: "Beta vulgaris", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, sandy, pH 6.5-7.5", harvest: 50-70, water: 4 }, { name: "Cauliflower", scientific: "Brassica oleracea var. botrytis", planting: { "Cold": "Early Spring", "Temperate": "Late Summer", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.5-7.0", harvest: 50-100, water: 4 }, { name: "Turnip", scientific: "Brassica rapa subsp. rapa", planting: { "Cold": "Early Spring/Late Summer", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.5", harvest: 40-60, water: 5 }, { name: "Asparagus", scientific: "Asparagus officinalis", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Not ideal", "Tropical": "Not suitable", "Mediterranean": "Winter", "Hot/Arid": "Early Spring" }, position: "Full Sun", soil: "Sandy, well-drained, pH 6.5-7.5", harvest: 730, water: 7 }, { name: "Artichoke", scientific: "Cynara cardunculus var. scolymus", planting: { "Cold": "Spring (indoors first)", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, fertile, pH 6.5-7.0", harvest: 180-200, water: 7 }, { name: "Okra", scientific: "Abelmoschus esculentus", planting: { "Cold": "Not suitable", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, rich, pH 6.5-7.5", harvest: 50-65, water: 4 }, { name: "Celery", scientific: "Apium graveolens", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Partial Shade", soil: "Moist, rich, pH 6.0-7.0", harvest: 85-120, water: 2 }, { name: "Leek", scientific: "Allium ampeloprasum", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: 80-120, water: 5 }, { name: "Chard", scientific: "Beta vulgaris subsp. cicla", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "All Year", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-7.0", harvest: 50-60, water: 3 }, { name: "Fennel", scientific: "Foeniculum vulgare", planting: { "Cold": "Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-8.0", harvest: 90-115, water: 5 }, { name: "Strawberry", scientific: "Fragaria × ananassa", planting: { "Cold": "Early Spring", "Temperate": "Late Autumn/Early Spring", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Sandy, acidic, pH 5.5-6.5", harvest: 60-90, water: 2 }, { name: "Blueberry", scientific: "Vaccinium corymbosum", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Spring", "Subtropical": "Requires low-chill varieties", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Not suitable" }, position: "Full Sun/Partial Shade", soil: "Acidic, well-drained, pH 4.5-5.5", harvest: 365, water: 3 }, { name: "Raspberry", scientific: "Rubus idaeus", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Spring", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.5", harvest: 365, water: 4 }, { name: "Watermelon", scientific: "Citrullus lanatus", planting: { "Cold": "Late Spring (indoors first)", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Sandy, well-drained, pH 6.0-7.0", harvest: 80-100, water: 5 }, { name: "Cantaloupe", scientific: "Cucumis melo var. cantalupensis", planting: { "Cold": "Late Spring (indoors first)", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Sandy, well-drained, pH 6.0-7.0", harvest: 70-90, water: 5 }, { name: "Grape", scientific: "Vitis vinifera", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Winter", "Tropical": "Not ideal", "Mediterranean": "Winter", "Hot/Arid": "Winter" }, position: "Full Sun", soil: "Deep, well-drained, pH 5.5-7.0", harvest: 730, water: 10 }, { name: "Pineapple", scientific: "Ananas comosus", planting: { "Cold": "Indoors only", "Temperate": "Indoors only", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Spring (in pots)", "Hot/Arid": "Spring (with shade)" }, position: "Full Sun", soil: "Sandy, acidic, well-drained, pH 4.5-5.5", harvest: 540-730, water: 14 }, { name: "Fig", scientific: "Ficus carica", planting: { "Cold": "Spring (in pots)", "Temperate": "Spring", "Subtropical": "Winter", "Tropical": "Not ideal", "Mediterranean": "Winter", "Hot/Arid": "Winter" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.5", harvest: 365, water: 10 }, { name: "Pomegranate", scientific: "Punica granatum", planting: { "Cold": "Spring (in pots)", "Temperate": "Spring", "Subtropical": "Spring", "Tropical": "Dry Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, pH 5.5-7.2", harvest: 730, water: 14 }, { name: "Kiwi", scientific: "Actinidia deliciosa", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Winter", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, fertile, pH 5.0-6.5", harvest: 1095, water: 7 }, { name: "Basil", scientific: "Ocimum basilicum", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "All Year", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring/Autumn" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: 30-60, water: 2 }, { name: "Mint", scientific: "Mentha", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn/Winter", "Tropical": "All Year", "Mediterranean": "Spring/Autumn", "Hot/Arid": "Spring/Autumn (with shade)" }, position: "Partial Shade", soil: "Moist, rich, pH 6.0-7.0", harvest: 60-90, water: 2 }, { name: "Rosemary", scientific: "Salvia rosmarinus", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, sandy, pH 6.0-7.0", harvest: 90, water: 14 }, { name: "Thyme", scientific: "Thymus vulgaris", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, light, pH 6.0-8.0", harvest: 90, water: 10 }, { name: "Parsley", scientific: "Petroselinum crispum", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Rich, moist, pH 6.0-7.0", harvest: 70-90, water: 3 }, { name: "Cilantro", scientific: "Coriandrum sativum", planting: { "Cold": "Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Well-drained, pH 6.2-6.8", harvest: 45-70, water: 3 }, { name: "Dill", scientific: "Anethum graveolens", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, rich, pH 5.5-6.5", harvest: 40-60, water: 4 }, { name: "Oregano", scientific: "Origanum vulgare", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-8.0", harvest: 80-90, water: 10 }, { name: "Chives", scientific: "Allium schoenoprasum", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-7.0", harvest: 60-90, water: 4 }, { name: "Sage", scientific: "Salvia officinalis", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.0", harvest: 75, water: 10 }, { name: "Lentil", scientific: "Lens culinaris", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained loam, pH 6.0-8.0", harvest: 80-110, water: 7 }, { name: "Chickpea", scientific: "Cicer arietinum", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Sandy loam, pH 6.0-9.0", harvest: 90-100, water: 7 }, { name: "Soybean", scientific: "Glycine max", planting: { "Cold": "Late Spring", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Loam, pH 6.0-6.8", harvest: 70-120, water: 5 }, { name: "Mung Bean", scientific: "Vigna radiata", planting: { "Cold": "Not suitable", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Sandy loam, pH 6.2-7.2", harvest: 60-90, water: 4 }, { name: "Adzuki Bean", scientific: "Vigna angularis", planting: { "Cold": "Late Spring", "Temperate": "Late Spring", "Subtropical": "Spring", "Tropical": "Dry Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, pH 5.5-6.5", harvest: 90-120, water: 5 }, { name: "Parsnip", scientific: "Pastinaca sativa", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Deep, loose, pH 6.0-7.0", harvest: 120-180, water: 5 }, { name: "Rutabaga", scientific: "Brassica napus", planting: { "Cold": "Late Spring", "Temperate": "Late Summer", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.0", harvest: 90-110, water: 4 }, { name: "Ginger", scientific: "Zingiber officinale", planting: { "Cold": "Indoors only", "Temperate": "Spring (in pots)", "Subtropical": "Early Spring", "Tropical": "All Year", "Mediterranean": "Spring (in pots)", "Hot/Arid": "Spring (with shade)" }, position: "Partial Shade", soil: "Rich, moist, well-drained, pH 5.5-6.5", harvest: 240-300, water: 3 }, { name: "Turmeric", scientific: "Curcuma longa", planting: { "Cold": "Indoors only", "Temperate": "Spring (in pots)", "Subtropical": "Early Spring", "Tropical": "All Year", "Mediterranean": "Spring (in pots)", "Hot/Arid": "Spring (with shade)" }, position: "Partial Shade", soil: "Rich, moist, well-drained, pH 6.0-7.8", harvest: 210-300, water: 3 }, { name: "Horseradish", scientific: "Armoracia rusticana", planting: { "Cold": "Early Spring", "Temperate": "Early Spring/Autumn", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Deep, rich, moist, pH 6.0-7.5", harvest: 365, water: 5 }, { name: "Arugula", scientific: "Eruca vesicaria", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "All Year", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.0", harvest: 30-40, water: 2 }, { name: "Mustard Greens", scientific: "Brassica juncea", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.5", harvest: 30-40, water: 3 }, { name: "Collard Greens", scientific: "Brassica oleracea var. viridis", planting: { "Cold": "Early Spring", "Temperate": "Spring/Late Summer", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, well-drained, pH 6.5-7.5", harvest: 60-75, water: 4 }, { name: "Bok Choy", scientific: "Brassica rapa subsp. chinensis", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-7.5", harvest: 45-60, water: 2 }, { name: "Endive", scientific: "Cichorium endivia", planting: { "Cold": "Late Spring", "Temperate": "Late Summer", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, well-drained, pH 5.5-7.0", harvest: 80-100, water: 4 }, { name: "Butternut Squash", scientific: "Cucurbita moschata", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: 80-100, water: 7 }, { name: "Spaghetti Squash", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.5", harvest: 90-100, water: 7 }, { name: "Acorn Squash", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: 80-100, water: 7 }, { name: "Delicata Squash", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: 80-100, water: 7 }, { name: "Kabocha Squash", scientific: "Cucurbita maxima", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: 90-100, water: 7 }, { name: "Brussels Sprouts", scientific: "Brassica oleracea var. gemmifera", planting: { "Cold": "Early Spring", "Temperate": "Late Spring/Early Summer", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Summer", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, well-drained, pH 6.8", harvest: 90-110, water: 5 }, { name: "Kohlrabi", scientific: "Brassica oleracea var. gongylodes", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, well-drained, pH 6.0-7.5", harvest: 45-60, water: 4 }, { name: "Rhubarb", scientific: "Rheum rhabarbarum", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Spring", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, rich, pH 5.5-6.5", harvest: 365, water: 5 }, { name: "Tomatillo", scientific: "Physalis philadelphica", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, rich, pH 6.5-7.0", harvest: 75-100, water: 3 }, { name: "Salsify", scientific: "Tragopogon porrifolius", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Deep, sandy loam, pH 6.0-7.5", harvest: 120-150, water: 6 }, { name: "Scallion", scientific: "Allium fistulosum", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "All Year", "Tropical": "All Year", "Mediterranean": "All Year", "Hot/Arid": "Autumn/Winter" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: 60-80, water: 4 }, { name: "Watercress", scientific: "Nasturtium officinale", planting: { "Cold": "Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn (in water)" }, position: "Partial Shade (in water)", soil: "Flowing water, pH 6.5-7.5", harvest: 50-60, water: 1 }, { name: "Jerusalem Artichoke", scientific: "Helianthus tuberosus", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Dry Season (high alt.)", "Mediterranean": "Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.5-7.5", harvest: 120-150, water: 7 }, { name: "Cardoon", scientific: "Cynara cardunculus", planting: { "Cold": "Spring (indoors first)", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, fertile, pH 6.5-7.0", harvest: 150-180, water: 7 }, { name: "Mushroom (Oyster)", scientific: "Pleurotus ostreatus", planting: { "Cold": "Indoors", "Temperate": "Indoors", "Subtropical": "Indoors", "Tropical": "Indoors", "Mediterranean": "Indoors", "Hot/Arid": "Indoors" }, position: "Shade/Indoors", soil: "Substrate (straw, logs)", harvest: 14-21, water: 1 }, { name: "Mushroom (Shiitake)", scientific: "Lentinula edodes", planting: { "Cold": "Indoors", "Temperate": "Indoors", "Subtropical": "Indoors", "Tropical": "Indoors", "Mediterranean": "Indoors", "Hot/Arid": "Indoors" }, position: "Shade/Indoors", soil: "Hardwood logs", harvest: 180-365, water: 10 }, { name: "Goji Berry", scientific: "Lycium barbarum", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, pH 6.8-8.1", harvest: 730, water: 14 }, { name: "Elderberry", scientific: "Sambucus nigra", planting: { "Cold": "Spring/Autumn", "Temperate": "Spring/Autumn", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Not suitable" }, position: "Full Sun/Partial Shade", soil: "Moist, well-drained, pH 5.5-6.5", harvest: 730, water: 7 }, { name: "Blackcurrant", scientific: "Ribes nigrum", planting: { "Cold": "Spring/Autumn", "Temperate": "Autumn", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-7.0", harvest: 365, water: 5 }, { name: "Gooseberry", scientific: "Ribes uva-crispa", planting: { "Cold": "Spring/Autumn", "Temperate": "Autumn", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-6.5", harvest: 365, water: 5 }, { name: "Passion Fruit", scientific: "Passiflora edulis", planting: { "Cold": "Indoors", "Temperate": "Spring (pots)", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring (with care)" }, position: "Full Sun", soil: "Well-drained, rich, pH 6.5-7.5", harvest: 240-365, water: 4 }, { name: "Guava", scientific: "Psidium guajava", planting: { "Cold": "Not suitable", "Temperate": "Not suitable", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, pH 5.0-7.0", harvest: 730, water: 7 }, { name: "Mango", scientific: "Mangifera indica", planting: { "Cold": "Not suitable", "Temperate": "Not suitable", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, pH 5.5-7.5", harvest: 1095, water: 10 }, { name: "Papaya", scientific: "Carica papaya", planting: { "Cold": "Not suitable", "Temperate": "Not suitable", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, rich, pH 5.5-6.5", harvest: 270-330, water: 4 }, { name: "Avocado", scientific: "Persea americana", planting: { "Cold": "Not suitable", "Temperate": "Spring (pots)", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring (with care)" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.5", harvest: 1825, water: 14 } ];

// Helper data for seasonal date calculations
const countryHemispheres = { "Australia": "Southern", "USA": "Northern", "Canada": "Northern", "UK": "Northern", "Germany": "Northern", "France": "Northern", "India": "Northern", "China": "Northern", "Brazil": "Southern", "South Africa": "Southern", "New Zealand": "Southern", "Japan": "Northern", "Russia": "Northern", "Italy": "Northern", "Spain": "Northern", "Mexico": "Northern", "Argentina": "Southern", "Egypt": "Northern", "Nigeria": "Northern", "Indonesia": "Southern", };
const seasonStartMonths = { // 0-indexed months (0 = Jan, 11 = Dec)
  Northern: { Spring: 2, Summer: 5, Autumn: 8, Winter: 11 },
  Southern: { Spring: 8, Summer: 11, Autumn: 2, Winter: 5 },
};

// --- REACT COMPONENT ---
function App() {
  const [country, setCountry] = useState(Object.keys(locations)[0]);
  const [city, setCity] = useState(Object.keys(locations[Object.keys(locations)[0]])[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [gardenLog, setGardenLog] = useState([]);
  const [logPlantName, setLogPlantName] = useState('');
  const [logPlantDate, setLogPlantDate] = useState(new Date().toISOString().split('T')[0]);
  const [gardenPlan, setGardenPlan] = useState([]);

  const climate = useMemo(() => locations[country]?.[city], [country, city]);
  const hemisphere = useMemo(() => countryHemispheres[country], [country]);
  
  const filteredPlants = useMemo(() => {
    if (!searchTerm) return [];
    return plantData.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.scientific.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm]);

  const calculateHarvestDate = (plantedDate, daysToHarvest) => {
    const date = new Date(plantedDate);
    const harvestDays = (typeof daysToHarvest === 'string' && daysToHarvest.includes('-'))
      ? Math.round(daysToHarvest.split('-').map(Number).reduce((a, b) => a + b, 0) / 2)
      : parseInt(daysToHarvest, 10);
    
    date.setDate(date.getDate() + harvestDays);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const plannedBeds = useMemo(() => {
    // Moved helper function inside to satisfy dependency rule
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
        const phCompatible = (plantAvgPh === null && bedAvgPh === null) || 
                             (plantAvgPh !== null && bedAvgPh !== null && Math.abs(plantAvgPh - bedAvgPh) <= 0.5);

        if (positionMatch && phCompatible) {
          bed.plants.push(plant);
          foundBed = true;
          break;
        }
      }
  
      if (!foundBed) {
        beds.push({
          position: plant.position,
          soil: plant.soil,
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

  const handleAddPlantToLog = () => {
    const plant = plantData.find(p => p.name.toLowerCase() === logPlantName.toLowerCase());
    if (plant && logPlantDate) {
        const newEntry = {
            id: Date.now(),
            plant: plant,
            plantedDate: new Date(logPlantDate),
        };
        setGardenLog([...gardenLog, newEntry]);
        setLogPlantName('');
        setLogPlantDate(new Date().toISOString().split('T')[0]);
    } else {
        alert("Please select a valid plant from the list.");
    }
  };
  
  const handleDownloadPdf = (elementId, filename) => {
    const { jsPDF } = window.jspdf;
    const input = document.getElementById(elementId);
    if (!input) return;
    
    window.html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;
        const pdfAspectRatio = pdfWidth / pdfHeight;

        let renderWidth, renderHeight;

        if (canvasAspectRatio > pdfAspectRatio) {
            renderWidth = pdfWidth;
            renderHeight = renderWidth / canvasAspectRatio;
        } else {
            renderHeight = pdfHeight;
            renderWidth = renderHeight * canvasAspectRatio;
        }

        const xOffset = (pdfWidth - renderWidth) / 2;
        const yOffset = (pdfHeight - renderHeight) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, renderWidth, renderHeight);
        pdf.save(filename);
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
        <section className="bg-white/80 p-6 rounded-xl shadow-md backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Find Your Perfect Plant</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <select id="country" value={country} onChange={e => { setCountry(e.target.value); setCity(Object.keys(locations[e.target.value])[0]); }} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                {Object.keys(locations).map(c => <option key={c} value={c}>{c}</option>)}
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
          <section className="bg-white/80 p-6 rounded-xl shadow-md backdrop-blur-sm mb-8">
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
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Harvest Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-green-800">{selectedPlant.planting[climate] || 'Not Recommended'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{selectedPlant.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{selectedPlant.soil}</td>
                            <td className="px-6 py-4 whitespace-nowrap">Approx. {selectedPlant.harvest} days</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </section>
        )}
        
        {gardenPlan.length > 0 && (
            <section id="garden-plan-section" className="bg-white/80 p-6 rounded-xl shadow-md backdrop-blur-sm mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-green-800">Your Suggested Garden Plan</h2>
                    <button
                        onClick={() => handleDownloadPdf('garden-plan-section', 'home-harvest-plan.pdf')}
                        className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Download Plan as PDF
                    </button>
                </div>
                <p className="mb-6 text-gray-600">These beds group plants with similar needs. The timeline is staggered to spread out your planting and harvesting.</p>
                
                <div className="space-y-8">
                    {plannedBeds.map((bed, index) => (
                        <div key={index}>
                            <h3 className="text-xl font-bold text-green-900 mb-2">
                                Bed {index + 1}: <span className="font-medium">{bed.position}</span>
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 -mt-1">
                                <span className="font-semibold">Representative Soil Type:</span> {bed.soil}
                            </p>
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-green-700 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Plant</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Suggested Plant Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Est. Harvest Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bed.plants.map(plant => (
                                            <tr key={plant.name}>
                                                <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{plant.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-orange-600 font-semibold">{plant.suggestedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-green-800 font-semibold">{calculateHarvestDate(plant.suggestedDate, plant.harvest)}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <button onClick={() => handleRemoveFromPlan(plant)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        <section className="bg-white/80 p-6 rounded-xl shadow-md backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-green-800">My Garden Log</h2>
              <button
                onClick={() => handleDownloadPdf('garden-log-table', 'home-harvest-log.pdf')}
                disabled={gardenLog.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Download Log as PDF
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="relative md:col-span-2">
                <label htmlFor="log-plant-name" className="block text-sm font-medium text-gray-700">Plant Name</label>
                <input 
                    id="log-plant-name"
                    type="text" 
                    value={logPlantName}
                    onChange={e => setLogPlantName(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Search for a plant to add..."
                />
                 {logPlantName && plantData.filter(p => p.name.toLowerCase().includes(logPlantName.toLowerCase())).slice(0,5).length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-auto">
                    {plantData.filter(p => p.name.toLowerCase().includes(logPlantName.toLowerCase())).slice(0,5).map(p => (
                      <li key={p.name} className="p-2 hover:bg-green-100 cursor-pointer" onClick={() => setLogPlantName(p.name)}>{p.name}</li>
                    ))}
                  </ul>
                 )}
            </div>
            <div>
                <label htmlFor="log-plant-date" className="block text-sm font-medium text-gray-700">Date Planted</label>
                <input
                    id="log-plant-date"
                    type="date"
                    value={logPlantDate}
                    onChange={e => setLogPlantDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
            </div>
            <button
                onClick={handleAddPlantToLog}
                className="w-full bg-green-600 text-white p-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Add to Log
            </button>
          </div>
          
           <div className="overflow-x-auto">
                <table id="garden-log-table" className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-700 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Plant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date Planted</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Watering Cycle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Est. Harvest Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {gardenLog.length > 0 ? gardenLog.map(entry => (
                            <tr key={entry.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{entry.plant.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{entry.plantedDate.toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">Every {entry.plant.water} days</td>
                                <td className="px-6 py-4 whitespace-nowrap">{calculateHarvestDate(entry.plantedDate, entry.plant.harvest)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Your garden log is empty. Add a plant above!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
           </div>
        </section>

      </main>

      <footer className="text-center p-4 text-sm text-gray-600 mt-8">
        <p>&copy; 2025 Home Harvest. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
