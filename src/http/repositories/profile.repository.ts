import { BasePaginationQuery } from "../models/BasePaginationQuery.mode";
import { PaginatedResponse } from "../models/PaginatedResponse.model";
import { IUser, SocialLinks, UserReference } from "../models/User.model";
import { ApiRepository } from "./repository";

export class ProfileApiRepository extends ApiRepository {
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
    return this.http.get<{ data: IUser }>("/api/profile/username/" + userName);
  }

  updateProfile(payload: UpdateProfilePayload) {
    return this.http.patch("/api/profile", payload);
  }

  getUniqueUsername(username: string) {
    return this.http.post<{ username: string }>(
      "/api/profile/unique-username",
      {
        username,
      }
    );
  }
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  email?: string;
  education?: string;
  designation?: string;
  website_url?: string;
  location?: string;
  profilePhoto?: string;
  profile_readme?: string;
  social_links?: SocialLinks;
}
