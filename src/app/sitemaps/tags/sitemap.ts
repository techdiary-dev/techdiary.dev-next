import { http } from "@/http/http.client";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await http.get<PaginatedResponse<any>>("api/tags", {
    params: { limit: -1 },
  });

  return data.data.map((tag) => ({
    url: `https://techdiary.dev/tags/${tag?.name
      ?.toLowerCase()
      .replace(/\&/g, "")
      ?.split(" ")
      ?.join("-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));
}
