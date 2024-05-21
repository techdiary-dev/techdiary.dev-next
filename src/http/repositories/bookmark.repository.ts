import { ApiRepository } from "./repository";

export class BookmarkRepository extends ApiRepository {
  public createBook(payload: ICreateBookmarkPayload) {
    return this.http.post("api/bookmarks", payload);
  }
}

export interface ICreateBookmarkPayload {
  model_name: "ARTICLE" | "COMMENT";
  model_id: string;
}
