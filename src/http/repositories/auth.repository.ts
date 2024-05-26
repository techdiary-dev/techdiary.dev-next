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
   * Forgot password
   * @param payload
   * @returns
   */
  forgotPassword(payload: { email: string }) {
    return this.http.post("/api/auth/forgot-password", payload);
  }

  /**
   * Reset password
   * @param payload
   * @returns
   */
  resetPassword(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.http.post("/api/auth/reset-password", payload);
  }

  /**
   * Logout user
   * @returns
   */
  logout() {
    return this.http.post("/api/auth/logout");
  }
}
