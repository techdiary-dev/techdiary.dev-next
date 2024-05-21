import { ApiRepository } from "./repository";

class VoteRepository extends ApiRepository {
  vote(payload: IVotePayload) {
    return this.httpClient.post("/vote", payload);
  }
}

export default new VoteRepository();

export interface IVotePayload {
  model_name: "ARTICLE" | "COMMENT";
  model_id: string;
  vote: "UP_VOTE" | "DOWN_VOTE";
}
