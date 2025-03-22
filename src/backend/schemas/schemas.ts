import {
  json,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

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
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});
