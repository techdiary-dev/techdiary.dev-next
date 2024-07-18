import { useQuery } from "@tanstack/react-query";
import { ApiRepository } from "./repository";
import { BasePaginationQuery } from "../models/BasePaginationQuery.mode";
import { PaginatedResponse } from "../models/PaginatedResponse.model";
import { IArticleDetail, IArticleFeedItem } from "../models/Article.model";

interface ArticleListQuery extends BasePaginationQuery {
  excludeIds?: string[];
  user?: string;
}

export interface CreateOrUpdateArticlePayload {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  is_published?: boolean | null;
  seriesName?: string | null;
  thumbnail?: {
    key?: string | null | undefined;
    provider?: string | null | undefined;
  } | null;
  body?: string | null;
  tags?: any[] | null;

  seo?: {
    og_image?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    canonical_url?: string | null;
  } | null;

  settings?: {
    disabled_comments?: boolean | null;
  } | null;
}

export class ArticleApiRepository extends ApiRepository {
  public async getArticles(payload: ArticleListQuery) {
    const { data } = await this.http.get<PaginatedResponse<IArticleFeedItem>>(
      "/api/articles",
      { params: payload }
    );

    return data;
  }

  public async getArticleBySlug(id: string) {
    const { data } = await this.http.get<IArticleFeedItem>(
      `/api/articles/${id}`
    );

    return data;
  }

  public async getArticleByUUID(uuid: string) {
    const { data } = await this.http.get<{ data: IArticleDetail }>(
      `/api/articles/uuid/${uuid}`
    );

    return data?.data;
  }

  public async getMyArticles(params: BasePaginationQuery, headers?: any) {
    const { data } = await this.http.get<PaginatedResponse<IArticleFeedItem>>(
      `/api/articles/mine`,
      { params, headers }
    );

    return data;
  }

  public async updateArticleByUUID(
    uuid: string,
    payload: CreateOrUpdateArticlePayload
  ) {
    const { data } = await this.http.patch(
      `/api/articles/uuid/${uuid}`,
      payload
    );
    return data;
  }

  public async createArticle(payload: CreateOrUpdateArticlePayload) {
    const { data } = await this.http.post(`/api/articles/`, payload);
    return data;
  }

  /**
   * Check if slug is unique
   * @param slug - slug to check
   * @returns
   */
  public async getUniqueSlug(slug: string) {
    const { data } = await this.http.post<{ slug: string }>(
      `/api/articles/get-unique-slug`,
      { slug }
    );

    return data;
  }

  /**
   * Check if slug is unique
   * @param slug - slug to check
   * @returns
   */
  public async makeArchive(uuid: string) {
    const { data } = await this.http.delete<{ uuid: string }>(
      `/api/articles/uuid/archive/${uuid}`
    );

    return data;
  }
}
