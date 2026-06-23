/**
 * Server-side API service that integrates with multiple open-source/real-time APIs:
 * - REST Countries API (https://restcountries.com) - free, no API key
 * - Open-Meteo API (https://open-meteo.com) - free, no API key, realtime sunrise/sunset
 * - UNESCO World Heritage API via Wikipedia - free data on heritage sites
 */

const REST_COUNTRIES_BASE = "https://restcountries.com/v3.1";
const OPEN_METEO_BASE = "https://api.open-meteo.com/v1";
const WIKIPEDIA_BASE = "https://en.wikipedia.org/api/rest_v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CountryInfo {
  capital?: string;
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  flagEmoji?: string;
  flagUrl?: string;
  timezones?: string[];
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  borders?: string[];
  mapUrl?: string;
}

export interface SunData {
  sunrise: string;
  sunset: string;
  timezone: string;
  dayLength: string;
  isDay: boolean;
  sunPosition: number; // 0-100 percentage across the sky
}

export interface UnescoSite {
  name: string;
  country: string;
  image?: string;
  description?: string;
  year?: number;
  category?: string;
}

export interface EnrichedDestination {
  id: string;
  name: string;
  country: string;
  continent: string;
  coordinates: { lat: number; lng: number };
  description: string;
  longDescription: string;
  image: string;
  rating: number;
  bestTimeToVisit: string;
  currency: string;
  language: string;
  highlights: string[];
  countryInfo: CountryInfo | null;
  sunData: SunData | null;
  unesco: UnescoSite | null;
}

// ─── Fallback rich data ──────────────────────────────────────────────────────

const FALLBACK_DATA: Record<string, Partial<EnrichedDestination>> = {
  "eiffel-tower": {
    description: "Iconic iron lattice tower on the Champ de Mars in Paris, one of the most famous landmarks in the world.",
    longDescription: "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. Constructed from 1887 to 1889 as the entrance to the 1889 World's Fair, it has become a global cultural icon of France and one of the most recognizable structures in the world.",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10cec3f4?w=800&h=600&fit=crop",
    rating: 4.7, bestTimeToVisit: "June to August or September to October", currency: "Euro (EUR)", language: "French",
    highlights: ["Summit View", "Champ de Mars", "Night Light Show", "Dining at 58 Tour Eiffel"],
  },
  "great-wall": {
    description: "Ancient series of walls and fortifications stretching across northern China, built over centuries.",
    longDescription: "The Great Wall of China is a series of fortifications built across the historical northern borders of ancient Chinese states and Imperial China as protection against various nomadic groups. Several walls were built from as early as the 7th century BC, with selective stretches later joined together by the first Emperor of China, Qin Shi Huang.",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop",
    rating: 4.8, bestTimeToVisit: "April to May or September to November", currency: "Chinese Yuan (CNY)", language: "Mandarin Chinese",
    highlights: ["Mutianyu Section", "Badaling Section", "Jinshanling", "Simatai Night Tour"],
  },
  "taj-mahal": {
    description: "Stunning white marble mausoleum in Agra, a UNESCO World Heritage site and symbol of love.",
    longDescription: "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the Yamuna river in Agra, Uttar Pradesh, India. It was commissioned in 1631 by the fifth Mughal emperor, Shah Jahan, to house the tomb of his beloved wife Mumtaz Mahal. It is widely recognized as 'the jewel of Muslim art in India'.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop",
    rating: 4.8, bestTimeToVisit: "October to March", currency: "Indian Rupee (INR)", language: "Hindi, English",
    highlights: ["Main Mausoleum", "Yamuna River View", "Mehtab Bagh", "Sunrise View"],
  },
  "machu-picchu": {
    description: "15th-century Inca citadel set high in the Andes Mountains above the Urubamba Valley.",
    longDescription: "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-meter mountain ridge. It is the most familiar icon of Inca civilization. Often referred to as the 'Lost City of the Incas', it is one of the most famous archaeological sites in the world.",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop",
    rating: 4.9, bestTimeToVisit: "April to October (Dry season)", currency: "Peruvian Sol (PEN)", language: "Spanish, Quechua",
    highlights: ["Huayna Picchu", "Sun Gate", "Temple of the Sun", "Inca Bridge"],
  },
  "sydney-opera": {
    description: "World-famous multi-venue performing arts centre on Sydney Harbour with distinctive sail-like roof.",
    longDescription: "The Sydney Opera House is a multi-venue performing arts centre in Sydney, New South Wales, Australia. It is one of the 20th century's most famous and distinctive buildings. Designed by Danish architect Jørn Utzon, the building was formally opened on 20 October 1973.",
    image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=800&h=600&fit=crop",
    rating: 4.6, bestTimeToVisit: "September to November or March to May", currency: "Australian Dollar (AUD)", language: "English",
    highlights: ["Guided Tours", "Opera Performances", "Harbour Bridge View", "Royal Botanic Garden"],
  },
  "pyramids-giza": {
    description: "Ancient pyramid complexes on the Giza plateau, the last surviving Wonder of the Ancient World.",
    longDescription: "The Great Pyramid of Giza is the oldest and largest of the three pyramids in the Giza pyramid complex bordering present-day Giza in Greater Cairo, Egypt. It is the oldest of the Seven Wonders of the Ancient World, and the only one to remain largely intact.",
    image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&h=600&fit=crop",
    rating: 4.7, bestTimeToVisit: "October to April", currency: "Egyptian Pound (EGP)", language: "Arabic",
    highlights: ["Great Sphinx", "Solar Boat Museum", "Camel Ride", "Sound and Light Show"],
  },
  "grand-canyon": {
    description: "Steep-sided canyon carved by the Colorado River in Arizona, one of the world's most famous natural wonders.",
    longDescription: "The Grand Canyon is a steep-sided canyon carved by the Colorado River in Arizona, United States. The Grand Canyon is 277 miles long, up to 18 miles wide and attains a depth of over a mile. It is one of the world's most famous natural wonders.",
    image: "https://images.unsplash.com/photo-1506903789192-9108654681c1?w=800&h=600&fit=crop",
    rating: 4.8, bestTimeToVisit: "March to May or September to November", currency: "US Dollar (USD)", language: "English",
    highlights: ["South Rim", "North Rim", "Colorado River Rafting", "Skywalk"],
  },
  "colosseum": {
    description: "Ancient Roman amphitheatre in the centre of Rome, the largest ever built in the Roman Empire.",
    longDescription: "The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy. Built of travertine limestone, tuff, and brick-faced concrete, it is the largest amphitheatre ever built. Construction began under the emperor Vespasian in AD 72 and was completed in AD 80.",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&h=600&fit=crop",
    rating: 4.6, bestTimeToVisit: "March to May or October to November", currency: "Euro (EUR)", language: "Italian",
    highlights: ["Arena Floor", "Underground Chambers", "Roman Forum", "Palatine Hill"],
  },
  "bora-bora": {
    description: "Tropical paradise island with crystal-clear turquoise waters and luxurious overwater bungalows.",
    longDescription: "Bora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus and a turquoise lagoon protected by a coral reef, it is known for its scuba diving and luxury resorts.",
    image: "https://images.unsplash.com/photo-1540202404-1aa9270f2cc6?w=800&h=600&fit=crop",
    rating: 4.9, bestTimeToVisit: "May to October (Dry season)", currency: "CFP Franc (XPF)", language: "French, Tahitian",
    highlights: ["Matira Beach", "Lagoon Snorkeling", "Shark and Ray Feeding", "Mount Otemanu"],
  },
  "santorini": {
    description: "Stunning volcanic island in the Cyclades group with iconic white-washed buildings and blue domes.",
    longDescription: "Santorini is a volcanic island in the Cyclades group of the Greek islands. It is known for its dramatic views, stunning sunsets, white-washed buildings with blue domes, and its very own active volcano.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
    rating: 4.7, bestTimeToVisit: "May to October", currency: "Euro (EUR)", language: "Greek",
    highlights: ["Oia Sunset", "Blue Domes", "Red Beach", "Wine Tasting"],
  },
  "niagara-falls": {
    description: "Massive waterfall system on the border of Canada and the USA, one of the most powerful in North America.",
    longDescription: "Niagara Falls is a group of three waterfalls at the southern end of Niagara Gorge, spanning the border between the province of Ontario in Canada and the state of New York in the United States.",
    image: "https://images.unsplash.com/photo-1562832135-14a35d25edef?w=800&h=600&fit=crop",
    rating: 4.6, bestTimeToVisit: "June to August or September to October", currency: "Canadian Dollar (CAD) / US Dollar (USD)", language: "English, French",
    highlights: ["Horseshoe Falls", "Maid of the Mist", "Journey Behind the Falls", "Night Illumination"],
  },
  "mount-fuji": {
    description: "Japan's tallest peak and an active volcano, a cultural symbol and UNESCO World Heritage site.",
    longDescription: "Mount Fuji is an active volcano located on the island of Honshu, Japan. It is the highest mountain in Japan, standing at 3,776 meters. Mount Fuji is a symbol of Japan and has been a subject of art and literature for centuries.",
    image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop",
    rating: 4.8, bestTimeToVisit: "July to August (Climbing season)", currency: "Japanese Yen (JPY)", language: "Japanese",
    highlights: ["Fifth Station", "Fuji Five Lakes", "Hakone", "Chureito Pagoda"],
  },
  "christ-redeemer": {
    description: "Iconic Art Deco statue of Jesus Christ atop Mount Corcovado overlooking Rio de Janeiro.",
    longDescription: "Christ the Redeemer is an Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil. The statue stands 30 meters tall on a pedestal of about 8 meters, atop Mount Corcovado in the Tijuca Forest National Park.",
    image: "https://images.unsplash.com/photo-1573152143244-36794ad6f5ab?w=800&h=600&fit=crop",
    rating: 4.6, bestTimeToVisit: "March to May or September to October", currency: "Brazilian Real (BRL)", language: "Portuguese",
    highlights: ["Corcovado Mountain", "Tijuca Forest", "Sugarloaf Mountain", "Copacabana Beach"],
  },
  "balis-beaches": {
    description: "Tropical paradise island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
    longDescription: "Bali is a province of Indonesia and an island of the Lesser Sunda Islands. Known as the 'Island of the Gods', Bali is famous for its unique Hindu culture, stunning beaches, terraced rice paddies, volcanic mountains, and vibrant arts scene.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
    rating: 4.7, bestTimeToVisit: "April to October (Dry season)", currency: "Indonesian Rupiah (IDR)", language: "Indonesian, Balinese",
    highlights: ["Ubud Monkey Forest", "Tanah Lot Temple", "Tegallalang Rice Terraces", "Seminyak Beach"],
  },
  "serengeti": {
    description: "Vast ecosystem in northern Tanzania famous for the Great Migration of wildebeest and zebra.",
    longDescription: "The Serengeti National Park is a large national park in northern Tanzania that stretches over 14,763 km². It is famous for the annual migration of over 1.5 million wildebeest and hundreds of thousands of zebra.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop",
    rating: 4.9, bestTimeToVisit: "June to October (Dry season)", currency: "Tanzanian Shilling (TZS)", language: "Swahili, English",
    highlights: ["Great Migration", "Big Five Safari", "Ngorongoro Crater", "Hot Air Balloon Safari"],
  },
  "petra": {
    description: "Ancient Nabataean city carved into red rock cliffs, one of the New Seven Wonders of the World.",
    longDescription: "Petra is a historic and archaeological city in southern Jordan. Famous for its rock-cut architecture and water conduit system, Petra is called the 'Rose City' because of the colour of the stone from which it is carved.",
    image: "https://images.unsplash.com/photo-1579606032821-3d5b40b07bdf?w=800&h=600&fit=crop",
    rating: 4.7, bestTimeToVisit: "March to May or September to November", currency: "Jordanian Dinar (JOD)", language: "Arabic",
    highlights: ["Treasury", "Monastery", "Siq Canyon", "Royal Tombs"],
  },
  "iceland-northern-lights": {
    description: "Spectacular natural light display in the Icelandic sky, also known as Aurora Borealis.",
    longDescription: "The Northern Lights, or Aurora Borealis, are a natural light display in the Earth's sky, predominantly seen in high-latitude regions around the Arctic. Iceland is one of the best places in the world to witness this spectacular phenomenon.",
    image: "https://images.unsplash.com/photo-1543699565-003b8add5d62?w=800&h=600&fit=crop",
    rating: 4.9, bestTimeToVisit: "September to March (Winter)", currency: "Icelandic Króna (ISK)", language: "Icelandic",
    highlights: ["Reykjavik Tours", "Blue Lagoon", "Golden Circle", "Glacier Hiking"],
  },
  "angkor-wat": {
    description: "Massive temple complex in Siem Reap, the largest religious monument in the world.",
    longDescription: "Angkor Wat is a temple complex in Cambodia and the largest religious monument in the world, on a site measuring 162.6 hectares. Originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire.",
    image: "https://images.unsplash.com/photo-1579513141590-c597876aef67?w=800&h=600&fit=crop",
    rating: 4.8, bestTimeToVisit: "November to March (Cool and dry season)", currency: "Cambodian Riel (KHR)", language: "Khmer",
    highlights: ["Sunrise at Angkor Wat", "Bayon Temple", "Ta Prohm", "Angkor Thom"],
  },
  "venice-canals": {
    description: "Romantic floating city built on over 100 small islands, famous for its canals and gondola rides.",
    longDescription: "Venice is a city in northeastern Italy and the capital of the Veneto region. It is built on a group of 118 small islands separated by canals and linked by over 400 bridges. Venice is famous for its beautiful architecture and art.",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop",
    rating: 4.6, bestTimeToVisit: "April to June or September to October", currency: "Euro (EUR)", language: "Italian",
    highlights: ["Grand Canal", "St. Mark's Square", "Rialto Bridge", "Gondola Ride"],
  },
  "maldives": {
    description: "Tropical island nation in the Indian Ocean known for its overwater bungalows and crystal-clear waters.",
    longDescription: "The Maldives is an archipelagic country in the Indian Ocean, located in the Arabian Sea. It consists of 26 atolls made up of over 1,000 coral islands. Known for its stunning white-sand beaches and luxurious overwater bungalows.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop",
    rating: 4.9, bestTimeToVisit: "November to April (Dry season)", currency: "Maldivian Rufiyaa (MVR)", language: "Dhivehi",
    highlights: ["Overwater Bungalows", "Snorkeling", "Diving at Banana Reef", "Sunset Cruises"],
  },
  "statue-liberty": {
    description: "Iconic neoclassical sculpture on Liberty Island in New York Harbor, a symbol of freedom.",
    longDescription: "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City. Designed by Frédéric Auguste Bartholdi and dedicated on October 28, 1886, the statue was a gift from the people of France to the United States.",
    image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=800&h=600&fit=crop",
    rating: 4.6, bestTimeToVisit: "April to October", currency: "US Dollar (USD)", language: "English",
    highlights: ["Crown Access", "Liberty Island Museum", "Ellis Island", "Battery Park View"],
  },
  "dubai-burj": {
    description: "Tallest building in the world, located in Dubai with breathtaking skyline views.",
    longDescription: "The Burj Khalifa is the tallest building in the world, standing at 828 meters. Located in downtown Dubai, it is a global icon of modern architecture and engineering. The building features observation decks, luxury residences, and the Armani Hotel.",
    image: "https://images.unsplash.com/photo-1582673945887-f2499e1f44b4?w=800&h=600&fit=crop",
    rating: 4.7, bestTimeToVisit: "November to March (Winter)", currency: "UAE Dirham (AED)", language: "Arabic, English",
    highlights: ["At the Top Observatory", "Dubai Mall", "Dubai Fountain", "Sky Views Dubai"],
  },
  "amazon-rainforest": {
    description: "Vast tropical rainforest spanning multiple South American countries, the world's largest rainforest.",
    longDescription: "The Amazon rainforest, also called Amazon jungle, is a moist broadleaf tropical rainforest in the Amazon biome that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 km², of which 6,000,000 km² are covered by the rainforest.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop",
    rating: 4.8, bestTimeToVisit: "June to November (Dry season)", currency: "Multiple currencies", language: "Multiple languages",
    highlights: ["River Cruises", "Jungle Trekking", "Wildlife Spotting", "Meeting Indigenous Communities"],
  },
  "sagrada-familia": {
    description: "Antoni Gaudí's unfinished masterpiece basilica in Barcelona, a UNESCO World Heritage site.",
    longDescription: "The Sagrada Familia is a large unfinished Roman Catholic minor basilica in Barcelona, Catalonia, Spain. Designed by the renowned architect Antoni Gaudí, it combines Gothic and Art Nouveau styles with his own unique architectural vision.",
    image: "https://images.unsplash.com/photo-1542652694-40abf526446e?w=800&h=600&fit=crop",
    rating: 4.7, bestTimeToVisit: "March to May or September to November", currency: "Euro (EUR)", language: "Spanish, Catalan",
    highlights: ["Nativity Facade", "Passion Facade", "Tower Climb", "Interior Columns"],
  },
  "banff-national-park": {
    description: "Canada's oldest national park in the Rocky Mountains, known for turquoise lakes and mountain scenery.",
    longDescription: "Banff National Park is Canada's oldest national park, established in 1885 in the Rocky Mountains. The park encompasses 6,641 km² of mountainous terrain, with numerous glaciers, ice fields, and dense coniferous forests.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    rating: 4.9, bestTimeToVisit: "June to August or December to March", currency: "Canadian Dollar (CAD)", language: "English, French",
    highlights: ["Lake Louise", "Moraine Lake", "Icefields Parkway", "Banff Gondola"],
  },
};

// ─── UNESCO via Wikipedia API ─────────────────────────────────────────────────

const UNESCO_WIKI_MAP: Record<string, string> = {
  "eiffel-tower": "Eiffel Tower",
  "great-wall": "Great Wall of China",
  "taj-mahal": "Taj Mahal",
  "machu-picchu": "Machu Picchu",
  "sydney-opera": "Sydney Opera House",
  "pyramids-giza": "Pyramids of Giza",
  "grand-canyon": "Grand Canyon",
  "colosseum": "Colosseum",
  "mount-fuji": "Mount Fuji",
  "petra": "Petra",
  "angkor-wat": "Angkor Wat",
  "statue-liberty": "Statue of Liberty",
  "sagrada-familia": "Sagrada Família",
  "venice-canals": "Venice",
  "christ-redeemer": "Christ the Redeemer (statue)",
};

export async function fetchUnescoSite(id: string, name: string): Promise<UnescoSite | null> {
  const wikiTitle = UNESCO_WIKI_MAP[id] || name;
  if (!wikiTitle) return null;

  try {
    // Get Wikipedia extract + image
    const res = await fetch(
      `${WIKIPEDIA_BASE}/page/summary/${encodeURIComponent(wikiTitle)}`,
      { signal: AbortSignal.timeout(5000), next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();

    return {
      name: data.title || name,
      country: "",
      image: data.thumbnail?.source || undefined,
      description: data.extract?.split(".")[0] + "." || undefined,
      year: undefined,
      category: "UNESCO World Heritage Site",
    };
  } catch {
    return null;
  }
}

// ─── REST Countries API ───────────────────────────────────────────────────────

export async function fetchCountryInfo(countryName: string): Promise<CountryInfo | null> {
  try {
    const clean = countryName.split("/")[0].trim();
    const res = await fetch(
      `${REST_COUNTRIES_BASE}/name/${encodeURIComponent(clean)}?fullText=true`,
      { signal: AbortSignal.timeout(5000), next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      const res2 = await fetch(
        `${REST_COUNTRIES_BASE}/name/${encodeURIComponent(clean)}`,
        { signal: AbortSignal.timeout(5000), next: { revalidate: 3600 } }
      );
      if (!res2.ok) return null;
      const d = await res2.json();
      if (!d?.[0]) return null;
      return mapCountry(d[0]);
    }
    const data = await res.json();
    if (!data?.[0]) return null;
    return mapCountry(data[0]);
  } catch {
    return null;
  }
}

function mapCountry(data: any): CountryInfo {
  const currencies = data.currencies
    ? Object.fromEntries(
        Object.entries(data.currencies).map(([code, info]: [string, any]) => [
          code, { name: info.name, symbol: info.symbol || "" },
        ])
      )
    : undefined;
  return {
    capital: data.capital?.[0],
    region: data.region,
    subregion: data.subregion,
    population: data.population,
    area: data.area,
    flagEmoji: data.flag,
    flagUrl: data.flags?.svg || data.flags?.png,
    timezones: data.timezones,
    currencies,
    languages: data.languages,
    borders: data.borders,
    mapUrl: data.maps?.googleMaps,
  };
}

// ─── Open-Meteo Sunrise/Sunset API ────────────────────────────────────────────

export async function fetchSunData(lat: number, lng: number): Promise<SunData | null> {
  try {
    const res = await fetch(
      `${OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lng}&daily=sunrise,sunset&timezone=auto&forecast_days=1&current_weather=true`,
      { signal: AbortSignal.timeout(5000), next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.daily) return null;

    const sunrise = data.daily.sunrise?.[0];
    const sunset = data.daily.sunset?.[0];
    if (!sunrise || !sunset) return null;

    const now = new Date();
    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);
    const isDay = now >= sunriseDate && now <= sunsetDate;

    // Calculate sun position percentage across the sky (0=left, 100=right)
    let sunPosition = 50;
    if (isDay) {
      const dayMs = sunsetDate.getTime() - sunriseDate.getTime();
      const elapsedMs = now.getTime() - sunriseDate.getTime();
      sunPosition = Math.min(100, Math.max(0, (elapsedMs / dayMs) * 100));
    } else if (now < sunriseDate) {
      // Before sunrise - moon is in the sky
      const nightMs = now.getTime() - sunsetDate.getTime();
      sunPosition = Math.min(50, Math.max(0, (nightMs / (24 * 3600000)) * 50));
    }

    const diffMs = sunsetDate.getTime() - sunriseDate.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);

    return {
      sunrise: sunriseDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      sunset: sunsetDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      timezone: data.timezone || "UTC",
      dayLength: `${hours}h ${minutes}m`,
      isDay,
      sunPosition,
    };
  } catch {
    return null;
  }
}

// ─── Enrichment Pipeline ──────────────────────────────────────────────────────

export async function enrichDestination(
  seed: { id: string; name: string; country: string; continent: string; coordinates: { lat: number; lng: number } }
): Promise<EnrichedDestination> {
  const fallback = FALLBACK_DATA[seed.id] || {
    description: `${seed.name} in ${seed.country} - a must-visit destination in ${seed.continent}.`,
    longDescription: `${seed.name} is one of the most remarkable destinations in ${seed.continent}, located in ${seed.country}. This iconic location attracts millions of visitors from around the world.`,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    rating: 4.5,
    bestTimeToVisit: "Year-round",
    currency: "Local currency",
    language: "Local language",
    highlights: ["Guided Tours", "Scenic Views", "Cultural Experience", "Photography"],
  };

  const [countryInfo, sunData, unesco] = await Promise.all([
    fetchCountryInfo(seed.country),
    fetchSunData(seed.coordinates.lat, seed.coordinates.lng),
    fetchUnescoSite(seed.id, seed.name),
  ]);

  return {
    id: seed.id,
    name: seed.name,
    country: seed.country,
    continent: seed.continent,
    coordinates: seed.coordinates,
    description: fallback.description || `${seed.name} - A top destination in ${seed.country}.`,
    longDescription: fallback.longDescription || `${seed.name} is located in ${seed.country} (${seed.continent}).`,
    image: fallback.image || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    rating: fallback.rating || 4.5,
    bestTimeToVisit: fallback.bestTimeToVisit || "Year-round",
    currency: countryInfo?.currencies
      ? Object.entries(countryInfo.currencies).map(([c, i]) => `${i.symbol} ${i.name} (${c})`).join(", ")
      : fallback.currency || "Local currency",
    language: countryInfo?.languages
      ? Object.values(countryInfo.languages).join(", ")
      : fallback.language || "Local language",
    highlights: fallback.highlights || ["Guided Tours", "Scenic Views", "Cultural Experience", "Photography"],
    countryInfo,
    sunData,
    unesco,
  };
}