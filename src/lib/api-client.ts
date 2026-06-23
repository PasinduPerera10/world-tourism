/**
 * Client-side API client for fetching data from our Next.js API routes.
 */

export interface SunData {
  sunrise: string;
  sunset: string;
  timezone: string;
  dayLength: string;
  isDay: boolean;
}

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

export interface Destination {
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
}

export interface DestinationsResponse {
  destinations: Destination[];
  continents: string[];
  total: number;
}

export interface DestinationDetailResponse {
  destination: Destination;
  related: Destination[];
}

export interface ContinentData {
  name: string;
  destinationCount: number;
  destinations: { id: string; name: string; country: string; image: string; rating: number }[];
}

export interface ContinentsResponse {
  continents: ContinentData[];
}

interface FetchOptions {
  continent?: string;
  search?: string;
  sort?: string;
}

const BASE_URL = "/api";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchDestinations(options: FetchOptions = {}): Promise<DestinationsResponse> {
  const params = new URLSearchParams();
  if (options.continent && options.continent !== "All") params.set("continent", options.continent);
  if (options.search) params.set("search", options.search);
  if (options.sort) params.set("sort", options.sort);

  const query = params.toString();
  const url = `${BASE_URL}/destinations${query ? `?${query}` : ""}`;
  return fetchJson<DestinationsResponse>(url);
}

export async function fetchDestination(id: string): Promise<DestinationDetailResponse> {
  return fetchJson<DestinationDetailResponse>(`${BASE_URL}/destinations/${encodeURIComponent(id)}`);
}

export async function fetchContinents(): Promise<ContinentsResponse> {
  return fetchJson<ContinentsResponse>(`${BASE_URL}/continents`);
}

export async function fetchDashboard(): Promise<{ topDestination: Destination | null; allDestinations: Destination[] }> {
  const data = await fetchDestinations({ sort: "rating" });
  return {
    topDestination: data.destinations[0] || null,
    allDestinations: data.destinations,
  };
}