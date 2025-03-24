import BaseLayout from "@/components/layout/BaseLayout";
import * as articleActions from "@/backend/services/article.actions";
import React from "react";
import { NextPage } from "next";

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
    <BaseLayout>
      {!article && <div>Article not found</div>}

      <pre>{JSON.stringify({ params, article }, null, 2)}</pre>
    </BaseLayout>
  );
};

export default Page;
