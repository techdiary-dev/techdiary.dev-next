import { http } from "@/http/http.client";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import { UserReference } from "@/http/models/User.model";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await http.get<PaginatedResponse<UserReference>>(
    "api/profile/list",
    {
      params: {
        limit: -1,
        page: 1,
      },
    }
  );

  return data.data.map((user) => ({
    url: `https://techdiary.dev/@${user.username}`,
    lastModified: new Date(user.joined),
    changeFrequency: "weekly",
    priority: 0.5,
  }));
}
