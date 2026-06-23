# 🌍 World Tourism - Real-Time Global Discovery Platform

A modern, real-time web application for discovering world tourism destinations. Built with **Next.js 16.2 (App Router)** and powered by multiple open-source APIs for live data enrichment.

## 🚀 Live Features

| Feature | Description |
|---------|-------------|
| **🌅 Real-Time Sunrise/Sunset** | Live sunrise, sunset, and day/night status via Open-Meteo API |
| **🏆 Dashboard** | World's #1 destination with real-time solar data and country info |
| **🗺️ 25+ Destinations** | Curated world-famous landmarks and natural wonders |
| **🌐 REST Countries Integration** | Live flag emoji, capital, population, currency, language data |
| **🔍 Search & Filter** | Filter by continent, search by name, sort by rating/name |
| **📱 Responsive Design** | Fully responsive with Tailwind CSS |
| **🖼️ Rich Media** | Stunning Unsplash imagery for every destination |

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16.2** (App Router) | Full-stack React framework with server components |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **Node.js** | Runtime environment |
| **VS Code** | IDE |

### Open-Source APIs Integrated

| API | Usage | Auth Required |
|-----|-------|:------------:|
| [Open-Meteo](https://open-meteo.com) | Real-time sunrise, sunset, day length | ❌ No |
| [REST Countries](https://restcountries.com) | Flags, capitals, populations, currencies | ❌ No |
| [Unsplash](https://unsplash.com) | Rich destination imagery | ❌ No (used via direct URLs) |

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── destinations/
│   │   │   ├── route.ts          # GET /api/destinations (list with filters)
│   │   │   └── [id]/route.ts     # GET /api/destinations/:id (detail)
│   │   └── continents/
│   │       └── route.ts          # GET /api/continents
│   ├── dashboard/
│   │   └── page.tsx              # Real-time dashboard with sunrise/sunset
│   ├── destinations/
│   │   └── page.tsx              # Browse & filter all destinations
│   ├── continents/
│   │   └── page.tsx              # Browse by continent
│   ├── destination/
│   │   └── [id]/page.tsx         # Destination detail page
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── DestinationCard.tsx       # Reusable destination card
│   ├── Navbar.tsx                # Navigation bar
│   └── Footer.tsx                # Site footer
├── lib/
│   ├── api-service.ts            # Server-side external API integrations
│   └── api-client.ts             # Client-side API client
└── data/
    └── destinations.ts           # Lightweight seed data (25 destinations)
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/PasinduPerera10/world-tourism.git
cd world-tourism

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/destinations` | GET | List destinations (query: `continent`, `search`, `sort`) |
| `/api/destinations/:id` | GET | Single destination detail with related |
| `/api/continents` | GET | All continents with their destinations |

### Example: Fetch destinations filtered by continent
```http
GET /api/destinations?continent=Asia&sort=rating
```

### Example: Fetch single destination
```http
GET /api/destinations/machu-picchu
```

## 📊 Dashboard Features

The **Dashboard** (`/dashboard`) provides:
- **🏆 World's #1 Ranked Destination** - Top-rated place with detailed info
- **🌅 Live Sunrise & Sunset** - Real-time solar data from Open-Meteo
- **☀️/🌙 Day/Night Status** - Current daytime status at each location
- **🕐 Current Time** - Server-side rendered clock
- **🏛️ Country Information** - Capital, population, flag, language, currency from REST Countries API
- **🗺️ Google Maps Integration** - Direct links to location on Google Maps

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source. All destination data and images are used for educational/demonstration purposes.