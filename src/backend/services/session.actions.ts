"use server";

import { generateRandomString } from "@/lib/utils";
import { cookies } from "next/headers";
import { userAgent } from "next/server";
import { z } from "zod";
import { UserSession } from "../models/domain-models";
import { pgClient } from "../persistence/database-drivers/pg.client";
import { PersistentRepository } from "../persistence/persistence.repository";
import { handleRepositoryException } from "./RepositoryException";
import { SessionResult, USER_SESSION_KEY } from "./action-type";
import { UserSessionInput } from "./inputs/session.input";
import { persistenceRepository } from "../persistence-repositories";
import { eq } from "../persistence/persistence-where-operator";
import { cache } from "react";

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
    _cookies.set(USER_SESSION_KEY.SESSION_TOKEN, token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    _cookies.set(USER_SESSION_KEY.SESSION_USER_ID, input.user_id, {
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

export const validateSessionToken = async (
  token: string
): Promise<SessionResult> => {
  const [session] = await persistenceRepository.userSession.findRows({
    limit: 1,
    where: eq("token", token),
    columns: ["id", "user_id", "token", "device"],
  });
  if (!session) {
    return { session: null, user: null };
  }

  const [user] = await persistenceRepository.user.findRows({
    limit: 1,
    where: eq("id", session.user_id),
    columns: ["id", "name", "username", "email", "profile_photo"],
  });

  return {
    session: {
      id: session.id,
      user_id: session.user_id,
      token: session.token,
    },
    user: {
      id: user?.id,
      name: user?.name,
      username: user?.username,
      email: user?.email,
      profile_photo: user?.profile_photo,
    },
  };
};

/**
 * Get the current session.
 * @returns - The current session.
 */
export const getSession = cache(async (): Promise<SessionResult> => {
  const _cookies = await cookies();
  const token = _cookies.get(USER_SESSION_KEY.SESSION_TOKEN)?.value ?? null;
  if (!token) {
    return { session: null, user: null };
  }
  const result = await validateSessionToken(token);

  if (!result) {
    _cookies.delete(USER_SESSION_KEY.SESSION_TOKEN);
  }

  return result;
});

/**
 * Get the current session user ID.
 * @returns - The current session user ID.
 */
export const getSessionUserId = cache(async (): Promise<string | null> => {
  const _cookies = await cookies();
  const userId = _cookies.get(USER_SESSION_KEY.SESSION_USER_ID)?.value ?? null;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
});

export const deleteLoginSession = async () => {
  const _cookies = await cookies();
  const token = _cookies.get(USER_SESSION_KEY.SESSION_TOKEN)?.value ?? null;
  if (!token) {
    return;
  }

  try {
    await persistenceRepository.userSession.deleteRows({
      where: eq("token", token),
    });
  } catch (error) {
  } finally {
    _cookies.delete(USER_SESSION_KEY.SESSION_TOKEN);
    _cookies.delete(USER_SESSION_KEY.SESSION_USER_ID);
  }
};

/**
 * Set the URL to redirect to after authentication.
 * @param url - The URL to redirect to after authentication.
 */
export const setAfterAuthRedirect = async (url: string) => {
  const _cookies = await cookies();
  _cookies.set("next", url);
};

/**
 * Get the URL to redirect to after authentication.
 * @returns - The URL to redirect to after authentication.
 */
export const getAfterAuthRedirect = async () => {
  const _cookies = await cookies();
  const value = _cookies.get("next")?.value;
  return value !== "null" ? value : null;
};
