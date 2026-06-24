import Link from "next/link";
import { destinations as seedData } from "@/data/destinations";
import { enrichDestination } from "@/lib/api-service";
import DestinationCard from "@/components/DestinationCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let destinations: any[] = [];
  let topDestination: any = null;

  try {
    const enriched = await Promise.all(
      seedData.map((d) => enrichDestination(d))
    );
    enriched.sort((a, b) => b.rating - a.rating);
    destinations = enriched;
    topDestination = enriched[0] || null;
  } catch {
    // Graceful fallback
  }

  const featuredDestinations = destinations.slice(0, 6);
  const continentList = [...new Set(destinations.map((d: any) => d.continent))];
  const totalDestinations = destinations.length;

  // Pick 3 UNESCO sites for the trivia section
  const unescoDestinations = destinations
    .filter((d: any) => d.unesco?.image)
    .slice(0, 3);

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
      {/* ─── WORLD #1 SPOTLIGHT WITH ANIMATED SUN ARC ─── */}
      {topDestination && (
        <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px]">
          {/* Sky background that changes from sunrise → day → sunset → night */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1920&h=1080&fit=crop"
              alt="Machu Picchu background"
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 transition-all duration-[2000ms] ${
              topDestination.sunData?.isDay
                ? topDestination.sunData.sunPosition < 30
                  ? "bg-gradient-to-b from-orange-300/70 via-sky-300/70 to-blue-400/70"
                  : topDestination.sunData.sunPosition > 70
                    ? "bg-gradient-to-b from-amber-600/70 via-orange-400/70 to-purple-500/70"
                    : "bg-gradient-to-b from-sky-400/70 via-blue-300/70 to-cyan-400/70"
                : "bg-gradient-to-b from-slate-900/80 via-indigo-900/80 to-purple-950/80"
            }`} />
          </div>
            {/* Sun/Moon arc path (invisible arc that the sun travels along) */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Sun/Moon positioned along an arc based on time */}
              {topDestination.sunData && (
                <div
                  className="absolute transition-all duration-[3000ms] ease-in-out"
                  style={{
                    // Arc path: left(0%) → center(50%) → right(100%)
                    // Height varies: low at edges, high in middle
                    left: `${topDestination.sunData.sunPosition}%`,
                    top: `${
                      topDestination.sunData.isDay
                        // Day: arc from bottom-left up to center, down to bottom-right
                        ? 80 - Math.sin((topDestination.sunData.sunPosition / 100) * Math.PI) * 50
                        // Night: arc at bottom with moon
                        : 85 - Math.sin((topDestination.sunData.sunPosition / 100) * Math.PI) * 15
                    }%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {topDestination.sunData.isDay ? (
                    <div className="relative animate-gentle-rotate">
                      {/* Sun glow */}
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-40 scale-150 animate-pulse-glow" />
                      {/* Sun body */}
                      <div className="relative w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-yellow-300 via-orange-400 to-yellow-500 rounded-full shadow-2xl flex items-center justify-center">
                        <span className="text-4xl md:text-6xl">☀️</span>
                      </div>
                      {/* Sun rays */}
                      <div className="absolute -inset-4 animate-spin-slow">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-4 md:h-6 bg-yellow-300/60 rounded-full"
                            style={{
                              left: "50%",
                              top: "-8px",
                              transformOrigin: "50% calc(100% + 20px)",
                              transform: `translateX(-50%) rotate(${i * 45}deg)`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Moon glow */}
                      <div className="absolute inset-0 bg-indigo-300 rounded-full blur-3xl opacity-20 scale-150" />
                      {/* Moon body */}
                      <div className="relative w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300 rounded-full shadow-2xl flex items-center justify-center">
                        <span className="text-4xl md:text-6xl">🌙</span>
                      </div>
                      {/* Stars around moon */}
                      <div className="absolute -top-8 -left-8 text-lg animate-twinkle">⭐</div>
                      <div className="absolute -bottom-6 -right-6 text-sm animate-twinkle-delayed">✨</div>
                    </div>
                  )}
                </div>
              )}

              {/* Static clouds (day) */}
              {topDestination.sunData?.isDay && (
                <>
                  <div className="absolute top-[15%] left-[8%] text-5xl md:text-6xl animate-float-slow opacity-60">☁️</div>
                  <div className="absolute top-[25%] right-[12%] text-4xl md:text-5xl animate-float opacity-40">☁️</div>
                  <div className="absolute top-[35%] left-[35%] text-3xl md:text-4xl animate-float-slow opacity-30">☁️</div>
                </>
              )}

              {/* Stars (night) */}
              {!topDestination.sunData?.isDay && (
                <>
                  <div className="absolute top-[8%] left-[15%] text-xl animate-twinkle">⭐</div>
                  <div className="absolute top-[12%] right-[25%] text-lg animate-twinkle-delayed">🌟</div>
                  <div className="absolute top-[30%] left-[45%] text-sm animate-twinkle">✨</div>
                  <div className="absolute top-[20%] right-[8%] text-xl animate-twinkle-delayed">⭐</div>
                  <div className="absolute top-[45%] left-[20%] text-lg animate-twinkle">🌟</div>
                  <div className="absolute top-[5%] left-[55%] text-sm animate-twinkle-delayed">✨</div>
                </>
              )}
            </div>

          {/* Content overlay */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left: Destination Info */}
              <div className="lg:w-3/5">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-4 border border-white/20">
                  <span className="text-yellow-300 text-lg">🏆</span>
                  <span className="text-white text-sm font-semibold uppercase tracking-wider">
                    World's #1 Destination
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
                  {topDestination.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-white/80 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {topDestination.country}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span>{topDestination.continent}</span>
                  {topDestination.countryInfo?.flagEmoji && (
                    <span className="text-2xl">{topDestination.countryInfo.flagEmoji}</span>
                  )}
                  {topDestination.unesco && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span className="bg-yellow-500/30 text-yellow-200 text-xs px-2 py-0.5 rounded-full border border-yellow-400/30">
                        UNESCO 🌍
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < Math.floor(topDestination.rating) ? "text-yellow-400" : "text-white/30"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-bold text-xl">{topDestination.rating}</span>
                </div>

                <p className="text-white/80 text-lg leading-relaxed max-w-xl mb-6">
                  {topDestination.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/destination/${topDestination.id}`}
                    className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg inline-flex items-center gap-2"
                  >
                    Explore Details
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right: Sunrise/Sunset Cards */}
              {topDestination.sunData && (
                <div className="lg:w-2/5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-2xl shadow-lg animate-float-slow">
                          🌅
                        </div>
                        <div>
                          <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Sunrise</p>
                          <p className="text-white text-2xl font-bold">{topDestination.sunData.sunrise}</p>
                          <p className="text-white/50 text-xs">{topDestination.sunData.timezone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg animate-float">
                          🌇
                        </div>
                        <div>
                          <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Sunset</p>
                          <p className="text-white text-2xl font-bold">{topDestination.sunData.sunset}</p>
                          <p className="text-white/50 text-xs">Day: {topDestination.sunData.dayLength}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl p-5 border backdrop-blur-md ${
                      topDestination.sunData.isDay
                        ? "bg-yellow-400/20 border-yellow-300/30"
                        : "bg-indigo-400/20 border-indigo-300/30"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg ${
                          topDestination.sunData.isDay ? "bg-yellow-400" : "bg-indigo-500"
                        }`}>
                          {topDestination.sunData.isDay ? "☀️" : "🌙"}
                        </div>
                        <div>
                          <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Status</p>
                          <p className="text-white text-2xl font-bold">
                            {topDestination.sunData.isDay ? "Daytime" : "Nighttime"}
                          </p>
                          <p className="text-white/50 text-xs">
                            Sun at {Math.round(topDestination.sunData.sunPosition)}% across sky
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
        </section>
      )}

      {/* ─── UNESCO QUIZ SECTION ─────────────────────────────── */}
      {unescoDestinations.length > 0 && (
        <section className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-16 border-y border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-3">
                <span className="text-lg">🌍</span>
                <span className="text-amber-800 text-sm font-semibold uppercase tracking-wider">UNESCO World Heritage</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Discover UNESCO Heritage Sites
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore the world's most treasured cultural and natural landmarks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {unescoDestinations.map((dest: any) => (
                <Link
                  key={dest.id}
                  href={`/destination/${dest.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dest.unesco?.image || dest.image}
                      alt={dest.unesco?.name || dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span>🌍</span> UNESCO
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 text-gray-800 text-sm font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {dest.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-amber-600 transition-colors mb-1">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{dest.country} &bull; {dest.continent}</p>
                    {dest.unesco?.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {dest.unesco.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center text-amber-600 text-sm font-semibold">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED DESTINATIONS ──────────────────────────── */}
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

      {/* ─── STATS ────────────────────────────────────────── */}
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
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {destinations.filter((d: any) => d.unesco).length}
              </div>
              <div className="text-emerald-200 font-medium">UNESCO Sites</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">25+</div>
              <div className="text-emerald-200 font-medium">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ALL DESTINATIONS WITH SUNRISE/SUNSET ──────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Destinations — Live Sunrise & Sunset
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time solar data for every destination
          </p>
          <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 12).map((dest: any) => (
            <Link
              key={dest.id}
              href={`/destination/${dest.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {dest.continent}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors mb-1">
                  {dest.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{dest.country}</p>
                {dest.sunData && (
                  <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                    <span className="flex items-center gap-1">🌅 {dest.sunData.sunrise}</span>
                    <span className="flex items-center gap-1">🌇 {dest.sunData.sunset}</span>
                    <span className="ml-auto font-medium">{dest.sunData.isDay ? "☀️" : "🌙"}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">{dest.rating}</span>
                </div>
              </div>
            </Link>
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

      {/* ─── CONTINENT QUICK LINKS ───────────────────────── */} 
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
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
