-- -------------------------------------------------------------
-- TablePlus 6.4.2(600)
--
-- https://tableplus.com/
--
-- Database: techdiary
-- Generation Time: 2025-03-30 4:35:17.4970 PM
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."user_sessions";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."user_sessions" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL,
    "token" varchar NOT NULL,
    "created_at" timestamp,
    "updated_at" timestamp,
    "device" varchar,
    "device_type" varchar,
    "ip" varchar,
    "last_action_at" timestamp,
    CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
);

