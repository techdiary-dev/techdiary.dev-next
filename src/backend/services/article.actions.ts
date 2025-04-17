"use server";

import { slugify } from "@/lib/slug-helper.util";
import {
  removeMarkdownSyntax,
  removeNullOrUndefinedFromObject,
} from "@/lib/utils";
import * as sk from "sqlkit";
import { and, desc, eq, like, neq, or } from "sqlkit";
import { z } from "zod";
import { Article, User } from "../models/domain-models";
import { pgClient } from "../persistence/database-drivers/pg.client";
import { DatabaseTableName } from "../persistence/persistence-contracts";
import {
  handleRepositoryException,
  RepositoryException,
} from "./RepositoryException";
import { ArticleRepositoryInput } from "./inputs/article.input";
import { getSessionUserId } from "./session.actions";
import { syncTagsWithArticles } from "./tag.action";

const articleRepository = new sk.Repository<Article>(
  DatabaseTableName.articles,
  pgClient
);

/**
 * Creates a new article in the database.
 *
 * @param _input - The article data to create, validated against ArticleRepositoryInput.createArticleInput schema
 * @returns Promise<Article> - The newly created article
 * @throws {RepositoryException} If article creation fails or validation fails
 */
export async function createArticle(
  _input: z.infer<typeof ArticleRepositoryInput.createArticleInput>
) {
  try {
    const input =
      await ArticleRepositoryInput.createArticleInput.parseAsync(_input);
    const article = await articleRepository.insertOne({
      title: input.title,
      handle: input.handle,
      excerpt: input.excerpt ?? null,
      body: input.body ?? null,
      cover_image: input.cover_image ?? null,
      is_published: input.is_published ?? false,
      published_at: input.is_published ? new Date() : null,
      author_id: input.author_id,
    });
    return article;
  } catch (error) {
    handleRepositoryException(error);
  }
}

export async function createMyArticle(
  _input: z.infer<typeof ArticleRepositoryInput.createMyArticleInput>
) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      throw new RepositoryException("Unauthorized");
    }

    const input =
      await ArticleRepositoryInput.createMyArticleInput.parseAsync(_input);

    const handle = await getUniqueArticleHandle(input.title);

    const article = await articleRepository.insertOne({
      title: input.title,
      handle: handle,
      excerpt: input.excerpt ?? null,
      body: input.body ?? null,
      cover_image: input.cover_image ?? null,
      is_published: input.is_published ?? false,
      published_at: input.is_published ? new Date() : null,
      author_id: sessionUserId,
    });
    return article;
  } catch (error) {
    handleRepositoryException(error);
  }
}

export const getUniqueArticleHandle = async (
  title: string,
  ignoreArticleId?: string
) => {
  try {
    // Slugify the title first
    const baseHandle = slugify(title);

    // If we have an ignoreArticleId, check if this article already exists
    if (ignoreArticleId) {
      const [existingArticle] = await articleRepository.findRows({
        where: eq("id", ignoreArticleId),
        columns: ["id", "handle"],
        limit: 1,
      });

      // If the article exists and its handle is already the slugified title,
      // we can just return that handle (no need to append a number)
      if (existingArticle && existingArticle.handle === baseHandle) {
        return baseHandle;
      }
    }

    // Find all articles with the same base handle or handles that have numeric suffixes
    const handlePattern = `${baseHandle}-%`;
    let baseHandleWhereClause: any = eq<Article, keyof Article>(
      "handle",
      baseHandle
    );
    let suffixWhereClause: any = like<Article>("handle", handlePattern);

    let whereClause: any = or(baseHandleWhereClause, suffixWhereClause);

    if (ignoreArticleId) {
      whereClause = and(
        whereClause,
        neq<Article, keyof Article>("id", ignoreArticleId)
      );
    }

    // Get all existing handles that match our patterns
    const existingArticles = await articleRepository.findRows({
      where: whereClause,
      columns: ["handle"],
    });

    // If no existing handles found, return the base handle
    if (existingArticles.length === 0) {
      return baseHandle;
    }

    // Check if the exact base handle exists
    const exactBaseExists = existingArticles.some(
      (article) => article.handle === baseHandle
    );

    // If the exact base handle doesn't exist, we can use it
    if (!exactBaseExists) {
      return baseHandle;
    }

    // Find the highest numbered suffix
    let highestNumber = 1;
    const regex = new RegExp(`^${baseHandle}-(\\d+)$`);

    existingArticles.forEach((article) => {
      const match = article.handle.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= highestNumber) {
          highestNumber = num + 1;
        }
      }
    });

    // Return with the next number in sequence
    return `${baseHandle}-${highestNumber}`;
  } catch (error) {
    handleRepositoryException(error);
    throw error;
  }
};

/**
 * Updates an existing article in the database.
 *
 * @param _input - The article update data, validated against ArticleRepositoryInput.updateArticleInput schema
 * @returns Promise<Article> - The updated article
 * @throws {RepositoryException} If article update fails, article not found, or validation fails
 */
export async function updateArticle(
  _input: z.infer<typeof ArticleRepositoryInput.updateArticleInput>
) {
  try {
    const input =
      await ArticleRepositoryInput.updateArticleInput.parseAsync(_input);
    const article = await articleRepository.updateOne({
      where: eq("id", input.article_id),
      data: {
        title: input.title,
        handle: input.handle
          ? await getUniqueArticleHandle(input.handle, input.article_id)
          : undefined,
        excerpt: input.excerpt,
        body: input.body,
        cover_image: input.cover_image,
        is_published: input.is_published,
        published_at: input.is_published ? new Date() : null,
      },
    });

    return article;
  } catch (error) {
    handleRepositoryException(error);
  }
}

export async function updateMyArticle(
  _input: z.infer<typeof ArticleRepositoryInput.updateMyArticleInput>
) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      throw new RepositoryException("Unauthorized");
    }

    const input =
      await ArticleRepositoryInput.updateMyArticleInput.parseAsync(_input);

    const article = await articleRepository.update({
      where: and(eq("id", input.article_id), eq("author_id", sessionUserId)),
      data: removeNullOrUndefinedFromObject({
        title: input.title,
        handle: input.handle,
        excerpt: input.excerpt,
        body: input.body,
        cover_image: input.cover_image,
        is_published: input.is_published,
        published_at: input.is_published ? new Date() : null,
        metadata: input.metadata,
      }),
    });

    if (input.tag_ids) {
      await syncTagsWithArticles({
        article_id: input.article_id,
        tag_ids: input.tag_ids,
      });
    }

    return article;
  } catch (error) {
    handleRepositoryException(error);
  }
}

/**
 * Deletes an article from the database.
 *
 * @param article_id - The unique identifier of the article to delete
 * @returns Promise<Article> - The deleted article
 * @throws {RepositoryException} If article deletion fails or article not found
 */
export async function deleteArticle(article_id: string) {
  try {
    const deletedArticles = await articleRepository.delete({
      where: eq("id", article_id),
    });

    return deletedArticles;
  } catch (error) {
    handleRepositoryException(error);
  }
}

/**
 * Retrieves the most recent published articles.
 *
 * @param limit - Maximum number of articles to return (default: 5)
 * @returns Promise<Article[]> - Array of recent articles with author information
 * @throws {RepositoryException} If query fails
 */
// export async function findRecentArticles(
//   limit: number = 5
// ): Promise<Article[]> {
//   try {
//     return articleRepository.findRows({
//       where: and(eq("is_published", true), neq("published_at", null)),
//       limit,
//       orderBy: [desc("published_at")],
//       columns: ["id", "title", "handle"],
//       joins: [
//         leftJoin<Article, User>({
//           as: "user",
//           joinTo: "users",
//           localField: "author_id",
//           foreignField: "id",
//           columns: ["id", "name", "username", "profile_photo"],
//         }),
//       ],
//     });
//   } catch (error) {
//     handleRepositoryException(error);
//     return [];
//   }
// }

/**
 * Retrieves a paginated feed of published articles.
 *
 * @param _input - Feed parameters including page and limit, validated against ArticleRepositoryInput.feedInput schema
 * @returns Promise<{ data: Article[], total: number }> - Paginated articles with total count
 * @throws {RepositoryException} If query fails or validation fails
 */
export async function articleFeed(
  _input: z.infer<typeof ArticleRepositoryInput.feedInput>
) {
  try {
    const input = await ArticleRepositoryInput.feedInput.parseAsync(_input);

    const response = await articleRepository.paginate({
      where: and(eq("is_published", true), neq("approved_at", null)),
      page: input.page,
      limit: input.limit,
      orderBy: [desc("published_at")],
      columns: [
        "id",
        "title",
        "handle",
        "cover_image",
        "body",
        "created_at",
        "excerpt",
      ],
      joins: [
        {
          as: "user",
          table: DatabaseTableName.users,
          type: "left",
          on: {
            foreignField: "id",
            localField: "author_id",
          },
          columns: ["id", "name", "username", "profile_photo"],
        } as sk.Join<Article, User>,
      ],
    });

    response["nodes"] = response["nodes"].map((article) => {
      return {
        ...article,
        excerpt: article.excerpt ?? removeMarkdownSyntax(article.body),
      };
    });

    return response;
  } catch (error) {
    handleRepositoryException(error);
  }
}

export async function userArticleFeed(
  _input: z.infer<typeof ArticleRepositoryInput.userFeedInput>,
  columns?: (keyof Article)[]
) {
  try {
    const input = await ArticleRepositoryInput.userFeedInput.parseAsync(_input);

    const response = await articleRepository.paginate({
      where: and(
        eq("is_published", true),
        neq("approved_at", null),
        eq("author_id", input.user_id)
      ),
      page: input.page,
      limit: input.limit,
      orderBy: [desc("published_at")],
      columns: columns ?? [
        "id",
        "title",
        "handle",
        "cover_image",
        "body",
        "created_at",
        "excerpt",
      ],
      joins: [
        {
          as: "tags",
          table: DatabaseTableName.users,
          on: {
            foreignField: "id",
            localField: "author_id",
          },
          columns: ["id", "name", "username", "profile_photo"],
        } as sk.Join<Article, User>,
      ],
    });

    response["nodes"] = response["nodes"].map((article) => {
      return {
        ...article,
        excerpt: article.excerpt ?? removeMarkdownSyntax(article.body),
      };
    });

    return response;
  } catch (error) {
    handleRepositoryException(error);
  }
}

export async function articleDetailByHandle(article_handle: string) {
  try {
    const [article] = await articleRepository.findRows({
      where: eq("handle", article_handle),
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
      joins: [
        {
          as: "user",
          type: "left",
          table: DatabaseTableName.users,
          on: {
            foreignField: "id",
            localField: "author_id",
          },
          columns: ["id", "name", "username", "profile_photo"],
        } as sk.Join<Article, User>,
      ],
      limit: 1,
    });

    if (!article) {
      throw new RepositoryException("Article not found");
    }

    return article;
  } catch (error) {
    handleRepositoryException(error);
  }
}

export async function articleDetailByUUID(uuid: string) {
  try {
    const [article] = await articleRepository.findRows({
      where: eq("id", uuid),
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
      joins: [
        leftJoin<Article, User>({
          as: "user",
          joinTo: "users",
          localField: "author_id",
          foreignField: "id",
          columns: ["id", "name", "username", "profile_photo"],
        }),
      ],
      limit: 1,
    });

    if (!article) {
      throw new RepositoryException("Article not found");
    }

    return article;
  } catch (error) {
    handleRepositoryException(error);
  }
}

export async function myArticles(
  input: z.infer<typeof ArticleRepositoryInput.myArticleInput>
) {
  const sessionUserId = await getSessionUserId();

  if (!sessionUserId) {
    throw new RepositoryException("Unauthorized");
  }

  try {
    const articles = await articleRepository.paginate({
      where: eq("author_id", sessionUserId!),
      columns: [
        "id",
        "title",
        "handle",
        "created_at",
        "is_published",
        "approved_at",
      ],
      limit: input.limit,
      page: input.page,
      orderBy: [desc("created_at")],
    });
    return articles;
  } catch (error) {
    handleRepositoryException(error);
  }
}

/**
 * Updates the status of an article.
 * @param article_id - The unique identifier of the article to update
 * @param is_published - The new status of the article
 * @returns
 */
export async function setArticlePublished(
  article_id: string,
  is_published: boolean
) {
  const sessionUserId = await getSessionUserId();
  try {
    const articles = await articleRepository.update({
      where: and(
        eq("id", article_id),
        eq("author_id", sessionUserId?.toString()!)
      ),
      data: {
        is_published: is_published,
        published_at: is_published ? new Date() : null,
      },
    });
    return articles;
  } catch (error) {
    handleRepositoryException(error);
  }
}
