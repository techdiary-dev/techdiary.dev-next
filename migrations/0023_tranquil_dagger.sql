ALTER TABLE "user_sessions" ADD COLUMN "device_type" varchar;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "ip" varchar;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "last_action_at" timestamp;