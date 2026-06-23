/**
 * Minimal seed data - just enough info to query external APIs.
 * All descriptions, ratings, currencies, images etc. are fetched from real-time APIs.
 */
export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  coordinates: { lat: number; lng: number };
}

export const continents = [
  "Asia",
  "Africa",
  "Europe",
  "North America",
  "South America",
  "Australia/Oceania",
  "Antarctica",
];

/**
 * Lightweight seed list of world-famous destinations.
 * Enriched in real-time by: REST Countries API, Open-Meteo, Unsplash, OpenTripMap.
 */
export const destinations: Destination[] = [
  { id: "eiffel-tower", name: "Eiffel Tower", country: "France", continent: "Europe", coordinates: { lat: 48.8584, lng: 2.2945 } },
  { id: "great-wall", name: "Great Wall of China", country: "China", continent: "Asia", coordinates: { lat: 40.4319, lng: 116.5704 } },
  { id: "taj-mahal", name: "Taj Mahal", country: "India", continent: "Asia", coordinates: { lat: 27.1751, lng: 78.0421 } },
  { id: "machu-picchu", name: "Machu Picchu", country: "Peru", continent: "South America", coordinates: { lat: 13.1631, lng: -72.545 } },
  { id: "sydney-opera", name: "Sydney Opera House", country: "Australia", continent: "Australia/Oceania", coordinates: { lat: -33.8568, lng: 151.2153 } },
  { id: "pyramids-giza", name: "Pyramids of Giza", country: "Egypt", continent: "Africa", coordinates: { lat: 29.9792, lng: 31.1342 } },
  { id: "grand-canyon", name: "Grand Canyon", country: "United States", continent: "North America", coordinates: { lat: 36.1069, lng: -112.1129 } },
  { id: "colosseum", name: "Colosseum", country: "Italy", continent: "Europe", coordinates: { lat: 41.8902, lng: 12.4922 } },
  { id: "bora-bora", name: "Bora Bora", country: "French Polynesia", continent: "Australia/Oceania", coordinates: { lat: -16.5004, lng: -151.7415 } },
  { id: "santorini", name: "Santorini", country: "Greece", continent: "Europe", coordinates: { lat: 36.3932, lng: 25.4615 } },
  { id: "niagara-falls", name: "Niagara Falls", country: "Canada", continent: "North America", coordinates: { lat: 43.0828, lng: -79.0742 } },
  { id: "christ-redeemer", name: "Christ the Redeemer", country: "Brazil", continent: "South America", coordinates: { lat: -22.9519, lng: -43.2105 } },
  { id: "mount-fuji", name: "Mount Fuji", country: "Japan", continent: "Asia", coordinates: { lat: 35.3606, lng: 138.7274 } },
  { id: "balis-beaches", name: "Bali", country: "Indonesia", continent: "Asia", coordinates: { lat: -8.3405, lng: 115.092 } },
  { id: "serengeti", name: "Serengeti National Park", country: "Tanzania", continent: "Africa", coordinates: { lat: -2.3333, lng: 34.8333 } },
  { id: "petra", name: "Petra", country: "Jordan", continent: "Asia", coordinates: { lat: 30.3285, lng: 35.4444 } },
  { id: "iceland-northern-lights", name: "Northern Lights - Iceland", country: "Iceland", continent: "Europe", coordinates: { lat: 64.1466, lng: -21.9426 } },
  { id: "angkor-wat", name: "Angkor Wat", country: "Cambodia", continent: "Asia", coordinates: { lat: 13.4125, lng: 103.867 } },
  { id: "venice-canals", name: "Venice", country: "Italy", continent: "Europe", coordinates: { lat: 45.4408, lng: 12.3155 } },
  { id: "maldives", name: "Maldives", country: "Maldives", continent: "Asia", coordinates: { lat: 3.2028, lng: 73.2207 } },
  { id: "statue-liberty", name: "Statue of Liberty", country: "United States", continent: "North America", coordinates: { lat: 40.6892, lng: -74.0445 } },
  { id: "dubai-burj", name: "Burj Khalifa", country: "United Arab Emirates", continent: "Asia", coordinates: { lat: 25.1972, lng: 55.2744 } },
  { id: "amazon-rainforest", name: "Amazon Rainforest", country: "Brazil", continent: "South America", coordinates: { lat: -3.4653, lng: -62.2159 } },
  { id: "sagrada-familia", name: "Sagrada Familia", country: "Spain", continent: "Europe", coordinates: { lat: 41.4036, lng: 2.1744 } },
  { id: "banff-national-park", name: "Banff National Park", country: "Canada", continent: "North America", coordinates: { lat: 51.4968, lng: -115.9281 } },
];