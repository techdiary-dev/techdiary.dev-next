import ArticleEditor from "@/components/Editor/ArticleEditor";
import * as articleActions from "@/backend/services/article.actions";
import React from "react";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ uuid: string }>;
}
const page: React.FC<Props> = async ({ params }) => {
  const _params = await params;
  const article = await articleActions.articleDetailByUUID(_params.uuid);

  if (!article) {
    throw notFound();
  }

  return <ArticleEditor uuid={_params.uuid} article={article} />;
};

export default page;
