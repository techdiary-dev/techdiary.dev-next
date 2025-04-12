import {
  Article,
  Series,
  SeriesItem,
  Tag,
  User,
  UserSession,
  UserSocial,
} from "./models/domain-models";
import { pgClient } from "./persistence/database-drivers/pg.client";
import { DatabaseTableName } from "./persistence/persistence-contracts";
import { PersistentRepository } from "./persistence/persistence.repository";

export const userRepository = new PersistentRepository<User>(
  DatabaseTableName.users,
  pgClient
);
export const articleRepository = new PersistentRepository<Article>(
  DatabaseTableName.articles,
  pgClient
);
export const tagRepository = new PersistentRepository<Tag>(
  DatabaseTableName.tags,
  pgClient
);
export const userSocialRepository = new PersistentRepository<UserSocial>(
  DatabaseTableName.user_socials,
  pgClient
);
export const userSessionRepository = new PersistentRepository<UserSession>(
  DatabaseTableName.user_sessions,
  pgClient
);

const seriesRepository = new PersistentRepository<Series>(
  DatabaseTableName.series,
  pgClient
);

const seriesItemsRepository = new PersistentRepository<SeriesItem>(
  DatabaseTableName.series_items,
  pgClient
);

export const persistenceRepository = {
  user: userRepository,
  userSocial: userSocialRepository,
  userSession: userSessionRepository,
  article: articleRepository,
  tags: tagRepository,
  series: seriesRepository,
  seriesItems: seriesItemsRepository,
};
