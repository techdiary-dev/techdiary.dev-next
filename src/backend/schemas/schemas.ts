import {
  AnyPgColumn,
  boolean,
  json,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { IServerFile } from "../models/domain-models";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  username: varchar("username").notNull(),
  email: varchar("email"),
  profile_photo: varchar("profile_photo"),
  education: varchar("education"),
  designation: varchar("designation"),
  bio: varchar("bio"),
  websiteUrl: varchar("website_url"),
  location: varchar("location"),
  social_links: json("social_links"),
  profile_readme: text("profile_readme"),
  skills: varchar("skills"),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export const userSocialsTable = pgTable("user_socials", {
  id: serial("id").primaryKey(),
  service: varchar("service").notNull(),
  service_uid: varchar("service_uid").notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export const userSessionsTable = pgTable("user_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  token: varchar("token").notNull(),
  device: varchar("device"), // os + browser
  ip: varchar("ip"),
  last_action_at: timestamp("last_action_at"),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export const userFollowsTable = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  follower_id: uuid("follower_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  followee_id: uuid("followee_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export const articlesTable = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  handle: varchar("handle").notNull(),
  excerpt: varchar("excerpt"),
  body: text("body"),
  cover_image: jsonb("cover_image").$type<IServerFile>(),
  is_published: boolean("is_published").default(false),
  published_at: timestamp("published_at"),
  approved_at: timestamp("approved_at"),
  metadata: jsonb("metadata"),
  author_id: uuid("author_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export const commentsTable = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  body: text("body").notNull(),
  commentable_type: varchar("commentable_type").notNull(),
  commentable_id: uuid("commentable_id").notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  parent_id: uuid("parent_id").references((): AnyPgColumn => commentsTable.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  icon: jsonb("icon").$type<IServerFile>(),
  color: varchar("color", { length: 6 }),
  description: text("description"),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

export const articleTagsTable = pgTable("article_tag", {
  id: serial("id").primaryKey(),
  article_id: uuid("article_id")
    .notNull()
    .references(() => articlesTable.id, { onDelete: "cascade" }),
  tag_id: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),

  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});
