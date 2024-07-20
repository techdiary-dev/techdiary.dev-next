import { PersonalAccessToken } from "../models/PersonalAccessToken.model";
import { ApiRepository } from "./repository";

export class PersonalAccessTokenApiRepository extends ApiRepository {
  public async getMyTokens() {
    const { data } = await this.http.get<{ data: PersonalAccessToken[] }>(
      "/api/auth/personal-access-tokens"
    );

    return data;
  }

  public async createToken(payload: { name: string }) {
    const { data } = await this.http.post<{ token: string }>(
      "/api/auth/personal-access-tokens",
      payload
    );

    return data;
  }
}

// curl \
//   -X GET \
//   -H "Accept: application/json" \
//   -H "Authorization: Bearer 9|BQm6KnOTnY3i4IlBF4eZhgrvzLudAuNLr6xvvEeP3b1ad00e" \
//   http://api.techdiary.test/api/auth/personal-access-tokens

// curl \
//   -X POST -# \
//   -H "Accept: application/json" \
//   -H "Authorization: Bearer 9|BQm6KnOTnY3i4IlBF4eZhgrvzLudAuNLr6xvvEeP3b1ad00e" \
//   -d "name=Test token" \
//   http://api.techdiary.test/api/auth/personal-access-tokens
