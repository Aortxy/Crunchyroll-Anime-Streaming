import { notFound } from "next/navigation";

import { Episode } from "@/app/(main)/watch/[id]/[title]/page.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function getTitle(
  id: string,
): Promise<{ seriesTitle: string; episodeTitle: string }> {
  const response = await fetch(`${API_URL}/episodes/${id}/title`);

  if (!response.ok) {
    return notFound();
  }

  return response.json();
}

export default async function getEpisode(id: string): Promise<Episode> {
  const response = await fetch(`${API_URL}/episodes/${id}`);

  if (!response.ok) {
    return notFound();
  }

  return response.json();
}
