CREATE TABLE "user_socials" (
	"id" serial PRIMARY KEY NOT NULL,
	"service" varchar NOT NULL,
	"service_uid" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar,
	"profilePhoto" varchar,
	"education" varchar,
	"designation" varchar,
	"bio" varchar,
	"website_url" varchar,
	"location" varchar,
	"social_links" json,
	"profile_readme" text,
	"skills" varchar,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_socials" ADD CONSTRAINT "user_socials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;