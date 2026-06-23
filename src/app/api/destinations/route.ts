import { NextRequest } from "next/server";
import { destinations, continents } from "@/data/destinations";
import { enrichDestination } from "@/lib/api-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const continent = searchParams.get("continent");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "rating";

  let filtered = [...destinations];

  if (continent && continent !== "All") {
    filtered = filtered.filter((d) => d.continent === continent);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
    );
  }

  // Enrich all destinations in parallel with real-time data
  const enriched = await Promise.all(
    filtered.map((dest) => enrichDestination(dest))
  );

  // Sort
  if (sort === "rating") {
    enriched.sort((a, b) => b.rating - a.rating);
  } else if (sort === "name") {
    enriched.sort((a, b) => a.name.localeCompare(b.name));
  }

  return Response.json({
    destinations: enriched,
    continents,
    total: enriched.length,
  });
}