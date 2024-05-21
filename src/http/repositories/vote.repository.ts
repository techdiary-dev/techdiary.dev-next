import { ApiRepository } from "./repository";

export class VoteRepository extends ApiRepository {
  vote(payload: IVotePayload) {
    return this.http.post("/api/vote", payload);
  }
}

export interface IVotePayload {
  model_name: "ARTICLE" | "COMMENT";
  model_id: string;
  vote: "UP_VOTE" | "DOWN_VOTE";
}
