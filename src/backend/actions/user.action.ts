"use server";

import { User, UserSocial } from "../models/domain-models";
import { IGithubUser } from "../models/models";
import { PersistentRepository } from "../persistence/persistence.repository";
import { pgClient } from "../persistence/database-drivers/pg.client";
import {
  and,
  asc,
  desc,
  eq,
} from "../persistence/database-drivers/persistence-where-operator";
import { persistenceRepository } from "../persistence-repositories";

export const syncAuthenticatedGithubUser = async (
  payload: IGithubUser
): Promise<User> => {
  let [user] = await persistenceRepository.user.findRows({
    where: eq("email", payload.email),
    columns: ["id", "name", "username", "email"],
    orderBy: [desc("created_at")],
    limit: 1,
  });

  if (!user) {
    user = await persistenceRepository.user.createOne({
      name: payload.name,
      username: payload.login,
      email: payload.email,
      profile_photo: payload.avatar_url,
      bio: payload.bio,
    });
  }

  // check user has social account

  const [userSocial] = await persistenceRepository.userSocial.findRows({
    where: and(
      eq("service", "github"),
      eq("service_uid", payload.id.toString())
    ),
    columns: ["id", "service", "service_uid", "user_id"],
    limit: 1,
  });

  if (!userSocial) {
    await persistenceRepository.userSocial.createOne({
      service: "github",
      service_uid: payload.id.toString(),
      user_id: user.id,
    });
  }

  return user;
};
