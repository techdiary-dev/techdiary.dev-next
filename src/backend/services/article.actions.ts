"use server";

import { z } from "zod";
import { Article, User } from "../models/domain-models";
import { pgClient } from "../persistence/database-drivers/pg.client";
import {
  and,
  desc,
  eq,
  joinTable,
  neq,
} from "../persistence/persistence-where-operator";
import { PersistentRepository } from "../persistence/persistence.repository";
import {
  handleRepositoryException,
  RepositoryException,
} from "./RepositoryException";
import { ArticleRepositoryInput } from "./inputs/article.input";
import { removeMarkdownSyntax } from "@/lib/utils";

const articleRepository = new PersistentRepository<Article>(
  "articles",
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
    const article = await articleRepository.createOne({
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
        handle: input.handle,
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

/**
 * Deletes an article from the database.
 *
 * @param article_id - The unique identifier of the article to delete
 * @returns Promise<Article> - The deleted article
 * @throws {RepositoryException} If article deletion fails or article not found
 */
export async function deleteArticle(article_id: string) {
  try {
    const deletedArticles = await articleRepository.deleteRows({
      where: eq("id", article_id),
    });

    if (!deletedArticles || deletedArticles.length === 0) {
      throw new RepositoryException(
        "Article not found or could not be deleted"
      );
    }

    return deletedArticles[0];
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
export async function findRecentArticles(
  limit: number = 5
): Promise<Article[]> {
  try {
    return articleRepository.findRows({
      where: and(eq("is_published", true), neq("published_at", null)),
      limit,
      orderBy: [desc("published_at")],
      columns: ["id", "title", "handle"],
      joins: [
        joinTable<Article, User>({
          as: "user",
          joinTo: "users",
          localField: "author_id",
          foreignField: "id",
          columns: ["id", "name", "username", "profile_photo"],
        }),
      ],
    });
  } catch (error) {
    handleRepositoryException(error);
    return [];
  }
}

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

    const response = await articleRepository.findAllWithPagination({
      where: and(eq("is_published", true)),
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
        joinTable<Article, User>({
          as: "user",
          joinTo: "users",
          localField: "author_id",
          foreignField: "id",
          columns: ["id", "name", "username", "profile_photo"],
        }),
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

export async function articleDetail(article_handle: string) {
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
        joinTable<Article, User>({
          as: "user",
          joinTo: "users",
          localField: "author_id",
          foreignField: "id",
          columns: ["id", "name", "username", "profile_photo"],
        }),
      ],
    });

    if (!article) {
      throw new RepositoryException("Article not found");
    }

    return article;
  } catch (error) {
    handleRepositoryException(error);
  }
}
