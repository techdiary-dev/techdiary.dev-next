import { BasePaginationQuery } from "../models/BasePaginationQuery.mode";
import { PaginatedResponse } from "../models/PaginatedResponse.model";
import { IUser, UserReference } from "../models/User.model";
import { ApiRepository } from "./repository";

export class UserRepository extends ApiRepository {
  /**
   * Get a list of users
   * @param limit - number of users to return
   * @param page - page number
   * @returns
   */
  users(payload: BasePaginationQuery) {
    return this.http.get<PaginatedResponse<UserReference>>(
      "/api/profile/list",
      {
        params: {
          limit: payload.limit,
          page: payload.page,
        },
      }
    );
  }

  /**
   * Get a user by username
   * @param userName - username of the user to get
   * @returns
   */
  userProfileByUserName(userName: string) {
    return this.http.get<{ data: IUser }>("/profile/username/" + userName);
  }
}
