ALTER TABLE "article_tag" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "article_tag" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "updated_at" timestamp;