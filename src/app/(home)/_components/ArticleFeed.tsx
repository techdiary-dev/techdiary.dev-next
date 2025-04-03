"use client";

import * as articleActions from "@/backend/services/article.actions";
import ArticleCard from "@/components/ArticleCard";
import { readingTime } from "@/lib/utils";
import getFileUrl from "@/utils/getFileUrl";
import { useInfiniteQuery } from "@tanstack/react-query";
import VisibilitySensor from "@/components/VisibilitySensor";

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
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
          <div className="h-56 bg-muted animate-pulse mx-4" />
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
              id: article?.user?.id ?? "",
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
        <VisibilitySensor
          visible={feedInfiniteQuery.hasNextPage}
          onLoadmore={async () => {
            console.log("fetching next page");
            await feedInfiniteQuery.fetchNextPage();
            // alert("Fetching next page");
          }}
        />
      </div>
    </div>
  );
};

export default ArticleFeed;
