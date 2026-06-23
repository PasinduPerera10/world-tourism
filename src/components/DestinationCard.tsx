import Link from "next/link";
import type { Destination } from "@/lib/api-client";

export default function DestinationCard({ destination }: { destination: Destination }) {
  const stars = Math.round(destination.rating);
  const fullStars = Math.floor(destination.rating);
  return (
    <Link
      href={`/destination/${destination.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {destination.continent}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {destination.rating}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors mb-1">
          {destination.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {destination.country}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>
        <div className="mt-4 flex items-center text-emerald-600 text-sm font-semibold group-hover:gap-2 transition-all">
          <span>Explore More</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}