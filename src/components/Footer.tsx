import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl font-bold text-white">WorldTourism</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explore the most amazing destinations across the globe. Your journey starts here.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link href="/continents" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Browse by Continent
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Top Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/destination/eiffel-tower" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Eiffel Tower, France
                </Link>
              </li>
              <li>
                <Link href="/destination/taj-mahal" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Taj Mahal, India
                </Link>
              </li>
              <li>
                <Link href="/destination/machu-picchu" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Machu Picchu, Peru
                </Link>
              </li>
              <li>
                <Link href="/destination/great-wall" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Great Wall, China
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} WorldTourism. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}