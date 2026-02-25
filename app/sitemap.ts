import type { MetadataRoute } from "next";
import { MOCK_TRIP_REQUESTS } from "./lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://staybid.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/post-trip`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  const tripPages: MetadataRoute.Sitemap = MOCK_TRIP_REQUESTS.map((trip) => ({
    url: `${baseUrl}/trip/${trip.id}`,
    lastModified: new Date(trip.createdAt),
    changeFrequency: "daily" as const,
    priority: trip.status === "open" ? 0.8 : 0.5,
  }));

  return [...staticPages, ...tripPages];
}
