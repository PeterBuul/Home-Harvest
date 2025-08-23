import React, { useState, useMemo } from 'react';

// --- DATA ---
const locations = { "Australia": {"Sydney": "Temperate", "Melbourne": "Temperate", "Brisbane": "Subtropical", "Perth": "Mediterranean"}, "USA": {"New York": "Cold", "Los Angeles": "Mediterranean", "Chicago": "Cold", "Miami": "Tropical"}, "Canada": {"Toronto": "Cold", "Vancouver": "Temperate", "Montreal": "Cold"}, "UK": {"London": "Temperate", "Manchester": "Temperate", "Edinburgh": "Cold"}, "Germany": {"Berlin": "Cold", "Munich": "Cold", "Hamburg": "Temperate"}, "France": {"Paris": "Temperate", "Marseille": "Mediterranean", "Lyon": "Temperate"}, "India": {"Delhi": "Subtropical", "Mumbai": "Tropical", "Bangalore": "Tropical"}, "China": {"Beijing": "Cold", "Shanghai": "Subtropical", "Guangzhou": "Subtropical"}, "Brazil": {"São Paulo": "Subtropical", "Rio de Janeiro": "Tropical", "Brasília": "Tropical"}, "South Africa": {"Johannesburg": "Temperate", "Cape Town": "Mediterranean", "Durban": "Subtropical"}, "New Zealand": {"Auckland": "Temperate", "Wellington": "Temperate", "Christchurch": "Temperate"}, "Japan": {"Tokyo": "Temperate", "Osaka": "Temperate", "Sapporo": "Cold"}, "Russia": {"Moscow": "Cold", "Saint Petersburg": "Cold"}, "Italy": {"Rome": "Mediterranean", "Milan": "Temperate"}, "Spain": {"Madrid": "Mediterranean", "Barcelona": "Mediterranean"}, "Mexico": {"Mexico City": "Temperate", "Cancun": "Tropical"}, "Argentina": {"Buenos Aires": "Temperate"}, "Egypt": {"Cairo": "Hot/Arid"}, "Nigeria": {"Lagos": "Tropical"}, "Indonesia": {"Jakarta": "Tropical"}, };
const plantData = [
    { name: "Tomato", scientific: "Solanum lycopersicum", planting: { "Cold": "Late Spring", "Temperate": "Early Spring", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Early Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.8", harvest: {"Cold": "80-120", "Temperate": "70-100", "Subtropical": "60-90", "Tropical": "60-90", "Mediterranean": "70-100", "Hot/Arid": "75-100"}, water: 3, size: "1.5m H x 0.5m W", spacing: "45-60cm apart" },
    { name: "Carrot", scientific: "Daucus carota", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Loose, sandy, pH 6.0-7.0", harvest: {"Cold": "80-100", "Temperate": "70-90", "Subtropical": "60-80", "Tropical": "60-80", "Mediterranean": "70-90", "Hot/Arid": "75-95"}, water: 4, size: "30cm H x 5cm W", spacing: "5-8cm apart" },
    { name: "Lettuce", scientific: "Lactuca sativa", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "High altitude/Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn/Winter" }, position: "Partial Shade", soil: "Rich, moist, pH 6.0-7.0", harvest: {"Cold": "50-80", "Temperate": "40-70", "Subtropical": "35-60", "Tropical": "35-60", "Mediterranean": "40-70", "Hot/Arid": "45-65"}, water: 2, size: "20cm H x 25cm W", spacing: "20-30cm apart" },
    { name: "Cucumber", scientific: "Cucumis sativus", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Early Spring/Autumn" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: {"Cold": "60-80", "Temperate": "50-70", "Subtropical": "45-65", "Tropical": "45-65", "Mediterranean": "50-70", "Hot/Arid": "55-75"}, water: 2, size: "2m vine", spacing: "1m apart on trellis" },
    { name: "Bell Pepper", scientific: "Capsicum annuum", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Late Summer/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Early Spring/Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.8", harvest: {"Cold": "80-100", "Temperate": "70-90", "Subtropical": "65-85", "Tropical": "65-85", "Mediterranean": "70-90", "Hot/Arid": "75-95"}, water: 3, size: "60cm H x 45cm W", spacing: "45-50cm apart" },
    { name: "Broccoli", scientific: "Brassica oleracea var. italica", planting: { "Cold": "Early Spring", "Temperate": "Late Summer/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, pH 6.0-7.0", harvest: {"Cold": "80-110", "Temperate": "70-100", "Subtropical": "60-90", "Tropical": "N/A", "Mediterranean": "70-100", "Hot/Arid": "75-100"}, water: 4, size: "60cm H x 40cm W", spacing: "45-60cm apart" },
    { name: "Spinach", scientific: "Spinacia oleracea", planting: { "Cold": "Early Spring/Autumn", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "High altitude only", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Well-drained, rich, pH 6.5-7.5", harvest: {"Cold": "45-60", "Temperate": "40-55", "Subtropical": "35-50", "Tropical": "N/A", "Mediterranean": "40-55", "Hot/Arid": "40-55"}, water: 3, size: "20cm H x 15cm W", spacing: "15-20cm apart" },
    { name: "Potato", scientific: "Solanum tuberosum", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Dry Season (high alt.)", "Mediterranean": "Winter/Early Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Acidic, loose, pH 4.8-6.5", harvest: "90-120", water: 5, size: "60cm H x 30cm W", spacing: "30cm apart" },
    { name: "Onion", scientific: "Allium cepa", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Early Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, fertile, pH 6.0-7.0", harvest: "150-240", water: 7, size: "45cm H x 15cm W", spacing: "10-15cm apart" },
    { name: "Garlic", scientific: "Allium sativum", planting: { "Cold": "Autumn", "Temperate": "Autumn", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, sandy loam, pH 6.0-7.0", harvest: "240-270", water: 7, size: "60cm H x 15cm W", spacing: "10-15cm apart" },
    { name: "Zucchini", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Early Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.5", harvest: "45-65", water: 3, size: "60cm H x 1m W", spacing: "1m apart" },
    { name: "Radish", scientific: "Raphanus sativus", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Loose, well-drained, pH 6.0-7.0", harvest: "30-50", water: 2, size: "15cm H x 5cm W", spacing: "5cm apart" },
    { name: "Pea", scientific: "Pisum sativum", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Early Spring", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.5", harvest: "60-80", water: 4, size: "1.8m vine", spacing: "5-10cm apart" },
    { name: "Corn", scientific: "Zea mays", planting: { "Cold": "Late Spring", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: {"Cold": "80-120", "Temperate": "70-100", "Subtropical": "65-90", "Tropical": "65-85", "Mediterranean": "70-100", "Hot/Arid": "75-100"}, water: 4, size: "2.5m H x 45cm W", spacing: "30cm apart in blocks" },
    { name: "Bean", scientific: "Phaseolus vulgaris", planting: { "Cold": "Late Spring", "Temperate": "Spring/Summer", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.0", harvest: "60-90", water: 3, size: "2m vine or 60cm bush", spacing: "10-15cm apart" },
    { name: "Kale", scientific: "Brassica oleracea var. sabellica", planting: { "Cold": "Early Spring/Late Summer", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.5", harvest: "55-75", water: 4, size: "60cm H x 45cm W", spacing: "45cm apart" },
    { name: "Eggplant", scientific: "Solanum melongena", planting: { "Cold": "Late Spring (indoors first)", "Temperate": "Late Spring", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, fertile, pH 5.5-6.5", harvest: {"Cold": "110-130", "Temperate": "100-120", "Subtropical": "90-110", "Tropical": "90-110", "Mediterranean": "100-120", "Hot/Arid": "100-120"}, water: 3, size: "1m H x 60cm W", spacing: "60cm apart" },
    { name: "Sweet Potato", scientific: "Ipomoea batatas", planting: { "Cold": "Not suitable", "Temperate": "Late Spring", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Late Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Sandy, well-drained, pH 5.0-6.5", harvest: "90-120", water: 5, size: "3m vine", spacing: "30-45cm apart" },
    { name: "Pumpkin", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: "90-120", water: 7, size: "5m vine", spacing: "2-3m apart" },
    { name: "Cabbage", scientific: "Brassica oleracea var. capitata", planting: { "Cold": "Early Spring", "Temperate": "Late Summer/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, pH 6.5-7.5", harvest: "70-100", water: 4, size: "40cm H x 60cm W", spacing: "45-60cm apart" },
    { name: "Beetroot", scientific: "Beta vulgaris", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, sandy, pH 6.5-7.5", harvest: "50-70", water: 4, size: "30cm H x 10cm W", spacing: "10cm apart" },
    { name: "Cauliflower", scientific: "Brassica oleracea var. botrytis", planting: { "Cold": "Early Spring", "Temperate": "Late Summer", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.5-7.0", harvest: "50-100", water: 4, size: "60cm H x 60cm W", spacing: "60cm apart" },
    { name: "Turnip", scientific: "Brassica rapa subsp. rapa", planting: { "Cold": "Early Spring/Late Summer", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.5", harvest: "40-60", water: 5, size: "30cm H x 15cm W", spacing: "15cm apart" },
    { name: "Asparagus", scientific: "Asparagus officinalis", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Not ideal", "Tropical": "Not suitable", "Mediterranean": "Winter", "Hot/Arid": "Early Spring" }, position: "Full Sun", soil: "Sandy, well-drained, pH 6.5-7.5", harvest: "730", water: 7, size: "1.5m H x 45cm W", spacing: "45cm apart" },
    { name: "Artichoke", scientific: "Cynara cardunculus var. scolymus", planting: { "Cold": "Spring (indoors first)", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, fertile, pH 6.5-7.0", harvest: "180-200", water: 7, size: "1.5m H x 1.2m W", spacing: "1.2m apart" },
    { name: "Okra", scientific: "Abelmoschus esculentus", planting: { "Cold": "Not suitable", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, rich, pH 6.5-7.5", harvest: "50-65", water: 4, size: "1.8m H x 1m W", spacing: "45-60cm apart" },
    { name: "Celery", scientific: "Apium graveolens", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Partial Shade", soil: "Moist, rich, pH 6.0-7.0", harvest: "85-120", water: 2, size: "60cm H x 30cm W", spacing: "25cm apart" },
    { name: "Leek", scientific: "Allium ampeloprasum", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: "80-120", water: 5, size: "60cm H x 15cm W", spacing: "15cm apart" },
    { name: "Chard", scientific: "Beta vulgaris subsp. cicla", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "All Year", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-7.0", harvest: "50-60", water: 3, size: "60cm H x 45cm W", spacing: "30-45cm apart" },
    { name: "Fennel", scientific: "Foeniculum vulgare", planting: { "Cold": "Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-8.0", harvest: "90-115", water: 5, size: "1.5m H x 30cm W", spacing: "30cm apart" },
    { name: "Strawberry", scientific: "Fragaria × ananassa", planting: { "Cold": "Early Spring", "Temperate": "Late Autumn/Early Spring", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Sandy, acidic, pH 5.5-6.5", harvest: "60-90", water: 2, size: "20cm H x 30cm W", spacing: "30-45cm apart" },
    { name: "Blueberry", scientific: "Vaccinium corymbosum", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Spring", "Subtropical": "Requires low-chill varieties", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Not suitable" }, position: "Full Sun/Partial Shade", soil: "Acidic, well-drained, pH 4.5-5.5", harvest: "365", water: 3, size: "2m H x 1.5m W", spacing: "1.5m apart" },
    { name: "Raspberry", scientific: "Rubus idaeus", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Spring", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.5", harvest: "365", water: 4, size: "1.8m H x 1m W", spacing: "1m apart" },
    { name: "Watermelon", scientific: "Citrullus lanatus", planting: { "Cold": "Late Spring (indoors first)", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Sandy, well-drained, pH 6.0-7.0", harvest: "80-100", water: 5, size: "4m vine", spacing: "2-3m apart" },
    { name: "Cantaloupe", scientific: "Cucumis melo var. cantalupensis", planting: { "Cold": "Late Spring (indoors first)", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Sandy, well-drained, pH 6.0-7.0", harvest: "70-90", water: 5, size: "3m vine", spacing: "1-2m apart" },
    { name: "Grape", scientific: "Vitis vinifera", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Winter", "Tropical": "Not ideal", "Mediterranean": "Winter", "Hot/Arid": "Winter" }, position: "Full Sun", soil: "Deep, well-drained, pH 5.5-7.0", harvest: "730", water: 10, size: "8m vine", spacing: "2-3m apart" },
    { name: "Pineapple", scientific: "Ananas comosus", planting: { "Cold": "Indoors only", "Temperate": "Indoors only", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Spring (in pots)", "Hot/Arid": "Spring (with shade)" }, position: "Full Sun", soil: "Sandy, acidic, well-drained, pH 4.5-5.5", harvest: "540-730", water: 14, size: "1m H x 1m W", spacing: "60cm apart" },
    { name: "Fig", scientific: "Ficus carica", planting: { "Cold": "Spring (in pots)", "Temperate": "Spring", "Subtropical": "Winter", "Tropical": "Not ideal", "Mediterranean": "Winter", "Hot/Arid": "Winter" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.5", harvest: "365", water: 10, size: "5m H x 5m W", spacing: "5m apart" },
    { name: "Pomegranate", scientific: "Punica granatum", planting: { "Cold": "Spring (in pots)", "Temperate": "Spring", "Subtropical": "Spring", "Tropical": "Dry Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, pH 5.5-7.2", harvest: "730", water: 14, size: "4m H x 3m W", spacing: "3-4m apart" },
    { name: "Kiwi", scientific: "Actinidia deliciosa", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Winter", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, fertile, pH 5.0-6.5", harvest: "1095", water: 7, size: "10m vine", spacing: "5m apart" },
    { name: "Basil", scientific: "Ocimum basilicum", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "All Year", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring/Autumn" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: "42-60", water: 2, size: "45cm H x 30cm W", spacing: "30cm apart" },
    { name: "Mint", scientific: "Mentha", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn/Winter", "Tropical": "All Year", "Mediterranean": "Spring/Autumn", "Hot/Arid": "Spring/Autumn (with shade)" }, position: "Partial Shade", soil: "Moist, rich, pH 6.0-7.0", harvest: "60-90", water: 2, size: "45cm H x 1m W (runner)", spacing: "45cm apart (in pots!)" },
    { name: "Rosemary", scientific: "Salvia rosmarinus", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, sandy, pH 6.0-7.0", harvest: "90", water: 14, size: "1.5m H x 1.5m W", spacing: "1.5m apart" },
    { name: "Thyme", scientific: "Thymus vulgaris", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, light, pH 6.0-8.0", harvest: "90", water: 10, size: "20cm H x 30cm W", spacing: "30cm apart" },
    { name: "Parsley", scientific: "Petroselinum crispum", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Rich, moist, pH 6.0-7.0", harvest: "70-90", water: 3, size: "30cm H x 30cm W", spacing: "25cm apart" },
    { name: "Cilantro", scientific: "Coriandrum sativum", planting: { "Cold": "Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Well-drained, pH 6.2-6.8", harvest: "45-70", water: 3, size: "50cm H x 20cm W", spacing: "20cm apart" },
    { name: "Dill", scientific: "Anethum graveolens", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, rich, pH 5.5-6.5", harvest: "40-60", water: 4, size: "1m H x 30cm W", spacing: "25-30cm apart" },
    { name: "Oregano", scientific: "Origanum vulgare", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-8.0", harvest: "80-90", water: 10, size: "45cm H x 45cm W", spacing: "30cm apart" },
    { name: "Chives", scientific: "Allium schoenoprasum", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-7.0", harvest: "60-90", water: 4, size: "30cm H x 30cm W", spacing: "Clumps" },
    { name: "Sage", scientific: "Salvia officinalis", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn/Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.0", harvest: "75", water: 10, size: "60cm H x 60cm W", spacing: "60cm apart" },
    { name: "Lentil", scientific: "Lens culinaris", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained loam, pH 6.0-8.0", harvest: "80-110", water: 7, size: "60cm H x 20cm W", spacing: "5cm apart" },
    { name: "Chickpea", scientific: "Cicer arietinum", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Dry Season", "Mediterranean": "Spring", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Sandy loam, pH 6.0-9.0", harvest: "90-100", water: 7, size: "50cm H x 25cm W", spacing: "10cm apart" },
    { name: "Soybean", scientific: "Glycine max", planting: { "Cold": "Late Spring", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Loam, pH 6.0-6.8", harvest: "70-120", water: 5, size: "1m H x 45cm W", spacing: "10cm apart" },
    { name: "Mung Bean", scientific: "Vigna radiata", planting: { "Cold": "Not suitable", "Temperate": "Late Spring", "Subtropical": "Spring/Summer", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Sandy loam, pH 6.2-7.2", harvest: "60-90", water: 4, size: "60cm H x 30cm W", spacing: "10cm apart" },
    { name: "Adzuki Bean", scientific: "Vigna angularis", planting: { "Cold": "Late Spring", "Temperate": "Late Spring", "Subtropical": "Spring", "Tropical": "Dry Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, pH 5.5-6.5", harvest: "90-120", water: 5, size: "60cm H x 30cm W", spacing: "15cm apart" },
    { name: "Parsnip", scientific: "Pastinaca sativa", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Deep, loose, pH 6.0-7.0", harvest: "120-180", water: 5, size: "45cm H x 10cm W", spacing: "10cm apart" },
    { name: "Rutabaga", scientific: "Brassica napus", planting: { "Cold": "Late Spring", "Temperate": "Late Summer", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.0", harvest: "90-110", water: 4, size: "40cm H x 20cm W", spacing: "20cm apart" },
    { name: "Ginger", scientific: "Zingiber officinale", planting: { "Cold": "Indoors only", "Temperate": "Spring (in pots)", "Subtropical": "Early Spring", "Tropical": "All Year", "Mediterranean": "Spring (in pots)", "Hot/Arid": "Spring (with shade)" }, position: "Partial Shade", soil: "Rich, moist, well-drained, pH 5.5-6.5", harvest: "240-300", water: 3, size: "1m H x 50cm W", spacing: "20cm apart" },
    { name: "Turmeric", scientific: "Curcuma longa", planting: { "Cold": "Indoors only", "Temperate": "Spring (in pots)", "Subtropical": "Early Spring", "Tropical": "All Year", "Mediterranean": "Spring (in pots)", "Hot/Arid": "Spring (with shade)" }, position: "Partial Shade", soil: "Rich, moist, well-drained, pH 6.0-7.8", harvest: "210-300", water: 3, size: "1m H x 50cm W", spacing: "20cm apart" },
    { name: "Horseradish", scientific: "Armoracia rusticana", planting: { "Cold": "Early Spring", "Temperate": "Early Spring/Autumn", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Deep, rich, moist, pH 6.0-7.5", harvest: "365", water: 5, size: "1m H x 60cm W", spacing: "60cm apart" },
    { name: "Arugula", scientific: "Eruca vesicaria", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "All Year", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.0", harvest: "30-40", water: 2, size: "20cm H x 15cm W", spacing: "15cm apart" },
    { name: "Mustard Greens", scientific: "Brassica juncea", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.0-7.5", harvest: "30-40", water: 3, size: "50cm H x 30cm W", spacing: "20cm apart" },
    { name: "Collard Greens", scientific: "Brassica oleracea var. viridis", planting: { "Cold": "Early Spring", "Temperate": "Spring/Late Summer", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, well-drained, pH 6.5-7.5", harvest: "60-75", water: 4, size: "1m H x 60cm W", spacing: "45cm apart" },
    { name: "Bok Choy", scientific: "Brassica rapa subsp. chinensis", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-7.5", harvest: "45-60", water: 2, size: "30cm H x 20cm W", spacing: "20cm apart" },
    { name: "Endive", scientific: "Cichorium endivia", planting: { "Cold": "Late Spring", "Temperate": "Late Summer", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, well-drained, pH 5.5-7.0", harvest: "80-100", water: 4, size: "45cm H x 30cm W", spacing: "30cm apart" },
    { name: "Butternut Squash", scientific: "Cucurbita moschata", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: "80-100", water: 7, size: "4m vine", spacing: "2m apart" },
    { name: "Spaghetti Squash", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.5", harvest: "90-100", water: 7, size: "4m vine", spacing: "2m apart" },
    { name: "Acorn Squash", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: "80-100", water: 7, size: "3m vine", spacing: "1.5m apart" },
    { name: "Delicata Squash", scientific: "Cucurbita pepo", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: "80-100", water: 7, size: "3m vine", spacing: "1.5m apart" },
    { name: "Kabocha Squash", scientific: "Cucurbita maxima", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "Wet Season", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-6.8", harvest: "90-100", water: 7, size: "4m vine", spacing: "2m apart" },
    { name: "Brussels Sprouts", scientific: "Brassica oleracea var. gemmifera", planting: { "Cold": "Early Spring", "Temperate": "Late Spring/Early Summer", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Summer", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, well-drained, pH 6.8", harvest: "90-110", water: 5, size: "1m H x 45cm W", spacing: "60cm apart" },
    { name: "Kohlrabi", scientific: "Brassica oleracea var. gongylodes", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn", "Tropical": "High altitude only", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Fertile, well-drained, pH 6.0-7.5", harvest: "45-60", water: 4, size: "30cm H x 20cm W", spacing: "20cm apart" },
    { name: "Rhubarb", scientific: "Rheum rhabarbarum", planting: { "Cold": "Early Spring", "Temperate": "Autumn/Spring", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, rich, pH 5.5-6.5", harvest: "365", water: 5, size: "1m H x 1m W", spacing: "1m apart" },
    { name: "Tomatillo", scientific: "Physalis philadelphica", planting: { "Cold": "Late Spring", "Temperate": "Spring", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, rich, pH 6.5-7.0", harvest: "75-100", water: 3, size: "1.2m H x 1m W", spacing: "1m apart" },
    { name: "Salsify", scientific: "Tragopogon porrifolius", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Deep, sandy loam, pH 6.0-7.5", harvest: "120-150", water: 6, size: "1m H x 15cm W", spacing: "10cm apart" },
    { name: "Scallion", scientific: "Allium fistulosum", planting: { "Cold": "Early Spring", "Temperate": "Spring/Autumn", "Subtropical": "All Year", "Tropical": "All Year", "Mediterranean": "All Year", "Hot/Arid": "Autumn/Winter" }, position: "Full Sun", soil: "Rich, well-drained, pH 6.0-7.0", harvest: "60-80", water: 4, size: "40cm H", spacing: "5cm apart" },
    { name: "Watercress", scientific: "Nasturtium officinale", planting: { "Cold": "Spring", "Temperate": "Spring/Autumn", "Subtropical": "Autumn/Winter", "Tropical": "Dry Season", "Mediterranean": "Autumn/Winter", "Hot/Arid": "Autumn (in water)" }, position: "Partial Shade (in water)", soil: "Flowing water, pH 6.5-7.5", harvest: "50-60", water: 1, size: "15cm H x 50cm W (runner)", spacing: "20cm apart" },
    { name: "Jerusalem Artichoke", scientific: "Helianthus tuberosus", planting: { "Cold": "Early Spring", "Temperate": "Early Spring", "Subtropical": "Autumn", "Tropical": "Dry Season (high alt.)", "Mediterranean": "Winter", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, pH 6.5-7.5", harvest: "120-150", water: 7, size: "3m H x 1m W", spacing: "45cm apart" },
    { name: "Cardoon", scientific: "Cynara cardunculus", planting: { "Cold": "Spring (indoors first)", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Autumn" }, position: "Full Sun", soil: "Well-drained, fertile, pH 6.5-7.0", harvest: "150-180", water: 7, size: "1.5m H x 1m W", spacing: "1m apart" },
    { name: "Mushroom (Oyster)", scientific: "Pleurotus ostreatus", planting: { "Cold": "Indoors", "Temperate": "Indoors", "Subtropical": "Indoors", "Tropical": "Indoors", "Mediterranean": "Indoors", "Hot/Arid": "Indoors" }, position: "Shade/Indoors", soil: "Substrate (straw, logs)", harvest: "14-21", water: 1, size: "Varies", spacing: "N/A" },
    { name: "Mushroom (Shiitake)", scientific: "Lentinula edodes", planting: { "Cold": "Indoors", "Temperate": "Indoors", "Subtropical": "Indoors", "Tropical": "Indoors", "Mediterranean": "Indoors", "Hot/Arid": "Indoors" }, position: "Shade/Indoors", soil: "Hardwood logs", harvest: "180-365", water: 10, size: "Varies", spacing: "N/A" },
    { name: "Goji Berry", scientific: "Lycium barbarum", planting: { "Cold": "Spring", "Temperate": "Spring", "Subtropical": "Autumn", "Tropical": "Not suitable", "Mediterranean": "Spring", "Hot/Arid": "Spring" }, position: "Full Sun", soil: "Well-drained, pH 6.8-8.1", harvest: "730", water: 14, size: "2.5m H x 2m W", spacing: "1.5m apart" },
    { name: "Elderberry", scientific: "Sambucus nigra", planting: { "Cold": "Spring/Autumn", "Temperate": "Spring/Autumn", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Autumn", "Hot/Arid": "Not suitable" }, position: "Full Sun/Partial Shade", soil: "Moist, well-drained, pH 5.5-6.5", harvest: "730", water: 7, size: "4m H x 4m W", spacing: "4m apart" },
    { name: "Blackcurrant", scientific: "Ribes nigrum", planting: { "Cold": "Spring/Autumn", "Temperate": "Autumn", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-7.0", harvest: "365", water: 5, size: "1.5m H x 1.5m W", spacing: "1.5m apart" },
    { name: "Gooseberry", scientific: "Ribes uva-crispa", planting: { "Cold": "Spring/Autumn", "Temperate": "Autumn", "Subtropical": "Not suitable", "Tropical": "Not suitable", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun/Partial Shade", soil: "Rich, well-drained, pH 6.0-6.5", harvest: "365", water: 5, size: "1m H x 1m W", spacing: "1m apart" },
    { name: "Passion Fruit", scientific: "Passiflora edulis", planting: { "Cold": "Indoors", "Temperate": "Spring (pots)", "Subtropical": "Spring/Autumn", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring (with care)" }, position: "Full Sun", soil: "Well-drained, rich, pH 6.5-7.5", harvest: "240-365", water: 4, size: "8m vine", spacing: "3m apart" },
    { name: "Guava", scientific: "Psidium guajava", planting: { "Cold": "Not suitable", "Temperate": "Not suitable", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, pH 5.0-7.0", harvest: "730", water: 7, size: "5m H x 4m W", spacing: "5m apart" },
    { name: "Mango", scientific: "Mangifera indica", planting: { "Cold": "Not suitable", "Temperate": "Not suitable", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, pH 5.5-7.5", harvest: "1095", water: 10, size: "10m+ H x 8m W", spacing: "8-10m apart" },
    { name: "Papaya", scientific: "Carica papaya", planting: { "Cold": "Not suitable", "Temperate": "Not suitable", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Not suitable", "Hot/Arid": "Not suitable" }, position: "Full Sun", soil: "Well-drained, rich, pH 5.5-6.5", harvest: "270-330", water: 4, size: "4m H x 2m W", spacing: "2-3m apart" },
    { name: "Avocado", scientific: "Persea americana", planting: { "Cold": "Not suitable", "Temperate": "Spring (pots)", "Subtropical": "Spring", "Tropical": "All Year", "Mediterranean": "Spring", "Hot/Arid": "Spring (with care)" }, position: "Full Sun", soil: "Well-drained, pH 6.0-6.5", harvest: "1825", water: 14, size: "10m+ H x 8m W", spacing: "8-10m apart" },
];

const logoSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsMi41QzM1LDIuNSwyNSwxNSwyNSwyNSBjMCwxMCwxMCwzNSwzNSwzNVM4NSwzNSw4NSwyNEM4NSwxNSw2NSwyLjUsNTAsMi41ek01MCw0MCBDNDAuMDM4LDQwLDMyLjUsNDcuNTM4LDMyLjUsNTcuNUMzMi41LDY3LjQ2Miw0MC4wMzgsNzUsNTAsNzUgUzY3LjUsNjcuNDYyLDY3LjUsNTcuNUM2Ny41LDQ3LjUzOCw1OS45NjIsNDAsNTAsNDB6IiBmaWxsPSIjMkU1NzIyIj48L3BhdGgPjxwYXRoIGQ9Ik01MCwzMi41Yy0xMi40MjUsMC0yMi41LDEwLjA3NS0yMi41LDIyLjVjMCwxMi40MjUsMTAuMDc1LDIyLjUsMjIuNSwyMi41czIyLjUtMTAuMDc1LDIyLjUtMjIuNSBDNzIuNSw0Mi41NzUsNjIuNDI1LDMyLjUsNTAsMzIuNXoiIGZpbGw9IiM2Q0E4NDYiPjwvcGF0aD48cGF0aCBkPSJNNTAsMy43NWMxMi4xMjYsMCwyMS44NzUsOS43NDksMjEuODc1LDIxLjg3NVM2Mi4xMjYsNDcuNSw1MCw0Ny41cy0yMS44NzUtOS43NDktMjEuODc1LTIxLjg3NSBTMzcuODc0LDMuNzUsNTAsMy43NXoiIGZpbGw9IiM2Q0E4NDYiPjxwYXRoIGQ9Ik01MS4yNSw2Mi41SDQ4Ljc1Yy01LjUyMywwLTEwLTQuNDc3LTEwLTEwYzAtMi43NjEsMS4xMi01LjI2MSwyLjkzLTcuMDdDNDAuODgsNDQuNTcsNDAsNDMuMDcsNDAsNDEuMjUgYzAtMi4wNzEsMS42NzktMy43NSwzLjc1LTMuNzVjMS4wMzYsMCwxLjk3NCwwLjQyLDIuNjUyLDEuMTAxQzQ3LjA3NiwzOC4xODEsNDguNDY0LDM3LjUsNTAsMzcuNSBjMS4yNDEsMCwyLjM4LDAuNTE5LDMuMjAxLDEuMzM3QzUzLjg4NSwzOC4yMDQsNTQuNjc0LDM3LjUsNTUuNjI1LDM3LjVjMi4wNzEsMCwzLjc1LDEuNjc5LDMuNzUsMy43NSBjMCwxLjM0MS0wLjcxNSwyLjUzOS0xLjc5NywzLjE5MUM1OS4xMTUsNDguNDc0LDYwLDQ5LjY1OSw2MCw1MS4yNSIgZmlsbD0iI0ZGRiI+PC9wYXRoPjwvc3ZnPg==";
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
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const bedElements = document.querySelectorAll('.garden-bed');
    if (bedElements.length === 0) return;

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageW - margin * 2;
    
    pdf.addImage(logoSvg, 'SVG', margin, margin, 20, 20);
    pdf.setFontSize(22);
    pdf.text('Home Harvest Plan', pageW / 2, margin + 15, { align: 'center' });

    const promises = Array.from(bedElements).map(bed => 
      window.html2canvas(bed, { 
        scale: 2,
        onclone: (doc) => {
            doc.querySelector(`[data-bed-id="${bed.dataset.bedId}"] .action-header`).style.display = 'none';
            doc.querySelector(`[data-bed-id="${bed.dataset.bedId}"] .notes-header`).style.display = 'table-cell';
            doc.querySelectorAll(`[data-bed-id="${bed.dataset.bedId}"] .action-cell`).forEach(c => c.style.display = 'none');
            doc.querySelectorAll(`[data-bed-id="${bed.dataset.bedId}"] .notes-cell`).forEach(c => {
                c.style.display = 'table-cell';
                c.style.border = '1px solid #eee';
            });
        }
      })
    );
  
    let cursorY = margin + 30;
    Promise.all(promises).then(canvases => {
        canvases.forEach((canvas) => {
            const imgHeight = canvas.height * contentWidth / canvas.width;
            if (cursorY + imgHeight > pageH - margin) {
                pdf.addPage();
                cursorY = margin;
            }
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, cursorY, contentWidth, imgHeight);
            cursorY += imgHeight + 8;
        });
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
                    <div className="flex justify-between items-center mb-4">
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
