import { generateRandomString } from "@/lib/utils";
import { cookies } from "next/headers";
import { userAgent } from "next/server";
import { z } from "zod";
import { UserSession } from "../models/domain-models";
import { pgClient } from "../persistence/database-drivers/pg.client";
import { PersistentRepository } from "../persistence/persistence.repository";
import { handleRepositoryException } from "./RepositoryException";
import { UserSessionInput } from "./inputs/session.input";

const sessionRepository = new PersistentRepository<UserSession>(
  "user_sessions",
  pgClient
);

/**
 * Creates a new login session for a user and sets a session cookie.
 *
 * @param _input - The session data containing user_id and request object, validated against UserSessionInput.createLoginSessionInput schema
 * @returns Promise<void>
 * @throws {RepositoryException} If session creation fails or validation fails
 */
export async function createLoginSession(
  _input: z.infer<typeof UserSessionInput.createLoginSessionInput>
): Promise<void> {
  const _cookies = await cookies();
  const token = generateRandomString(50);
  try {
    const input =
      await UserSessionInput.createLoginSessionInput.parseAsync(_input);
    const agent = userAgent(input.request);
    await sessionRepository.createOne({
      token,
      user_id: input.user_id,
      device: `${agent.os.name} ${agent.browser.name} ${agent.browser.version}`,
      // ip: input.request.ip,
      last_action_at: new Date(),
    });
    _cookies.set("session_token", token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    _cookies.set("session_userId", input.user_id, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  } catch (error) {
    handleRepositoryException(error);
  }
}
