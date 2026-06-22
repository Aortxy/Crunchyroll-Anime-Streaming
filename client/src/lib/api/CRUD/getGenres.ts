const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default async function getGenres(): Promise<{ id: string; title: string }[]> {
  const response = await fetch(`${API_URL}/genres`);

  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }

  return response.json();
}
