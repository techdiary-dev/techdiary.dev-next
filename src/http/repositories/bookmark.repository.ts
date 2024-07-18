import { IBookmarkArticle } from "../models/Article.model";
import { BasePaginationQuery } from "../models/BasePaginationQuery.mode";
import { PaginatedResponse } from "../models/PaginatedResponse.model";
import { ApiRepository } from "./repository";

export class BookmarkRepository extends ApiRepository {
  public createBook(payload: ICreateBookmarkPayload) {
    return this.http.post("api/bookmarks", payload);
  }

  public getBookmarks(payload: IBookmarkListQuery) {
    return this.http.get<PaginatedResponse<IBookmarkArticle>>("api/bookmarks", {
      params: payload,
    });
  }
}

export interface ICreateBookmarkPayload {
  model_name: "ARTICLE" | "COMMENT";
  model_id: string;
}

export interface IBookmarkListQuery extends BasePaginationQuery {
  model_name: "ARTICLE" | "COMMENT";
}
