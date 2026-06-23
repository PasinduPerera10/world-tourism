"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DestinationCard from "@/components/DestinationCard";
import { fetchDestinations, type Destination } from "@/lib/api-client";

const fallbackContinents = [
  "Asia", "Africa", "Europe", "North America",
  "South America", "Australia/Oceania", "Antarctica",
];

function DestinationsContent() {
  const searchParams = useSearchParams();
  const continentFilter = searchParams.get("continent");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState(continentFilter || "All");
  const [sortBy, setSortBy] = useState("rating");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [continents, setContinents] = useState<string[]>(fallbackContinents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  const loadDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDestinations({
        continent: selectedContinent === "All" ? undefined : selectedContinent,
        search: searchQuery || undefined,
        sort: sortBy,
      });
      setDestinations(data.destinations);
      setContinents(data.continents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load destinations");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch on filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadDestinations();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContinent, searchQuery, sortBy]);

  // Initial load when continent filter from URL changes
  useEffect(() => {
    if (continentFilter) {
      setSelectedContinent(continentFilter);
    }
  }, [continentFilter]);

  const filteredDestinations = useMemo(() => {
    // Client-side fallback sort in case API doesn't sort correctly
    const sorted = [...destinations];
    if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [destinations, sortBy]);

  return (
    <div>
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore All Destinations
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Browse through our curated collection of amazing places from around the world
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Continent</label>
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="All">All Continents</option>
                {continents.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          {loading ? (
            <p className="text-gray-600">
              <span className="animate-pulse">Loading destinations...</span>
            </p>
          ) : error ? (
            <p className="text-red-600 font-medium">{error}</p>
          ) : (
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredDestinations.length}</span> destinations found
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to load destinations</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={loadDestinations}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <DestinationsContent />
    </Suspense>
  );
}