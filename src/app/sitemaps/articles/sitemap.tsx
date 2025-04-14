import { Article, User } from "@/backend/models/domain-models";
import { persistenceRepository } from "@/backend/persistence-repositories";
import {
  and,
  eq,
  leftJoin,
  neq,
} from "@/backend/persistence/persistence-where-operator";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await persistenceRepository.article.findRows({
    where: and(eq("is_published", true), neq("approved_at", null)),
    columns: ["handle", "updated_at"],
    limit: -1,
    joins: [
      leftJoin<Article, User>({
        as: "user",
        joinTo: "users",
        localField: "author_id",
        foreignField: "id",
        columns: ["id", "username"],
      }),
    ],
  });

  return articles
    .filter((article) => article?.handle)
    .map((article) => {
      let url = "null";
      if (article?.handle) {
        url = `https://www.techdiary.dev/@${article.user?.username}/${article?.handle}`;
      }

      return {
        url,
        lastModified: article?.updated_at,
        changeFrequency: "weekly",
        priority: 1,
      };
    });
}
