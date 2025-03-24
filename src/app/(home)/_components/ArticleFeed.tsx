"use client";

import * as articleActions from "@/backend/services/article.actions";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { readingTime } from "@/lib/utils";
import getFileUrl from "@/utils/getFileUrl";
import {
  infiniteQueryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

const ArticleFeed = () => {
  const feedInfiniteQuery = useInfiniteQuery({
    queryKey: ["article-feed-2"],
    queryFn: ({ pageParam }) =>
      articleActions.articleFeed({ limit: 5, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const _page = lastPage?.meta?.currentPage ?? 1;
      return _page + 1;
    },
  });

  return (
    <div className="flex flex-col gap-10">
      {Boolean(feedInfiniteQuery.isFetching) && (
        <>
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
        </>
      )}

      {feedInfiniteQuery.data?.pages
        .flatMap((page) => page?.nodes)
        .map((article) => (
          <ArticleCard
            key={article?.id}
            id={article?.id.toString()!}
            handle={article?.handle ?? ""}
            title={article?.title ?? ""}
            excerpt={article?.excerpt ?? ""}
            coverImage={getFileUrl(article?.cover_image!)}
            author={{
              name: article?.user?.name ?? "",
              avatar: article?.user?.profile_photo ?? "",
              username: article?.user?.username ?? "",
            }}
            publishedAt={article?.created_at.toDateString() ?? ""}
            readingTime={readingTime(article?.body ?? "")}
            likes={0}
            comments={0}
          />
        ))}

      <div className="my-10">
        <Button
          variant={"link"}
          onClick={async () => {
            await feedInfiniteQuery.fetchNextPage();
          }}
          disabled={
            !feedInfiniteQuery.hasNextPage ||
            feedInfiniteQuery.isFetchingNextPage
          }
        >
          {feedInfiniteQuery.isFetchingNextPage
            ? "Loading more..."
            : feedInfiniteQuery.hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </Button>
      </div>
    </div>
  );
};

export default ArticleFeed;
