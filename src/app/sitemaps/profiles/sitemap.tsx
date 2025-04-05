import { persistenceRepository } from "@/backend/persistence-repositories";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles = await persistenceRepository.user.findRows({
    columns: ["username"],
    limit: -1,
  });

  return profiles.map((profile) => {
    return {
      url: `https://www.techdiary.dev/@${profile.username}`,
      lastModified: profile?.updated_at,
      changeFrequency: "weekly",
      priority: 1,
    };
  });
}
