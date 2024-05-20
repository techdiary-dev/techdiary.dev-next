import { http } from "@/clients/http.client";
import { PaginatedResponse } from "@/models/PaginatedResponse.model";
import { UserReference } from "@/models/User.model";
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
