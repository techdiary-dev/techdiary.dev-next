"use client";

import * as articleActions from "@/backend/services/article.actions";
import { useQuery } from "@tanstack/react-query";

const ArticleFeed = () => {
  const feedQuery = useQuery({
    queryKey: ["article-feed"],
    queryFn: () => articleActions.articleFeed({ limit: 10, page: 1 }),
  });
  return (
    <div>
      <pre>{JSON.stringify(feedQuery.data, null, 2)}</pre>
    </div>
  );
};

export default ArticleFeed;
