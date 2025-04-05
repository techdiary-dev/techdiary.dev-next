import {
  Article,
  Series,
  SeriesItem,
  User,
  UserSession,
  UserSocial,
} from "./models/domain-models";
import { pgClient } from "./persistence/database-drivers/pg.client";
import { PersistentRepository } from "./persistence/persistence.repository";

export const userRepository = new PersistentRepository<User>("users", pgClient);
export const articleRepository = new PersistentRepository<Article>(
  "articles",
  pgClient
);

export const userSocialRepository = new PersistentRepository<UserSocial>(
  "user_socials",
  pgClient
);
export const userSessionRepository = new PersistentRepository<UserSession>(
  "user_sessions",
  pgClient
);

const seriesRepository = new PersistentRepository<Series>("series", pgClient);

const seriesItemsRepository = new PersistentRepository<SeriesItem>(
  "series_items",
  pgClient
);

export const persistenceRepository = {
  user: userRepository,
  userSocial: userSocialRepository,
  userSession: userSessionRepository,
  article: articleRepository,
  series: seriesRepository,
  seriesItems: seriesItemsRepository,
};
