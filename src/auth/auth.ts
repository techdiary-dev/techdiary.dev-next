"use server";

import { persistenceRepository } from "@/backend/persistence-repositories";
import { eq } from "@/backend/persistence/persistence-where-operator";
import { cookies } from "next/headers";
import { cache } from "react";

export interface ISession {
  id: string;
  user_id: string;
  token: string;
  device?: string;
}

export interface ISessionUser {
  id: string;
  name: string;
  username: string;
  email: string;
  profile_photo: string;
}

export type SessionResult =
  | { session: ISession; user: ISessionUser }
  | { session: null; user: null };

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

export const getSession = cache(async (): Promise<SessionResult> => {
  const _cookies = await cookies();
  const token = _cookies.get("session")?.value ?? null;
  if (!token) {
    return { session: null, user: null };
  }
  const result = await validateSessionToken(token);

  if (!result) {
    _cookies.delete("session");
  }

  return result;
});

export const deleteSession = async () => {
  const _cookies = await cookies();
  const token = _cookies.get("session")?.value ?? null;
  if (!token) {
    return;
  }

  try {
    await persistenceRepository.userSession.deleteRows({
      where: eq("token", token),
    });
  } catch (error) {
  } finally {
    _cookies.delete("session");
  }
};
