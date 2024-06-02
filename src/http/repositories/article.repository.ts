import { useQuery } from "@tanstack/react-query";
import { ApiRepository } from "./repository";
import { BasePaginationQuery } from "../models/BasePaginationQuery.mode";
import { PaginatedResponse } from "../models/PaginatedResponse.model";
import { IArticleFeedItem } from "../models/Article.model";

interface ArticleListQuery extends BasePaginationQuery {
  excludeIds?: string[];
  user?: string;
}

export class ArticleRepository extends ApiRepository {
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

  public async getMyArticles(params: BasePaginationQuery, headers?: any) {
    const { data } = await this.http.get<PaginatedResponse<IArticleFeedItem>>(
      `/api/articles/mine`,
      { params, headers }
    );

    return data;
  }
}
