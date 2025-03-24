import BaseLayout from "@/components/layout/BaseLayout";
import * as articleActions from "@/backend/services/article.actions";
import React from "react";
import { NextPage } from "next";
import HomepageLayout from "@/components/layout/HomepageLayout";
import HomeLeftSidebar from "@/app/(home)/_components/HomeLeftSidebar";

interface ArticlePageProps {
  params: Promise<{
    username: string;
    articleHandle: string;
  }>;
}

const Page: NextPage<ArticlePageProps> = async ({ params }) => {
  const _params = await params;
  const article = await articleActions.articleDetail(_params.articleHandle);

  return (
    <HomepageLayout LeftSidebar={<HomeLeftSidebar />}>
      {!article && <div>Article not found</div>}

      <pre>{JSON.stringify({ params, article }, null, 2)}</pre>
    </HomepageLayout>
  );
};

export default Page;
