import React from "react";
import ArticleEditor from "./_components/Editor";
import { NextPage } from "next";
import { ArticleApiRepository } from "@/http/repositories/article.repository";

interface Props {
  params: { uuid: string };
}

const ArticleEditPage: NextPage<Props> = async ({ params }) => {
  const api = new ArticleApiRepository();
  const data = await api.getArticleByUUID(params.uuid);

  return <ArticleEditor uuid={params.uuid} article={data} />;
};

export default ArticleEditPage;
