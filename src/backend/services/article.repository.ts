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

class ArticleRepository extends PersistentRepository<Article> {
  constructor() {
    super("articles", pgClient);
  }

  async createArticle(
    _input: z.infer<typeof ArticleRepositoryInput.createArticleInput>
  ) {
    try {
      const input =
        await ArticleRepositoryInput.createArticleInput.parseAsync(_input);
      const article = await this.createOne({
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

  async updateArticle(
    _input: z.infer<typeof ArticleRepositoryInput.updateArticleInput>
  ) {
    try {
      const input =
        await ArticleRepositoryInput.updateArticleInput.parseAsync(_input);
      const article = await this.updateOne({
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

  // Delete an article
  async deleteArticle(article_id: string) {
    try {
      const deletedArticles = await this.deleteRows({
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

  // Get recent articles
  async findRecentArticles(limit: number = 5): Promise<Article[]> {
    try {
      return this.findRows({
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

  async articleFeed(_input: z.infer<typeof ArticleRepositoryInput.feedInput>) {
    try {
      const input = await ArticleRepositoryInput.feedInput.parseAsync(_input);

      return this.findAllWithPagination({
        where: and(eq("is_published", true), neq("published_at", null)),
        page: input.page,
        limit: input.limit,
        orderBy: [desc("published_at")],
        columns: ["id", "title", "handle", "cover_image"],
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
    }
  }
}

export const articleRepository = new ArticleRepository();
export const ArticleRepositoryInput = {
  createArticleInput: z.object({
    title: z.string(),
    handle: z.string(),
    excerpt: z.string().optional().nullable(),
    body: z.string().optional().nullable(),
    cover_image: z
      .object({
        key: z.string(),
        provider: z.string(),
      })
      .optional()
      .nullable(),
    is_published: z.boolean().optional().nullable(),
    author_id: z.string(),
  }),

  updateArticleInput: z.object({
    article_id: z.string(),
    title: z.string().optional(),
    handle: z.string().optional(),
    excerpt: z.string().optional(),
    body: z.string().optional(),
    cover_image: z
      .object({
        key: z.string(),
        provider: z.string(),
      })
      .optional(),
    is_published: z.boolean().optional(),
  }),

  feedInput: z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
  }),

  findArticlesByAuthorInput: z.object({
    author_id: z.string(),
    published_only: z.boolean().default(false),
    page: z.number().default(1),
    limit: z.number().default(10),
  }),

  searchArticlesInput: z.object({
    search_term: z.string().optional(),
    published_only: z.boolean().default(true),
    page: z.number().default(1),
    limit: z.number().default(10),
  }),
};
