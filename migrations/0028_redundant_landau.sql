ALTER TABLE "user_socials" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_socials" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();