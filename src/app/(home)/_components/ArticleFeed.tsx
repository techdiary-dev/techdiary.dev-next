"use client";

import * as articleActions from "@/backend/services/article.actions";
import ArticleCard from "@/components/ArticleCard";
import { readingTime } from "@/lib/utils";
import getFileUrl from "@/utils/getFileUrl";
import { useQuery } from "@tanstack/react-query";

const ArticleFeed = () => {
  const feedQuery = useQuery({
    queryKey: ["article-feed"],
    queryFn: () => articleActions.articleFeed({ limit: 10, page: 1 }),
  });
  return (
    <div className="flex flex-col gap-10">
      {Boolean(feedQuery.isFetching) && (
        <>
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
          <div className="h-56 bg-muted animate-pulse" />
        </>
      )}

      {feedQuery.data?.nodes.map((article) => (
        <ArticleCard
          key={article.id}
          id={article.id}
          handle={article.handle}
          title={article.title}
          excerpt={article.excerpt ?? ""}
          coverImage={getFileUrl(article.cover_image!)}
          author={{
            name: article.user?.name ?? "",
            avatar: article.user?.profile_photo ?? "",
            username: article.user?.username ?? "",
          }}
          publishedAt={article.created_at.toDateString()}
          readingTime={readingTime(article.body ?? "")}
          likes={0}
          comments={0}
        />
      ))}
    </div>
  );
};

export default ArticleFeed;
