import Link from "next/link";
import { fetchDestinations } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let topDestination: any = null;
  let allDestinations: any[] = [];

  try {
    const data = await fetchDestinations({ sort: "rating" });
    topDestination = data.destinations[0] || null;
    allDestinations = data.destinations;
  } catch {
    // Graceful fallback
  }

  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                🌍 World Tourism Dashboard
              </h1>
              <p className="text-emerald-100 text-lg">
                Real-time global tourism data with live sunrise/sunset tracking
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="text-center">
                <p className="text-emerald-200 text-xs uppercase tracking-wide">Current Time</p>
                <p className="text-white text-xl font-bold">{currentTime}</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-emerald-200 text-xs uppercase tracking-wide">Destinations</p>
                <p className="text-white text-xl font-bold">{allDestinations.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* World #1 Place */}
        {topDestination && (
          <section className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img
                src={topDestination.image}
                alt={topDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full">
                  🏆 #1 World Destination
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {topDestination.name}
                </h2>
                <p className="text-emerald-200 text-lg">
                  {topDestination.country} • {topDestination.continent}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(topDestination.rating) ? "text-yellow-400" : "text-gray-400"}`}
                        fill="currentColor" viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-bold text-lg">{topDestination.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {topDestination.description}
              </p>

              {/* Realtime Sunrise/Sunset Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {topDestination.sunData ? (
                  <>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-amber-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🌅</span>
                        <div>
                          <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Sunrise</p>
                          <p className="text-xl font-bold text-gray-800">{topDestination.sunData.sunrise}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Timezone: {topDestination.sunData.timezone}</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🌇</span>
                        <div>
                          <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Sunset</p>
                          <p className="text-xl font-bold text-gray-800">{topDestination.sunData.sunset}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Day length: {topDestination.sunData.dayLength}</p>
                    </div>

                    <div className={`rounded-2xl p-5 border ${topDestination.sunData.isDay ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" : "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200"}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{topDestination.sunData.isDay ? "☀️" : "🌙"}</span>
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Status</p>
                          <p className="text-xl font-bold text-gray-800">
                            {topDestination.sunData.isDay ? "Daytime" : "Nighttime"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Currently at {topDestination.name}</p>
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-3 bg-gray-50 rounded-2xl p-5 text-center text-gray-500">
                    <p>Sunrise/sunset data loading...</p>
                  </div>
                )}
              </div>

              {/* Country info */}
              {topDestination.countryInfo && (
                <div className="flex flex-wrap gap-3">
                  {topDestination.countryInfo.flagEmoji && (
                    <span className="text-3xl" role="img">{topDestination.countryInfo.flagEmoji}</span>
                  )}
                  {topDestination.countryInfo.capital && (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      🏛️ Capital: {topDestination.countryInfo.capital}
                    </span>
                  )}
                  {topDestination.countryInfo.population && (
                    <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      👥 Pop: {(topDestination.countryInfo.population / 1_000_000).toFixed(1)}M
                    </span>
                  )}
                  {topDestination.countryInfo.mapUrl && (
                    <a
                      href={topDestination.countryInfo.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors"
                    >
                      🗺️ View on Maps
                    </a>
                  )}
                </div>
              )}

              <div className="mt-6">
                <Link
                  href={`/destination/${topDestination.id}`}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                >
                  View Details
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* All Destinations with Sunrise/Sunset Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Destinations — Live Sunrise & Sunset
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allDestinations.slice(0, 12).map((dest: any) => (
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

                  {/* Sunrise/Sunset Mini */}
                  {dest.sunData && (
                    <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                      <span className="flex items-center gap-1">
                        🌅 {dest.sunData.sunrise}
                      </span>
                      <span className="flex items-center gap-1">
                        🌇 {dest.sunData.sunset}
                      </span>
                      <span className="ml-auto font-medium">
                        {dest.sunData.isDay ? "☀️" : "🌙"}
                      </span>
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
        </section>
      </div>
    </div>
  );
}