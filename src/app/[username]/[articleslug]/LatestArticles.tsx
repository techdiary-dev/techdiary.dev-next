import { http } from "@/clients/http.client";
import { IArticleFeedItem } from "@/models/Article.model";
import { PaginatedResponse } from "@/models/PaginatedResponse.model";
import Link from "next/link";
import React from "react";

interface LatestArticlesProps {
  tag?: string;
}
const LatestArticles: React.FC<LatestArticlesProps> = async ({ tag }) => {
  const {
    data: { data: articles },
  } = await http.get<PaginatedResponse<IArticleFeedItem>>("/api/articles");
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
