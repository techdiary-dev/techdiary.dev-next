import { persistenceRepository } from "@/backend/persistence-repositories";
import { eq } from "@/backend/persistence/database-drivers/persistence-where-operator";
import { cookies } from "next/headers";
import { cache } from "react";

export interface ISession {
  id: string;
  user_id: string;
  token: string;
}

export interface ISessionUser {
  id: string;
  name: string;
  username: string;
  email: string;
  profile_photo: string;
}

type SessionResult =
  | { session: ISession; user: ISessionUser }
  | { session: null; user: null };

export const validateSessionToken = async (
  token: string
): Promise<SessionResult> => {
  const [session] = await persistenceRepository.userSession.findRows({
    limit: 1,
    where: eq("token", token),
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
