"use client";

import { IArticleFeedItem } from "@/http/models/Article.model";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import { ArticleApiRepository } from "@/http/repositories/article.repository";
import { Loader } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { VisibilityObserver } from "reactjs-visibility";
import ArticleCard from "./ArticleCard";

interface ArticleFeedProps {
  initialData: PaginatedResponse<IArticleFeedItem>;
}
const ArticleFeed: React.FC<ArticleFeedProps> = ({ initialData }) => {
  const articleRepository = new ArticleApiRepository();

  const { data, fetchNextPage } = useInfiniteQuery<
    PaginatedResponse<IArticleFeedItem>
  >({
    queryKey: ["article-feed"],
    initialData: {
      pageParams: [initialData.meta.current_page],
      pages: [initialData],
    },
    initialPageParam: initialData.meta.current_page,
    refetchOnMount: false,
    getNextPageParam: (lastPage, pages) => lastPage.meta.current_page + 1,
    queryFn: async ({ pageParam }) => {
      return articleRepository.getArticles({
        page: pageParam as number,
        limit: 10,
      });
    },
  });

  return (
    <div className="flex flex-col gap-8 mt-4">
      {data?.pages.map((page) => {
        return page.data.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ));
      })}

      <VisibilityObserver
        onChangeVisibility={(isVisible) => {
          if (isVisible) {
            fetchNextPage();
          }
        }}
        options={{ rootMargin: "200px" }}
      >
        <div className="text-center">
          <Loader size={"lg"} color="blue" />
        </div>
      </VisibilityObserver>
    </div>
  );
};

export default ArticleFeed;
