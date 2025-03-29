"use server";

import { getSessionUserId } from "@/auth/auth";
import { persistenceRepository } from "../persistence-repositories";
import { sql } from "../persistence/persistence-utils";

const query = sql`
SELECT (SELECT Count(*)
          FROM   articles
          WHERE  author_id = $1)
       AS total_articles,
       (SELECT Count(*)
          FROM   comments
          WHERE  comments.commentable_type = 'ARTICLE'
            AND  comments.commentable_id IN (SELECT id
                                              FROM   articles
                                              WHERE  articles.author_id = $1))
       AS total_comments
`;

export async function myArticleMatrix() {
  const sessionUserId = await getSessionUserId();

  const totalPostsQuery = await persistenceRepository.article.executeSQL(
    query,
    [sessionUserId!]
  );

  return {
    total_articles: totalPostsQuery.rows[0].total_articles,
    total_comments: totalPostsQuery.rows[0].total_comments,
  };
}
