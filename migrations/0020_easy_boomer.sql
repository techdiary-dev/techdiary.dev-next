ALTER TABLE "comments" DROP CONSTRAINT "comments_article_id_articles_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "commentable_type" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "commentable_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "article_id";