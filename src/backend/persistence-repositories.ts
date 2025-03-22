import { User, UserSession, UserSocial } from "./models/domain-models";
import { pgClient } from "./persistence/database-drivers/pg.client";
import { PersistentRepository } from "./persistence/persistence.repository";

export const userRepository = new PersistentRepository<User>("users", pgClient);
export const userSocialRepository = new PersistentRepository<UserSocial>(
  "user_socials",
  pgClient
);
export const userSessionRepository = new PersistentRepository<UserSession>(
  "user_sessions",
  pgClient
);

export const persistenceRepository = {
  user: userRepository,
  userSocial: userSocialRepository,
  userSession: userSessionRepository,
};
