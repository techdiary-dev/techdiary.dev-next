import { z } from "zod";
import { User, UserSession } from "../models/domain-models";
import { pgClient } from "../persistence/database-drivers/pg.client";
import { PersistentRepository } from "../persistence/persistence.repository";
import { cookies } from "next/headers";
import { generateRandomString } from "@/lib/utils";
import { userAgent } from "next/server";
import { handleRepositoryException } from "./RepositoryException";

class SessionRepository extends PersistentRepository<UserSession> {
  constructor() {
    super("user_sessions", pgClient);
  }

  createLoginSession = async (
    _input: z.infer<typeof UserSessionInput.createLoginSessionInput>
  ): Promise<void> => {
    const _cookies = await cookies();
    const token = generateRandomString(50);
    try {
      const input = await UserSessionInput.createLoginSessionInput.parseAsync(
        _input
      );
      const agent = userAgent(input.request);
      await this.createOne({
        token,
        user_id: input.user_id,
        device: `${agent.os.name} ${agent.browser.name} ${agent.browser.version}`,
      });
      _cookies.set("session", token, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    } catch (error) {
      handleRepositoryException(error);
    }
  };
}

export const sessionRepository = new SessionRepository();
export const UserSessionInput = {
  createLoginSessionInput: z.object({
    user_id: z.string(),
    request: z.instanceof(Request),
  }),
};
