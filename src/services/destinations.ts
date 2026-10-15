export type DestinationSuggestion = {
  id: number;
  name: string;
  admin1?: string;
  country: string;
};

type GeocodingResponse = {
  results?: Array<{
    id: number;
    name: string;
    admin1?: string;
    country?: string;
  }>;
};

export async function searchDestinations(
  query: string,
  signal?: AbortSignal,
): Promise<DestinationSuggestion[]> {
  const params = new URLSearchParams({
    name: query,
    count: '6',
    language: 'en',
    format: 'json',
  });
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error('Could not load destination suggestions. Please try again.');
  }

  const data = (await response.json()) as GeocodingResponse;
  return (data.results ?? []).map((place) => ({
    id: place.id,
    name: place.name,
    admin1: place.admin1,
    country: place.country ?? '',
  }));
}
