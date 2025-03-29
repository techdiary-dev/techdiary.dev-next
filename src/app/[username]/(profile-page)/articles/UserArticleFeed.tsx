"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import * as articleActions from "@/backend/services/article.actions";
import React, { useMemo } from "react";
import ArticleCard from "@/components/ArticleCard";
import { readingTime } from "@/lib/utils";
import VisibilitySensor from "@/components/VisibilitySensor";

interface UserArticleFeedProps {
  userId: string;
}

const UserArticleFeed: React.FC<UserArticleFeedProps> = ({ userId }) => {
  const feedInfiniteQuery = useInfiniteQuery({
    queryKey: ["user-article-feed", userId],
    queryFn: ({ pageParam }) =>
      articleActions.userArticleFeed({
        user_id: userId,
        limit: 5,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const _page = lastPage?.meta?.currentPage ?? 1;
      const _totalPages = lastPage?.meta?.totalPages ?? 1;
      return _page + 1 <= _totalPages ? _page + 1 : null;
    },
  });

  const feedArticles = useMemo(() => {
    return feedInfiniteQuery.data?.pages.flatMap((page) => page?.nodes);
  }, [feedInfiniteQuery.data]);

  return (
    <>
      {feedInfiniteQuery.isFetching && (
        <div className="flex flex-col gap-10">
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
        </div>
      )}

      {feedArticles?.map((article) => (
        <ArticleCard
          id={article?.id ?? ""}
          title={article?.title ?? ""}
          handle={article?.handle ?? ""}
          excerpt={article?.excerpt ?? ""}
          author={{
            name: article?.user?.name ?? "",
            avatar: article?.user?.profile_photo ?? "",
            username: article?.user?.username ?? "",
          }}
          publishedAt={article?.created_at.toDateString() ?? ""}
          readingTime={readingTime(article?.body ?? "")}
          likes={0}
          comments={0}
          key={article?.id}
        />
      ))}

      {feedInfiniteQuery.hasNextPage && (
        <VisibilitySensor onLoadmore={feedInfiniteQuery.fetchNextPage} />
      )}
    </>
  );
};

export default UserArticleFeed;
