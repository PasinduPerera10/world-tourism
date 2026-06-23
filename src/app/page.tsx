import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { fetchDestinations, fetchContinents } from "@/lib/api-client";

export default async function Home() {
  let featuredDestinations: any[] = [];
  let totalDestinations = 0;
  let continentList: string[] = [];

  try {
    const data = await fetchDestinations({ sort: "rating" });
    featuredDestinations = data.destinations.slice(0, 6);
    totalDestinations = data.total;
    continentList = data.continents;
  } catch {
    // Fallback: if API fails, data remains empty
  }

  let continentData: any[] = [];
  try {
    const continentsRes = await fetchContinents();
    continentData = continentsRes.continents;
  } catch {
    // Fallback
  }

  const continentCards = [
    { name: "Asia", color: "from-rose-500 to-pink-600", img: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=300&fit=crop" },
    { name: "Africa", color: "from-amber-500 to-orange-600", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop" },
    { name: "Europe", color: "from-blue-500 to-indigo-600", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop" },
    { name: "North America", color: "from-emerald-500 to-teal-600", img: "https://images.unsplash.com/photo-1506903789192-9108654681c1?w=400&h=300&fit=crop" },
    { name: "South America", color: "from-green-500 to-emerald-600", img: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=400&h=300&fit=crop" },
    { name: "Australia/Oceania", color: "from-cyan-500 to-blue-600", img: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=400&h=300&fit=crop" },
    { name: "Antarctica", color: "from-sky-400 to-blue-500", img: "https://images.unsplash.com/photo-1551361415-69c1e8c7b5f8?w=400&h=300&fit=crop" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover
            <span className="text-emerald-400"> Most Amazing</span> Places
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Explore breathtaking destinations across every continent. From ancient wonders to natural marvels, your next adventure awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/destinations"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-lg hover:scale-105"
            >
              Explore Destinations
            </Link>
            <Link
              href="/continents"
              className="bg-white/20 backdrop-blur-sm border-2 border-white hover:bg-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Browse by Continent
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      {featuredDestinations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of the most incredible places to visit
            </p>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination: any) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg"
            >
              View All Destinations
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{totalDestinations}+</div>
              <div className="text-emerald-200 font-medium">Destinations</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{continentList.length}</div>
              <div className="text-emerald-200 font-medium">Continents</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.8</div>
              <div className="text-emerald-200 font-medium">Avg Rating</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">25+</div>
              <div className="text-emerald-200 font-medium">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Continent Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Continent
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a continent to discover its most remarkable destinations
          </p>
          <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {continentCards.map((continent) => (
            <Link
              key={continent.name}
              href={`/destinations?continent=${encodeURIComponent(continent.name)}`}
              className="relative group rounded-2xl overflow-hidden h-40 shadow-md"
            >
              <img
                src={continent.img}
                alt={continent.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${continent.color} opacity-80`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold drop-shadow-lg">{continent.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}