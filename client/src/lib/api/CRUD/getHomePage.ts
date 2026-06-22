import { headers } from "next/headers";

import { BannerItem } from "@/app/(main)/_components/banner/index.types";
import { DataFeedItem } from "@/app/(main)/_components/dataFeedRow/index.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

async function getBannerItems(): Promise<BannerItem[]> {
  const headersList = headers();
  const clientGeoCountry = headersList.get("x-client-geo-country") || "US";

  const response = await fetch(`${API_URL}/home/banner`, {
    headers: {
      "x-client-geo-country": clientGeoCountry,
    },
    next: {
      revalidate: 7 * 24 * 60 * 60, // Revalidate every 7 days
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch banner items");
  }

  return response.json();
}

async function getTopPicksForYou(): Promise<DataFeedItem[]> {
  const headersList = headers();
  const clientGeoCountry = headersList.get("x-client-geo-country") || "US";

  const response = await fetch(`${API_URL}/home/top-picks`, {
    headers: {
      "x-client-geo-country": clientGeoCountry,
    },
    next: {
      revalidate: 23 * 60, // Revalidate every 23 minutes
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch top picks");
  }

  return response.json();
}

async function getNewlyUpdatedSeries(): Promise<DataFeedItem[]> {
  const response = await fetch(`${API_URL}/home/newly-updated`, {
    next: {
      revalidate: 60 * 60, // Revalidate every hour
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch newly updated series");
  }

  return response.json();
}

export { getBannerItems, getTopPicksForYou, getNewlyUpdatedSeries };
