import { http } from "@/http/http.client";
import { IArticleFeedItem } from "@/http/models/Article.model";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import { ArticleApiRepository } from "@/http/repositories/article.repository";
import Link from "next/link";
import React from "react";

interface LatestArticlesProps {
  tag?: string;
  excludeIds: string[];
}
const LatestArticles: React.FC<LatestArticlesProps> = async ({
  excludeIds,
}) => {
  const articleRepository = new ArticleApiRepository();

  const { data: articles } = await articleRepository.getArticles({
    limit: 10,
    excludeIds,
  });

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-forground-muted">
        সাম্প্রতিক লেখা
      </h3>
      <div className=" flex flex-col gap-4">
        {articles.map((article) => (
          <Link
            href={article?.url}
            key={article.id}
            className="hover:underline"
          >
            {article.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestArticles;
