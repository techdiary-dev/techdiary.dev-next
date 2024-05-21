"use client";

import { http } from "@/clients/http.client";
import { IArticleFeedItem } from "@/models/Article.model";
import { PaginatedResponse } from "@/models/PaginatedResponse.model";
import { Loader } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { VisibilityObserver } from "reactjs-visibility";
import ArticleCard from "./ArticleCard";
import { useAtomValue } from "jotai";
import { userAtom } from "@/store/user.atom";

interface ArticleFeedProps {
  initialData: PaginatedResponse<IArticleFeedItem>;
}
const ArticleFeed: React.FC<ArticleFeedProps> = ({ initialData }) => {
  const currentUser = useAtomValue(userAtom);

  const { data, fetchNextPage } = useInfiniteQuery<
    PaginatedResponse<IArticleFeedItem>
  >({
    queryKey: ["article-feed"],
    initialData: {
      pageParams: [initialData.meta.current_page],
      pages: [initialData],
    },
    initialPageParam: initialData.meta.current_page,
    getNextPageParam: (lastPage, pages) => lastPage.meta.current_page + 1,
    queryFn: async ({ pageParam }) => {
      const response = await http.get(
        `/api/articles?page=${pageParam}&limit=10`
      );
      return response.data as PaginatedResponse<IArticleFeedItem>;
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