import Link from "next/link";
import { fetchContinents } from "@/lib/api-client";

const continentDisplayData: Record<string, { color: string; img: string; desc: string }> = {
  "Asia": { color: "from-rose-500 to-pink-600", img: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=500&fit=crop", desc: "From ancient temples to futuristic cities, Asia offers a rich tapestry of cultures and landscapes." },
  "Africa": { color: "from-amber-500 to-orange-600", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop", desc: "Home to vast savannas, diverse wildlife, and ancient civilizations." },
  "Europe": { color: "from-blue-500 to-indigo-600", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=500&fit=crop", desc: "A continent rich in history, art, architecture, and culinary traditions." },
  "North America": { color: "from-emerald-500 to-teal-600", img: "https://images.unsplash.com/photo-1506903789192-9108654681c1?w=800&h=500&fit=crop", desc: "From natural wonders to vibrant metropolises, North America has it all." },
  "South America": { color: "from-green-500 to-emerald-600", img: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=800&h=500&fit=crop", desc: "Rainforests, mountains, and ancient ruins await in this diverse continent." },
  "Australia/Oceania": { color: "from-cyan-500 to-blue-600", img: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=800&h=500&fit=crop", desc: "Island paradises, unique wildlife, and stunning natural beauty." },
  "Antarctica": { color: "from-sky-400 to-blue-500", img: "https://images.unsplash.com/photo-1551361415-69c1e8c7b5f8?w=800&h=500&fit=crop", desc: "The last great wilderness, a pristine continent of ice and snow." },
};

export default async function ContinentsPage() {
  let continentData: { name: string; destinationCount: number; destinations: { id: string; name: string; country: string; image: string; rating: number }[] }[] = [];

  try {
    const data = await fetchContinents();
    continentData = data.continents;
  } catch {
    // Fallback: empty data
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse by Continent
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Explore destinations from every corner of the world
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-20">
          {continentData.map((continent, index) => {
            const display = continentDisplayData[continent.name] || {
              color: "from-emerald-500 to-teal-600",
              img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=500&fit=crop",
              desc: "Explore amazing destinations in this continent.",
            };
            return (
              <div key={continent.name}>
                <div className="relative rounded-3xl overflow-hidden mb-8 h-64 md:h-80">
                  <img
                    src={display.img}
                    alt={continent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${display.color} opacity-80`} />
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">{continent.name}</h2>
                    <p className="text-white/90 text-lg max-w-xl">{display.desc}</p>
                    <p className="text-white/80 text-sm mt-2">
                      {continent.destinationCount} destinations
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {continent.destinations.map((d) => (
                    <Link
                      key={d.id}
                      href={`/destination/${d.id}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="h-40 overflow-hidden">
                        <img
                          src={d.image}
                          alt={d.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors mb-1">{d.name}</h3>
                        <p className="text-xs text-gray-500">{d.country}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">{d.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}