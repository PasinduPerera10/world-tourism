import { destinations, continents } from "@/data/destinations";
import { enrichDestination } from "@/lib/api-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const continentData = await Promise.all(
    continents.map(async (name) => {
      const continentSeeds = destinations.filter((d) => d.continent === name);
      const enriched = await Promise.all(
        continentSeeds.map((d) => enrichDestination(d))
      );
      return {
        name,
        destinationCount: continentSeeds.length,
        destinations: enriched.map((d) => ({
          id: d.id,
          name: d.name,
          country: d.country,
          image: d.image,
          rating: d.rating,
        })),
      };
    })
  );

  return Response.json({ continents: continentData });
}