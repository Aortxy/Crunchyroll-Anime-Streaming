import { notFound } from "next/navigation";

import { Series } from "@/app/(main)/series/[id]/[title]/page.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function getTitle(id: string): Promise<string> {
  const response = await fetch(`${API_URL}/series/${id}/title`);

  if (!response.ok) {
    return notFound();
  }

  const data = await response.json();
  return data.title;
}

export default async function getSeries(id: string): Promise<Series> {
  const response = await fetch(`${API_URL}/series/${id}`);

  if (!response.ok) {
    return notFound();
  }

  return response.json();
}
