import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDestinations } from "@/lib/api-client";
import DestinationCard from "@/components/DestinationCard";

export const dynamic = "force-dynamic";

// Next.js 16 route params are a Promise
export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch all destinations from API to find this one and related
  let destination: any = null;
  let related: any[] = [];

  try {
    const allData = await fetchDestinations();
    destination = allData.destinations.find((d: any) => d.id === id) || null;

    if (destination) {
      related = allData.destinations
        .filter((d: any) => d.continent === destination.continent && d.id !== destination.id)
        .slice(0, 3);
    }
  } catch {
    // Fallback handled below
  }

  if (!destination) {
    notFound();
  }

  const fullStars = Math.floor(destination.rating);
  const hasHalfStar = destination.rating % 1 >= 0.5;
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-end">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium mb-2">
            <Link href="/" className="hover:text-emerald-200 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-emerald-200 transition-colors">Destinations</Link>
            <span>/</span>
            <span className="text-white">{destination.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            {destination.name}
          </h1>
          <p className="text-xl text-gray-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {destination.country} &bull; {destination.continent}
          </p>
          {/* Show real-time flag from API enrichment */}
          {destination.countryInfo?.flagEmoji && (
            <span className="inline-block mt-2 text-3xl" role="img" aria-label={`Flag of ${destination.country}`}>
              {destination.countryInfo.flagEmoji}
            </span>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-8">
              {destination.longDescription}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {destination.highlights.map((highlight: string, index: number) => (
                <div key={index} className="flex items-center gap-3 bg-emerald-50 rounded-xl p-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Real-time country info from REST Countries API */}
            {destination.countryInfo && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Country Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {destination.countryInfo.capital && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Capital</p>
                      <p className="text-lg font-semibold text-gray-800">{destination.countryInfo.capital}</p>
                    </div>
                  )}
                  {destination.countryInfo.population && (
                    <div className="bg-purple-50 rounded-xl p-4">
                      <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Population</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {(destination.countryInfo.population / 1_000_000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                  {destination.countryInfo.region && (
                    <div className="bg-amber-50 rounded-xl p-4">
                      <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Region</p>
                      <p className="text-lg font-semibold text-gray-800">{destination.countryInfo.region}</p>
                    </div>
                  )}
                  {destination.countryInfo.timezones && (
                    <div className="bg-teal-50 rounded-xl p-4">
                      <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Time Zones</p>
                      <p className="text-lg font-semibold text-gray-800">{destination.countryInfo.timezones[0]}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < fullStars ? "text-yellow-400" : "text-gray-200"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900">{destination.rating}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Best Time to Visit</p>
                    <p className="text-sm font-semibold text-gray-800">{destination.bestTimeToVisit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Currency</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {destination.currencyInfo?.symbol || ""} {destination.currency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Language</p>
                    <p className="text-sm font-semibold text-gray-800">{destination.language}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Continent</p>
                    <p className="text-sm font-semibold text-gray-800">{destination.continent}</p>
                  </div>
                </div>
              </div>

              {/* Map link from REST Countries API */}
              {destination.countryInfo?.mapUrl && (
                <div className="mt-4">
                  <a
                    href={destination.countryInfo.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    View on Google Maps
                  </a>
                </div>
              )}

              <div className="mt-4">
                <Link
                  href="/destinations"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Destinations */}
      {related.length > 0 && (
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                More in {destination.continent}
              </h2>
              <p className="text-gray-600">
                Discover other amazing destinations in {destination.continent}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((d: any) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}