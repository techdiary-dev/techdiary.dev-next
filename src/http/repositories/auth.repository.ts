import { ApiRepository } from "./repository";

export class AuthRepository extends ApiRepository {
  /**
   * Login user by email and password
   * @param payload
   * @returns
   */
  login(payload: { email: string; password: string }) {
    return this.http.post("/api/auth/login", payload);
  }

  /**
   * Logout user
   * @returns
   */
  logout() {
    return this.http.post("/api/auth/logout");
  }
}
