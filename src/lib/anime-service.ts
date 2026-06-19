const JIKAN_API = "https://api.jikan.moe/v4";
const CONSUMET_API = "https://consumet-api-fawn.vercel.app/anime/gogoanime"; // Example public instance

export type AnimeMetadata = {
  id: string;
  title: string;
  image: string;
  description: string;
  genres: string[];
  rating: number;
  episodes: number;
  year?: number;
  type?: string;
};

export type EpisodeInfo = {
  id: string;
  number: number;
  title?: string;
  image?: string;
  url?: string;
};

export async function getTopAnime(): Promise<AnimeMetadata[]> {
  // Use Consumet's top-airing for better compatibility with streaming IDs
  const res = await fetch(`${CONSUMET_API}/top-airing`);
  const data = await res.json();

  return data.results.map((anime: any) => ({
    id: anime.id,
    title: anime.title,
    image: anime.image,
    description: "",
    genres: anime.genres || [],
    rating: 0,
    episodes: 0,
    type: "Anime",
  }));
}

export async function searchAnime(query: string): Promise<AnimeMetadata[]> {
  // We'll search on Consumet to get compatible IDs for streaming
  const res = await fetch(`${CONSUMET_API}/${encodeURIComponent(query)}`);
  const data = await res.json();

  return data.results.map((anime: any) => ({
    id: anime.id,
    title: anime.title,
    image: anime.image,
    description: "", // Consumet search doesn't always have full description
    genres: [],
    rating: 0,
    episodes: 0,
  }));
}

export async function getAnimeInfo(id: string) {
  const res = await fetch(`${CONSUMET_API}/info/${id}`);
  if (!res.ok) throw new Error("Failed to fetch anime info");
  return await res.json();
}

export async function getEpisodeStreamingLinks(episodeId: string) {
  const res = await fetch(`${CONSUMET_API}/watch/${episodeId}`);
  if (!res.ok) throw new Error("Failed to fetch streaming links");
  return await res.json();
}
