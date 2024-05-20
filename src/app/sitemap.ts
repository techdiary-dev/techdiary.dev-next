import { http } from "@/clients/http.client";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await http.get("api/articles", {
    params: {
      limit: 100,
      page: 1,
    },
  });

  return data.data.map((article: any) => ({
    url: article.url,
    lastModified: new Date(article.created_at),
    changeFrequency: "weekly",
    priority: 0.5,
  }));
}
