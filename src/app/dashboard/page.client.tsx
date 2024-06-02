"use client";

import { IArticleFeedItem } from "@/http/models/Article.model";
import { PaginatedResponse } from "@/http/models/PaginatedResponse.model";
import React from "react";

interface IDashboardPageProps {
  initialArticles: PaginatedResponse<IArticleFeedItem>;
}

const DashboardPage: React.FC<IDashboardPageProps> = ({ initialArticles }) => {
  // const apiRepo = new ArticleRepository();
  // const { data } = useQuery({
  //   queryKey: ["dashboard-articles"],
  //   queryFn: () => apiRepo.getMyArticles({ limit: 10 }),
  // });

  return (
    <div>
      <pre>{JSON.stringify(initialArticles, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;
