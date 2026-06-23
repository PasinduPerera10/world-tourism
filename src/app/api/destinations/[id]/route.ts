import { NextRequest } from "next/server";
import { destinations } from "@/data/destinations";
import { enrichDestination } from "@/lib/api-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const seed = destinations.find((d) => d.id === id);

  if (!seed) {
    return Response.json({ error: "Destination not found" }, { status: 404 });
  }

  // Enrich with real-time data
  const destination = await enrichDestination(seed);

  // Get related destinations from the same continent
  const relatedSeeds = destinations
    .filter((d) => d.continent === seed.continent && d.id !== seed.id)
    .slice(0, 3);

  const related = await Promise.all(relatedSeeds.map((d) => enrichDestination(d)));

  return Response.json({ destination, related });
}