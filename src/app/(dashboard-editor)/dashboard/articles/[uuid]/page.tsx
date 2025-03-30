import ArticleEditor from "@/components/Editor/ArticleEditor";
import * as articleActions from "@/backend/services/article.actions";
import React from "react";
import * as sessionActions from "@/backend/services/session.actions";
import { notFound } from "next/navigation";
import { persistenceRepository } from "@/backend/persistence-repositories";
import { eq, and } from "@/backend/persistence/persistence-where-operator";

interface Props {
  params: Promise<{ uuid: string }>;
}
const page: React.FC<Props> = async ({ params }) => {
  const sessionUserId = await sessionActions.getSessionUserId();
  const _params = await params;

  const [article] = await persistenceRepository.article.findRows({
    limit: 1,
    where: and(eq("id", _params.uuid), eq("author_id", sessionUserId)),
    columns: [
      "id",
      "title",
      "handle",
      "excerpt",
      "body",
      "cover_image",
      "is_published",
      "published_at",
      "approved_at",
      "metadata",
      "author_id",
      "created_at",
      "updated_at",
    ],
  });

  if (!article) {
    throw notFound();
  }

  return <ArticleEditor uuid={_params.uuid} article={article} />;
};

export default page;
